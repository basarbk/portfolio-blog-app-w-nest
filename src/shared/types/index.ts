export class GenericResponse {
  message: string;
  constructor(message: string) {
    this.message = message;
  }
}

export enum Operation {
  register = 'register',
  login = 'login',
}

export class Pagination {
  page: number;
  size: number;
  constructor(page: number, size: number) {
    this.page = page;
    this.size = size;
  }
}
