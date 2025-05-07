import express from 'express';
import * as BookController from '../controllers/BookController';
import * as RatingController from '../controllers/RatingController';
import * as CommentController from '../controllers/CommentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

/**
 * @route GET /api/books
 * @desc Tüm kitapları getir
 * @access Public
 */
// @ts-ignore
router.get('/', BookController.getAllBooks);

/**
 * @route GET /api/books/:id
 * @desc Kitap detayını getir
 * @access Public
 */
// @ts-ignore
router.get('/:id', BookController.getBookById);

/**
 * @route POST /api/books
 * @desc Yeni kitap ekle
 * @access Private - Admin only
 */
// @ts-ignore
router.post('/', authenticateToken, BookController.createBook);

/**
 * @route PUT /api/books/:id
 * @desc Kitap bilgilerini güncelle
 * @access Private - Admin only
 */
// @ts-ignore
router.put('/:id', authenticateToken, BookController.updateBook);

/**
 * @route DELETE /api/books/:id
 * @desc Kitap sil
 * @access Private - Admin only
 */
// @ts-ignore
router.delete('/:id', authenticateToken, BookController.deleteBook);

/**
 * @route GET /api/books/:id/ratings
 * @desc Kitap puanlarını getir
 * @access Public
 */
// @ts-ignore
router.get('/:id/ratings', RatingController.getBookRatings);

/**
 * @route POST /api/books/:id/ratings
 * @desc Kitaba puan ver
 * @access Private
 */
// @ts-ignore
router.post('/:id/ratings', authenticateToken, RatingController.rateBook);

/**
 * @route DELETE /api/books/:id/ratings
 * @desc Kitap puanını kaldır
 * @access Private
 */
// @ts-ignore
router.delete('/:id/ratings', authenticateToken, RatingController.deleteRating);

/**
 * @route GET /api/books/:id/comments
 * @desc Kitap yorumlarını getir
 * @access Public
 */
// @ts-ignore
router.get('/:id/comments', CommentController.getBookComments);

/**
 * @route POST /api/books/:id/comments
 * @desc Kitaba yorum ekle
 * @access Private
 */
// @ts-ignore
router.post('/:id/comments', authenticateToken, CommentController.createComment);

export default router; 