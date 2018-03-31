import React, { Component } from 'react'
import { Container, MenuContainer, Main } from './layouts'
import { get } from './services/fetch'

import PositionsClosedList from './components/positionsClosedList'
import Menu from './components/menu'

export default class extends Component {

  static async getInitialProps ({ req }) {
    const positions = await get('/api/positions', req)
    return { positions }
  }

  render () {
    const { positions } = this.props

    return (
      <Container>
        <MenuContainer>
          <Menu />
        </MenuContainer>
        <Main>
          <PositionsClosedList positions={ positions } />
        </Main>
      </Container>
    )
  }
}
