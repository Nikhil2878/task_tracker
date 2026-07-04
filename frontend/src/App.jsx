import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import Notification from './components/Notification';

function App() {
  const {
    tasks,
    loading,
    error,
    filters,
    setFilters,
    notification,
    clearNotification,
    addTask,
    editTask,
    removeTask,
    toggleStatus,
    refetch,
  } = useTasks();

  const [editingTask, setEditingTask] = useState(null);

  const handleSubmit = editingTask
    ? async (id, data) => {
        const result = await editTask(id, data);
        if (result.success) setEditingTask(null);
        return result;
      }
    : addTask;

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <div>
            <h1>Task Tracker</h1>
            <p>Stay on top of every task, one status at a time.</p>
          </div>
        </div>
        {tasks.length > 0 && (
          <div className="app__stats">
            <strong>{stats.completed}</strong>/{stats.total} completed
          </div>
        )}
      </header>

      <main className="app__main">
        <section className="app__form-panel">
          <TaskForm
            onSubmit={handleSubmit}
            editingTask={editingTask}
            onCancelEdit={() => setEditingTask(null)}
          />
        </section>

        <section className="app__list-panel">
          <FilterBar filters={filters} setFilters={setFilters} taskCount={tasks.length} />
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            onEdit={setEditingTask}
            onDelete={removeTask}
            onToggleStatus={toggleStatus}
            onRetry={refetch}
          />
        </section>
      </main>

      <Notification notification={notification} onClear={clearNotification} />
    </div>
  );
}

export default App;
