import * as r from 'rethinkdb'
import { Sequence, Operation, Cursor, WriteResult } from 'rethinkdb'

const dbUp = async (command: Sequence | Operation<WriteResult | Cursor | null>) => {
  try {
    const conn = await r.connect({ host: 'localhost', port: 28015, db: 'stockbroker' })
    const res = await command.run(conn)
    conn.close()
    return res
  } catch (err) {
    return err
  }
}

export const getSymbolsState  = () => dbUp(
  r.table('symbolsState')
    .filter({ '4h': true })
    .orderBy(r.row('timestamp')))

export const getPositions = (account: string) => dbUp(
  r.table('positions')
    .getAll(account, { index: 'account' })
    .orderBy(r.row('open')('time')))

export const getAccount = (account: string) => dbUp(
  r.table('accounts')
    .get(account))

export const getProfile = (account: string) => dbUp(
  r.table('accounts')
    .get(account)
    .pluck([ 'name', 'preferences' ]))

export const createAccount = (data: {}) => dbUp(
  r.table('accounts')
    .insert(data))

export const createInvite = ({ code, by }: { code: string, by: string }) => dbUp(
  r.table('invites')
    .insert({ code, by, active: true }))

export const getInvite = (code: string) => dbUp(
  r.table('invites')
    .getAll(code, { index: 'code' })
    .limit(1)
    .orderBy(r.row('code')))

export const updateInvite = ({ id, data }: { id: string, data: {} }) => dbUp(
  r.table('invites')
    .get(id)
    .update(data)
)
