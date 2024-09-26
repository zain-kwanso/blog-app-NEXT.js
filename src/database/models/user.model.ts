import { DataTypes, ModelDefined, Optional } from "sequelize";
import bcrypt from "bcrypt";
import { UserInstanceType } from "../../../@types/user";
import sequelize from "../config/database";

const User: UserInstanceType = sequelize.define<UserInstanceType>(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationTime: {
      type: DataTypes.DATE,
      defaultValue: null,
    },

    profileKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Users",
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
    hooks: {
      beforeCreate: async (user) => {
        const userInstance = user as UserInstanceType;
        if (userInstance.password) {
          userInstance.password = await bcrypt.hash(userInstance.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        const userInstance = user as UserInstanceType;
        if (userInstance.changed("password")) {
          userInstance.password = await bcrypt.hash(userInstance.password, 10);
        }
      },
    },
  }
);

export default User;
