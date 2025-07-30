import React, { useState } from 'react';
import axios from 'axios';
import './PrescriptionUpload.css';
import ResponseDisplay from './ResponseDisplay';
import QualityFeedback from './QualityFeedback';



const PrescriptionUpload = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [qualityIssue, setQualityIssue] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  //const [patientId, setPatientId] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResponse(null);
    setError(null);
  };

  // const handlePatientIdChange = (e) => {
  //   setPatientId(e.target.value); // 🔍 Handle patient ID input
  // };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

const analyzePresc = async () => {
    if (!file) {
      setError('Please select a prescription image first');
      return;
    }

    // if (!patientId || patientId.trim() === '') {
    //   setError('Please enter a Patient ID');
    //   return;
    // }

    setIsProcessing(true);
    setError(null);
    setResponse(null);
    setQualityIssue(null);


    const formData = new FormData();
    formData.append('prescription', file);
    //formData.append('patient_id', patientId);

    try {
      const apiUrl = process.env.BACKEND_URL || '';
      const result = await axios.post(`${apiUrl}/api/prescription/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 600000, // 60 seconds timeout
      });

      setResponse(result.data);
    } catch (err) {
      console.error('Error analyzing prescription:', err);
      if (err.response?.status === 400 && err.response?.data?.action_required === 'RETAKE_PHOTO'){
        setQualityIssue(err.response.data);
      }else{
        setError(
          err.response?.data?.error || 
          err.message || 
          'Failed to analyze prescription. Please try again.'
        );
      }
      
    } finally {
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResponse(null);
    setError(null);
    setQualityIssue(null);
  };

  return (
    <div className="prescription-upload">
      <div className="upload-container">
        {/* 🔍 Patient ID Input */}
        {/* <div className="patient-id-section">
          <label htmlFor="patientId">🔹 Enter Patient ID:</label>
          <input
            type="text"
            id="patientId"
            value={patientId}
            onChange={handlePatientIdChange}
            placeholder="e.g., patient_12456"
          />
        </div> */}
        <div 
          className={`upload-area ${dragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            id="prescription-input"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          {!file ? (
            <label htmlFor="prescription-input" className="upload-label">
              <div className="upload-icon">📄</div>
              <h3>Upload Prescription</h3>
              <p>Drop your prescription image here or click to browse</p>
              <p className="file-types">Supports: JPG, PNG, WebP (Max 10MB)</p>
            </label>
          ) : (
            <div className="file-selected">
              <div className="file-icon">✅</div>
              <h3>File Selected</h3>
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
        </div>

        <div className="actions">
          {file && !isProcessing && (
            <>
              <button 
                onClick={analyzePresc}
                className="analyze-btn"
                disabled={isProcessing}
              >
                Analyze Prescription
              </button>
              <button 
                onClick={resetUpload}
                className="reset-btn"
              >
                Choose Different File
              </button>
            </>
          )}
        </div>

        {isProcessing && (
          <div className="processing">
            <div className="spinner"></div>
            <h3>Processing Your Prescription...</h3>
            <p>Our AI is analyzing the prescription image. This may take a few moments.</p>
          </div>
        )}

        {error && (
          <div className="error">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}
        {qualityIssue && (
          <QualityFeedback 
            qualityData={qualityIssue.quality_assessment} 
            onRetake={resetUpload}
          />
        )}
      </div>

      {response && (
        <ResponseDisplay response={response} />
      )}
    </div>
  );
};

export default PrescriptionUpload;
