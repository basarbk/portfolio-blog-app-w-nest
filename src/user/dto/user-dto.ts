import { User } from '../user.entity';

export class UserDTO {
  id: number;
  handle: string;
  name: string;
  image: string;
  constructor(user: User) {
    this.id = user.id;
    this.handle = user.handle;
    this.name = user.name;
    this.image = user.image;
  }
}
