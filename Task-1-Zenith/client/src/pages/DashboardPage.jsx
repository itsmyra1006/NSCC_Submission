import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { navigate } from '../router/Router';
import Spinner from '../components/Spinner';
import apiClient from '../apiClient';

const DashboardPage = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('myPosts');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dashboardData = await apiClient('/dashboard');
                setData(dashboardData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const formatDate = (isoString) => new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;
    if (error) return <div className="text-center text-red-400 py-10">Error: {error}</div>;
    if (!user) return <div className="text-center text-gray-400 py-10">Please log in to view your dashboard.</div>;
    if (!data) return null;

    const tabClasses = (tabName) => 
        `px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2D283E] focus:ring-[#802BB1] ${
            activeTab === tabName 
                ? 'bg-[#802BB1] text-white' 
                : 'text-[#D1D7E0] hover:bg-[#4C495D]'
        }`;

    const renderContent = () => {
        switch (activeTab) {
            case 'myPosts':
                return data.userPosts?.length > 0 ? (
                    data.userPosts.map(post => (
                        <div key={post._id} onClick={() => navigate(`/post/${post._id}`)} className="bg-[#4C495D] p-4 rounded-lg cursor-pointer hover:bg-[#564F6F] transition-colors">
                            <p className="font-bold text-white">{post.title}</p>
                            <p className="text-xs text-gray-400">Created on {formatDate(post.createdAt)}</p>
                        </div>
                    ))
                ) : <p className="text-gray-400">You haven't created any posts yet.</p>;
            case 'likedPosts':
                return data.likedPosts?.length > 0 ? (
                    data.likedPosts.map(post => (
                        <div key={post._id} onClick={() => navigate(`/post/${post._id}`)} className="bg-[#4C495D] p-4 rounded-lg cursor-pointer hover:bg-[#564F6F] transition-colors">
                            <p className="font-bold text-white">{post.title}</p>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                                <img src={post.author.picture} className="h-5 w-5 rounded-full mr-2" alt={post.author.name} />
                                <span>by {post.author.name}</span>
                            </div>
                        </div>
                    ))
                ) : <p className="text-gray-400">You haven't liked any posts yet.</p>;
            case 'myComments':
                return data.userComments?.length > 0 ? (
                     data.userComments.map(comment => (
                        <div key={comment._id} onClick={() => navigate(`/post/${comment.post._id}`)} className="bg-[#4C495D] p-4 rounded-lg cursor-pointer hover:bg-[#564F6F] transition-colors">
                            <p className="text-white italic">"{comment.text}"</p>
                            <p className="text-xs text-gray-400 mt-2">Commented on <span className="font-semibold text-gray-300">{comment.post.title}</span></p>
                        </div>
                    ))
                ) : <p className="text-gray-400">You haven't made any comments yet.</p>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-[#2D283E] -m-8 p-8 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-8">
                    <img src={user.picture} className="h-20 w-20 rounded-full mr-6 border-4 border-[#4C495D]" alt={user.name} />
                    <div>
                        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                        <p className="text-md text-gray-400">{user.email}</p>
                    </div>
                </div>
                <div className="bg-[#2D283E]">
                    <div className="border-b border-[#4C495D] mb-6">
                        <nav className="flex space-x-4" aria-label="Tabs">
                            <button onClick={() => setActiveTab('myPosts')} className={tabClasses('myPosts')}>My Posts</button>
                            <button onClick={() => setActiveTab('likedPosts')} className={tabClasses('likedPosts')}>Liked Posts</button>
                            <button onClick={() => setActiveTab('myComments')} className={tabClasses('myComments')}>My Comments</button>
                        </nav>
                    </div>
                    <div className="space-y-4">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DashboardPage;