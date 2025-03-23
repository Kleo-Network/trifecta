import { PinataSDK } from "pinata"

export const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT || process.env.PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY || process.env.PINATA_GATEWAY
})
