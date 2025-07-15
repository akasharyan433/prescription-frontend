import React from 'react';
import './App.css';
import PrescriptionUpload from './components/PrescriptionUpload';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Prescription Analyzer</h1>
        <p>Upload your prescription image for AI-powered analysis</p>
      </header>
      <main className="App-main">
        <PrescriptionUpload />
      </main>
    </div>
  );
}

export default App;
