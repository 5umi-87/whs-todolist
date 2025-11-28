import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/authStore';
import { axiosInstance } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';

// Define Zod schemas for validation
const profileSchema = z.object({
  username: z.string().min(2, '사용자 이름은 최소 2자 이상이어야 합니다').max(100, '사용자 이름은 100자를 초과할 수 없습니다')
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
  newPassword: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  newPasswordConfirm: z.string().min(1, '새 비밀번호를 다시 입력해주세요')
}).refine(data => data.newPassword === data.newPasswordConfirm, {
  message: '새 비밀번호가 일치하지 않습니다',
  path: ['newPasswordConfirm']
});

const ProfilePage = () => {
  const { user, isLoading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState({ email: '', username: '', createdAt: '' });

  // Initialize form for profile update
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
    reset: resetProfile,
    setValue: setProfileValue
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: ''
    }
  });

  // Initialize form for password change
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    reset: resetPassword,
    setError: setPasswordError
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: ''
    }
  });

  // Load user data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/users/me');
        const { data } = response.data;
        setUserData({
          email: data.email,
          username: data.username,
          createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString('ko-KR') : ''
        });
        // Set the username in the form
        setProfileValue('username', data.username);
      } catch (error) {
        setError(error.response?.data?.error?.message || '사용자 정보를 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user, setProfileValue]);

  // Handle profile update
  const onSubmitProfile = async (data) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await axiosInstance.patch('/users/me', {
        username: data.username
      });

      const { data: updatedUser } = response.data;
      setUserData(prev => ({
        ...prev,
        username: updatedUser.username
      }));

      setSuccess('사용자 정보가 성공적으로 수정되었습니다');
    } catch (error) {
      setError(error.response?.data?.error?.message || '사용자 정보 수정에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const onSubmitPassword = async (data) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await axiosInstance.patch('/users/me', {
        password: data.newPassword
      });

      setSuccess('비밀번호가 성공적으로 변경되었습니다');
      resetPassword();
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || '비밀번호 변경에 실패했습니다';
      setError(errorMessage);

      // Set specific field errors if provided by backend
      if (error.response?.data?.error?.code === 'INVALID_PASSWORD') {
        setPasswordError('currentPassword', { message: '현재 비밀번호가 올바르지 않습니다' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">프로필</h1>

      {/* Success and Error Messages */}
      {success && (
        <Alert type="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* User info section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">사용자 정보</h2>

        <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">이메일</label>
            <div className="mt-1 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded">
              {userData.email} (변경 불가)
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              사용자 이름
            </label>
            <input
              id="username"
              type="text"
              {...registerProfile('username')}
              className={`mt-1 block w-full border ${
                profileErrors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-primary-main focus:border-primary-main`}
              disabled={isSubmittingProfile}
            />
            {profileErrors.username && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{profileErrors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">가입일</label>
            <div className="mt-1 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded">
              {userData.createdAt}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmittingProfile}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-main hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main disabled:opacity-50"
            >
              {isSubmittingProfile ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  저장 중...
                </>
              ) : (
                '사용자 정보 저장'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Password change section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">비밀번호 변경</h2>

        <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              현재 비밀번호
            </label>
            <input
              id="currentPassword"
              type="password"
              {...registerPassword('currentPassword')}
              className={`mt-1 block w-full border ${
                passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-primary-main focus:border-primary-main`}
              disabled={isSubmittingPassword}
              placeholder="현재 비밀번호 입력"
            />
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{passwordErrors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              새 비밀번호
            </label>
            <input
              id="newPassword"
              type="password"
              {...registerPassword('newPassword')}
              className={`mt-1 block w-full border ${
                passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-primary-main focus:border-primary-main`}
              disabled={isSubmittingPassword}
              placeholder="새 비밀번호 입력 (최소 8자)"
            />
            {passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{passwordErrors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="newPasswordConfirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              새 비밀번호 확인
            </label>
            <input
              id="newPasswordConfirm"
              type="password"
              {...registerPassword('newPasswordConfirm')}
              className={`mt-1 block w-full border ${
                passwordErrors.newPasswordConfirm ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-primary-main focus:border-primary-main`}
              disabled={isSubmittingPassword}
              placeholder="새 비밀번호 다시 입력"
            />
            {passwordErrors.newPasswordConfirm && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{passwordErrors.newPasswordConfirm.message}</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmittingPassword}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-main hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main disabled:opacity-50"
            >
              {isSubmittingPassword ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  변경 중...
                </>
              ) : (
                '비밀번호 변경'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;