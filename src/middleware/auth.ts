import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'gizli-anahtar';

// Token doğrulama middleware'i
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        message: 'Yetkilendirme gerekli'
      });
    }
    
    return jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({
          message: 'Geçersiz veya süresi dolmuş token'
        });
      }
      
      // Kullanıcı hala var mı kontrol et
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.status(403).json({
          message: 'Kullanıcı bulunamadı'
        });
      }
      
      // Request nesnesine kullanıcı bilgilerini ekle
      (req as any).user = decoded;
      return next();
    });
  } catch (error) {
    console.error('Kimlik doğrulama hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// İsteğe bağlı token doğrulama (isteğe bağlı yetkilendirme için)
export const optionalAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return next();
    }
    
    return jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
      if (!err) {
        (req as any).user = decoded;
      }
      return next();
    });
  } catch (error) {
    console.error('İsteğe bağlı kimlik doğrulama hatası:', error);
    return next();
  }
}; 