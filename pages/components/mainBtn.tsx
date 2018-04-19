import glamorous from 'glamorous'

export default glamorous.button({
  background: '#ff9800',
  border: 'none',
  borderBottom: '2px solid #ef6c00',
  color: '#fff',
  fontSize: '1.2rem',
  padding: '1rem',
  borderRadius: '.25rem',
  width: '30vw',
  alignSelf: 'flex-end',
  cursor: 'pointer',
  ':focus': {
    background: '#fbc02d',
    outline: 'none',
    fontSize: 0
  },
  '> span': {
    display: 'none'
  },
  ':focus > span': {
    display: 'inline',
    fontSize: '1.2rem'
  },
  '@media (max-width: 600px)': {
    width: '100%'
  }
})