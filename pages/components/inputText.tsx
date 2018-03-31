import React, { Component } from 'react'
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
  fontSize: '1.1rem',
  '::placeholder': {
    color: '#cfd8dc'
  }
})

export default class extends Component {
  componentDidMount () { this.props.onChange(this.props.value) }
  onChange = event => this.props.onChange(event.target.value)

  render () {
    const { label, value, onChange, errorMessage, passProps } = this.props

    return (
      <Row>
        <Label htmlFor='key'>{ label }</Label>
        <Input
          type='text'
          defaultValue={value}
          onChange={this.onChange}
          placeholder={passProps.placeholder} />
        <div>{ errorMessage }</div>
      </Row>
    )
  }
}