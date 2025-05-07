import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import BookList from './BookList';
import Book from './Book';

class BookListItem extends Model {
  public id!: number;
  public bookListId!: number;
  public bookId!: number;
}

BookListItem.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  bookListId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BookList,
      key: 'id'
    }
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Book,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'BookListItem',
  tableName: 'book_list_items',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['book_list_id', 'book_id']
    }
  ]
});

// Associations
BookListItem.belongsTo(BookList, { foreignKey: 'bookListId' });
BookListItem.belongsTo(Book, { foreignKey: 'bookId' });

export default BookListItem; 