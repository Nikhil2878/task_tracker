const FilterBar = ({ filters, setFilters, taskCount }) => {
  const update = (key) => (e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="filter-bar">
      <input
        type="text"
        className="filter-bar__search"
        placeholder="Search tasks by title…"
        value={filters.search}
        onChange={update('search')}
        aria-label="Search tasks"
      />

      <div className="filter-bar__controls">
        <select value={filters.status} onChange={update('status')} aria-label="Filter by status">
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filters.priority}
          onChange={update('priority')}
          aria-label="Filter by priority"
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select value={filters.sortBy} onChange={update('sortBy')} aria-label="Sort by">
          <option value="createdAt">Sort: Newest</option>
          <option value="dueDate">Sort: Due date</option>
          <option value="priority">Sort: Priority</option>
          <option value="title">Sort: Title</option>
        </select>

        <button
          className="btn btn--ghost btn--icon"
          onClick={() =>
            setFilters((prev) => ({ ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' }))
          }
          title={filters.order === 'asc' ? 'Ascending' : 'Descending'}
        >
          {filters.order === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <span className="filter-bar__count">{taskCount} task{taskCount === 1 ? '' : 's'}</span>
    </div>
  );
};

export default FilterBar;
