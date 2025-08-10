export default function AISuggestions({ loading, suggestion }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold mb-2">AI Action Suggestions</h3>
      {loading ? (
        <p className="text-sm text-gray-500">Generating suggestions…</p>
      ) : suggestion ? (
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: suggestion.replace(/\n/g, '<br/>') }} />
      ) : (
        <p className="text-sm text-gray-500">Fill in details to see suggestions.</p>
      )}
    </div>
  );
}