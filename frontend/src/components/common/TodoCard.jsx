import React from 'react';
import PropTypes from 'prop-types';
import { CheckSquare, Square } from 'lucide-react';

const TodoCard = ({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
  className = ''
}) => {
  const isCompleted = todo.isCompleted;
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !isCompleted;

  // Calculate days until due
  let daysUntilDue = null;
  if (todo.dueDate) {
    const dueDate = new Date(todo.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = dueDate - today;
    daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Determine status background color (구글 캘린더 스타일)
  let statusBgClass = '';
  if (isCompleted) {
    statusBgClass = 'bg-green-50 dark:bg-green-900/10';
  } else if (isOverdue) {
    statusBgClass = 'bg-red-50 dark:bg-red-900/10';
  } else {
    statusBgClass = 'bg-background-white dark:bg-dark-surface';
  }

  return (
    <div className={`border border-border-gray dark:border-gray-700 rounded ${statusBgClass} shadow-google-sm hover:shadow-google-md transition-shadow ${className} flex flex-col h-full`}>
      {/* 체크박스와 제목 */}
      <div className="flex items-start gap-2 p-2">
        <button
          onClick={() => onToggleComplete && onToggleComplete(todo.todoId)}
          className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-active-blue rounded-sm mt-0.5"
          aria-label={isCompleted ? '미완료로 변경' : '완료로 변경'}
        >
          {isCompleted ? (
            <CheckSquare className="h-[18px] w-[18px] text-status-completed" strokeWidth={2} />
          ) : (
            <Square className="h-[18px] w-[18px] text-text-secondary dark:text-gray-500" strokeWidth={2} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-medium leading-tight ${
            isCompleted
              ? 'text-text-disabled dark:text-gray-500 line-through'
              : 'text-text-primary dark:text-dark-text'
          }`}>
            {todo.title}
          </h3>
        </div>
      </div>

      {/* 내용 */}
      {todo.content && (
        <p className="px-2 text-xs text-text-secondary dark:text-dark-textSecondary mb-2 flex-1">
          {todo.content}
        </p>
      )}

      {/* 날짜 */}
      {(todo.startDate || todo.dueDate) && (
        <div className="flex items-center gap-1 px-2 mb-2 text-xs text-text-secondary dark:text-dark-textSecondary">
          <span>
            {todo.startDate && todo.dueDate
              ? `시작일: ${todo.startDate} ~ 마감일: ${todo.dueDate}`
              : todo.dueDate
                ? `마감일: ${todo.dueDate}`
                : `시작일: ${todo.startDate}`}
          </span>
        </div>
      )}

      {/* 상태 라벨과 D-Day */}
      <div className="flex items-center gap-1.5 px-2 mb-1">
        {/* D-Day 경고 (만료 임박시) */}
        {daysUntilDue !== null && daysUntilDue <= 3 && !isCompleted && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
            isOverdue
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              : daysUntilDue === 0
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
          }`}>
            ⚠️ {isOverdue ? `D+${Math.abs(daysUntilDue)}` : daysUntilDue === 0 ? 'D-Day' : `D-${daysUntilDue}`}
          </span>
        )}

        {/* 상태 라벨 */}
        {isCompleted ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            완료
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
            진행중
          </span>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2 pt-2 px-2 pb-1 border-t border-border-light dark:border-gray-700 mt-auto">
        {!isCompleted && (
          <button
            onClick={() => onEdit && onEdit(todo)}
            className="text-xs text-text-secondary dark:text-dark-textSecondary hover:text-text-primary dark:hover:text-dark-text font-normal hover:bg-hover-gray dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors"
            aria-label="수정"
          >
            [수정]
          </button>
        )}
        <button
          onClick={() => onDelete && onDelete(todo.todoId)}
          className="text-xs text-text-secondary dark:text-dark-textSecondary hover:text-text-primary dark:hover:text-dark-text font-normal hover:bg-hover-gray dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors"
          aria-label="삭제"
        >
          [삭제]
        </button>
      </div>
    </div>
  );
};

TodoCard.propTypes = {
  todo: PropTypes.shape({
    todoId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    startDate: PropTypes.string,
    dueDate: PropTypes.string,
    isCompleted: PropTypes.bool,
    status: PropTypes.string
  }).isRequired,
  onToggleComplete: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  className: PropTypes.string
};

export default TodoCard;
