import * as next from 'next'
import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as session from 'koa-session'
import * as passport from 'koa-passport'
import * as bodyParser from 'koa-bodyparser'
import * as json from 'koa-json'

import applyRoutes from './routes'
import { serialize, deserialize, strategy } from './auth'

const port = parseInt(process.env.PORT as string, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  applyRoutes(router)

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/signin?status=failed'
  }))

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  passport.serializeUser(serialize)
  passport.deserializeUser(deserialize)
  passport.use(strategy)

  server.proxy = true
  server.keys = ['7e0fb4fa03b877c34754245f6869f416d0397a7c7ea3bb277123a']
  server.use(session({}, server))
  server.use(bodyParser())
  server.use(passport.initialize())
  server.use(passport.session())
  server.use(json())

  server.use(router.routes())
  server.listen(port, () =>
    console.log(`> Ready on http://localhost:${port}`))
})
