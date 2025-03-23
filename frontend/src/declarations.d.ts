declare module "@pinata/sdk" {
  export interface PinataSDKOptions {
    pinataJWTKey?: string;
    pinataApiKey?: string;
    pinataSecretApiKey?: string;
    pinataGateway?: string;
  }

  export interface PinataResponse {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
    isDuplicate?: boolean;
  }

  export class PinataSDK {
    constructor(options: PinataSDKOptions);

    pinFileToIPFS(file: File | string): Promise<PinataResponse>;
    pinFromFS(sourcePath: string): Promise<PinataResponse>;
    pinJSONToIPFS(json: object): Promise<PinataResponse>;
    pinJobs(queryParams?: object): Promise<object>;

    unpin(hashToUnpin: string): Promise<object>;
    testAuthentication(): Promise<boolean>;

    pinList(filters?: object): Promise<object>;
    userPinList(filters?: object): Promise<object>;
    userPinnedDataTotal(): Promise<object>;
  }
}