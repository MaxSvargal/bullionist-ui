import { Component } from 'react'
import { Div, Span, Strong, Input } from 'glamorous'
import { Form, Field } from 'simple-react-form'

import MainBtn from './mainBtn'
import InputText from './inputText'

type Props = {
  payAddress: string
  onSubmit: (a: {}) => void
}

export default class extends Component<Props> {
  render() {
    const { payAddress, onSubmit } = this.props
    return (
      <Form onSubmit={ onSubmit }>
        <Div
          display='grid'
          grid='1fr 1fr 1fr / 1fr 1fr'
          gridGap='.5rem'
          maxWidth='42rem'
          justifyItems='stretch'
          alignItems='center' >
          <Span padding='0.25rem 0'>Send <Strong color='#ffb300'>bitcoins</Strong> to address</Span>
          <Span background='#eceff1' padding='0.5rem 1rem' fontSize='1.1rem'>{ payAddress }</Span>

          <Span>Fill your wallet address</Span>
          <Field type={ InputText } fieldName='outputAddr' />

          <Span>And then press the button</Span>
          <MainBtn style={ { padding: '0.5rem', width: '100%' } }>Check payment</MainBtn>
        </Div>
      </Form>
    )
  }
}