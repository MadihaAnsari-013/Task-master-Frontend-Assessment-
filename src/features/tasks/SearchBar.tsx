import { Input } from '../../components/ui/Input';
import { useTaskStore } from '../../store/useTaskStore';
import { useDebounce } from '../../hooks/useDebounce';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export const SearchBar = () => {
  const setSearch = useTaskStore(s => s.setSearch);
  const [value, setValue] = useState('');
  // Implements debouncing for search optimization (300ms delay after typing stops)
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    // Implements search functionality: updates search query for filtering tasks by title
    setSearch(debounced);
  }, [debounced, setSearch]);

  return (
    <div className="relative mb-6">
      <Input
        placeholder="Search tasks..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-base shadow-sm pl-10"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    </div>
  );
};