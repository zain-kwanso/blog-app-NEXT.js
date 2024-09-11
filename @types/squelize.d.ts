import { Model } from "sequelize";

export type data<T, U> = Model<T, U> & T;

export interface DatabaseOptions {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
}
