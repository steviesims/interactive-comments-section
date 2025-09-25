import Plus from './assets/icon-plus.svg';
import Minus from './assets/icon-minus.svg';
import Reply from './assets/icon-reply.svg';
import { useState } from 'react';
import { ReplyForm } from './ReplyForm';


export const CommentCard = ({ comment, replyCallback}) => {
    const [replyVisible, setReplyVisible] = useState(false);
    const { id, content, user, createdAt, score, replies } = comment;

    const handleReply = (...args) => {
    if (typeof replyCallback === 'function') {
        try {

        replyCallback(id)(...args);
        
        } catch (err) {
        console.error('replyCallback failed:', err);
        // keep the form open so user can retry
        return;
        }
    }
    // only close when callback succeeded
    setReplyVisible(false);
    };

    return (
        <div className='comment-card-container'>
            <div>
                <div className="comment-card">
                    <div className="comment-score-container">
                        <button className="score-increment">
                            <img src={Plus} alt="Increase score" />
                        </button>
                        <div className="comment-score">{ score}</div>
                        <button className="score-decrement">
                            <img src={Minus} alt="Decrease score" />
                        </button>
                    </div>
                    <div className="comment-card-content">
                        <div className="comment-card-header">
                            <div className="comment-user">
                                <img src={user.image.png} alt={user.username} className="user-avatar" />
                                <span className="user-name">{user.username}</span>
                                <span className="comment-date">{createdAt}</span>
                            </div>
                            
                            <div className="comment-reply">
                                <img src={Reply} alt="Reply" className="reply-icon" />
                                <button className="reply-button" onClick={() => setReplyVisible(v => !v)}>Reply</button>
                            </div>
                        </div>
                        <div className="comment-card-body">
                            <p>{content}</p>
                        </div>
                    </div>
                </div>
                {replyVisible && (
                    <ReplyForm user={user} callback={handleReply}>
                        Reply
                    </ReplyForm>
                )}
            </div>
            {replies && replies.length > 0 && (
                <div className="replies-container">
                    <div className='reply-separator'></div>
                    {replies.map((reply, index) => (
                        <div className='comment-card-reply' key={index}>
                            <CommentCard key={index} comment={reply} />
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}