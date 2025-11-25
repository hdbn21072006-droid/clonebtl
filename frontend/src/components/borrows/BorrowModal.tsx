import React from 'react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BorrowModal: React.FC<BorrowModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo phiếu mượn mới">
      <div style={{ display: 'grid', gap: '1rem' }}>
        <Input placeholder="Mã bạn đọc" />
        <Input placeholder="Tên sách" />
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Hủy</Button>
          <Button>Tạo phiếu</Button>
        </div>
      </div>
    </Modal>
  );
};

export default BorrowModal;