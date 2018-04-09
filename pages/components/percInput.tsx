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

const WarningMsg = glamorous.span({
  color: '#e91e63',
  fontSize: '.9rem',
  padding: '0 1rem'
})

interface Props {
  value: number
  label: string
  errorMessage?: string
  onChange: (value: number) => void
}

export default class extends Component<Props> {
  state = {
    currValue: 0,
    warnAmount: null
  }

  componentWillMount() {
    this.setState({ currValue: this.props.value })
  }

  componentDidMount () {
    this.props.onChange(this.props.value)
  }
  
  onChange = event => {
    this.setState({
      currValue: event.target.value,
      warnAmount: parseFloat(event.target.value) > 0.01 ?
        'Be careful! You may not reach the goal!' :
        null 
    })
    this.props.onChange(parseFloat(event.target.value))
  }

  render () {
    const { label, value, errorMessage } = this.props
    const { currValue, warnAmount } = this.state
    return (
      <Row>
        <div>
          <Label>{ label }: </Label>
          <Value>{ (currValue * 100).toFixed(2) }%</Value>
          <WarningMsg>{ warnAmount }</WarningMsg>
        </div>
        <Input
          type='range'
          min='0.001'
          max='0.05'
          step='0.0001'
          defaultValue={value.toString()}
          onChange={this.onChange} />
        <div>{ errorMessage }</div>
      </Row>
    )
  }
}