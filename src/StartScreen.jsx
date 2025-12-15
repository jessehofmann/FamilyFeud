import React from 'react';

export default function StartScreen({ musicPlaying, toggleMusic, teamAName, setTeamAName, teamBName, setTeamBName, setGameStarted }) {
  return (
    <div className="app start-screen">
      <img src="/images/logo.png" alt="Family Feud" className="logo start-logo" />
      <button className="mute-button" title="Toggle music" onClick={toggleMusic} aria-label="Toggle music">{musicPlaying ? "🔊" : "🔇"}</button>
      <div className="vertical-inputs start-controls">
        <div className="inputs-row">
          <input placeholder="Team A Name" value={teamAName} onChange={(e) => setTeamAName(e.target.value)} />
          <input placeholder="Team B Name" value={teamBName} onChange={(e) => setTeamBName(e.target.value)} />
        </div>
        <button onClick={() => setGameStarted(true)}>Start Game</button>
      </div>
    </div>
  );
}
