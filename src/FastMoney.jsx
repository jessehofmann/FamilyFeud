import React from 'react';

export default function FastMoney(props) {
  const {
    fastMoneyNamesEntered,
    setFastMoneyNamesEntered,
    fastMoneyPlayerNames,
    setFastMoneyPlayerNames,
    setFastMoneyActive,
    setFastMoneyPlayer,
    fastMoneyHidePlayer1,
    setFastMoneyHidePlayer1,
    fastMoneyAnswers,
    setFastMoneyAnswers,
    fastMoneyPoints,
    handleFastMoneyPointChange,
    fastMoneyTotals,
    submitFastMoneyPlayer,
    fastMoneyPlayer,
    fastMoneyFinished,
    resetEverything,
    fastMoneyTimerRunning,
    toggleFastMoneyTimer,
    fastMoneyTimeLeft,
  } = props;

  return (
    <div className="app">
      {props.fastMoneyCelebrate && (
        <div className="fm-celebrate">
          <div className="fm-celebrate-inner">
            <h2>CONGRATULATIONS!</h2>
            <p>{(typeof props.fastMoneyLeader === 'number' ? (props.fastMoneyLeader === 0 ? (props.teamAName || 'Team A') : (props.teamBName || 'Team B')) : 'Team')} won the Family Feud</p>
            <div style={{marginTop:12}}>
              <button onClick={() => { props.resetEverything(); }}>Continue</button>
            </div>
          </div>
        </div>
      )}
      <div className="header-row">
        <div style={{flex:1}} />
        <div style={{textAlign:'center'}} />
        <div style={{flex:1}} />
      </div>

      <div className="fm-screen">
        <div className="fm-header-box">
          <h2>Fast Money</h2>
          <div className="team-total">Team Total: {fastMoneyTotals[0] + fastMoneyTotals[1]}</div>
        </div>

        {!fastMoneyNamesEntered ? (
          <div style={{display:'flex', flexDirection:'column', gap:12, alignItems:'center'}}>
            <div style={{display:'flex', gap:12, alignItems:'center'}}>
              <label style={{minWidth:90, textAlign:'right'}}>Player 1:</label>
              <input value={fastMoneyPlayerNames[0] || ''} onChange={(e)=>{ const copy=[...fastMoneyPlayerNames]; copy[0]=e.target.value; setFastMoneyPlayerNames(copy); }} />
            </div>
            <div style={{display:'flex', gap:12, alignItems:'center'}}>
              <label style={{minWidth:90, textAlign:'right'}}>Player 2:</label>
              <input value={fastMoneyPlayerNames[1] || ''} onChange={(e)=>{ const copy=[...fastMoneyPlayerNames]; copy[1]=e.target.value; setFastMoneyPlayerNames(copy); }} />
            </div>
            <div style={{display:'flex', gap:8}}>
              <button onClick={() => { setFastMoneyNamesEntered(true); setFastMoneyPlayer(0); }}>Start Fast Money</button>
              <button onClick={() => { setFastMoneyActive(false); setFastMoneyNamesEntered(false); }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{maxWidth:900, margin:'0 auto 8px'}}>
              <div className="fm-players-row" style={{display:'flex', gap:32, justifyContent:'center'}}>
                <div className={`fm-player-box ${fastMoneyHidePlayer1 ? 'fm-hidden' : ''}`} style={{flex:1, padding:12}}>
                  <div className="player-title">{fastMoneyPlayerNames[0] || 'Player 1'}</div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="fm-item-row" style={{display:'flex', gap:8, alignItems:'center', marginBottom:8}}>
                      <input className="answer-input" value={fastMoneyAnswers[0]?.[i] ?? ''} onChange={(e) => { const copy = fastMoneyAnswers.map(arr => arr.slice()); copy[0][i] = e.target.value; setFastMoneyAnswers(copy); }} />
                      <input className="points-input" type="number" min={0} step={1} value={fastMoneyPoints[0]?.[i] ?? 0} onChange={(e) => handleFastMoneyPointChange(0, i, e.target.value)} />
                    </div>
                  ))}
                  <div className="player-score">{fastMoneyTotals[0]}</div>
                </div>
                <div className="fm-player-box" style={{flex:1, padding:12}}>
                  <div className="player-title">{fastMoneyPlayerNames[1] || 'Player 2'}</div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="fm-item-row" style={{display:'flex', gap:8, alignItems:'center', marginBottom:8}}>
                      <input className="answer-input" value={fastMoneyAnswers[1]?.[i] ?? ''} onChange={(e) => { const copy = fastMoneyAnswers.map(arr => arr.slice()); copy[1][i] = e.target.value; setFastMoneyAnswers(copy); }} />
                      <input className="points-input" type="number" min={0} step={1} value={fastMoneyPoints[1]?.[i] ?? 0} onChange={(e) => handleFastMoneyPointChange(1, i, e.target.value)} />
                    </div>
                  ))}
                  <div className="player-score">{fastMoneyTotals[1]}</div>
                </div>
              </div>
            </div>
            <div style={{display:'flex', justifyContent:'center', gap:12, alignItems:'center', marginTop:6}}>
              {!fastMoneyFinished ? (
                <>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <button onClick={submitFastMoneyPlayer}>{fastMoneyPlayer === 0 ? "Submit Player 1" : "Finish & Award"}</button>
                    <button onClick={() => { setFastMoneyActive(false); setFastMoneyNamesEntered(false); }}>Cancel</button>
                  </div>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <button onClick={() => setFastMoneyHidePlayer1(v => !v)}>{fastMoneyHidePlayer1 ? 'Unhide P1' : 'Hide P1'}</button>
                  </div>
                </>
              ) : (
                <div>
                  <button onClick={() => { resetEverything(); }}>Continue</button>
                </div>
              )}
            </div>
            <div style={{display:'flex', justifyContent:'center', marginTop:10}}>
              <div
                className={"fm-timer" + (fastMoneyTimerRunning ? ' running' : '')}
                onClick={() => { toggleFastMoneyTimer(); }}
                role="button"
                aria-pressed={fastMoneyTimerRunning}
                aria-label={fastMoneyTimerRunning ? `Timer running ${fastMoneyTimeLeft} seconds` : `Timer stopped ${fastMoneyTimeLeft} seconds`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  textAlign: 'center',
                  color: '#fffbea',
                  background: 'radial-gradient(circle at 35% 30%, #226aa8 0%, #0f5486 45%, #053856 100%)',
                  border: '6px solid #8b6a00',
                  boxShadow: '0 10px 30px rgba(2,30,60,0.6), 0 0 22px rgba(6,90,150,0.18) inset',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  ...(fastMoneyTimerRunning ? { animation: 'fm-pulse 1s infinite linear' } : {}),
                }}
              >
                {fastMoneyTimeLeft}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
