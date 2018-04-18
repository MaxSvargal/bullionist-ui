import { Component } from 'react'
import glamorous, { Div } from 'glamorous'
import moment from 'moment'
import { prop } from 'ramda'

const Row = glamorous.div({
  display: 'grid',
  grid: '1fr / 1fr 1fr 1fr',
  padding: '1rem',
  borderBottom: '1px solid #b0bec5'
})

type Props = {
  rows: {
    insertTime: number
  }[]
}

export default class extends Component<Props> {
  render() {
    const { rows } = this.props
    return (
      <Div display='flex' flexFlow='column wrap'>
        <Row>
          <div>Date</div>
          <div>Amount</div>
          <div>Tx ID</div>
        </Row>
        { rows.map(r =>
          <Row key={ prop('id', r) }>
            <Div>{ moment(prop('insertTime', r)).format('HH:mm, D MMM') }</Div>
            <Div>{ prop('amount', r) } BTC</Div>
            <Div>
              <a href={ `https://blockchain.info/tx/${prop('txId', r)}` } target='_blank'>
                <small>{ prop('txId', r) }</small>
              </a>
            </Div>
          </Row>
        ) }
      </Div>
    )
  }
}