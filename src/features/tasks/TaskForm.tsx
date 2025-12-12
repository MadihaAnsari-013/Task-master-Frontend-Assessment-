import { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const TaskForm = () => {
  const [title, setTitle] = useState('');
  const { add, isLoading } = useTaskStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    // Implements CRUD: Create task
    add(title);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 text-lg font-medium shadow-sm"
      />
      <Button type="submit" loading={isLoading}>
        Add Task
      </Button>
    </form>
  );
};