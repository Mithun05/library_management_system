'use client';
import { useState, useEffect } from 'react';

export default function LibraryPanel() {
  const [view, setView] = useState('list'); // 'list', 'add', 'update', 'delete'
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({ title: '', author: '', published_date: '', number_of_copies: 1 });
  const [selectedId, setSelectedId] = useState('');
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:8000/api/books/';

  const fetchBooks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBooks(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleAction = async (method, id = '') => {
    const url = id ? `${API_URL}${id}/` : API_URL;
    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'GET' && method !== 'DELETE' ? JSON.stringify(formData) : null,
      });
      if (res.ok) {
        setMessage(`${method} Successful!`);
        fetchBooks();
        if(method === 'DELETE' || method === 'POST') setView('list');
      } else {
        const err = await res.json();
        setMessage(`Error: ${JSON.stringify(err)}`);
      }
    } catch (e) { setMessage("Server Connection Failed"); }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      {/* 4 MAIN ACTION BUTTONS */}
      <div className="flex flex-wrap gap-2 mb-8 border-b pb-4">
        <button onClick={() => {setView('list'); setMessage('');}} className={`px-4 py-2 rounded ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>📋 View All</button>
        <button onClick={() => {setView('add'); setMessage('');}} className={`px-4 py-2 rounded ${view === 'add' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>➕ Add Book</button>
        <button onClick={() => {setView('update'); setMessage('');}} className={`px-4 py-2 rounded ${view === 'update' ? 'bg-yellow-500 text-white' : 'bg-gray-100'}`}>🔄 Update</button>
        <button onClick={() => {setView('delete'); setMessage('');}} className={`px-4 py-2 rounded ${view === 'delete' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>🗑️ Delete</button>
      </div>

      {message && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded">{message}</div>}

      {/* DYNAMIC CONTENT PANELS */}
      {view === 'list' && (
        <table className="w-full border-collapse">
          <thead><tr className="bg-gray-50 text-left"><th className="p-3">ID</th><th className="p-3">Title</th><th className="p-3">Author</th><th className="p-3">Physical Copy UIDs</th></tr></thead>
          <tbody>
            {books.map(b => <tr key={b.id} className="border-t">
              <td className="p-3">{b.id}</td><td className="p-3 font-bold">{b.title}</td><td className="p-3">{b.author}</td>
              <td className="p-3">
          {/* Display all UIDs associated with this book */}
          <div className="flex flex-wrap gap-1">
            {b.copies && b.copies.length > 0 ? (
              b.copies.map(copy => (
                <span key={copy.book_uid} className={`px-2 py-0.5 rounded text-[10px] font-mono border ${copy.is_available ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {copy.book_uid}
                </span>
              ))
            ) : (
              <span className="text-gray-400 italic text-xs">No copies found</span>
            )}
          </div>
        </td>
            </tr>)}
          </tbody>
        </table>
      )}

      {(view === 'add' || view === 'update') && (
        <div className="max-w-md space-y-4">
          {view === 'update' && (
            <input type="number" placeholder="Enter Book ID to Update" className="w-full border p-2 rounded bg-yellow-50" 
              onChange={(e) => setSelectedId(e.target.value)} />
          )}
          <input type="text" placeholder="Title" className="w-full border p-2 rounded" value={formData.title} onChange={(e)=>setFormData({...formData, title:e.target.value})} />
          <input type="text" placeholder="Author" className="w-full border p-2 rounded" value={formData.author} onChange={(e)=>setFormData({...formData, author:e.target.value})} />
          <input type="date" className="w-full border p-2 rounded" value={formData.published_date} onChange={(e)=>setFormData({...formData, published_date:e.target.value})} />
          {view === 'add' && <input type="number" placeholder="Copies" className="w-full border p-2 rounded" onChange={(e)=>setFormData({...formData, number_of_copies:e.target.value})} />}
          <button onClick={() => handleAction(view === 'add' ? 'POST' : 'PUT', selectedId)} className="w-full bg-blue-600 text-white p-2 rounded">
            {view === 'add' ? 'Create Book' : 'Update Book Info'}
          </button>
        </div>
      )}

      {view === 'delete' && (
        <div className="max-w-md p-4 border-2 border-red-100 rounded bg-red-50">
          <p className="mb-4 text-red-700 font-bold">Warning: This action is permanent.</p>
          <input type="number" placeholder="Enter Book ID to Delete" className="w-full border p-2 rounded mb-4" 
            onChange={(e) => setSelectedId(e.target.value)} />
          <button onClick={() => handleAction('DELETE', selectedId)} className="w-full bg-red-600 text-white p-2 rounded">Confirm Delete</button>
        </div>
      )}
    </div>
  );
}