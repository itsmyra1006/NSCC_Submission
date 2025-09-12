import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Get all posts
// @route   GET /api/posts
const getPosts = async (req, res) => {
    try {
        await db.read();
        // Join author details and comment count with each post
        const postsWithDetails = db.data.posts.map(post => {
            const author = db.data.users.find(u => u._id === post.author);
            // *** BUG FIX: Calculate comment count for each post ***
            const comments = db.data.comments.filter(c => c.post === post._id);
            return {
                ...post,
                author: author ? { _id: author._id, name: author.name, picture: author.picture } : null,
                commentCount: comments.length // Add comment count directly
            };
        });
        res.json(postsWithDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get a single post by ID
// @route   GET /api/post/:postId
const getPostById = async (req, res) => {
    try {
        await db.read();
        const post = db.data.posts.find(p => p._id === req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const author = db.data.users.find(u => u._id === post.author);
        const commentsWithAuthors = db.data.comments
            .filter(c => c.post === post._id)
            .map(comment => {
                const commentAuthor = db.data.users.find(u => u._id === comment.author);
                return {
                    ...comment,
                    author: commentAuthor ? { _id: commentAuthor._id, name: commentAuthor.name, picture: commentAuthor.picture } : null
                };
            })
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        res.json({
            ...post,
            author: author ? { _id: author._id, name: author.name, picture: author.picture } : null,
            comments: commentsWithAuthors
        });
    } catch (error) {
        console.error('Error getting post by ID:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ... rest of the file remains the same ...

const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Please provide title and content' });
        }
        const newPost = {
            _id: uuidv4(),
            title,
            content,
            author: req.user._id,
            likes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db.data.posts.push(newPost);
        await db.write();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        await db.read();
        const postIndex = db.data.posts.findIndex(p => p._id === req.params.postId);

        if (postIndex === -1) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        if (db.data.posts[postIndex].author !== req.user._id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        db.data.posts[postIndex] = { ...db.data.posts[postIndex], title, content, updatedAt: new Date().toISOString() };
        await db.write();
        res.json(db.data.posts[postIndex]);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deletePost = async (req, res) => {
    try {
        await db.read();
        const postIndex = db.data.posts.findIndex(p => p._id === req.params.postId);
        if (postIndex === -1) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (db.data.posts[postIndex].author !== req.user._id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        db.data.posts.splice(postIndex, 1);
        db.data.comments = db.data.comments.filter(c => c.post !== req.params.postId);
        
        await db.write();
        res.json({ message: 'Post removed' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const likePost = async (req, res) => {
    try {
        await db.read();
        const post = db.data.posts.find(p => p._id === req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userId = req.user._id;
        const index = post.likes.indexOf(userId);

        if (index > -1) {
            post.likes.splice(index, 1);
        } else {
            post.likes.push(userId);
        }
        await db.write();
        res.json(post);
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: 'Comment text cannot be empty' });
        }
        await db.read();
        const post = db.data.posts.find(p => p._id === req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        const newComment = {
            _id: uuidv4(),
            text,
            author: req.user._id,
            post: req.params.postId,
            createdAt: new Date().toISOString()
        };
        db.data.comments.push(newComment);
        await db.write();
        
        const author = db.data.users.find(u => u._id === newComment.author);
        res.status(201).json({
          ...newComment,
          author: author ? { _id: author._id, name: author.name, picture: author.picture } : null
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteComment = async (req, res) => {
    try {
        await db.read();
        const commentIndex = db.data.comments.findIndex(c => c._id === req.params.commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (db.data.comments[commentIndex].author !== req.user._id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        db.data.comments.splice(commentIndex, 1);
        await db.write();
        res.json({ message: 'Comment removed' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getDashboardData = async (req, res) => {
    try {
        await db.read();
        const userId = req.user._id;

        const userPosts = db.data.posts.filter(p => p.author === userId)
            .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const likedPosts = db.data.posts
            .filter(p => p.likes.includes(userId))
            .map(post => {
                const author = db.data.users.find(u => u._id === post.author);
                return { ...post, author: author ? { _id: author._id, name: author.name, picture: author.picture } : null };
            })
            .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

        const userComments = db.data.comments
            .filter(c => c.author === userId)
            .map(comment => {
                const post = db.data.posts.find(p => p._id === comment.post);
                return { ...comment, post: post ? { title: post.title, _id: post._id } : null };
            })
            .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({ userPosts, likedPosts, userComments });
    } catch (error) {
        console.error('Error getting dashboard data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
    deleteComment,
    getDashboardData,
};

