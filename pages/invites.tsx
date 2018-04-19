import React, { Component } from 'react'
import glamorous from 'glamorous'
import { get } from './services/fetch'

import { Container, MenuContainer, Main } from './layouts'
import InvitesList from './components/invitesList'
import Menu from './components/menu'
import NothingToShow from './components/nothingToShow'

type Props = {
  invites: {}[]
}

export default class extends Component<Props> {

  static async getInitialProps ({ req }: any) {
    const invites = await get('/api/invites', req)
    return { invites }
  }

  render() {
    const { invites } = this.props
    console.log({ invites })

    return (
      <Container>
        <MenuContainer>
          <Menu />
        </MenuContainer>
        <Main>
          { invites.length === 0 ?
            <NothingToShow /> :
            <InvitesList rows={ invites } />
          }
        </Main>
      </Container>
    )
  }
}