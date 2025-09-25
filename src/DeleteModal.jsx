export const DeleteModal = ({ isOpen, onCancel, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">Delete comment</h2>
                <p className="modal-message">
                    Are you sure you want to delete this comment? This will remove the comment and can't be undone.
                </p>
                <div className="modal-buttons">
                    <button className="modal-cancel-btn" onClick={onCancel}>
                        NO, CANCEL
                    </button>
                    <button className="modal-confirm-btn" onClick={onConfirm}>
                        YES, DELETE
                    </button>
                </div>
            </div>
        </div>
    );
};