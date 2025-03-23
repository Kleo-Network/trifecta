import { PinataSDK } from "pinata"
import { config } from 'dotenv';
config();
export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY
})
