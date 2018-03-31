import * as aes256 from 'aes256'
import { readFileSync } from 'fs'

export const encrypt = (str: string): string =>
  aes256.encrypt(readFileSync(`${__dirname}/secret.txt`, 'utf8'), str)