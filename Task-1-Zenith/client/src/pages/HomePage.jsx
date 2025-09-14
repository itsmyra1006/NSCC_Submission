import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard.jsx';
import Spinner from '../components/Spinner.jsx';
import apiClient from '../apiClient.js';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await apiClient('/posts');
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }
    
    if (error) {
        return <div className="text-center text-red-400 p-8">Error: {error}</div>;
    }

    return (
        <div className="bg-[#2D283E] -m-8 p-8 min-h-screen">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">Latest Stories</h1>
                    <p className="text-lg text-[#D1D7E0]">Insights, tutorials, and thoughts from the community.</p>
                </div>

                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-[#4C495D] rounded-lg">
                        <h2 className="text-2xl font-semibold text-white mb-2">No posts yet.</h2>
                        <p className="text-[#D1D7E0]">Why don't you create the first one?</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;

