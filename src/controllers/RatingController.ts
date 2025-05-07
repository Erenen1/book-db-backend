import { Request, Response } from 'express';
import Rating from '../models/Rating';
import Book from '../models/Book';
import User from '../models/User';

// Kitap puanlarını getir
export const getBookRatings = async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id);
    
    // Kitabın var olup olmadığını kontrol et
    const book = await Book.findByPk(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }
    
    // Puanlamaları getir
    const ratings = await Rating.findAll({
      where: { bookId },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // Ortalama puanı hesapla
    let averageRating = 0;
    
    if (ratings.length > 0) {
      const sum = ratings.reduce((total, rating) => total + rating.score, 0);
      averageRating = sum / ratings.length;
    }
    
    return res.status(200).json({
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalRatings: ratings.length,
      ratings
    });
  } catch (error) {
    console.error('Puanları getirme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Kitaba puan ver veya mevcut puanı güncelle
export const rateBook = async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id);
    const userId = (req as any).user.id; // Auth middleware'den gelen kullanıcı
    const { score } = req.body;
    
    // Geçerli puan aralığını kontrol et
    if (score < 0 || score > 10) {
      return res.status(400).json({
        message: 'Puan 0 ile 10 arasında olmalıdır'
      });
    }
    
    // Kitabın var olup olmadığını kontrol et
    const book = await Book.findByPk(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }
    
    // Kullanıcının daha önce puan verip vermediğini kontrol et
    const existingRating = await Rating.findOne({
      where: { userId, bookId }
    });
    
    let rating;
    
    if (existingRating) {
      // Mevcut puanı güncelle
      rating = await existingRating.update({ score });
    } else {
      // Yeni puan oluştur
      rating = await Rating.create({
        userId,
        bookId,
        score
      });
    }
    
    // Kullanıcı bilgilerini ekle
    const ratingWithUser = await Rating.findByPk(rating.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ]
    });
    
    return res.status(201).json(ratingWithUser);
  } catch (error) {
    console.error('Puanlama hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Kullanıcının kitap puanını getir
export const getUserBookRating = async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.bookId);
    const userId = (req as any).user.id; // Auth middleware'den gelen kullanıcı
    
    // Kullanıcının puanını getir
    const rating = await Rating.findOne({
      where: { userId, bookId }
    });
    
    if (!rating) {
      return res.status(404).json({
        message: 'Bu kitap için puan bulunamadı'
      });
    }
    
    return res.status(200).json(rating);
  } catch (error) {
    console.error('Kullanıcı puanı getirme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Kitap puanını sil
export const deleteRating = async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id);
    const userId = (req as any).user.id; // Auth middleware'den gelen kullanıcı
    
    // Puanı bul
    const rating = await Rating.findOne({
      where: { userId, bookId }
    });
    
    if (!rating) {
      return res.status(404).json({
        message: 'Bu kitap için puan bulunamadı'
      });
    }
    
    // Puanı sil
    await rating.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error('Puan silme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
}; 