import express from 'express';
import * as UserController from '../controllers/UserController';
import * as BookListController from '../controllers/BookListController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

/**
 * @route GET /api/users/profile
 * @desc Kullanıcı profil bilgilerini getir
 * @access Private
 */
// @ts-ignore
router.get('/profile', authenticateToken, UserController.getUserProfile);

/**
 * @route PUT /api/users/profile
 * @desc Kullanıcı profil bilgilerini güncelle
 * @access Private
 */
// @ts-ignore
router.put('/profile', authenticateToken, UserController.updateUserProfile);

/**
 * @route PUT /api/users/change-password
 * @desc Kullanıcı şifresini değiştir
 * @access Private
 */
// @ts-ignore
router.put('/change-password', authenticateToken, UserController.changePassword);

/**
 * @route GET /api/users/reading-history
 * @desc Kullanıcının okuma geçmişini getir
 * @access Private
 */
// @ts-ignore
router.get('/reading-history', authenticateToken, UserController.getUserBookHistory);

/**
 * @route GET /api/users/book-lists
 * @desc Kullanıcının kitap listelerini getir
 * @access Private
 */
// @ts-ignore
router.get('/book-lists', authenticateToken, BookListController.getUserBookLists);

/**
 * @route POST /api/users/book-lists
 * @desc Yeni kitap listesi oluştur
 * @access Private
 */
// @ts-ignore
router.post('/book-lists', authenticateToken, BookListController.createBookList);

export default router; 