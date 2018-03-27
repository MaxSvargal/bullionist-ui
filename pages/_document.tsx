import { renderStatic } from 'glamor/server'
import { rehydrate, css } from 'glamor'
import Document, { Head, Main, NextScript } from 'next/document'

if (typeof window !== 'undefined') rehydrate(window.__NEXT_DATA__.ids)

export default class MyDocument extends Document {
  static async getInitialProps ({ renderPage }) {
    const page = renderPage()
    const styles = renderStatic(() => page.html || page.errorHtml)
    return { ...page, ...styles }
  }

  constructor (props) {
    super(props)
    const { __NEXT_DATA__, ids } = props
    if (ids) __NEXT_DATA__.ids = this.props.ids
  }

  render () {
    css.global('html, body', {
      background: '#fff',
      margin: 0,
      height: '100vh',
      minHeight: '100vh',
      fontFamily: '"SFMono-Regular",Consolas,"Liberation Mono",Menlo,Courier,monospace',
      fontSize: '14px'
    })

    return (
      <html>
        <Head>
          <title>Bullionist</title>
          <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, minimal-ui' />
          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}