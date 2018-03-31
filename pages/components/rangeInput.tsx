import React, { Component } from 'react'
import glamorous from 'glamorous'

const Row = glamorous.div({
  display: 'flex',
  flexFlow: 'column wrap',
  lineHeight: '1.6rem',
  padding: '1rem'
})

const Label = glamorous.label({
  display: 'inline',
  fontSize: '.8rem'
})

const Value = glamorous.label({
  display: 'inline',
  fontSize: '1rem',
  fontWeight: 'bold'
})

const Input = glamorous.input({
  padding: '.8rem',
  fontSize: '1.1rem'
})

interface Props {
  value: number
  label: string
  errorMessage?: string
  onChange: (value: number) => void
}

export default class extends Component<Props> {
  state = { currValue: 0 }

  componentWillMount() {
    this.setState({ currValue: this.props.value })
  }

  componentDidMount () {
    this.props.onChange(this.props.value)
  }
  
  onChange = event => {
    this.setState({ currValue: event.target.value })
    this.props.onChange(parseInt(event.target.value))
  }

  render () {
    const { label, value, errorMessage } = this.props
    const { currValue } = this.state
    return (
      <Row>
        <div>
          <Label>{ label }: </Label>
          <Value>{ currValue }</Value>
        </div>
        <Input
          type='range'
          min='1'
          max='64'
          // css={{
          //   WebkitAppearance: 'none',
          //   background: 'black',
          //   ':-webkit-slider-thumb': {
          //     WebkitAppearance: 'none',
          //     background: 'red',
          //     color: 'red'
          //   }
          // }}
          defaultValue={value.toString()}
          onChange={this.onChange} />
        <div>{ errorMessage }</div>
      </Row>
    )
  }
}