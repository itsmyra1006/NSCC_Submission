import React from 'react';
import { navigate } from '../router/Router';

const NotFoundPage = () => {
  return (
    <div className="bg-[#2D283E] -m-8 p-8 min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-9xl font-black text-[#4C495D] select-none">404</h1>
        <h2 className="text-3xl font-bold text-white mt-4">Uh-oh! Page Not Found.</h2>
        <p className="text-[#D1D7E0] mt-2 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#802BB1] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;