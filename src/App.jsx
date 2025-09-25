import { useEffect, useState } from 'react';
import { CommentCard } from './CommentCard';
import { ReplyForm } from './ReplyForm';

import './App.css'
import data from './data.json';

function readJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`Failed to parse localStorage ${key}:`, err);
    return fallback;
  }
}

function App() {  
   const [comments, setComments] = useState(() => readJSON('comments', data.comments));
  const [currentUser, setCurrentUser] = useState(() => readJSON('currentUser', data.currentUser));

  useEffect(() => {
    const storedComments = readJSON('comments', null);
    if (storedComments) {
      setComments(storedComments);
    } else {
      setComments(data.comments);
      localStorage.setItem('comments', JSON.stringify(data.comments));
    }

    const storedUser = readJSON('currentUser', null);
    if (storedUser) {
      setCurrentUser(storedUser);
    } else {
      setCurrentUser(data.currentUser);
      localStorage.setItem('currentUser', JSON.stringify(data.currentUser));
    }
  }, []); 

  // Persist comments whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('comments', JSON.stringify(comments));
    } catch (err) {
      console.error('Failed to save comments to localStorage:', err);
    }
  }, [comments]);

  // Persist currentUser whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } catch (err) {
      console.error('Failed to save currentUser to localStorage:', err);
    }
  }, [currentUser]);

  const addReply = (commentId, replyContent) => {
    console.log("Adding reply to comment ID:", commentId);
    const newReply = {
      id: Date.now(), // Simple unique ID based on timestamp
      content: replyContent,
      createdAt: "now",
      score: 0,
      user: currentUser,
      replies: []
    };

    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, replies: [...comment.replies, newReply] };
        }
        return comment;
      });
    });
  }

  const replyCallback = (commentId) => {
    return (replyContent) => {
      addReply(commentId, replyContent);
    };
  }

  const addComment = (content) => {
    const newComment = {
      id: Date.now(), // Simple unique ID based on timestamp
      content,
      createdAt: new Date().toISOString(),
      score: 0,
      user: currentUser,
      replies: []
    };

    setComments(prevComments => [...prevComments, newComment]);
  }

  if (!comments || comments.length === 0) {
    return <div className='container'>No comments available</div>;
  }

  if (!currentUser || Object.keys(currentUser).length === 0) {
    return <div className='container'>No current user available</div>;
  }


  return (
    <div className='container'>
      {comments.map((comment, index) => (
        <CommentCard key={index} comment={comment} replyCallback={replyCallback } />
      ))}
      {currentUser && Object.keys(currentUser).length > 0 && (
        <ReplyForm user={currentUser} callback={addComment}>
          Send
        </ReplyForm>
      )}
    </div>
  )
}

export default App
