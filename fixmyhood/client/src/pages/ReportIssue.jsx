import IssueForm from '../components/IssueForm.jsx';
import { api } from '../services/api.js';
import { useDeviceId } from '../services/device.js';

export default function ReportIssue() {
  const deviceId = useDeviceId();

  async function createIssue(payload) {
    const form = new FormData();
    for (const [k, v] of Object.entries(payload)) {
      if (k === 'image') continue;
      form.append(k, v);
    }
    form.append('deviceId', deviceId);
    if (payload.image) form.append('image', payload.image);
    const res = await api.post('/issues', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    window.location.href = `/issue/${res.data._id}`;
  }

  function suggest(body) {
    return api.post('/ai/suggest', body).then((r) => r.data);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Report an Issue</h1>
      <IssueForm onSubmit={createIssue} onSuggest={suggest} />
    </div>
  );
}