import { memo, useCallback, useState } from 'react';
import type { Task } from '../../types';
import { Checkbox } from '../../components/ui/Checkbox';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useTaskStore } from '../../store/useTaskStore';
import { cn } from '../../utils/cn';
import { GripVertical, Edit2, Trash2 } from 'lucide-react';

interface Props {
  task: Task;
}

export const TaskItem = memo(({ task }: Props) => {
  const { toggle, edit, remove } = useTaskStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  const handleToggle = useCallback(() => 
    // Implements CRUD: Update task (mark complete/incomplete)
    toggle(task.id), [task.id, toggle]);
  const handleRemove = useCallback(() => 
    // Implements CRUD: Delete task
    remove(task.id), [task.id, remove]);

  const startEdit = useCallback(() => {
    setEditValue(task.title);
    setIsEditing(true);
  }, [task.title]);

  const saveEdit = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.title) {
      // Implements CRUD: Update task (edit title)
      edit(task.id, trimmed);
    }
    setIsEditing(false);
  }, [editValue, task.id, task.title, edit]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditValue(task.title);
  }, [task.title]);

  return (
    <div
      role="listitem"
      className={cn(
        "group flex items-center gap-4 p-5 border-b border-gray-200 dark:border-slate-700",
        "hover:bg-blue-500/10 dark:hover:bg-blue-400/20",
        "backdrop-blur-sm transition-all duration-300",
        task.completed && "opacity-60"
      )}
    >
      <div className="text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing select-none">
        <GripVertical className="w-5 h-5" />
      </div>

      <Checkbox checked={task.completed} onChange={handleToggle} />

      {isEditing ? (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') cancelEdit();
          }}
          className="flex-1 text-lg font-medium"
          autoFocus
        />
      ) : (
        <span
          onDoubleClick={startEdit}
          className={cn(
            "flex-1 text-lg font-medium select-none cursor-pointer",
            task.completed && "line-through text-gray-500 dark:text-gray-400"
          )}
        >
          {task.title}
        </span>
      )}

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <Button
          onClick={startEdit}
          variant="secondary"
          size="sm"
          className="flex items-center gap-1.5 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-300 dark:hover:text-blue-300 border border-gray-300 dark:border-slate-600"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </Button>

        <Button
          onClick={handleRemove}
          variant="danger"
          size="sm"
          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-800"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </div>
  );
});

TaskItem.displayName = 'TaskItem';