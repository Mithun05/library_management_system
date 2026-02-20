'use client';
import { useState, useEffect } from 'react';

export default function MemberPanel() {
  const [view, setView] = useState('list'); // 'list', 'add', 'update', 'delete'
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    member_id: '',
    email: '',
    phone: '',
    is_active: true
  });
  const [selectedId, setSelectedId] = useState('');
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:8000/api/members/';

  const fetchMembers = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setMembers(data);
    } catch (e) { console.error('Error fetching members:', e); }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleAction = async (method, id = '') => {
    const url = id ? `${API_URL}${id}/` : API_URL;
    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'GET' && method !== 'DELETE' ? JSON.stringify(formData) : null,
      });
      
      if (res.ok) {
        setMessage(`Member ${method === 'POST' ? 'Created' : method === 'PUT' ? 'Updated' : 'Deleted'} Successfully!`);
        fetchMembers();
        if (method !== 'PUT') setView('list');
      } else {
        const err = await res.json();
        setMessage(`Error: ${JSON.stringify(err)}`);
      }
    } catch (e) { setMessage("Connection to Django Backend Failed"); }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      {/* MEMBER ACTION BUTTONS */}
      <div className="flex flex-wrap gap-2 mb-8 border-b pb-4">
        <button onClick={() => {setView('list'); setMessage('');}} className={`px-4 py-2 rounded transition ${view === 'list' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>📋 View All</button>
        <button onClick={() => {setView('add'); setMessage('');}} className={`px-4 py-2 rounded transition ${view === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>➕ Register Member</button>
        <button onClick={() => {setView('update'); setMessage('');}} className={`px-4 py-2 rounded transition ${view === 'update' ? 'bg-yellow-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>🔄 Update Status</button>
        <button onClick={() => {setView('delete'); setMessage('');}} className={`px-4 py-2 rounded transition ${view === 'delete' ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>🗑️ Remove</button>
      </div>

      {message && <div className={`mb-4 p-3 rounded ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{message}</div>}

      {/* 1. LIST VIEW */}
      {view === 'list' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-3">UID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Books Out</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{m.member_id}</td>
                  <td className="p-3 font-bold">{m.name}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${m.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {m.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3">{m.current_books_loaned_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. ADD / UPDATE FORM */}
      {(view === 'add' || view === 'update') && (
        <div className="max-w-md space-y-4">
          {view === 'update' && (
            <input type="number" placeholder="Enter Database ID to Update" className="w-full border p-2 rounded bg-yellow-50" 
              onChange={(e) => setSelectedId(e.target.value)} />
          )}
          <input type="text" placeholder="Full Name" className="w-full border p-2 rounded" value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} />
          <input type="text" placeholder="Member ID (e.g. MEM-001)" className="w-full border p-2 rounded" value={formData.member_id} onChange={(e)=>setFormData({...formData, member_id:e.target.value})} />
          <input type="email" placeholder="Email Address" className="w-full border p-2 rounded" value={formData.email} onChange={(e)=>setFormData({...formData, email:e.target.value})} />
          <input type="text" placeholder="Phone Number" className="w-full border p-2 rounded" value={formData.phone} onChange={(e)=>setFormData({...formData, phone:e.target.value})} />
          
          <div className="flex items-center gap-2 p-2">
            <input type="checkbox" checked={formData.is_active} onChange={(e)=>setFormData({...formData, is_active: e.target.checked})} />
            <label>Member is Active</label>
          </div>

          <button onClick={() => handleAction(view === 'add' ? 'POST' : 'PUT', selectedId)} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">
            {view === 'add' ? 'Register New Member' : 'Update Member Details'}
          </button>
        </div>
      )}

      {/* 3. DELETE VIEW */}
      {view === 'delete' && (
        <div className="max-w-md p-4 border-2 border-red-100 rounded bg-red-50">
          <p className="mb-4 text-red-700 font-bold">⚠️ Warning: Deleting a member will remove all their history.</p>
          <input type="number" placeholder="Enter Database ID to Delete" className="w-full border p-2 rounded mb-4" 
            onChange={(e) => setSelectedId(e.target.value)} />
          <button onClick={() => handleAction('DELETE', selectedId)} className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700">Confirm Deletion</button>
        </div>
      )}
    </div>
  );
}