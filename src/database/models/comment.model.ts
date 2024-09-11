import { DataTypes } from "sequelize";

import { CommentInstance } from "../../../@types/comment";
import sequelize from "../config/database";

const Comment: CommentInstance = sequelize.define<CommentInstance>("Comments", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  PostId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Posts",
      key: "id",
    },
  },
  ParentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Comments",
      key: "id",
    },
  },
});

export default Comment;
