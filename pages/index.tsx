import { Div, A } from 'glamorous'
import MainBtn from './components/mainBtn'

export default () => (
  <Div height='100vh' display='grid' grid='1fr auto 1fr / 1fr 4fr 1fr'>
    <A href='/dashboard' gridArea='2 / 2 / 2 / 2' textAlign='center'>
      <MainBtn>To dashboard<span>Redirecting...</span></MainBtn>
    </A>
  </Div>
)
