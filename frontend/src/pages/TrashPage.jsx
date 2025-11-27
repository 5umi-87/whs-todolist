import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { useTodoStore } from '../stores/todoStore';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const TrashPage = () => {
  const { todos, loading, error, fetchTrash, restoreTodo, permanentlyDeleteTodo } = useTodoStore();
  const { isAuthenticated } = useAuthStore();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrash();
    }
  }, [isAuthenticated, fetchTrash]);

  const handleRestore = async (id) => {
    const result = await restoreTodo(id);
    if (result.success) {
      // Restore handled by store
    }
  };

  const handlePermanentDelete = async (id) => {
    const result = await permanentlyDeleteTodo(id);
    if (result.success) {
      // Permanent deletion handled by store
      setConfirmDeleteId(null);
    }
  };

  // Calculate relative time (e.g., "2 hours ago", "1 day ago")
  const getRelativeTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: '년', seconds: 31536000 },
      { label: '개월', seconds: 2592000 },
      { label: '일', seconds: 86400 },
      { label: '시간', seconds: 3600 },
      { label: '분', seconds: 60 },
      { label: '초', seconds: 1 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count}${interval.label} 전`;
      }
    }

    return '방금 전';
  };

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">휴지통</h1>
        <p className="text-gray-600 dark:text-gray-300">
          삭제된 할일을 복원하거나 영구 삭제할 수 있습니다
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-main"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Trash items list */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <div
                key={todo.todoId}
                className="border rounded-lg p-4 shadow-sm bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 opacity-80"
              >
                <div className="flex items-start">
                  <div className="ml-3 flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {todo.title} <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded dark:bg-gray-700 dark:text-gray-300">삭제됨</span>
                    </h3>
                    {todo.content && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                        {todo.content}
                      </p>
                    )}
                    {todo.dueDate && (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        📅 {todo.startDate} ~ {todo.dueDate}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Trash2 className="h-3 w-3 mr-1" /> {getRelativeTime(todo.deletedAt)}
                    </p>
                    <div className="mt-3 flex space-x-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleRestore(todo.todoId)}
                        className="flex items-center"
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        복원
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setConfirmDeleteId(todo.todoId)}
                        className="flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        영구삭제
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-4xl">🗑️</div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">휴지통이 비어있습니다</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                삭제한 할일이 없습니다
              </p>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Permanent Deletion */}
      <Modal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="⚠️ 영구 삭제"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              정말로 이 할일을 영구적으로 삭제하시겠습니까?
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            이 작업은 되돌릴 수 없습니다.
          </p>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setConfirmDeleteId(null)}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                if (confirmDeleteId) {
                  handlePermanentDelete(confirmDeleteId);
                }
              }}
            >
              영구삭제
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TrashPage;