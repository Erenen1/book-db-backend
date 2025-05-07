import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Comment from './Comment';

class CommentReply extends Model {
  public id!: number;
  public commentId!: number;
  public userId!: number;
  public content!: string;
}

CommentReply.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Comment,
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'CommentReply',
  tableName: 'comment_replies',
  timestamps: true,
  underscored: true
});

// Associations
CommentReply.belongsTo(Comment, { foreignKey: 'commentId' });
CommentReply.belongsTo(User, { foreignKey: 'userId' });

export default CommentReply; 