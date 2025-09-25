import Plus from './assets/icon-plus.svg';
import Minus from './assets/icon-minus.svg';
import Reply from './assets/icon-reply.svg';
import Delete from './assets/icon-delete.svg';
import Edit from './assets/icon-edit.svg';
import { useRef, useState } from 'react';
import { ReplyForm } from './ReplyForm';
import { DeleteModal } from './DeleteModal';
import { formatRelativeTime } from './utils/dateUtils';


export const CommentCard = ({ comment, replyCallback, editCallback, deleteCallback, updateScoreCallback }) => {
    
    const [replyVisible, setReplyVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const editRef = useRef(null);
    const { id, content, user, createdAt, score, replies } = comment;

    let storedUser = null;
    try {
        storedUser = JSON.parse(localStorage.getItem('currentUser'));
    } catch (e) {
        /* ignore */
    }
    const isCurrentUser = !!storedUser && user && user.username === storedUser.username;


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

    const handleUpdate = () => {
        if (typeof editCallback === 'function') {

            editCallback(id, editRef.current.value ?? '');
            setEditVisible(false);
        } else {
          console.warn('editCallback not provided');
        }
    };

    const handleDelete = () => {
        if (typeof deleteCallback === 'function') {
            deleteCallback(id);
        }
        setShowDeleteModal(false);
    };

    const handleScoreChange = (increment) => {
        if (typeof updateScoreCallback === 'function') {
            updateScoreCallback(id, increment);
        }
    };

    return (
        <div className='comment-card-container'>
            <div>
                <div className="comment-card">
                    <div className="comment-score-container">
                        <button className="score-increment" onClick={() => handleScoreChange(1)}>
                            <img src={Plus} alt="Increase score" />
                        </button>
                        <div className="comment-score">{ score}</div>
                        <button className="score-decrement" onClick={() => handleScoreChange(-1)}>
                            <img src={Minus} alt="Decrease score" />
                        </button>
                    </div>
                    <div className="comment-card-content">
                        <div className="comment-card-header">
                            <div className="comment-user">
                                <img src={user.image.png} alt={user.username} className="user-avatar" />
                               
                                <span className="user-name">{user.username}</span>
                                 {isCurrentUser && (
                                    <span className="current-user-badge">you</span>
                                )}
                                <span className="comment-date">{formatRelativeTime(createdAt)}</span>
                            </div>
                            
                            {!!isCurrentUser && (
                                <div className="comment-actions">
                                    <button className="delete-button" onClick={() => setShowDeleteModal(true)}>
                                        <img src={Delete} alt="Delete" className="action-icon" />
                                        Delete</button>
                                    <button className="edit-button" onClick={() => setEditVisible(v => !v)}>
                                        <img src={Edit} alt="Edit" className="action-icon" />
                                        Edit</button>
                                </div>
                            )}
                            {!isCurrentUser && (
                                <div className="comment-reply">
                                    <img src={Reply} alt="Reply" className="reply-icon" />
                                    <button className="reply-button" onClick={() => setReplyVisible(v => !v)}>Reply</button>
                                </div>
                            )}    
                        </div>
                        <div className="comment-card-body">
                            {!!editVisible && (
                                <div className='edit-form'>
                                    <textarea className="edit-textarea" defaultValue={content} ref={editRef}></textarea>
                                    <button className="save-edit-button" onClick={handleUpdate}>UPDATE</button>
                                </div>
                            )}
                            {!editVisible && <p>{content}</p>}
                        </div>
                    </div>
                </div>
                {replyVisible && (
                    <ReplyForm user={storedUser} callback={handleReply}>
                        Reply
                    </ReplyForm>
                )}
            </div>
            {replies && replies.length > 0 && (
                <div className="replies-container">
                    <div className='reply-separator'></div>
                    {replies.map((reply, index) => (
                        <div className='comment-card-reply' key={index}>
                            <CommentCard key={index} comment={reply} replyCallback={replyCallback} editCallback={ editCallback} deleteCallback={deleteCallback} updateScoreCallback={updateScoreCallback}/>
                        </div>
                    ))}
                </div>
            )}

            <DeleteModal
                isOpen={showDeleteModal}
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
            />
        </div>
    )
}