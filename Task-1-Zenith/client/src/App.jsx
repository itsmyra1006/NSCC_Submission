import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Router } from './router/Router';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import PostFormPage from './pages/PostFormPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Router>
            <HomePage path="/" />
            <PostPage path="/post/:postId" />
            <PostFormPage path="/create-post" />
            <PostFormPage path="/edit-post/:postId" />
            <DashboardPage path="/dashboard" />
            <NotFoundPage default />
          </Router>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;

