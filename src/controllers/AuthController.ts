import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'gizli-anahtar';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Kullanıcı adı veya email zaten kullanılıyor mu kontrol et
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Kullanıcı adı veya e-posta zaten kullanımda'
      });
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcı oluştur
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // Hassas verileri kaldır
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.get('createdAt'),
      updatedAt: user.get('updatedAt')
    };

    return res.status(201).json(userResponse);
  } catch (error) {
    console.error('Kayıt hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı e-posta ile bul
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: 'Geçersiz kimlik bilgileri'
      });
    }

    // Şifre doğrulaması
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Geçersiz kimlik bilgileri'
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Hassas verileri kaldır
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.get('createdAt'),
      updatedAt: user.get('updatedAt')
    };

    return res.status(200).json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
}; 