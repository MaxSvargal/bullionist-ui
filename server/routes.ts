import Router from 'koa-router'
import * as fetch from 'isomorphic-fetch'
import { converge, merge, objOf, both, ifElse, isEmpty, always, head, prop, o, all, not, isNil, props, path } from 'ramda'
import { saltHashPassword, genRandomString } from './hash'
import { encrypt } from './crypt'
import {
  getPosition, getPositions, getInvite, createAccount, updateInvite,
  createInvite, getSymbolsState, getProfile, updateSettings
} from './db'
import { publish } from './cote'

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