export const put = (path: string, data: {}): Promise<Response> =>
  window.fetch(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

export const post = (path: string, data: {}): Promise<Response> =>
  window.fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })