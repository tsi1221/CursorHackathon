import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';

export default function IssueCard({ issue }) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
      {issue.imageUrl && (
        <img src={issue.imageUrl} alt={issue.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg"><Link to={`/issue/${issue._id}`}>{issue.title}</Link></h3>
          <StatusBadge status={issue.status} />
        </div>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{issue.description}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
          <span>📍 {issue.subCity || 'Addis Ababa'}{issue.woreda ? `, Woreda ${issue.woreda}` : ''}</span>
          <span>•</span>
          <span>⬆️ {issue.upvotes}</span>
        </div>
      </div>
    </div>
  );
}