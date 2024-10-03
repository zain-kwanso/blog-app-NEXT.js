export interface UserLoginAttributes {
  email: string;
  password: string;
}
export interface UserCreationAttributes extends UserLoginAttributes {
  name: string;
}

export interface User {
  id: number;
  name: string;
  isAdmin: boolean;
  profileKey: string;
}
export interface UserType extends User {
  email: string;
  password: string;
  verificationToken: string;
  verificationTime: Date;
}

export interface UserResponse extends User {
  profilePictureUrl: string;
}

export interface Context {
  currentUser: UserResponse | null;
}

export type UserInstanceType = data<UserType, UserCreationAttributes>;
