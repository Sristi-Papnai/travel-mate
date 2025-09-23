export interface IErrorElement {
    [key: string]: string;
  }
  
  export interface IStandardResponse<T = unknown> {
    error: boolean;
    errors: IErrorElement;
    msg: string;
    data?: T;
  }
  