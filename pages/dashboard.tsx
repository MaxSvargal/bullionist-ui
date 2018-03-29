import React, { Component } from 'react'
import cookie from 'cookie'
import { get } from './services/fetch'

export default class extends Component {
  static async getInitialProps ({ req, query }) {
    const [ profile, positions, symbolsState ] = await Promise.all([
      get(req, '/api/profile'),
      get(req, '/api/positions'),
      get(req, '/api/symbolsState'),
    ])
    return { profile, positions, symbolsState }
  }

  render() {
    console.log(this.props)
    return <div />
  }
}