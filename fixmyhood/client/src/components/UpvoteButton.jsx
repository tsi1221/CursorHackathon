export default function UpvoteButton({ count, onUpvote, disabled }) {
  return (
    <button
      onClick={onUpvote}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-sm ${disabled ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
    >
      <span>⬆️</span>
      <span>{count}</span>
    </button>
  );
}