import { User } from './User';

export class Article {
  readonly id: number;

  content: string;

  readonly createdAt: Date;

  author: User;

  constructor(id: number, author: User, content: string) {
    this.id = id;
    this.author = author;
    this.content = content;
    this.createdAt = new Date();
  }
}
