import Comment from "./comment.model";
import Post from "./post.model";
import User from "./user.model";

User.hasMany(Post, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
});

User.hasMany(Comment, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
});

Post.belongsTo(User, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
});

Post.hasMany(Comment, {
  foreignKey: "PostId",
  onDelete: "CASCADE",
});

Comment.belongsTo(User, {
  foreignKey: "UserId",
  onDelete: "CASCADE",
});

Comment.belongsTo(Post, {
  foreignKey: "PostId",
  onDelete: "CASCADE",
});

Comment.belongsTo(Comment, {
  as: "parentComment",
  foreignKey: "ParentId",
  onDelete: "CASCADE",
});

Comment.hasMany(Comment, {
  as: "replies",
  foreignKey: "ParentId",
  onDelete: "CASCADE",
});

export { Comment, User, Post };
