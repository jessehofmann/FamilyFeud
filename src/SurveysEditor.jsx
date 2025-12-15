import React, { useState } from 'react';

export default function SurveysEditor({ surveys, setSurveys, onClose, onResetToDefault, onExport, showToast }) {
  const [text, setText] = useState(JSON.stringify(surveys, null, 2));
  const [error, setError] = useState(null);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error('Surveys JSON must be an array');
      // very light validation
      parsed.forEach((s, idx) => {
        if (!s.name || !Array.isArray(s.questions)) throw new Error(`Survey at index ${idx} is invalid`);
      });
      setSurveys(parsed);
      showToast?.('Surveys saved');
      onClose();
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  return (
    <div className="help-modal" onClick={onClose}>
      <div className="help-inner" onClick={(e) => e.stopPropagation()} style={{maxWidth:900}}>
        <h2>Edit Surveys</h2>
        <p style={{opacity:0.9}}>Edit the JSON for surveys. Click <strong>Save</strong> to apply.</p>
        <textarea value={text} onChange={(e) => { setText(e.target.value); setError(null); }} style={{width:'100%', height:320, fontFamily:'monospace', fontSize:13, marginTop:8}} />
        {error && <div style={{color:'#ffb4b4', marginTop:8}}>Error: {error}</div>}
        <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:12}}>
          <button onClick={onExport}>Export</button>
          <button onClick={onResetToDefault}>Reset</button>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
