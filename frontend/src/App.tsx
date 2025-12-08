// src/App.tsx
import React from 'react';
import AppRoutes from '@/routes/AppRoutes';
import './index.css';

function App() {
  return (
    // Chỉ gọi AppRoutes, tuyệt đối KHÔNG bọc BrowserRouter ở đây
    <AppRoutes />
  );
}

export default App;