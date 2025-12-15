import React from 'react';

export default function SurveySelection(props) {
  const {
    surveys,
    completedSurveys,
    setSelectedSurvey,
    setSurveySelected,
    setRound,
    setRevealed,
    setQuestionVisible,
    resetGame,
    startFastMoneyFromSelection,
    teamAScore,
    teamBScore,
    teamAName,
    teamBName,
    teamAStrikes,
    teamBStrikes,
    currentTeam,
    roundMultiplier,
    setRoundMultiplier,
    setCurrentTeam,
    showToast,
  } = props;

  // `surveyWrappings` and `surveyRibbons` may be provided by App to determine visuals
  const { surveyWrappings = [], surveyRibbons = [] } = props;
  

  return (
    <div className="app">
      {props.onEditSurveys && (
        <button className="edit-button" title="Edit surveys" onClick={() => props.onEditSurveys?.()} aria-label="Edit surveys">📝</button>
      )}
      {/* note: surveyWrappings/surveyRibbons are passed from App to visually style cards */}
      <div className="header-row">
        <div className="team-wrap">
          <div className={`team ${currentTeam === 'A' ? 'active-team' : ''}`}><h2>{teamAName || "Team A"}</h2><p>{teamAScore}</p></div>
          <div className="team-strikes">
            {Array.from({ length: teamAStrikes }).map((_, i) => (
              <img key={i} src="/images/x_large.png" alt="X" className="strike-small" />
            ))}
          </div>
        </div>

        <div className="header-center">
          <div className="header-title">CHOOSE A SURVEY</div>
        </div>

        <div className="team-wrap">
          <div className={`team ${currentTeam === 'B' ? 'active-team' : ''}`}><h2>{teamBName || "Team B"}</h2><p>{teamBScore}</p></div>
          <div className="team-strikes">
            {Array.from({ length: teamBStrikes }).map((_, i) => (
              <img key={i} src="/images/x_large.png" alt="X" className="strike-small" />
            ))}
          </div>
        </div>
      </div>
      <div style={{display:'flex', justifyContent:'center', marginTop:10}}>
        <div className="mult-buttons">
          <button className={"mult-btn " + (roundMultiplier === 1 ? 'active' : '')} onClick={() => setRoundMultiplier(1)}>Normal</button>
          <button className={"mult-btn " + (roundMultiplier === 2 ? 'active' : '')} onClick={() => setRoundMultiplier(2)}>Double</button>
          <button className={"mult-btn " + (roundMultiplier === 3 ? 'active' : '')} onClick={() => setRoundMultiplier(3)}>Triple</button>
        </div>
      </div>
      <div className="survey-grid">
        {surveys.map((survey, index) => {
          const isCompleted = completedSurveys.includes(survey.name);
          return (
              <button
                key={index}
                className={`survey-card wrap-${(surveyWrappings[index]||1)} ribbon-${(surveyRibbons[index]||1)} ${isCompleted ? 'completed' : ''}`}
                disabled={isCompleted}
                onClick={() => { setSelectedSurvey(survey); setSurveySelected(true); setRound(0); setRevealed([]); setQuestionVisible(false); }}
              >
                <div className="survey-name" style={{fontSize:18, fontWeight:900}}>{survey.name}</div>
                <span aria-hidden className="bow" />
              </button>
          );
        })}
      </div>
      <div style={{display:'flex', gap:12, justifyContent:'center', marginTop:14}}>
        <button onClick={resetGame}>Reset Game</button>
        <button onClick={startFastMoneyFromSelection} disabled={teamAScore === teamBScore}>Fast Money</button>
      </div>
    </div>
  );
}
