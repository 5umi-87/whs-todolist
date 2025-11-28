import { create } from 'zustand';
import { axiosInstance } from '../services/api';

const useTodoStore = create((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  fetchTodos: async (status = 'active') => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/todos?status=${status}`);
      const { data } = response;

      set({
        todos: data.data,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || '할일 목록을 불러오는데 실패했습니다',
        loading: false
      });
    }
  },

  fetchAllTodos: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch all non-deleted todos (active and completed)
      const response = await axiosInstance.get('/todos');
      const { data } = response;

      set({
        todos: data.data,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || '할일 목록을 불러오는데 실패했습니다',
        loading: false
      });
    }
  },

  createTodo: async (todoData) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post('/todos', todoData);
      const { data } = response;

      set((state) => ({
        todos: [data.data, ...state.todos],
        loading: false
      }));

      return { success: true, data: data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || '할일을 추가하는데 실패했습니다',
        loading: false
      });

      return { success: false, error: error.response?.data?.error?.message || '할일을 추가하는데 실패했습니다' };
    }
  },

  updateTodo: async (id, todoData) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.put(`/todos/${id}`, todoData);
      const { data } = response;

      set((state) => ({
        todos: state.todos.map(todo =>
          todo.todoId === id ? { ...todo, ...data.data } : todo
        ),
        loading: false
      }));

      return { success: true, data: data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || '할일을 수정하는데 실패했습니다',
        loading: false
      });

      return { success: false, error: error.response?.data?.error?.message || '할일을 수정하는데 실패했습니다' };
    }
  },

  deleteTodo: async (id) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.delete(`/todos/${id}`);
      const { data } = response;

      set((state) => ({
        todos: state.todos.map(todo =>
          todo.todoId === id ? { ...todo, status: 'deleted', deletedAt: data.data.deletedAt } : todo
        ),
        loading: false
      }));

      return { success: true, data: data };
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || '할일을 삭제하는데 실폐했습니다',
        loading: false
      });

      return { success: false, error: error.response?.data?.error?.message || '할일을 삭제하는데 실폐했습니다' };
    }
  },

  toggleComplete: async (id) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.patch(`/todos/${id}/complete`);
      const { data } = response;

      set((state) => ({
        todos: state.todos.map(todo =>
          todo.todoId === id ? { ...todo, ...data.data } : todo
        ),
        loading: false
      }));

      return { success: true, data: data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || '할일 완료 상태를 변경하는데 실패했습니다',
        loading: false
      });

      return { success: false, error: error.response?.data?.error?.message || '할일 완료 상태를 변경하는데 실패했습니다' };
    }
  },

  restoreTodo: async (id) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.patch(`/todos/${id}/restore`);
      const { data } = response;

      set((state) => ({
        todos: state.todos.map(todo =>
          todo.todoId === id ? { ...todo, ...data.data } : todo
        ),
        loading: false
      }));

      return { success: true, data: data.data };
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || '할일을 복원하는데 실패했습니다',
        loading: false
      });

      return { success: false, error: error.response?.data?.error?.message || '할일을 복원하는데 실패했습니다' };
    }
  },

  fetchTrash: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/trash');
      const { data } = response;

      set({
        todos: data.data,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || '휴지통 목록을 불러오는데 실패했습니다',
        loading: false
      });
    }
  },

  permanentlyDeleteTodo: async (id) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/trash/${id}`);

      set((state) => ({
        todos: state.todos.filter(todo => todo.todoId !== id),
        loading: false
      }));

      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || '할일을 영구 삭제하는데 실패했습니다',
        loading: false
      });

      return { success: false, error: error.response?.data?.error?.message || '할일을 영구 삭제하는데 실패했습니다' };
    }
  }
}));

export { useTodoStore };