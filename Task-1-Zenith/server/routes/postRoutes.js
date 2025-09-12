import express from 'express';
import {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
    deleteComment,
    getDashboardData
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- REORDERED ROUTES ---

// Specific routes must come BEFORE general/parameterized routes

// @desc    Get all posts
// @route   GET /api/posts
router.get('/posts', getPosts);

// @desc    Get dashboard data for logged in user
// @route   GET /api/dashboard
router.get('/dashboard', protect, getDashboardData);

// @desc    Get a single post by ID
// @route   GET /api/post/:postId
// NOTE: Changed the path slightly to avoid conflict
router.get('/post/:postId', getPostById);

// @desc    Create a new post
// @route   POST /api/posts
router.post('/posts', protect, createPost);

// @desc    Update a post
// @route   PUT /api/post/:postId
router.put('/post/:postId', protect, updatePost);

// @desc    Delete a post
// @route   DELETE /api/post/:postId
router.delete('/post/:postId', protect, deletePost);

// @desc    Like/Unlike a post
// @route   POST /api/post/:postId/like
router.post('/post/:postId/like', protect, likePost);

// @desc    Add a comment to a post
// @route   POST /api/post/:postId/comments
router.post('/post/:postId/comments', protect, addComment);

// @desc    Delete a comment
// @route   DELETE /api/post/:postId/comments/:commentId
router.delete('/post/:postId/comments/:commentId', protect, deleteComment);


export default router;

