import { Sequelize } from "sequelize";
import pg from "pg";

declare global {
  var sequelize: Sequelize | undefined;
}

const sequelize =
  global.sequelize ||
  new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
      host: process.env.DB_HOST!,
      port: Number(process.env.DB_PORT!),
      dialect: "postgres",
      dialectModule: pg,
    }
  );

if (!global.sequelize) {
  global.sequelize = sequelize;
}

export default sequelize;

// package.json explore
// dependency injection
// lifecycle
// .service usage
// ctx wokring and usage
// status codes
// pipe : messages, validations, global valiator
// restructure guards, don't use filter in guards but in service
// token verificaiton in guards
// Reflect Metadata
// don't use separate queries, create a single
// Transform before IsInt, sequence checking, also tell the max limit
// create separate folder for common
// check for await keyword
// file format validation using custom inteceptor
// decorator for param validation
// AWS v3 usage instead of v2
// separate classes, cat, uat
// validation in entities,
// write the subscriber
// usage of join column, only use when column name is different,it is must in one-to-one relationship.
// define Cascade relationship
// do not use name of column with @Column, not recommended
// define default port instead of using !,
// app.module validation for configuration, everything should come from same configuration.
// create provider if you want to use async, or use useclass and providers should be separate
// use query builder as minimal as possible
// don't format date in backend
// don't fetch user relation on updating the post
// make the common ENUM, create a separate table for roles
// modules should not be under separate folder
// migration commands
// decorators explanation, use custom decorator
