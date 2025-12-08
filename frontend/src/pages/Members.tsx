// src/pages/Members.tsx
import React, { useEffect, useState } from 'react';
// SỬA: Import apiThuVien object thay vì import lẻ tẻ
import { apiThuVien } from '../api/apiThuVien'; 
import './DashboardPage.css'; 

// Định nghĩa kiểu dữ liệu cho TypeScript
interface Member {
    member_id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    join_date: string;
}

const Members: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    
    // State cho form thêm mới
    const [newMember, setNewMember] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    // Hàm load dữ liệu từ API
    const fetchMembers = async () => {
        try {
            // SỬA: Gọi qua apiThuVien.getMembers()
            const data = await apiThuVien.getMembers();
            setMembers(data);
        } catch (error) {
            console.error("Lỗi tải danh sách:", error);
            alert("Không tải được danh sách thành viên!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    // Xử lý khi bấm nút Thêm
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // SỬA: Gọi qua apiThuVien.addMember()
            await apiThuVien.addMember(newMember);
            alert("Thêm thành công!");
            setNewMember({ name: '', email: '', phone: '', address: '' }); // Reset form
            fetchMembers(); // Load lại bảng
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi thêm!");
        }
    };

    // Xử lý khi bấm nút Xóa
    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn chắc chắn muốn xóa thành viên này?")) {
            try {
                // SỬA: Gọi qua apiThuVien.deleteMember()
                await apiThuVien.deleteMember(id);
                fetchMembers(); // Load lại bảng sau khi xóa
            } catch (error) {
                alert("Lỗi khi xóa!");
            }
        }
    };

    return (
        <div className="members-container" style={{ padding: '20px', color: '#fff' }}>
            <h2>Quản lý Thành viên</h2>

            {/* Form Thêm nhanh */}
            <div className="add-member-form" style={{ marginBottom: '30px', background: '#333', padding: '15px', borderRadius: '8px' }}>
                <h3>Thêm Độc giả mới</h3>
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input 
                        placeholder="Họ tên" 
                        value={newMember.name} 
                        onChange={e => setNewMember({...newMember, name: e.target.value})} 
                        required 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input 
                        placeholder="Email" 
                        type="email"
                        value={newMember.email} 
                        onChange={e => setNewMember({...newMember, email: e.target.value})} 
                        required 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input 
                        placeholder="SĐT" 
                        value={newMember.phone} 
                        onChange={e => setNewMember({...newMember, phone: e.target.value})} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <input 
                        placeholder="Địa chỉ" 
                        value={newMember.address} 
                        onChange={e => setNewMember({...newMember, address: e.target.value})} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px' }}>
                        + Thêm
                    </button>
                </form>
            </div>

            {/* Bảng danh sách */}
            {loading ? <p>Đang tải...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ background: '#444', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>ID</th>
                            <th style={{ padding: '10px' }}>Họ Tên</th>
                            <th style={{ padding: '10px' }}>Email</th>
                            <th style={{ padding: '10px' }}>Ngày tham gia</th>
                            <th style={{ padding: '10px' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((mem) => (
                            <tr key={mem.member_id} style={{ borderBottom: '1px solid #555' }}>
                                <td style={{ padding: '10px' }}>{mem.member_id}</td>
                                <td style={{ padding: '10px' }}>{mem.name}</td>
                                <td style={{ padding: '10px' }}>{mem.email}</td>
                                <td style={{ padding: '10px' }}>
                                    {new Date(mem.join_date).toLocaleDateString('vi-VN')}
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <button 
                                        onClick={() => handleDelete(mem.member_id)}
                                        style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Members;