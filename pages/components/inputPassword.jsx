import { Component } from 'react'
import glamorous from 'glamorous'

const Row = glamorous.div({
  display: 'flex',
  flexFlow: 'column wrap',
  lineHeight: '1.6rem',
  padding: '1rem'
})

const Label = glamorous.label({
  fontSize: '.8rem'
})

const Input = glamorous.input({
  padding: '.8rem',
  fontSize: '1.1rem'
})

export default class extends Component {
  componentDidMount () { this.props.onChange(this.props.value) }
  onChange = event => this.props.onChange(event.target.value)

  render () {
    const { label, value, onChange, errorMessage } = this.props
    return (
      <Row>
        <Label htmlFor='key'>{ label }</Label>
        <Input
          type='password'
          defaultValue={value}
          onChange={this.onChange}
          required />
        <div>{ errorMessage }</div>
      </Row>
    )
  }
}