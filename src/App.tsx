import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';
import { TaskForm } from './features/tasks/TaskForm';
import { SearchBar } from './features/tasks/SearchBar';
import { TaskListContainer } from './features/tasks/TaskListContainer';
import { Button } from './components/ui/Button';
import { useTaskStore } from './store/useTaskStore';
import { useEffect } from 'react';
import { Moon, Sun, Trash2 } from 'lucide-react';
import { cn } from './utils/cn';

function App() {
  const { isDark, toggle } = useThemeStore();
  const { filter, setFilter, sort, setSort } = useTaskStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-body)' }}>
      <div className="max-w-5xl mx-auto p-6 pt-12">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-7xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent select-none">
            Task Master
          </h1>

          <Button
            onClick={toggle}
            variant="secondary"
            className="flex items-center gap-2.5 px-5 py-3 font-semibold rounded-xl border border-gray-300 dark:border-slate-600 hover:scale-105 transition-all duration-300"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </header>

        <main
          className="rounded-3xl p-10 shadow-2xl backdrop-blur-xl border transition-all duration-500"
          style={{
            backgroundColor: 'var(--bg-card)',
            boxShadow: 'var(--shadow)',
            borderColor: 'var(--border)',
          }}
        >
          <TaskForm />
          <SearchBar />

          <div className="flex flex-wrap items-center gap-3 mb-8">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'primary' : 'secondary'}
                onClick={() => 
                  // Implements filtering: toggles filter type
                  setFilter(f)}
                className="capitalize font-medium px-6"
              >
                {f === 'all' ? 'All' : f}
              </Button>
            ))}

            <Button
              onClick={() => 
                // Implements sorting: toggles asc/desc
                setSort(sort === 'asc' ? 'desc' : 'asc')}
              variant="secondary"
              className={cn(
                "ml-auto font-medium flex items-center gap-2.5 px-5 py-3 rounded-xl",
                "border border-gray-300 dark:border-slate-600",
                "hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/50 dark:hover:text-blue-400",
                "hover:border-blue-400 dark:hover:border-blue-500",
                "hover:shadow-lg hover:scale-105",
                "transition-all duration-300"
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Sort {sort === 'asc' ? 'Oldest First' : 'Newest First'}
            </Button>

            <Button
              onClick={() => {
                const completedIds = useTaskStore.getState().tasks.filter(t => t.completed).map(t => t.id);
                completedIds.forEach(id => useTaskStore.getState().remove(id));
              }}
              variant="danger"
              className="ml-2 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Completed
            </Button>
          </div>

          <TaskListContainer />
        </main>

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              fontSize: '15px',
              backdropFilter: 'blur(10px)',
              boxShadow: 'var(--shadow)',
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;