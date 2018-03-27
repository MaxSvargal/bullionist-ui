import { createHmac, randomBytes } from 'crypto'

type Output = { salt: string, hash: string }

type Sha512 = (passw: string, salt: string) => Output
const sha512: Sha512 = (passw, salt) => ({
  salt,
  hash: createHmac('sha512', salt).update(passw).digest('hex')
})

type GenRandomString = (length: number) => string
export const genRandomString: GenRandomString = length =>
  randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length)

type SaltHashPassword = (passw: string) => Output
export const saltHashPassword: SaltHashPassword = (passw) =>
  sha512(passw, genRandomString(16))

export const hashSaltWithPassword: Sha512 = (passw, salt) =>
  sha512(passw, salt)
