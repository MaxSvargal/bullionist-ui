import fetch from 'isomorphic-fetch'
import { merge, pick, o } from 'ramda'

type Req = { headers: { host: string } }

const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
const getHost = ({ headers }: Req) => process.browser ? location.host : headers.host
const makeHeaders = o(merge({ credentials: 'include' } as any), pick([ 'headers' ]) as (a: Req) => Req)

type Get = (path: string, req?: Req) => Promise<Response>
export const get: Get = (path, req = { headers: { host: 'localhost:3000' } }) =>
  fetch(`${protocol}://${getHost(req)}${path}`, makeHeaders(req))
    .then(res => res.json())
    .catch(err => console.error(err) || err)

export const put = (path: string, data: {}): Promise<Response> =>
  fetch(path, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

export const post = (path: string, data: {}): Promise<Response> =>
  fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })