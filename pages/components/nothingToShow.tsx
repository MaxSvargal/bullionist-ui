import { Div } from 'glamorous'
import Icon from 'react-icons-kit'
import { ic_schedule as schedule } from 'react-icons-kit/md/ic_schedule'

export default () => (
  <Div
    display='flex'
    flexFlow='column wrap'
    alignItems='center'
    justifyContent='center'
    textAlign='center'
    height='100vh'
    color='#0d47a1'>
    <div>
      <Icon icon={ schedule } size={ 256 } style={{ fill: '#8e24aa' }} />
      <h1>Nothing to show yet</h1>
    </div>
  </Div>
)