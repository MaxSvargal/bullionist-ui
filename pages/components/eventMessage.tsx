import { Component } from 'react'
import glamorous from 'glamorous'

const Container = glamorous.div(({ type, show }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const FadeBg = glamorous.div(({ type, show }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: type === 'success' ? '#03a9f4' : '#f44336',
  opacity: show ? 1 : 0,
  transition: 'all .5s .2s ease-out'
}))

const Message = glamorous.div(({ type, show }) => ({
  background: type === 'success' ? '#03a9f4' : '#f44336',
  color: '#fff',
  fontSize: '2rem',
  padding: '4rem',
  borderRadius: '2rem',
  opacity: show ? 1 : 0,
  transition: 'opacity .25s .75s ease-out'
}))

type Props = { message: string, type: 'success' | 'error' }
export default class extends Component<Props> {
  state = {
    show: true,
    removed: false
  }

  componentDidMount() {
    setTimeout(() => this.setState({ show: false }), 20)
  }

  render() {
    return (
      <Container type={ this.props.type } show={ this.state.show }>
        <FadeBg type={ this.props.type } show={ this.state.show } />
        <Message type={ this.props.type } show={ this.state.show }>
          { this.props.message }
        </Message>
      </Container>
    )
  }
}