import fetch from 'isomorphic-fetch'

const host = (req: { headers: { host: string } }) => process.browser ? location.host : req.headers.host
const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

export const get = (req: { headers: { host: string } }, path: string): Promise<Response> => {
  console.log(`${protocol}://${host(req)}${path}`, req.headers)
  return fetch(`${protocol}://${host(req)}${path}`, { headers: req.headers })
    .then(res => res.json())
    .catch(err => console.error(err))
}

export const put = (path: string, data: {}): Promise<Response> =>
  fetch(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

export const post = (path: string, data: {}): Promise<Response> =>
  fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })