import Router from 'koa-router'
import * as fetch from 'isomorphic-fetch'
import { ifElse, isEmpty, always, head, prop } from 'ramda'
import { saltHashPassword, genRandomString } from './hash'
import { getPositions, getInvite, createAccount, updateInvite, createInvite, getSymbolsState, getProfile } from './db';

const checkAuth = (ctx: Router.IRouterContext) =>
  ctx.isAuthenticated() ? ctx.state.user.name : (ctx.status = 401)

export default (router: Router) => {

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
      const status = await createAccount({ email, name, salt, password: hash, invite: invite.id })

      if (status.inserted === 1) {
        await updateInvite({ id: invite.id, data: { active: false, of: name } })
        ctx.redirect('/dashboard')
      } else {
        ctx.redirect('/dashboard?status=failed')
      }
    } else {
      ctx.redirect('/dashboard?status=inviteFailed')
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