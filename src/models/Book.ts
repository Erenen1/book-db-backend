import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Book extends Model {
  public id!: number;
  public title!: string;
  public author!: string;
  public publisher!: string;
  public pages!: number;
  public releaseYear!: number;
  public coverImage?: string;
  public description?: string;
  public estimatedReadingTime?: number;
}

Book.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  publisher: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  pages: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  releaseYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1000,
      max: new Date().getFullYear()
    }
  },
  coverImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estimatedReadingTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Estimated reading time in minutes'
  }
}, {
  sequelize,
  modelName: 'Book',
  tableName: 'books',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: (book) => {
      book.estimatedReadingTime = book.pages;
    },
    beforeUpdate: (book) => {
      book.estimatedReadingTime = book.pages;
    }
  }
});

export default Book; 