
import React, { useState } from 'react';
import Button from '@/components/common/Button';
import Table from '@/components/common/Table';
import BorrowModal from '@/components/borrows/BorrowModal';
import { Plus } from 'lucide-react';

const BorrowsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // PHẢI DÙNG ĐÚNG CẤU TRÚC MỚI CỦA TABLE (mảng object, không phải mảng string)
  const columns = [
    { key: 'id', header: 'Mã phiếu' },
    { key: 'reader', header: 'Bạn đọc' },
    { key: 'book', header: 'Tên sách' },
    { key: 'borrowDate', header: 'Ngày mượn' },
    { key: 'dueDate', header: 'Hạn trả' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (value: string) => (
        <span className={value === 'Quá hạn' ? 'status-overdue' : 'status-ongoing'}>
          {value}
        </span>
      ),
    },
  ];

  const data = [
    {
      id: 'PM001',
      reader: 'Nguyễn Văn An',
      book: 'ReactJS Nâng Cao',
      borrowDate: '20/11/2025',
      dueDate: '04/12/2025',
      status: 'Đang mượn',
    },
    {
      id: 'PM002',
      reader: 'Trần Thị Bình',
      book: 'Node.js Toàn tập',
      borrowDate: '15/11/2025',
      dueDate: '29/11/2025',
      status: 'Quá hạn',
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Danh sách phiếu mượn</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={20} /> Tạo phiếu mới
        </Button>
      </div>

      {/* Dùng đúng kiểu mới */}
      <Table columns={columns} data={data} />

      <BorrowModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default BorrowsPage;