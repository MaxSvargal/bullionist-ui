import { Div } from 'glamorous'
import Icon from 'react-icons-kit'
import { lowVision } from 'react-icons-kit/fa/lowVision'

export default () => (
  <Div
    display='flex'
    flexFlow='column wrap'
    alignItems='center'
    justifyContent='center'
    textAlign='center'
    height='100vh'
    color='#1976d2'>
    <div>
      <Icon icon={ lowVision } size={ 256 } />
      <h1>Nothing to show yet</h1>
    </div>
  </Div>
)