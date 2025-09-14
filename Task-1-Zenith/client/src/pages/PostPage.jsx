import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { navigate } from '../router/Router.jsx';
import Spinner from '../components/Spinner.jsx';
import apiClient from '../apiClient.js';

const PostPage = () => {
    const postId = window.location.pathname.split('/post/')[1];
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        if (!postId) {
            setError("No post ID found in URL.");
            setLoading(false);
            return;
        }

        const fetchPost = async () => {
            try {
                const data = await apiClient(`/post/${postId}`);
                setPost(data);
                setComments(data.comments);
                setLikeCount(data.likes.length);
                if (user) {
                    setIsLiked(data.likes.includes(user._id));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId, user]);

    const handleLike = async () => {
        if (!user) return navigate('/');
        
        setIsLiked(!isLiked);
        setLikeCount(likeCount + (!isLiked ? 1 : -1));

        try {
            await apiClient(`/post/${postId}/like`, { method: 'POST' });
        } catch (err) {
            setIsLiked(isLiked);
            setLikeCount(likeCount);
            console.error("Failed to like post:", err);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const newComment = await apiClient(`/post/${postId}/comments`, {
                method: 'POST',
                body: { text: commentText },
            });
            setComments(prevComments => [...prevComments, newComment]);
            setCommentText('');
        } catch (err) {
            console.error("Failed to add comment:", err);
        }
    };

    const handleDeletePost = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await apiClient(`/post/${postId}`, { method: 'DELETE' });
                navigate('/');
            } catch (err) {
                console.error("Failed to delete post:", err);
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await apiClient(`/post/${postId}/comments/${commentId}`, { method: 'DELETE' });
                setComments(prevComments => prevComments.filter(c => c._id !== commentId));
            } catch (err) {
                console.error("Failed to delete comment:", err);
            }
        }
    };

    const formatDateTime = (isoString) => new Date(isoString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;
    if (error) return <div className="text-center text-red-500 py-10 bg-[#2D283E] -m-8 min-h-screen">Error: {error}</div>;
    if (!post) return <div className="text-center text-gray-500 py-10 bg-[#2D283E] -m-8 min-h-screen">Post not found.</div>;

    return (
        <div className="bg-[#2D283E] -m-8 p-8 min-h-screen text-[#D1D7E0]">
            <div className="max-w-4xl mx-auto">
                <article>
                    <header className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
                        <div className="flex items-center text-sm">
                            <img className="h-10 w-10 rounded-full object-cover mr-4 border-2 border-[#564F6F]" src={post.author?.picture} alt={post.author?.name} />
                            <div>
                                <p className="font-semibold text-white">{post.author?.name}</p>
                                <p className="text-gray-400">{formatDateTime(post.createdAt)}</p>
                            </div>
                        </div>
                    </header>

                    <div className="prose prose-invert prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
                    
                    <div className="flex items-center justify-between border-t border-b border-[#4C495D] py-4 mb-8">
                        <button onClick={handleLike} className={`flex items-center space-x-2 text-sm font-semibold transition-colors duration-200 ${isLiked ? 'text-[#802BB1]' : 'text-gray-400 hover:text-white'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21.5l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                            </svg>
                            <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
                        </button>
                        {user?._id === post.author?._id && (
                             <div className="flex space-x-4">
                                <button onClick={() => navigate(`/edit-post/${post._id}`)} className="text-sm text-gray-400 hover:text-white transition-colors">Edit</button>
                                <button onClick={handleDeletePost} className="text-sm text-red-500 hover:text-red-400 transition-colors">Delete</button>
                            </div>
                        )}
                    </div>
                </article>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">{comments.length} Comments</h2>
                    <div className="space-y-6">
                        {comments.map(comment => (
                            <div key={comment._id} className="flex items-start space-x-4">
                                <img className="h-10 w-10 rounded-full object-cover" src={comment.author?.picture} alt={comment.author?.name} />
                                <div className="flex-1 bg-[#4C495D] rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-semibold text-white text-sm">{comment.author?.name}</p>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-xs text-gray-400">{formatDateTime(comment.createdAt)}</p>
                                            {user?._id === comment.author?._id && (
                                                <button onClick={() => handleDeleteComment(comment._id)} className="text-xs text-gray-500 hover:text-red-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {user && (
                        <form onSubmit={handleCommentSubmit} className="mt-8">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="w-full p-3 bg-[#4C495D] rounded-lg border border-[#564F6F] focus:ring-2 focus:ring-[#802BB1] focus:border-[#802BB1] transition"
                                placeholder="Add a comment..."
                                rows="3"
                            ></textarea>
                            <button type="submit" className="mt-2 px-4 py-2 bg-[#802BB1] text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">Post Comment</button>
                        </form>
                    )}
                </section>
            </div>
        </div>
    );
};

export default PostPage;