// src/seed.ts
export const seed10kTasks = () => {
  const tasks = Array.from({ length: 10000 }, (_, i) => ({
    id: crypto.randomUUID(),
    title: `Task ${i + 1} - ${Math.random().toString(36).slice(2, 8)}`,
    completed: Math.random() > 0.7,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
  }));
  localStorage.setItem('tasks', JSON.stringify(tasks, (_, v) =>
    v instanceof Date ? v.toISOString() : v  // Fixed to direct ISO string
  ));
  console.log('10,000 tasks seeded! Refresh the app.');
};

// Run once in browser console:
// import('./seed').then(m => m.seed10kTasks())