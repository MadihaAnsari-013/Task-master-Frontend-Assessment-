import type { Task } from '../types';

const STORAGE_KEY = 'tasks';
const DELAY_MS = 500;

const delay = () => new Promise(res => setTimeout(res, DELAY_MS));
const shouldFail = () => Math.random() < 0.1;

const getTasks = (): Task[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw, (_, v) =>
      typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v) ? new Date(v) : v
    );
  } catch (err) {
    console.error('Failed to parse tasks:', err);
    return [];
  }
};

const saveTasks = (tasks: Task[]) => {
  // Implements persistence: saves to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const taskService = {
  async getAll(): Promise<Task[]> {
    await delay();
    if (shouldFail()) throw new Error('Failed to load tasks');
    // Implements persistence: reads from localStorage
    return getTasks();
  },

  async create(title: string): Promise<Task> {
    await delay();
    if (shouldFail()) throw new Error('Failed to add task');
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
    };
    const tasks = [...getTasks(), newTask];
    saveTasks(tasks);
    return newTask;
  },

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    await delay();
    if (shouldFail()) throw new Error('Failed to update task');
    const tasks = getTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Task not found');
    tasks[idx] = { ...tasks[idx], ...updates };
    saveTasks(tasks);
    return tasks[idx];
  },

  async delete(id: string): Promise<void> {
    await delay();
    if (shouldFail()) throw new Error('Failed to delete task');
    saveTasks(getTasks().filter(t => t.id !== id));
  },

  async reorder(tasks: Task[]): Promise<void> {
    await delay();
    if (shouldFail()) throw new Error('Failed to reorder tasks');
    saveTasks(tasks);
  },
};