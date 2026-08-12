



declare module "multiformats" {
  export class CID {
    static parse(s: string): CID;
    toString(): string;
  }
}