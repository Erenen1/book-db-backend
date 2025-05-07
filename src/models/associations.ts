import User from './User';
import Book from './Book';
import Rating from './Rating';
import Comment from './Comment';
import CommentReply from './CommentReply';
import CommentLike from './CommentLike';
import BookList from './BookList';
import BookListItem from './BookListItem';

// User Associations
User.hasMany(Rating, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });
User.hasMany(CommentReply, { foreignKey: 'userId' });
User.hasMany(CommentLike, { foreignKey: 'userId' });
User.hasMany(BookList, { foreignKey: 'userId' });

// Book Associations
Book.hasMany(Rating, { foreignKey: 'bookId' });
Book.hasMany(Comment, { foreignKey: 'bookId' });
Book.hasMany(BookListItem, { foreignKey: 'bookId' });

// Comment Associations
Comment.hasMany(CommentReply, { foreignKey: 'commentId' });
Comment.hasMany(CommentLike, { foreignKey: 'commentId' });

// BookList Associations
BookList.hasMany(BookListItem, { foreignKey: 'bookListId' });

export {
  User,
  Book,
  Rating,
  Comment,
  CommentReply,
  CommentLike,
  BookList,
  BookListItem
}; 