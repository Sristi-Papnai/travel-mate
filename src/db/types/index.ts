export interface IErrorElement {
    [key: string]: string;
  }
  
  export interface IStandardResponse {
    error: boolean;
    errors: IErrorElement;
    msg: string;
    data?: unknown;
  }
  