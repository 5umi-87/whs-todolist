import React from 'react';
import PropTypes from 'prop-types';
import { Edit, Trash2, CheckCircle, Circle } from 'lucide-react';
import Button from './Button';

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

  // Determine status color
  let statusColorClass = '';
  if (isCompleted) {
    statusColorClass = 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20';
  } else if (isOverdue) {
    statusColorClass = 'border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20';
  } else {
    statusColorClass = 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
  }

  return (
    <div className={`border rounded-lg p-4 shadow-sm ${statusColorClass} ${className}`}>
      <div className="flex items-start">
        <button
          onClick={() => onToggleComplete && onToggleComplete(todo.todoId)}
          className={`mt-1 flex-shrink-0 h-5 w-5 rounded border ${
            isCompleted 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-300 dark:border-gray-600'
          } focus:outline-none focus:ring-2 focus:ring-primary-main`}
          aria-label={isCompleted ? "할일 미완료로 변경" : "할일 완료로 변경"}
        >
          {isCompleted && <CheckCircle className="h-5 w-5 text-white" />}
        </button>
        
        <div className="ml-3 flex-1 min-w-0">
          <h3 className={`text-lg font-medium ${
            isCompleted 
              ? 'text-gray-500 dark:text-gray-400 line-through' 
              : 'text-gray-900 dark:text-white'
          }`}>
            {todo.title}
          </h3>
          
          {todo.content && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
              {todo.content}
            </p>
          )}
          
          {todo.dueDate && (
            <div className="mt-2 flex items-center text-xs">
              <span className="text-gray-500 dark:text-gray-400">📅 {todo.startDate} ~ {todo.dueDate}</span>
              {daysUntilDue !== null && daysUntilDue <= 3 && !isCompleted && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  isOverdue 
                    ? 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300' 
                    : daysUntilDue === 0 
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-800/30 dark:text-orange-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300'
                }`}>
                  {isOverdue ? `D+${Math.abs(daysUntilDue)}` : daysUntilDue === 0 ? 'D-Day' : `D-${daysUntilDue}`}
                </span>
              )}
            </div>
          )}
          
          {isCompleted && (
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300">
              완료됨
            </div>
          )}
        </div>
        
        <div className="ml-2 flex space-x-1">
          <Button
            variant="icon"
            size="sm"
            onClick={() => onEdit && onEdit(todo)}
            aria-label="수정"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="icon"
            size="sm"
            onClick={() => onDelete && onDelete(todo.todoId)}
            aria-label="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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