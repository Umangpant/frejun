import React, { useState, useEffect } from 'react';
import './App.css';
import CommentTable from './components/CommentTable';
import Navbar from './components/Navbar';

export default function App() {
  const [comments, setComments] = useState([]);
  const [postsById, setPostsById] = useState({});
  const [filterText, setFilterText] = useState('');

  // Fetch comments and posts, merge saved edits from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('editedComments') || '{}');

    async function fetchData() {
      try {
        const [commentsRes, postsRes] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/comments'),
          fetch('https://jsonplaceholder.typicode.com/posts')
        ]);

        const commentsData = await commentsRes.json();
        const postsData = await postsRes.json();

        const mergedComments = commentsData.map(c => ({ ...c, ...(saved[c.id] || {}) }));
        const postMap = Object.fromEntries(postsData.map(p => [p.id, p.title]));

        setComments(mergedComments);
        setPostsById(postMap);
      } catch (error) {
        console.error("Data fetch failed:", error);
      }
    }

    fetchData();
  }, []);

  // Handle inline edits and save them to localStorage
  const handleEdit = (id, field, value) => {
    setComments(prev =>
      prev.map(c => c.id === id ? { ...c, [field]: value } : c)
    );

    const saved = JSON.parse(localStorage.getItem('editedComments') || '{}');
    const existing = saved[id] || {};
    existing[field] = value;
    saved[id] = existing;
    localStorage.setItem('editedComments', JSON.stringify(saved));
  };

  return (
    <div className="app">
      <Navbar filterText={filterText} onFilterChange={setFilterText} />
      <CommentTable
        comments={comments}
        postsById={postsById}
        filterText={filterText}
        onEdit={handleEdit}
      />
    </div>
  );
}
