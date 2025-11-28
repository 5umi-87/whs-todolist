import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/authStore';

// Define validation schema using zod
const registerSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  username: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
})
// Add custom validation to ensure passwords match
.refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [submitError, setSubmitError] = useState('');

  // Initialize react-hook-form with zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data) => {
    setSubmitError('');

    const result = await registerUser(data.email, data.password, data.username);
    if (result.success) {
      navigate('/login');
    } else {
      setSubmitError(result.error);
      setError('root', { message: result.error });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            WHS-TodoList
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            회원가입
          </p>
        </div>

        {(submitError || errors.root) && (
          <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
            <div className="text-sm text-red-700 dark:text-red-200">
              {submitError || errors.root?.message}
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email
                    ? 'border-red-300'
                    : 'border-gray-300 dark:border-gray-600'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary-main focus:border-primary-main focus:z-10 sm:text-sm bg-white dark:bg-gray-800 ${
                  errors.email ? 'focus:ring-red-500 focus:border-red-500' : ''
                }`}
                placeholder="이메일을 입력하세요"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="username" className="sr-only">
                이름
              </label>
              <input
                id="username"
                name="username"
                type="text"
                {...register('username')}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.username
                    ? 'border-red-300'
                    : 'border-gray-300 dark:border-gray-600'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-main focus:border-primary-main focus:z-10 sm:text-sm bg-white dark:bg-gray-800 ${
                  errors.username ? 'focus:ring-red-500 focus:border-red-500' : ''
                }`}
                placeholder="이름을 입력하세요"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                {...register('password')}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password
                    ? 'border-red-300'
                    : 'border-gray-300 dark:border-gray-600'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-main focus:border-primary-main focus:z-10 sm:text-sm bg-white dark:bg-gray-800 ${
                  errors.password ? 'focus:ring-red-500 focus:border-red-500' : ''
                }`}
                placeholder="비밀번호를 입력하세요 (8자 이상)"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.confirmPassword
                    ? 'border-red-300'
                    : 'border-gray-300 dark:border-gray-600'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary-main focus:border-primary-main focus:z-10 sm:text-sm bg-white dark:bg-gray-800 ${
                  errors.confirmPassword ? 'focus:ring-red-500 focus:border-red-500' : ''
                }`}
                placeholder="비밀번호를 다시 입력하세요"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-main hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main disabled:opacity-50"
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-medium text-primary-main hover:text-primary-dark">
              로그인
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
