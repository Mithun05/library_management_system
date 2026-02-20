'use client';
import { useState } from 'react';
import LibraryPanel from '../components/LibraryPanel';
import MemberPanel from '../components/MemberPanel';
import TransactionPanel from '../components/TransactionPanel';


export default function Home() {
  const [activePanel, setActivePanel] = useState(null);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>
        Welcome to the Library Management System
      </h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '2rem' }}>
        <button 
          onClick={() => setActivePanel('book')}
          style={buttonStyle(activePanel === 'book')}
        >
          Book Management
        </button>
        
        <button 
          onClick={() => setActivePanel('member')}
          style={buttonStyle(activePanel === 'member')}
        >
          Member Management
        </button>

        <button 
          onClick={() => setActivePanel('transaction')}
          style={buttonStyle(activePanel === 'transaction')}
        >
          Transaction Management
        </button>
      </div>

      <div style={{ marginTop: '3rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
        {!activePanel && <p style={{ textAlign: 'center' }}>Please select a module to begin.</p>}
        {activePanel === 'book' && <LibraryPanel />}
        {activePanel === 'member' && <MemberPanel />}
        {activePanel === 'transaction' && <TransactionPanel />}
      </div>
    </main>
  );
}

const buttonStyle = (isActive) => ({
  padding: '12px 24px',
  fontSize: '1rem',
  cursor: 'pointer',
  backgroundColor: isActive ? '#3498db' : '#ecf0f1',
  color: isActive ? 'white' : 'black',
  border: '1px solid #bdc3c7',
  borderRadius: '4px'
});
