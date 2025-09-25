import { useRef } from "react";

export const ReplyForm = ({ user, children, callback }) => {
    const ref = useRef(null);

    return (
        <div className="reply-form">
            <img src={user.image.png} alt={user.username} className="reply-avatar" />
            <textarea placeholder="Add a comment..." ref={ref} className="reply-textarea"></textarea>
            <button className="submit-reply-button" onClick={() => {
                callback(ref.current.value)
                ref.current.value = '';
            }}>{children}</button>
        </div>
    )
}