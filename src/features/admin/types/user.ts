export interface User {
  _id: string;
  username: string;
  email: string;
  phonenumber?: string;
  address?: string;
}

export interface UsersResponse {
  data: {
    users: User[];
    total: number;
  };
}

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  phonenumber?: string;
  address?: string;
}
