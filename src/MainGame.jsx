import React from 'react';
import { motion } from 'framer-motion';

export default function MainGame(props) {
  const {
    continueToSelection,
    showContinue,
    markIncorrect,
    awardPoints,
    pointsToAdd,
    setCurrentTeam,
    currentTeam,
    resetGame,
    teamAScore,
    teamBScore,
    teamAStrikes,
    teamBStrikes,
    teamAName,
    teamBName,
    showGiantX,
    giantXCount,
    current,
    questionVisible,
    setQuestionVisible,
    editingAnswers,
    answerTexts,
    setAnswerTexts,
    revealAnswer,
    revealed,
  } = props;

  // Keyboard shortcuts: Numpad1..9 reveal answers 1..9 (zero-based index), Numpad0 = strike
  React.useEffect(() => {
    function onKeyDown(e) {
      if (editingAnswers) return; // don't interfere while editing
      // Only handle numpad keys (also accept top-row digits as convenience)
      const code = e.code;
      if (code === 'Numpad0') {
        e.preventDefault();
        markIncorrect();
        return;
      }
      const m = code.match(/(?:Numpad|Digit)([1-9])/);
      if (m) {
        const n = parseInt(m[1], 10);
        const idx = n - 1;
        const answers = (current && current.answers) || [];
        if (idx >= 0 && idx < answers.length) {
          e.preventDefault();
          revealAnswer(idx);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editingAnswers, current, revealAnswer, markIncorrect]);

  return (
    <div className="app">
      <div className="header-row">
        <div className="team-wrap">
          <div
            className={`team ${currentTeam === 'A' ? 'active-team' : ''}`}
            onClick={() => setCurrentTeam('A')}
            style={{ cursor: 'pointer' }}
            title="Click to set starting team"
          >
            <h2>{teamAName || "Team A"}</h2>
            <p>{teamAScore}</p>
          </div>
          <div className="team-strikes">
            {Array.from({ length: teamAStrikes }).map((_, i) => (
              <img key={i} src="/images/x_large.png" alt="X" className="strike-small" />
            ))}
          </div>
        </div>

        <img src="/images/logo.png" alt="Family Feud" className="logo" />

        <div className="team-wrap">
          <div
            className={`team ${currentTeam === 'B' ? 'active-team' : ''}`}
            onClick={() => setCurrentTeam('B')}
            style={{ cursor: 'pointer' }}
            title="Click to set starting team"
          >
            <h2>{teamBName || "Team B"}</h2>
            <p>{teamBScore}</p>
          </div>
          <div className="team-strikes">
            {Array.from({ length: teamBStrikes }).map((_, i) => (
              <img key={i} src="/images/x_large.png" alt="X" className="strike-small" />
            ))}
          </div>
        </div>
      </div>

      <div className="header-info">
        <div className="question question-box" onClick={() => { if (!questionVisible) setQuestionVisible(true); }} style={{cursor: questionVisible ? 'default' : 'pointer'}}>
          {questionVisible ? (
            <h2>{current.question}</h2>
          ) : (
            <h2 style={{opacity:0.85}}>Click to reveal question</h2>
          )}
        </div>
      </div>

      {showGiantX && (
        <div className="giant-x-flash">
          {Array.from({ length: giantXCount }).map((_, i) => (
            <img key={i} src="/images/x_large.png" alt="X" />
          ))}
        </div>
      )}

      <div className="answers-grid">
        {/* Split answers into two vertical columns like the show */}
        {(() => {
          const answers = current.answers || [];
          const half = Math.ceil(answers.length / 2);
          const left = answers.slice(0, half);
          const right = answers.slice(half);
          return (
            <>
              <div className="answers-col">
                {left.map((a, idx) => {
                  const i = idx; // original index
                  return (
                    <motion.div key={i} className={`answer ${revealed.includes(i) ? "correct" : ""}`}>
                      {editingAnswers ? (
                        <div className="content" style={{display:'flex', flexDirection:'column', gap:8}}>
                          <input className="answer-input" value={answerTexts[i] || ''} onChange={(e)=>{ const copy=[...answerTexts]; copy[i]=e.target.value; setAnswerTexts(copy); }} />
                          <div style={{alignSelf:'flex-end'}} className="points">{a.points}</div>
                        </div>
                      ) : (
                        <div className={`tile ${revealed.includes(i) ? 'flipped' : ''}`} onClick={() => revealAnswer(i)}>
                          <div className="face front">
                            <div className="front-content"><div className="front-num">{i + 1}</div></div>
                          </div>
                          <div className="face back">
                            <div className="content">
                              <div className="text">{answerTexts[i] ?? a.text}</div>
                              <div className="points">{a.points}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="answers-col">
                {right.map((a, idx) => {
                  const i = half + idx;
                  return (
                    <motion.div key={i} className={`answer ${revealed.includes(i) ? "correct" : ""}`}>
                      {editingAnswers ? (
                        <div className="content" style={{display:'flex', flexDirection:'column', gap:8}}>
                          <input className="answer-input" value={answerTexts[i] || ''} onChange={(e)=>{ const copy=[...answerTexts]; copy[i]=e.target.value; setAnswerTexts(copy); }} />
                          <div style={{alignSelf:'flex-end'}} className="points">{a.points}</div>
                        </div>
                      ) : (
                        <div className={`tile ${revealed.includes(i) ? 'flipped' : ''}`} onClick={() => revealAnswer(i)}>
                          <div className="face front">
                            <div className="front-content"><div className="front-num">{i + 1}</div></div>
                          </div>
                          <div className="face back">
                            <div className="content">
                              <div className="text">{answerTexts[i] ?? a.text}</div>
                              <div className="points">{a.points}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
                {/* If there are an odd number of answers, render a blank, non-clickable placeholder
                    to visually balance the two columns (no number, not clickable). */}
                {answers.length % 2 === 1 && (
                  <motion.div key="blank" className="answer placeholder" aria-hidden="true">
                    <div className="tile">
                      <div className="face front">
                        <div className="front-content"><div className="front-num"></div></div>
                      </div>
                      <div className="face back">
                        <div className="content">
                          <div className="text"></div>
                          <div className="points"></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          );
        })()}
      </div>

      <div className="bottom-controls">
        {showContinue ? (
          <button onClick={continueToSelection}>Continue</button>
        ) : (
          <>
            <button onClick={markIncorrect} disabled={!currentTeam} title={!currentTeam ? 'Select a team first' : 'Mark Incorrect'}>Mark Incorrect</button>
            <button onClick={awardPoints}>Award Points ({pointsToAdd})</button>
            <button onClick={resetGame}>Reset Game</button>
          </>
        )}
      </div>
    </div>
  );
}
