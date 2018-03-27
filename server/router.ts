import Router from 'koa-router'
import { ifElse, isEmpty, always, head, prop } from 'ramda'
import { getPositions, getInvite, createAccount, updateInvite, createInvite } from './db'
import { saltHashPassword, genRandomString } from './hash'

export default (router: Router) => {
  router.get('/api/test', async ctx => {
    const data = await getPositions('maxsvargal')
    const invite = await getInvite('2df1068f024432a3899c863eb3ecb665')
    console.log(data[0])
    console.log(invite[0])
    ctx.body = data
  })

  router.get('/', async ctx => {
    if (ctx.isAuthenticated()) {
      ctx.body = { status: ctx.state.user }
    } else {
      ctx.body = { status: false }
    }
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