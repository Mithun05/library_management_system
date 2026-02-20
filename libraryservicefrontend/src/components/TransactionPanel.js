'use client';
import { useState } from 'react';

export default function TransactionPanel() {
  const [view, setView] = useState('loans'); // 'borrow', 'return', 'loans'
  const [loans, setLoans] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    book_uid: '',
    member_id: '',
    staff_name: ''
  });

  const API_BASE = 'http://localhost:8000/api/loans/';

  const handleTransaction = async (actionType) => {
    setMessage('Processing...');
    try {
      const endpoint = actionType === 'borrow' ? 'borrow/' : 'return_item/';
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Success: ${data.status || 'Transaction completed'}`);
        setFormData({ book_uid: '', member_id: '', staff_name: '' });
      } else {
        setMessage(`Error: ${data.error || 'Request failed'}`);
      }
    } catch (error) {
      setMessage('Server connection failed.');
    }
  };

  const fetchActiveLoans = async () => {
    const memberId = prompt("Enter Member ID to filter (or leave blank for all active loans):");
    let url = `${API_BASE}member_loans/`;
    if (memberId) url += `?member_id=${memberId}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      // Handle response structure from our Django LoanViewSet member_loans action
      setLoans(Array.isArray(data) ? data : data.books || []);
      setView('loans');
    } catch (e) {
      setMessage("Failed to fetch loans.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
      {/* TRANSACTION NAV */}
      <div className="flex gap-2 mb-8 border-b pb-4">
        <button onClick={() => setView('borrow')} className={`px-4 py-2 rounded ${view === 'borrow' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>📤 Borrow Book</button>
        <button onClick={() => setView('return')} className={`px-4 py-2 rounded ${view === 'return' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>📥 Return Book</button>
        <button onClick={fetchActiveLoans} className={`px-4 py-2 rounded ${view === 'loans' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>📋 View Active Loans</button>
      </div>

      {message && <div className="mb-4 p-3 bg-purple-50 text-purple-700 rounded font-medium">{message}</div>}

      {/* BORROW FORM */}
      {view === 'borrow' && (
        <div className="max-w-md space-y-4">
          <h3 className="font-bold text-lg text-purple-800">Checkout Book</h3>
          <input type="text" placeholder="Book Unique ID (e.g. BK-XXXX)" className="w-full border p-2 rounded" 
            value={formData.book_uid} onChange={(e)=>setFormData({...formData, book_uid: e.target.value})} />
          <input type="text" placeholder="Member ID (e.g. MEM-001)" className="w-full border p-2 rounded" 
            value={formData.member_id} onChange={(e)=>setFormData({...formData, member_id: e.target.value})} />
          <input type="text" placeholder="Staff Name" className="w-full border p-2 rounded" 
            value={formData.staff_name} onChange={(e)=>setFormData({...formData, staff_name: e.target.value})} />
          <button onClick={() => handleTransaction('borrow')} className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">Process Borrowing</button>
        </div>
      )}

      {/* RETURN FORM */}
      {view === 'return' && (
        <div className="max-w-md space-y-4">
          <h3 className="font-bold text-lg text-indigo-800">Check-in Book</h3>
          <input type="text" placeholder="Enter Book Unique ID to Return" className="w-full border p-2 rounded" 
            value={formData.book_uid} onChange={(e)=>setFormData({...formData, book_uid: e.target.value})} />
          <button onClick={() => handleTransaction('return')} className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Confirm Return</button>
        </div>
      )}

      {/* LOANS LIST */}
      {view === 'loans' && (
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3">Book UID</th>
              <th className="p-3">Book Title</th>
              <th className="p-3">Member ID</th>
              <th className="p-3">Staff</th>
            </tr>
          </thead>
          <tbody>
            {loans.length > 0 ? loans.map((loan, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3 font-mono">{loan.book_uid}</td>
                <td className="p-3">{loan.book_title}</td>
                <td className="p-3">{loan.member_id_str}</td>
                <td className="p-3">{loan.processed_by}</td>
              </tr>
            )) : <tr><td colSpan="4" className="p-10 text-center text-gray-400">No active loans found.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
