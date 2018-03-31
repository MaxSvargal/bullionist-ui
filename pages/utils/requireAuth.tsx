type Res = {
  isAuthenticated: boolean,
  writeHead: (a: number, b: {}) => void,
  end: () => void,
  finished: boolean
}
export default (res: Res, to: string) => new Promise(resolve => {
  if(res && !res.isAuthenticated) {
    res.writeHead(302, { Location: to })
    res.end()
    res.finished = true
  } else {
    resolve()
  }
})
