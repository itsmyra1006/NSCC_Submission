import React from 'react';
import { navigate } from '../router/Router';

const PostCard = ({ post }) => {
    // Function to format date and time
    const formatDateTime = (isoString) => {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    // Function to create a short snippet of the content
    const createSnippet = (content) => {
        if (!content) return '';
        const words = content.split(' ');
        if (words.length > 20) {
            return words.slice(0, 20).join(' ') + '...';
        }
        return content;
    };

    return (
        <div 
            className="bg-[#4C495D] rounded-lg shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer flex flex-col"
            onClick={() => navigate(`/post/${post._id}`)}
        >
            <div className="p-6 flex-grow">
                <div className="flex items-center mb-4">
                    <img className="h-10 w-10 rounded-full object-cover mr-4 border-2 border-[#564F6F]" src={post.author?.picture || 'https://placehold.co/40x40/E2E8F0/4A5568?text=Z'} alt={`${post.author?.name}'s avatar`} />
                    <div>
                        <p className="text-sm font-semibold text-white">{post.author?.name || 'Anonymous'}</p>
                        <p className="text-xs text-[#D1D7E0]">{formatDateTime(post.createdAt)}</p>
                    </div>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-3 leading-tight">{post.title}</h2>
                
                <p className="text-[#D1D7E0] text-sm flex-grow">
                    {createSnippet(post.content)}
                </p>
            </div>
            <div className="px-6 py-4 bg-[#564F6F]/50">
                <div className="flex items-center text-xs text-[#D1D7E0]">
                    <div className="flex items-center mr-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#802BB1]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span>{post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}</span>
                    </div>
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#802BB1]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.839 8.839 0 01-4.083-.98L2 17l1.438-4.083A7.002 7.002 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.438 11.917L4 13.299l1.383.437a5 5 0 008.342-3.654c0-2.206-2.239-4-5-4s-5 1.794-5 4c0 .54.116 1.053.328 1.528A4.99 4.99 0 004.438 11.917z" clipRule="evenodd" />
                        </svg>
                        <span>{post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;

