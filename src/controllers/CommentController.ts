import { Request, Response } from 'express';
import Comment from '../models/Comment';
import CommentReply from '../models/CommentReply';
import CommentLike from '../models/CommentLike';
import User from '../models/User';
import Book from '../models/Book';

// Belirli bir kitaba ait yorumları getir
export const getBookComments = async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    // Kitabın var olup olmadığını kontrol et
    const book = await Book.findByPk(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }
    
    // Yorumları getir
    const { count, rows } = await Comment.findAndCountAll({
      where: { bookId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: CommentReply,
          include: [
            {
              model: User,
              attributes: ['id', 'username']
            }
          ]
        }
      ]
    });
    
    // Her yorum için beğeni sayısını hesapla
    const commentsWithLikes = await Promise.all(
      rows.map(async (comment) => {
        const likeCount = await CommentLike.count({
          where: { commentId: comment.id }
        });
        
        return {
          ...comment.toJSON(),
          likes: likeCount
        };
      })
    );
    
    return res.status(200).json({
      total: count,
      page,
      limit,
      comments: commentsWithLikes
    });
  } catch (error) {
    console.error('Yorumları getirme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Yeni yorum ekle
export const createComment = async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.params.id);
    const userId = (req as any).user.id; // Auth middleware'den gelen kullanıcı
    const { content, isSpoiler = false } = req.body;
    
    // Kitabın var olup olmadığını kontrol et
    const book = await Book.findByPk(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }
    
    // Yeni yorum oluştur
    const comment = await Comment.create({
      userId,
      bookId,
      content,
      isSpoiler
    });
    
    // Kullanıcı bilgilerini ekle
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ]
    });
    
    return res.status(201).json(commentWithUser);
  } catch (error) {
    console.error('Yorum oluşturma hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Yorum güncelle
export const updateComment = async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);
    const userId = (req as any).user.id; // Auth middleware'den gelen kullanıcı
    const { content, isSpoiler } = req.body;
    
    // Yorumu bul
    const comment = await Comment.findByPk(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı' });
    }
    
    // Sadece yorumun sahibi güncelleyebilir
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Bu yorumu güncelleme yetkiniz yok' });
    }
    
    // Yorumu güncelle
    await comment.update({
      content,
      isSpoiler
    });
    
    // Güncel yorumu kullanıcı bilgileriyle birlikte getir
    const updatedComment = await Comment.findByPk(commentId, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ]
    });
    
    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error('Yorum güncelleme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Yorum sil
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);
    const userId = (req as any).user.id; // Auth middleware'den gelen kullanıcı
    
    // Yorumu bul
    const comment = await Comment.findByPk(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı' });
    }
    
    // Sadece yorumun sahibi silebilir
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Bu yorumu silme yetkiniz yok' });
    }
    
    // Yorumu sil
    await comment.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error('Yorum silme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Yoruma cevap ekle
export const addCommentReply = async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);
    const userId = (req as any).user.id; // Auth middleware'den gelen kullanıcı
    const { content } = req.body;
    
    // Yorumun var olup olmadığını kontrol et
    const comment = await Comment.findByPk(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı' });
    }
    
    // Cevap oluştur
    const reply = await CommentReply.create({
      userId,
      commentId,
      content
    });
    
    // Kullanıcı bilgilerini ekle
    const replyWithUser = await CommentReply.findByPk(reply.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ]
    });
    
    return res.status(201).json(replyWithUser);
  } catch (error) {
    console.error('Yorum cevabı oluşturma hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Yorumu beğen/beğenme
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.id);
    const userId = (req as any).user.id; // Auth middleware'den gelen kullanıcı
    
    // Yorumun var olup olmadığını kontrol et
    const comment = await Comment.findByPk(commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı' });
    }
    
    // Kullanıcının daha önce beğenip beğenmediğini kontrol et
    const existingLike = await CommentLike.findOne({
      where: { userId, commentId }
    });
    
    if (existingLike) {
      // Beğeniyi kaldır
      await existingLike.destroy();
      return res.status(200).json({ liked: false });
    } else {
      // Beğeni ekle
      await CommentLike.create({
        userId,
        commentId
      });
      return res.status(200).json({ liked: true });
    }
  } catch (error) {
    console.error('Yorum beğenme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
}; 