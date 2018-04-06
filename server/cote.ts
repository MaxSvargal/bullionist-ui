import { constructN } from 'ramda'
import { Publisher } from 'cote'

type PublisherCons = (options: { name: string, broadcasts: string[] }) => Publisher
export const publisherCons: PublisherCons = constructN(1, Publisher)

const publisher = publisherCons({
  name: 'Signaller Publisher',
  broadcasts: [ 'newSignal' ]
})

export const publish = (type: string, req: Event) =>
  publisher.publish(type, req)