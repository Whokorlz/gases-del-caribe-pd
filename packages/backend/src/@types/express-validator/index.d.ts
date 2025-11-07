import 'express-validator';

declare module 'express-validator' {
  interface ValidationError {
    path?: string;
    msg: any;
    value?: any;
    location?: string;
    type?: string;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}
