import { useEffect, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useTaskStore } from '../../store/useTaskStore';
import { TaskItem } from './TaskItem';
import { Spinner } from '../../components/ui/Spinner';
import { cn } from '../../utils/cn';
import { List } from 'lucide-react';
import { taskService } from '../../lib/taskService';

export const TaskListContainer = () => {
  const { tasks, load, isLoading, filter, sort, searchQuery, reorder } = useTaskStore();

  useEffect(() => {
    // Implements CRUD: Read tasks (loads from persistence)
    load();
  }, [load]);

  const displayedTasks = useMemo(() => {
    let result = [...tasks];

    // Implements filtering: by "All", "Active", "Completed"
    if (filter === 'active') result = result.filter(t => !t.completed);
    if (filter === 'completed') result = result.filter(t => t.completed);

    // Implements search functionality: filters tasks by title
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q));
    }

    // Implements sorting: by date (asc/desc)
    result.sort((a, b) => {
      const diff = a.createdAt.getTime() - b.createdAt.getTime();
      return sort === 'asc' ? diff : -diff;
    });

    return result;
  }, [tasks, filter, sort, searchQuery]);

  const moveTask = async (fromIndex: number, toIndex: number) => {
    const newDisplayed = [...displayedTasks];
    const [moved] = newDisplayed.splice(fromIndex, 1);
    newDisplayed.splice(toIndex, 0, moved);

    const visibleIds = new Set(newDisplayed.map(t => t.id));
    const hidden = tasks.filter(t => !visibleIds.has(t.id));
    const optimisticTasks = [...newDisplayed, ...hidden];

    reorder(optimisticTasks);

    try {
      await taskService.reorder(optimisticTasks);
    } catch {
      reorder(tasks);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  if (displayedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500 dark:text-gray-400">
        <List className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg">No tasks yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
      <div className="px-6 py-3 bg-gray-50/70 dark:bg-white/5 border-b">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Showing <span className="font-bold">{displayedTasks.length}</span> tasks
          {tasks.length !== displayedTasks.length && ` (Total: ${tasks.length})`}
        </p>
      </div>

      {/* Implements virtualization: uses Virtuoso for list windowing (handles large lists like 10k tasks) */}
      <Virtuoso
        style={{ height: '60vh' }}
        data={displayedTasks}
        itemContent={(index, task) => (
          <div
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('index', String(index));
              (e.currentTarget as HTMLElement).style.opacity = '0.5';
            }}
            onDragEnd={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '1';
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const fromIndex = Number(e.dataTransfer.getData('index'));
              if (!isNaN(fromIndex) && fromIndex !== index) {
                moveTask(fromIndex, index);
              }
            }}
            className={cn(
              "group border-b border-gray-100 dark:border-slate-800",
              "hover:bg-blue-500/10 dark:hover:bg-blue-400/20",
              "transition-all duration-300 cursor-grab active:cursor-grabbing select-none"
            )}
          >
            <TaskItem task={task} />
          </div>
        )}
      />
    </div>
  );
};