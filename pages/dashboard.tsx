import React, { Component } from 'react'
import glamorous from 'glamorous'

import { get } from './services/fetch'
import requireAuth from './utils/requireAuth'

import Balance from './components/balance'
import Menu from './components/menu'
import PositionsOpenList from './components/positionsOpenList'
import SymbolsStates from './components/symbolsStates'
import NothingToShow from './components/nothingToShow'
import LoadingPlaceholder from './components/loadingPlaceholder'

export default class extends Component {
  state = { loaded: false }
  componentDidMount() { this.setState({ loaded: true }) }

  static async getInitialProps ({ req, res, query }) {
    await requireAuth(res, '/signin')
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
        grid: '30vh auto 4rem / 1fr',
        gridTemplateAreas: `
          "header"
          "main"
          "footer"
        `
      }
    })

    const Header = glamorous.div({
      gridArea: 'header',
      overflow: 'hidden',
      position: 'relative'
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

    return !this.state.loaded || positions.length === 0 ?
      <Container>
        <MenuContainer>
          <Menu />
        </MenuContainer>
        <Main style={{ marginTop: '-30vh' }}>
          <LoadingPlaceholder />
        </Main>
      </Container>
    :
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
  }
}