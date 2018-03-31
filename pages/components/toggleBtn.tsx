import glamorous from 'glamorous'

const Container = glamorous.label({
  position: 'relative',
  display: 'inline-block',
  width: 60,
  height: 34
})

const Input = glamorous.input({
  display: 'none',
  ':checked + span': {
    background: '#4caf50'
  },
  ':checked + span:before': {
    transform: 'translateX(26px)'
  }
})

const Slider = glamorous.span({
  position: 'absolute',
  cursor: 'pointer',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 34,
  background: '#ccc',
  transition: '.4s',
  ':before': {
    position: 'absolute',
    content: '""',
    borderRadius: '50%',
    height: 26,
    width: 26,
    left: 4,
    bottom: 4,
    background: 'white',
    transition: '.4s'
  }
})

type Props = { value: boolean, onChange: (a: boolean) => void, passProps: {}[] }
export default ({ value, onChange, passProps }: Props) =>
  <Container>
    <Input
      type='checkbox'
      defaultChecked={ value }
      onChange={ (e) => onChange(e.target.checked) }
      {...passProps} />
    <Slider />
  </Container>