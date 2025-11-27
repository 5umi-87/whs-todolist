import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import PrivateRoute from './components/routes/PrivateRoute';
import PublicRoute from './components/routes/PublicRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TodoListPage from './pages/TodoListPage';
import TrashPage from './pages/TrashPage';
import HolidaysPage from './pages/HolidaysPage';
import ProfilePage from './pages/ProfilePage';
import AdminHolidaysPage from './pages/AdminHolidaysPage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />

      {/* Private routes */}
      <Route path="/" element={
        <PrivateRoute>
          <MainLayout>
            <TodoListPage />
          </MainLayout>
        </PrivateRoute>
      } />
      <Route path="/trash" element={
        <PrivateRoute>
          <MainLayout>
            <TrashPage />
          </MainLayout>
        </PrivateRoute>
      } />
      <Route path="/holidays" element={
        <PrivateRoute>
          <MainLayout>
            <HolidaysPage />
          </MainLayout>
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <MainLayout>
            <ProfilePage />
          </MainLayout>
        </PrivateRoute>
      } />
      <Route path="/admin/holidays" element={
        <PrivateRoute>
          <MainLayout>
            <AdminHolidaysPage />
          </MainLayout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;