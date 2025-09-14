import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { navigate } from '../router/Router';
import Spinner from '../components/Spinner';
import apiClient from '../apiClient';

const PostFormPage = () => {
    const pathParts = window.location.pathname.split('/edit-post/');
    const postId = pathParts.length > 1 ? pathParts[1] : null;
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const isEditing = !!postId;

    useEffect(() => {
        if (isEditing && user) {
            setLoading(true);
            const fetchPost = async () => {
                try {
                    const data = await apiClient(`/post/${postId}`);
                    if (data.author._id !== user._id) {
                         setError("You are not authorized to edit this post.");
                         return;
                    }
                    setTitle(data.title);
                    setContent(data.content);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchPost();
        }
    }, [postId, isEditing, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!title.trim() || !content.trim()) {
            setError('Title and content cannot be empty.');
            return;
        }
        setLoading(true);
        const url = isEditing ? `/post/${postId}` : '/posts';
        const method = isEditing ? 'PUT' : 'POST';
        try {
            const post = await apiClient(url, {
                method,
                body: { title, content },
            });
            navigate(`/post/${post._id}`);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    
    if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;

    return (
        <div className="bg-[#2D283E] -m-8 p-8 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-[#4C495D] p-8 rounded-lg shadow-2xl">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 border-b border-[#564F6F] pb-4">
                        {isEditing ? 'Edit Your Story' : 'Create a New Story'}
                    </h1>
                    {error && <p className="bg-red-500/20 text-red-300 text-sm p-3 rounded-md mb-6">{error}</p>}
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-[#D1D7E0] mb-2">Title</label>
                        <input
                            type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 bg-[#2D283E] text-white rounded-md border border-[#564F6F] focus:ring-2 focus:ring-[#802BB1] focus:border-[#802BB1] transition"
                            placeholder="A catchy title for your post"
                        />
                    </div>
                    <div className="mb-8">
                        <label htmlFor="content" className="block text-sm font-medium text-[#D1D7E0] mb-2">Content</label>
                        <textarea
                            id="content" value={content} onChange={(e) => setContent(e.target.value)}
                            className="w-full p-3 bg-[#2D283E] text-white rounded-md border border-[#564F6F] focus:ring-2 focus:ring-[#802BB1] focus:border-[#802BB1] transition"
                            rows="12" placeholder="Write your story here..."
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit" disabled={loading}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#802BB1] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Publish Post')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default PostFormPage;