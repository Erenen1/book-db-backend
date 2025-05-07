import { Request, Response } from 'express';
import User from '../models/User';
import Rating from '../models/Rating';
import Comment from '../models/Comment';
import Book from '../models/Book';
import bcrypt from 'bcrypt';

// Kullanıcı profili getir
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Kullanıcı profili getirme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Kullanıcı profili güncelle
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const requestUserId = (req as any).user.id;
    const { username, email } = req.body;
    
    // Sadece kendi profilini güncelleyebilir
    if (userId !== requestUserId) {
      return res.status(403).json({
        message: 'Başka bir kullanıcının profilini güncelleme yetkiniz yok'
      });
    }
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    // Kullanıcı adı benzersiz olmalı
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ where: { username } });
      
      if (existingUsername) {
        return res.status(409).json({
          message: 'Bu kullanıcı adı zaten kullanılıyor'
        });
      }
    }
    
    // E-posta benzersiz olmalı
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      
      if (existingEmail) {
        return res.status(409).json({
          message: 'Bu e-posta adresi zaten kullanılıyor'
        });
      }
    }
    
    // Profili güncelle
    await user.update({
      username,
      email
    });
    
    // Şifreyi çıkar
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.get('createdAt'),
      updatedAt: user.get('updatedAt')
    };
    
    return res.status(200).json(userResponse);
  } catch (error) {
    console.error('Kullanıcı profili güncelleme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Şifre değiştir
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const requestUserId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Sadece kendi şifresini değiştirebilir
    if (userId !== requestUserId) {
      return res.status(403).json({
        message: 'Başka bir kullanıcının şifresini değiştirme yetkiniz yok'
      });
    }
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    // Mevcut şifreyi doğrula
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Mevcut şifre yanlış'
      });
    }
    
    // Yeni şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Şifreyi güncelle
    await user.update({
      password: hashedPassword
    });
    
    return res.status(200).json({
      message: 'Şifre başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Kullanıcının kitap geçmişini getir (puanladığı ve yorum yaptığı kitaplar)
export const getUserBookHistory = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    // Kullanıcının puanlamaları
    const ratings = await Rating.findAll({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: Book,
          attributes: ['id', 'title', 'author', 'coverImage']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // Kullanıcının yorumları
    const comments = await Comment.findAll({
      where: { userId },
      include: [
        {
          model: Book,
          attributes: ['id', 'title', 'author', 'coverImage']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({
      ratings,
      comments
    });
  } catch (error) {
    console.error('Kullanıcı kitap geçmişi getirme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
}; 