import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <div className="modal-header">
                    <h3 className="modal-title">Confirm Deletion</h3>
                    <button
                        aria-label='Stat' className="close-button" onClick={onCancel}>&times;</button>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button
                        aria-label='Stat' className="btn cancel-btn" onClick={onCancel}>Cancel</button>
                    <button
                        aria-label='Stat' className="btn confirm-btn" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;