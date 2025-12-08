// src/components/borrows/BorrowModal.tsx
import React, { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import './BorrowModal.css';

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BorrowModal: React.FC<BorrowModalProps> = ({ isOpen, onClose }) => {
  const [readerId, setReaderId] = useState('');
  const [readerName, setReaderName] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [borrowDate, setBorrowDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (borrowDate) {
      const selected = new Date(borrowDate);
      const due = new Date(selected);
      due.setDate(due.getDate() + 21);
      setDueDate(due.toISOString().split('T')[0]);
    } else {
      setDueDate('');
    }
  }, [borrowDate]);

  useEffect(() => {
    if (isOpen && !borrowDate) {
      const today = new Date().toISOString().split('T')[0];
      setBorrowDate(today);
    }
  }, [isOpen, borrowDate]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo phiếu mượn mới">
      <div className="borrow-modal-form">
        <div className="form-group">
          <label>Mã bạn đọc</label>
          <Input
            placeholder="VD: B2012345"
            value={readerId}
            onChange={(e) => setReaderId(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Họ và tên</label>
          <Input
            placeholder="Tự động tìm khi nhập mã"
            value={readerName}
            onChange={(e) => setReaderName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Tên sách / Mã sách</label>
          <Input
            placeholder="Nhập tên hoặc mã sách"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />
        </div>

        <div className="date-row">
          <div className="form-group">
            <label>Ngày mượn</label>
            <div className="date-input-wrapper">
              <input
                type="date"
                className="date-input"
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Hạn trả (tự động +14 ngày)</label>
            <div className="date-input-wrapper due">
              <input
                type="date"
                className="date-input"
                value={dueDate}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button className="submit-btn">
            Xác nhận mượn sách
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BorrowModal;