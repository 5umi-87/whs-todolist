import React from 'react';

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">프로필</h1>

      {/* User info section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">사용자 정보</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">이메일</label>
            <div className="mt-1 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded">
              user@example.com (변경 불가)
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">사용자 이름</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-primary-main focus:border-primary-main"
              defaultValue="홍길동"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">가입일</label>
            <div className="mt-1 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded">
              2025-11-01
            </div>
          </div>
          
          <div className="pt-4">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-main hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main">
              사용자 정보 저장
            </button>
          </div>
        </div>
      </div>

      {/* Password change section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">비밀번호 변경</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">현재 비밀번호</label>
            <input
              type="password"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-primary-main focus:border-primary-main"
              placeholder="현재 비밀번호 입력"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">새 비밀번호</label>
            <input
              type="password"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-primary-main focus:border-primary-main"
              placeholder="새 비밀번호 입력 (최소 8자)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">새 비밀번호 확인</label>
            <input
              type="password"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-primary-main focus:border-primary-main"
              placeholder="새 비밀번호 다시 입력"
            />
          </div>
          
          <div className="pt-4">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-main hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main">
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;