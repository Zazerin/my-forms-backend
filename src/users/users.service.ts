import { Injectable } from '@nestjs/common';

export type User = {
  userId: string;
  phone: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: '1',
      phone: '380975357797',
      password: '1111',
    },
    {
      userId: '2',
      phone: '380975357797',
      password: '1111',
    },
  ];

  async findOne(phone: string): Promise<User | undefined> {
    return this.users.find(user => user.phone === phone);
  }
}