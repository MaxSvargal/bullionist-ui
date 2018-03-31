import React, { Component } from 'react'
import glamorous from 'glamorous'
import { get } from './services/fetch'

import Balance from './components/balance'
import Menu from './components/menu'
import PositionsOpenList from './components/positionsOpenList'
import SymbolsStates from './components/symbolsStates'

export default class extends Component {
  state = { loaded: false }
  componentDidMount() { this.setState({ loaded: true }) }

  static async getInitialProps ({ req, query }) {
    const [ profile, positions, symbolsState ] = await Promise.all([
      get('/api/profile', req),
      get('/api/positions', req),
      get('/api/symbolsState', req),
    ])
    return { profile, positions, symbolsState }
  }

  render() {
    const { positions, profile, symbolsState } = this.props

    const Container = glamorous.div({
      height: '100vh',
      display: 'grid',
      grid: '30vh 70vh / 5rem 1fr',
      gridTemplateAreas: `
        "sidebar header header"
        "sidebar main main"
        "sidebar footer footer"
      `,
      '@media(max-width: 600px)': {
        grid: '300px auto 4rem / 1fr',
        gridTemplateAreas: `
          "header"
          "main"
          "footer"
        `
      }
    })

    const Header = glamorous.div({
      gridArea: 'header',
      overflow: 'hidden'
    })
    const Main = glamorous.div({
      gridArea: 'main',
      overflow: 'scroll'
    })
    const Sidebar = glamorous.div({
      gridArea: 'sidebar',
      alignSelf: 'end',
      '@media(max-width: 600px)': {
        display: 'none'
      }
    })
    const MenuContainer = glamorous.div({
      gridArea: 'sidebar',
      '@media(max-width: 600px)': {
        gridArea: 'footer',
        overflow: 'hidden'
      }
    })

    return !this.state.loaded ? <div/> : (
      <Container>
        <MenuContainer>
          <Menu />
        </MenuContainer>
        <Sidebar>
          <SymbolsStates data={ symbolsState } />
        </Sidebar>
        <Header>
          <Balance positions={ positions } profile={ profile } />
        </Header>
        <Main>
          <PositionsOpenList positions={ positions } />
        </Main>
      </Container>
    )
  }
}