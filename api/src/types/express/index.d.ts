import { Request } from "express-serve-static-core";
import 'http';

declare module "express-serve-static-core" {
  interface Request {
    rawBody?: string;
  }
}

declare module 'http' {
  interface IncomingMessage {
    rawBody?: string;
  }
}