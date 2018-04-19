import { Div } from 'glamorous'
import { css } from 'glamor'
import Icon from 'react-icons-kit'
import { spinner10 } from 'react-icons-kit/icomoon/spinner10'

const rotate = css.keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(359deg)' }
})

export default () => (
  <Div
    display='flex'
    flexFlow='column wrap'
    alignItems='center'
    justifyContent='center'
    textAlign='center'
    height='100vh'
    color='#1976d2'>
    <Div animation={ `${rotate} 1s infinite linear` } >
      <Icon icon={ spinner10 } size={ 256 } />
    </Div>
  </Div>
)