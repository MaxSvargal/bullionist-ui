import { SyntheticEvent } from 'react'
import glamorous, { Div, Button } from 'glamorous'

const Row = glamorous.div({
  display: 'flex',
  flexFlow: 'column wrap',
  lineHeight: '1.34rem',
  padding: '1rem'
})

const Label = glamorous.label({
  fontSize: '.8rem'
})

const Input = glamorous.input({
  padding: '.25rem .5rem',
  fontSize: '1.1rem'
})

const toLower = (input: SyntheticEvent<HTMLInputElement>) =>
  input.target.value = input.target.value.toLowerCase()

export default ({ url: { query: { status } } }: any) =>
  <Div
    display='grid'
    grid='1fr auto 1fr / 1fr 4fr 1fr'
    height='100vh'
    background='linear-gradient(#FC5C7D, #6A82FB)'
    color='#546e7a' >
    <Div
      gridArea='2 / 2 / 2 / 2'
      background='#fafafa'
      borderRadius='.25rem' >
      { status === 'failed' &&
        <Div
          textAlign='center'
          fontSize='1.4rem'
          padding='1rem'
          color='#e53935'
          >Login or password are incorrect
        </Div>
      }
      <form action='/login' method='post'>
        <Div display='flex' flexFlow='column nowrap'>
          <Row>
            <Label htmlFor='username'>Name</Label>
            <Input type='text' name='username' required onKeyUp={ toLower } />
          </Row>
          <Row>
            <Label htmlFor='password'>Password</Label>
            <Input type='password' name='password' required />
          </Row>
          <Row>
            <Button
              type='submit'
              background='#ff9800'
              border='none'
              borderBottom='2px solid #ef6c00'
              color='#fff'
              fontSize='1.2rem'
              padding='1rem'
              borderRadius='.25rem'
              >Sign In
            </Button>
          </Row>
        </Div>
      </form>
    </Div>
  </Div>