import { Div, Span } from 'glamorous'
import { filter, map, o, propEq } from 'ramda'
import CopyToClipboard from 'react-copy-to-clipboard'

import MainBtn from './mainBtn'

type Invite = {
  id: string,
  code: string,
  of?: string
}
type Props = {
  rows: Invite[]
}

const renderAvaliable = ({ id, code }: Invite) =>
  <Div
    key={ id }
    display='grid'
    grid='1fr / 1fr 2fr'
    alignItems='center'
    background='#7cb342'
    color='#fff'
    margin='.5rem 0' >
    <CopyToClipboard text={ `https://bullionist.rocks/signup?invite=${code}` } >
      <MainBtn><span>Copied!</span>Copy link</MainBtn>
    </CopyToClipboard>
    <Span padding='.5rem'>
      <Span fontSize='.8rem' color='#e8f5e9'>https://bullionist.rocks/signup?invite=</Span>
      <Span>{ code }</Span>
    </Span>
  </Div>

const renderUsed = ({ id, code, of }: Invite) =>
  <Div
    key={ id }
    display='grid'
    grid='1fr / 1fr 1fr'
    padding='.5rem'
    borderBottom='1px solid #cfd8dc' >
    <Div>{ of }</Div>
    <Div>{ code }</Div>
  </Div>

export default ({ rows }: Props) => (
  <Div margin='1rem'>
    <div>
      <h1>Active invites</h1>
      { o(map(renderAvaliable), filter(propEq('active', true)), rows) }
    </div>
    <div>
      <br />
      <h1>Already used</h1>
      <Div lineHeight='2rem' >
        <Div display='grid' grid='1fr / 1fr 1fr'>
          <strong>Used by user</strong>
          <strong>Code</strong>
        </Div>
        { o(map(renderUsed), filter(propEq('active', false)), rows) }
      </Div>
    </div>
  </Div>
)