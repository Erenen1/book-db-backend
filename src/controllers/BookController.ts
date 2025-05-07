import { Request, Response } from 'express';
import Book from '../models/Book';
import Rating from '../models/Rating';
import Comment from '../models/Comment';
import User from '../models/User';
import { Op } from 'sequelize';

// Tüm kitapları getir (filtreleme ve sayfalama ile)
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    // Filtreleme seçenekleri
    const whereClause: any = {};
    
    if (req.query.author) {
      whereClause.author = { [Op.iLike]: `%${req.query.author}%` };
    }
    
    if (req.query.publisher) {
      whereClause.publisher = { [Op.iLike]: `%${req.query.publisher}%` };
    }
    
    if (req.query.year) {
      whereClause.releaseYear = parseInt(req.query.year as string);
    }
    
    // Kitapları getir
    const { count, rows } = await Book.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['title', 'ASC']],
      attributes: { exclude: ['updatedAt'] },
    });
    
    return res.status(200).json({
      total: count,
      page,
      limit,
      books: rows
    });
  } catch (error) {
    console.error('Kitapları getirme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Belirli bir kitabın detaylarını getir
export const getBookById = async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id);
    
    const book = await Book.findByPk(bookId, {
      include: [
        {
          model: Rating,
          attributes: ['score', 'userId', 'createdAt'],
          include: [
            {
              model: User,
              attributes: ['id', 'username']
            }
          ]
        },
        {
          model: Comment,
          attributes: ['id', 'content', 'isSpoiler', 'userId', 'createdAt'],
          include: [
            {
              model: User,
              attributes: ['id', 'username']
            }
          ]
        }
      ]
    });
    
    if (!book) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }
    
    // Ortalama puanı hesapla
    const ratings = book.get('Ratings') as Rating[];
    let averageRating = 0;
    
    if (ratings && ratings.length > 0) {
      const sum = ratings.reduce((total, rating) => total + rating.score, 0);
      averageRating = sum / ratings.length;
    }
    
    // Kitap detaylarına ortalama puanı ekle
    const bookWithRating = {
      ...book.toJSON(),
      averageRating: parseFloat(averageRating.toFixed(1))
    };
    
    return res.status(200).json(bookWithRating);
  } catch (error) {
    console.error('Kitap detayı getirme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Yeni kitap ekle
export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, publisher, pages, releaseYear, coverImage, description } = req.body;
    
    const newBook = await Book.create({
      title,
      author,
      publisher,
      pages,
      releaseYear,
      coverImage,
      description
    });
    
    return res.status(201).json(newBook);
  } catch (error) {
    console.error('Kitap oluşturma hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Kitap güncelle
export const updateBook = async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id);
    const { title, author, publisher, pages, releaseYear, coverImage, description } = req.body;
    
    const book = await Book.findByPk(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }
    
    await book.update({
      title,
      author,
      publisher,
      pages,
      releaseYear,
      coverImage,
      description
    });
    
    return res.status(200).json(book);
  } catch (error) {
    console.error('Kitap güncelleme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Kitap sil
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id);
    
    const book = await Book.findByPk(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }
    
    await book.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error('Kitap silme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
}; 