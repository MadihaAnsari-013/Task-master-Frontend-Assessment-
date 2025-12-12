import { create } from 'zustand';
import { taskService } from '../lib/taskService';
import toast from 'react-hot-toast';
import type { Task, FilterType } from '../types';

interface State {
  tasks: Task[];
  filter: FilterType;
  sort: 'asc' | 'desc';
  searchQuery: string;
  isLoading: boolean;

  load: () => Promise<void>;
  add: (title: string) => Promise<void>;
  toggle: (id: string) => Promise<void>;
  edit: (id: string, title: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reorder: (tasks: Task[]) => Promise<void>;
  setFilter: (f: FilterType) => void;
  setSort: (s: 'asc' | 'desc') => void;
  setSearch: (q: string) => void;
}

export const useTaskStore = create<State>((set, get) => ({
  tasks: [],
  filter: 'all',
  sort: 'desc',
  searchQuery: '',
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    try {
      // Implements CRUD: Read tasks via simulated API
      const tasks = await taskService.getAll();
      set({ tasks, isLoading: false });
    } catch (e: any) {
      toast.error(e.message || 'Failed to load tasks');
      set({ tasks: [], isLoading: false });
    }
  },

  add: async (title) => {
    set({ isLoading: true });
    try {
      // Implements CRUD: Create task via simulated API
      const task = await taskService.create(title);
      set((s) => ({ tasks: [...s.tasks, task], isLoading: false }));
      toast.success('Task added!');
    } catch (e: any) {
      toast.error(e.message);
      set({ isLoading: false });
    }
  },

  toggle: async (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    try {
      // Implements CRUD: Update task (toggle complete) via simulated API
      await taskService.update(id, { completed: !task.completed });
      set((s) => ({
        tasks: s.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      }));
    } catch (e: any) {
      toast.error(e.message);
    }
  },

  edit: async (id, title) => {
    try {
      // Implements CRUD: Update task (edit title) via simulated API
      await taskService.update(id, { title });
      set((s) => ({
        tasks: s.tasks.map(t => t.id === id ? { ...t, title } : t)
      }));
      toast.success('Task updated');
    } catch (e: any) {
      toast.error(e.message);
    }
  },

  remove: async (id) => {
    try {
      // Implements CRUD: Delete task via simulated API
      await taskService.delete(id);
      set((s) => ({ tasks: s.tasks.filter(t => t.id !== id) }));
      toast.success('Task deleted');
    } catch (e: any) {
      toast.error(e.message);
    }
  },

  reorder: async (tasks) => {
    try {
      await taskService.reorder(tasks);
      set({ tasks });
    } catch (e: any) {
      toast.error(e.message || 'Failed to reorder tasks');
    }
  },

  // Implements filtering: sets filter type
  setFilter: (filter) => set({ filter }),
  // Implements sorting: sets sort order
  setSort: (sort) => set({ sort }),
  // Implements search: sets search query
  setSearch: (searchQuery) => set({ searchQuery }),
}));

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'tasks') {
      useTaskStore.getState().load();
    }
  });
}