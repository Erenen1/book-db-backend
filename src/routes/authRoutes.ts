import express from 'express';
import * as AuthController from '../controllers/AuthController';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Yeni kullanıcı kaydı
 * @access Public
 */
// @ts-ignore
router.post('/register', AuthController.register);

/**
 * @route POST /api/auth/login
 * @desc Kullanıcı girişi ve token alma
 * @access Public
 */
// @ts-ignore
router.post('/login', AuthController.login);

export default router; 