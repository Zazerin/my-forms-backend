import { Injectable } from '@nestjs/common';

export type User = {
  userId: string;
  phone: string;
  password: string;
  name: string;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: '1',
      phone: '380971111111',
      password: '1111',
      name: 'Oleg',
    },
    {
      userId: '2',
      phone: '380972222222',
      password: '1111',
      name: 'Dmitry'
    },
  ];

  async findOne(phone: string): Promise<User | undefined> {
    return this.users.find(user => user.phone === phone);
  }
}