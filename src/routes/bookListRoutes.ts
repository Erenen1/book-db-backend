import express from 'express';
import * as BookListController from '../controllers/BookListController';
import { authenticateToken, optionalAuthentication } from '../middleware/auth';

const router = express.Router();

/**
 * @route GET /api/book-lists/:id
 * @desc Kitap listesi detayını getir
 * @access Mixed (Özel listeler sadece sahipleri tarafından görülebilir)
 */
// @ts-ignore
router.get('/:id', optionalAuthentication, BookListController.getBookListById);

/**
 * @route PUT /api/book-lists/:id
 * @desc Kitap listesini güncelle
 * @access Private
 */
// @ts-ignore
router.put('/:id', authenticateToken, BookListController.updateBookList);

/**
 * @route DELETE /api/book-lists/:id
 * @desc Kitap listesini sil
 * @access Private
 */
// @ts-ignore
router.delete('/:id', authenticateToken, BookListController.deleteBookList);

/**
 * @route POST /api/book-lists/:listId/books
 * @desc Kitap listesine kitap ekle
 * @access Private
 */
// @ts-ignore
router.post('/:listId/books', authenticateToken, BookListController.addBookToList);

/**
 * @route DELETE /api/book-lists/:listId/books/:bookId
 * @desc Kitap listesinden kitap çıkar
 * @access Private
 */
// @ts-ignore
router.delete('/:listId/books/:bookId', authenticateToken, BookListController.removeBookFromList);

export default router; 