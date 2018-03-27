import * as LocalStrategy from 'passport-local'
import { getAccount } from './db'
import { hashSaltWithPassword } from './hash'

export const serialize = (user: { name: string }, done: Function) => done(null, user.name)
export const deserialize = (name: string, done: Function) =>
  getAccount(name).then(account => done(null, account))

export const strategy = new LocalStrategy.Strategy(
  (username: string, password: string, done: Function) =>
    getAccount(username).then(account => {
      if (account) {
        const { hash } = hashSaltWithPassword(password, account.salt)
        if (hash === account.password) done(null, account)
        else done(null, false)
      } else done(null, false)
    }))