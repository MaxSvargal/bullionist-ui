import React, { Component } from 'react'
import glamorous from 'glamorous'
import { get } from './services/fetch'

import PositionsTimeline from './components/positionsTimeline'
import Menu from './components/menu'
import NothingToShow from './components/nothingToShow'

export default class extends Component {
  state = { loaded: false }

  static async getInitialProps ({ req }: any) {
    const positions = await get('/api/positions', req)
    return { positions }
  }

  componentDidMount() { this.setState({ loaded: true }) }

  render() {
    const { positions } = this.props

    const Container = glamorous.div({
      height: '100vh',
      display: 'grid',
      grid: '1fr / 5rem 1fr',
      gridTemplateAreas: `
        "sidebar main"
      `,
      '@media(max-width: 600px)': {
        grid: 'auto 4rem / 1fr',
        gridTemplateAreas: `
          "main"
          "footer"
        `
      }
    })

    const MenuContainer = glamorous.div({
      gridArea: 'sidebar',
      '@media(max-width: 600px)': {
        gridArea: 'footer',
        overflowY: 'scroll'
      }
    })

    const Main = glamorous.div({
      gridArea: 'main',
      overflow: 'scroll'
    })

    return (!positions || !this.state.loaded) ? <div/> : (
      <Container>
        <MenuContainer>
          <Menu />
        </MenuContainer>
        <Main>
          { positions.length === 0 ?
            <NothingToShow /> :
            <PositionsTimeline positions={ positions } />
          }
        </Main>
      </Container>
    )
  }
}
