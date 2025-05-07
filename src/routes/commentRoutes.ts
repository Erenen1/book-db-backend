import express from 'express';
import * as CommentController from '../controllers/CommentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

/**
 * @route POST /api/comments/:commentId/replies
 * @desc Yoruma cevap ekle
 * @access Private
 */
// @ts-ignore
router.post('/:commentId/replies', authenticateToken, CommentController.addCommentReply);

/**
 * @route PUT /api/comments/:commentId
 * @desc Yorumu güncelle
 * @access Private
 */
// @ts-ignore
router.put('/:commentId', authenticateToken, CommentController.updateComment);

/**
 * @route DELETE /api/comments/:commentId
 * @desc Yorumu sil
 * @access Private
 */
// @ts-ignore
router.delete('/:commentId', authenticateToken, CommentController.deleteComment);

/**
 * @route POST /api/comments/:commentId/like
 * @desc Yorumu beğen/beğenmekten vazgeç
 * @access Private
 */
// @ts-ignore
router.post('/:commentId/like', authenticateToken, CommentController.toggleLike);

export default router; 