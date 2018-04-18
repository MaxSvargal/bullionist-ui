import Router from 'koa-router'
import * as fetch from 'isomorphic-fetch'
import { converge, merge, objOf, both, ifElse, isEmpty, always, head, prop, o, path, propEq, pair, find } from 'ramda'
import { saltHashPassword, genRandomString } from './hash'
import { encrypt, decrypt } from './crypt'
import {
  getPosition, getPositions, getInvite, createAccount, updateInvite, createNewPayment,
  createInvite, getSymbolsState, getProfile, updateSettings, getAccount, getPaymentsOf
} from './db'
import client from './exchange'
import { publish } from './cote'

const billingAccount = 'maxsvargal'

const checkAuth = (ctx: Router.IRouterContext) =>
  ctx.isAuthenticated() ? ctx.state.user.name : (ctx.status = 401)

const bodyPath = path([ 'request', 'body' ])
const binancePath = o(prop('binance'), bodyPath)
const binanceKeyPath = o(prop('key'), binancePath)
const binanceSecretPath = o(prop('secret'), binancePath)
const cryptKeysPairs = ifElse(
  both(binanceKeyPath, binanceSecretPath),
  converge(merge, [
    o(objOf('key'), o(encrypt, binanceKeyPath)),
    o(objOf('secret'), o(encrypt, binanceSecretPath))
  ]),
  always({})
)

const decryptKeysPair = converge(pair, [
  o(decrypt, path([ 'binance', 'key' ])),
  o(decrypt, path([ 'binance', 'secret' ]))
])
const depositListCond = ifElse(
  propEq('success', true),
  prop('depositList'),
  always({ status: false, error: 'Exchange returned failed response' })
)

export default (router: Router) => {

  router.put('/api/settings', async ctx => {
    const name = checkAuth(ctx)
    if (!name) return (ctx.body = { status: false, error: 'Denied' })    
    await updateSettings({
      account: name,
      data: { ...bodyPath(ctx), binance: cryptKeysPairs(ctx) }
    })
    ctx.body = { status: true }
  })

  router.post('/api/positions/forceSell', async ctx => {
    const name = checkAuth(ctx)
    if (!name) return (ctx.body = { status: false, error: 'Denied' })
    
    const position = await getPosition(ctx.request.body.id)
    if (position.account === name) {
      publish('newSignal', {
        symbol: prop('symbol', position),
        account: name,
        side: 'SELL',
        forced: true
      })
      return ctx.body = { status: true }
    }
    return ctx.body = { status: false }
  })

  router.get('/api/profile', async ctx => {
    const name = checkAuth(ctx)
    name && (ctx.body = await getProfile(name))
  })

  router.get('/api/positions', async ctx => {
    const name = checkAuth(ctx)
    name && (ctx.body = await getPositions(name))
  })

  router.get('/api/symbolsState', async ctx => {
    const name = checkAuth(ctx)
    name && (ctx.body = await getSymbolsState())
  })

  router.get('/api/candles/:symbol/:interval/:limit', async ctx => {
    if (ctx.isUnauthenticated()) return (ctx.status = 401)
    const { symbol, interval, limit } = ctx.params
    const res = await fetch(`https://api.binance.com/api/v1/klines?interval=${interval}&limit=${limit}&symbol=${symbol}`)
    ctx.body = await res.json()
  })

  router.get('/api/paids', async ctx => {
    const account = checkAuth(ctx)
    if (!account) return (ctx.body = { status: false, error: 'Denied' })
    ctx.body = await getPaymentsOf(account)
  })

  router.post('/api/checkPaid', async ctx => {
    const account = checkAuth(ctx)
    if (!account) return (ctx.body = { status: false, error: 'Denied' })

    const { txId } = ctx.request.body

    const billAccount = await getAccount(billingAccount)
    const keysPair = decryptKeysPair(billAccount)
    const depositHistory = await client(keysPair).depositHistory()
    
    const payment = o(find(propEq('txId', txId)), prop('depositList'), depositHistory)
    
    if (!payment) {
      ctx.body = { status: false, error: 'Payment not found. Try later.' }
    } else {
      const payments = await getPaymentsOf(account)
      const double = find(propEq('txId', prop('txId', payment)), payments)

      if (double) return ctx.body = { status: false, error: 'Was already taken' }
      if (payment.status === 0) return ctx.body = { status: false, error: 'Your payments is pending' }
      if (payment.asset !== 'BTC') return ctx.body = { status: false, error: 'This payment is not in BTC' }
      if (payment.status === 1) {
        const state = await createNewPayment({ ...payment, account })
        if (state.inserted !== 1) return ctx.body = { status: false, error: 'Something went wrong!' }
        else ctx.body = { status: true }
      }
    }
  })

  router.post('/signup', async ctx => {
    const { email, name, password, inviteCode } = ctx.request.body
    const invite = await getInvite(inviteCode).then(ifElse(isEmpty, always(null), head))

    if (prop('active', invite)) {
      const { salt, hash } = saltHashPassword(password)
      const status = await createAccount({
        email,
        name,
        salt,
        password: hash,
        invite: invite.id,
        preferences: { chunksNumber: 1 },
        binance: { key: null, secret: null },
        enabled: false
      })

      if (status.inserted === 1) {
        await updateInvite({ id: invite.id, data: { active: false, of: name } })
        ctx.redirect('/settings')
      } else {
        ctx.redirect('/signup?status=failed')
      }
    } else {
      ctx.redirect('/signup?status=inviteFailed')
    }
  })

  router.post('/makeInvite', async ctx => {
    const { by, secret } = ctx.request.body
    if (secret !== 'daslefuu') return (ctx.body = 'Denied!')

    const code = genRandomString(32)
    const state = await createInvite({ code, by })
    if (state.inserted === 1) ctx.body = 'Success! Your invite code: ' + code
    else ctx.body = 'Something went wrong!'
  })
}