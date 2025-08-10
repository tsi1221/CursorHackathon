export default function StatusBadge({ status }) {
  const map = {
    open: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
  };
  const label = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status] || map.open}`}>
      {label[status] || 'Open'}
    </span>
  );
}