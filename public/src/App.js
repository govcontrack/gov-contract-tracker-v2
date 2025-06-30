import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#2563eb', borderBottom: '2px solid #2563eb', paddingBottom: '10px' }}>
        🏛️ Government Contract Tracker
      </h1>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h2>✅ React App is Working!</h2>
        <p>Your Government Contract Tracker is successfully deployed.</p>
        <button 
          onClick={() => alert('App is working perfectly!')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Button
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>🎯 Next Steps:</h3>
        <ul>
          <li>✅ Basic React app deployed successfully</li>
          <li>🔄 Ready to add full contract tracking features</li>
          <li>💰 Connect domain and launch business</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
