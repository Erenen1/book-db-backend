import { Request, Response } from 'express';
import BookList from '../models/BookList';
import BookListItem from '../models/BookListItem';
import User from '../models/User';
import Book from '../models/Book';

// Kullanıcının kitap listelerini getir
export const getUserBookLists = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Kullanıcının var olup olmadığını kontrol et
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    // Listeleri getir
    const bookLists = await BookList.findAll({
      where: { userId },
      include: [
        {
          model: BookListItem,
          include: [
            {
              model: Book,
              attributes: ['id', 'title', 'author', 'coverImage']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json(bookLists);
  } catch (error) {
    console.error('Kitap listelerini getirme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Yeni kitap listesi oluştur
export const createBookList = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const requestUserId = (req as any).user.id; // Auth middleware'den gelen kullanıcı
    const { name, description, isPublic = true } = req.body;
    
    // Sadece kendi listesini oluşturabilir
    if (userId !== requestUserId) {
      return res.status(403).json({
        message: 'Başka bir kullanıcı için liste oluşturamazsınız'
      });
    }
    
    // Kullanıcının var olup olmadığını kontrol et
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    // Yeni liste oluştur
    const bookList = await BookList.create({
      userId,
      name,
      description,
      isPublic
    });
    
    return res.status(201).json(bookList);
  } catch (error) {
    console.error('Kitap listesi oluşturma hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Kitap listesi detayını getir
export const getBookListById = async (req: Request, res: Response) => {
  try {
    const listId = parseInt(req.params.id);
    
    // Listeyi bul
    const bookList = await BookList.findByPk(listId, {
      include: [
        {
          model: BookListItem,
          include: [
            {
              model: Book,
              attributes: ['id', 'title', 'author', 'coverImage', 'publisher', 'releaseYear']
            }
          ]
        },
        {
          model: User,
          attributes: ['id', 'username']
        }
      ]
    });
    
    if (!bookList) {
      return res.status(404).json({ message: 'Kitap listesi bulunamadı' });
    }
    
    // Eğer liste özel ise sadece sahibi görebilir
    if (!bookList.isPublic && bookList.userId !== (req as any).user?.id) {
      return res.status(403).json({
        message: 'Bu özel listeyi görüntüleme yetkiniz yok'
      });
    }
    
    return res.status(200).json(bookList);
  } catch (error) {
    console.error('Kitap listesi getirme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Kitap listesine kitap ekle
export const addBookToList = async (req: Request, res: Response) => {
  try {
    const listId = parseInt(req.params.listId);
    const { bookId } = req.body;
    const userId = (req as any).user.id; // Auth middleware'den gelen kullanıcı
    
    // Listeyi bul
    const bookList = await BookList.findByPk(listId);
    
    if (!bookList) {
      return res.status(404).json({ message: 'Kitap listesi bulunamadı' });
    }
    
    // Sadece listenin sahibi kitap ekleyebilir
    if (bookList.userId !== userId) {
      return res.status(403).json({
        message: 'Bu listeye kitap ekleme yetkiniz yok'
      });
    }
    
    // Kitabın var olup olmadığını kontrol et
    const book = await Book.findByPk(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }
    
    // Kitabın listede zaten olup olmadığını kontrol et
    const existingItem = await BookListItem.findOne({
      where: { bookListId: listId, bookId }
    });
    
    if (existingItem) {
      return res.status(400).json({
        message: 'Bu kitap zaten listede mevcut'
      });
    }
    
    // Kitabı listeye ekle
    const bookListItem = await BookListItem.create({
      bookListId: listId,
      bookId
    });
    
    // Eklenen kitap bilgilerini getir
    const itemWithBook = await BookListItem.findByPk(bookListItem.id, {
      include: [
        {
          model: Book,
          attributes: ['id', 'title', 'author', 'coverImage']
        }
      ]
    });
    
    return res.status(201).json(itemWithBook);
  } catch (error) {
    console.error('Listeye kitap ekleme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Kitap listesinden kitap çıkar
export const removeBookFromList = async (req: Request, res: Response) => {
  try {
    const listId = parseInt(req.params.listId);
    const bookId = parseInt(req.params.bookId);
    const userId = (req as any).user.id; // Auth middleware'den gelen kullanıcı
    
    // Listeyi bul
    const bookList = await BookList.findByPk(listId);
    
    if (!bookList) {
      return res.status(404).json({ message: 'Kitap listesi bulunamadı' });
    }
    
    // Sadece listenin sahibi kitap çıkarabilir
    if (bookList.userId !== userId) {
      return res.status(403).json({
        message: 'Bu listeden kitap çıkarma yetkiniz yok'
      });
    }
    
    // Kitabın listede olup olmadığını kontrol et
    const listItem = await BookListItem.findOne({
      where: { bookListId: listId, bookId }
    });
    
    if (!listItem) {
      return res.status(404).json({
        message: 'Bu kitap listede bulunamadı'
      });
    }
    
    // Kitabı listeden çıkar
    await listItem.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error('Listeden kitap çıkarma hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Kitap listesini güncelle
export const updateBookList = async (req: Request, res: Response) => {
  try {
    const listId = parseInt(req.params.id);
    const userId = (req as any).user.id; // Auth middleware'den gelen kullanıcı
    const { name, description, isPublic } = req.body;
    
    // Listeyi bul
    const bookList = await BookList.findByPk(listId);
    
    if (!bookList) {
      return res.status(404).json({ message: 'Kitap listesi bulunamadı' });
    }
    
    // Sadece listenin sahibi güncelleyebilir
    if (bookList.userId !== userId) {
      return res.status(403).json({
        message: 'Bu listeyi güncelleme yetkiniz yok'
      });
    }
    
    // Listeyi güncelle
    await bookList.update({
      name,
      description,
      isPublic
    });
    
    return res.status(200).json(bookList);
  } catch (error) {
    console.error('Liste güncelleme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Kitap listesini sil
export const deleteBookList = async (req: Request, res: Response) => {
  try {
    const listId = parseInt(req.params.id);
    const userId = (req as any).user.id; // Auth middleware'den gelen kullanıcı
    
    // Listeyi bul
    const bookList = await BookList.findByPk(listId);
    
    if (!bookList) {
      return res.status(404).json({ message: 'Kitap listesi bulunamadı' });
    }
    
    // Sadece listenin sahibi silebilir
    if (bookList.userId !== userId) {
      return res.status(403).json({
        message: 'Bu listeyi silme yetkiniz yok'
      });
    }
    
    // Listeyi sil
    await bookList.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error('Liste silme hatası:', error);
    return res.status(500).json({
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
}; 