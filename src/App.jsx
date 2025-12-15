import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import "./App.css";
import SurveySelection from "./SurveySelection";
import StartScreen from "./StartScreen";
import FastMoney from "./FastMoney";
import MainGame from "./MainGame";
import HowToPlay from "./Help/HowToPlay";
import FastMoneyHelp from "./Help/FastMoneyHelp";
import SurveysEditor from "./SurveysEditor";

import surveysDefault from "./data/surveys";
export default function FamilyFeudApp() {
  // Screens & survey state
  const [gameStarted, setGameStarted] = useState(false);
  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [surveySelected, setSurveySelected] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [completedSurveys, setCompletedSurveys] = useState([]);
  // Survey present styling assignments (wrapping + ribbon), assigned when a new game starts
  const [surveyWrappings, setSurveyWrappings] = useState([]); // values 1-8
  const [surveyRibbons, setSurveyRibbons] = useState([]);   // values 1-8

  // Game state
  const [round, setRound] = useState(0);
  const [revealed, setRevealed] = useState([]);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [teamAStrikes, setTeamAStrikes] = useState(0);
  const [teamBStrikes, setTeamBStrikes] = useState(0);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const [roundMultiplier, setRoundMultiplier] = useState(1);
  // surveys state (editable in-app)
  const [surveysState, setSurveysState] = useState(surveysDefault);
  const [showSurveysEditor, setShowSurveysEditor] = useState(false);
  const [stealVictim, setStealVictim] = useState(null); // 'A' or 'B' when a team has 3 strikes and other team gets one steal attempt
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef(null);

  // Help modals
  const [showHelp, setShowHelp] = useState(false);
  const [showFMHelp, setShowFMHelp] = useState(false);

  const handleHelpToggle = () => {
    if (fastMoneyActive) {
      setShowFMHelp((s) => !s);
    } else {
      setShowHelp((s) => !s);
    }
  };

  const showToast = useCallback((msg) => {
    try {
      setToastMessage(msg);
      setToastVisible(true);
      if (toastTimeoutRef.current) { clearTimeout(toastTimeoutRef.current); toastTimeoutRef.current = null; }
      toastTimeoutRef.current = setTimeout(() => {
        setToastVisible(false);
        toastTimeoutRef.current = null;
      }, 5000);
    } catch (e) { console.error('showToast failed', e); }
  }, []);

  useEffect(() => {
    return () => { if (toastTimeoutRef.current) { clearTimeout(toastTimeoutRef.current); toastTimeoutRef.current = null; } };
  }, []);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [userMuted, setUserMuted] = useState(false);

  // Giant strike flash state
  const [giantXCount, setGiantXCount] = useState(0);
  const [showGiantX, setShowGiantX] = useState(false);

  // Fast Money state
  const [fastMoneyActive, setFastMoneyActive] = useState(false);
  const [fastMoneyPlayer, setFastMoneyPlayer] = useState(0); // 0 or 1
  const [fastMoneyPoints, setFastMoneyPoints] = useState([Array(5).fill(0), Array(5).fill(0)]);
  const [fastMoneyAnswers, setFastMoneyAnswers] = useState([Array(5).fill(""), Array(5).fill("")]);
  const [fastMoneyTotals, setFastMoneyTotals] = useState([0, 0]);
  const [fastMoneyHidePlayer1, setFastMoneyHidePlayer1] = useState(false);
  const [fastMoneyFinished, setFastMoneyFinished] = useState(false);
  const [fastMoneyLeader, setFastMoneyLeader] = useState(null); // 0 = A, 1 = B
  const [fastMoneyPlayerNames, setFastMoneyPlayerNames] = useState(["", ""]);
  const [fastMoneyScore, setFastMoneyScore] = useState([0, 0]); // separate fast money scores per team
  const [fastMoneyCelebrate, setFastMoneyCelebrate] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [postAwardMode, setPostAwardMode] = useState(false);
  const [editingAnswers, setEditingAnswers] = useState(false);
  const [answerTexts, setAnswerTexts] = useState([]);

  // Fast Money timer
  const [fastMoneyNamesEntered, setFastMoneyNamesEntered] = useState(false);
  const [fastMoneyTimeLeft, setFastMoneyTimeLeft] = useState(0);
  const fastMoneyDurations = [20, 25];
  const fastMoneyTimerRef = useRef(null);
  const timerBellRef = useRef(null);
  const [fastMoneyTimerRunning, setFastMoneyTimerRunning] = useState(false);

  // Animated displayed scores for visual tallying
  const [displayTeamAScore, setDisplayTeamAScore] = useState(0);
  const [displayTeamBScore, setDisplayTeamBScore] = useState(0);
  const scoreAnimRef = useRef(null);
  const fmScoreAnimRef = useRef([null, null]);
  const [displayFMScore, setDisplayFMScore] = useState([0,0]);

  // Sounds (lazy-load as blobs to avoid browser cache API errors)
  const buzzSound = useRef(null);
  const dingSound = useRef(null);
  const applauseSound = useRef(null);
  const musicRef = useRef(null);

  useEffect(() => {
    const urls = {
      buzz: "/sounds/buzz.mp3",
      ding: "/sounds/ding.mp3",
      applause: "/sounds/applause.mp3",
      timerBell: "/sounds/timerBell.mp3",
      music: "/sounds/familyFeud.mp3",
    };
    const objectUrls = [];
    let cancelled = false;

    async function load(url, ref, loop = false) {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const objUrl = URL.createObjectURL(blob);
        objectUrls.push(objUrl);
        if (!cancelled) {
          ref.current = new Audio(objUrl);
          ref.current.loop = loop;
          ref.current.preload = "auto";
        }
      } catch (err) {
        console.error("Audio fetch failed, falling back to URL:", url, err);
        if (!cancelled) {
          ref.current = new Audio(url);
          ref.current.loop = loop;
          ref.current.preload = "auto";
        }
      }
    }

    load(urls.buzz, buzzSound);
    load(urls.ding, dingSound);
    load(urls.applause, applauseSound);
    load(urls.timerBell, timerBellRef);
    load(urls.music, musicRef, true);

    return () => {
      cancelled = true;
      objectUrls.forEach((u) => URL.revokeObjectURL(u));
      [buzzSound, dingSound, applauseSound, musicRef].forEach((r) => {
        try {
          if (r.current) {
            r.current.pause?.();
            r.current.src = "";
            r.current = null;
          }
        } catch (e) {
          // ignore cleanup errors
        }
      });
    };
    // run once
  }, []);

  // Try to autoplay music on the start screen (may be blocked by browser autoplay policies).
  useEffect(() => {
    if (!gameStarted && musicRef.current && !musicPlaying && !userMuted) {
      const tryPlay = async () => {
        try {
          await musicRef.current.play();
          setMusicPlaying(true);
        } catch (e) {
          // Autoplay blocked; user can toggle using the mute button.
        }
      };
      const id = setTimeout(tryPlay, 150);
      return () => clearTimeout(id);
    }
  }, [gameStarted, musicPlaying, userMuted]);

  // LocalStorage persistence
  const STORAGE_KEY = "family-feud-game-v1";

  const loadSaved = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (!s) return;
      // Do NOT auto-start the game on load — return to start screen after refresh
      setGameStarted(false);
      setTeamAName(s.teamAName || "");
      setTeamBName(s.teamBName || "");
      setSurveySelected(!!s.surveySelected);
      if (s.selectedSurveyName) {
        const found = (s.surveys || surveysState).find((x) => x.name === s.selectedSurveyName);
        if (found) setSelectedSurvey(found);
      }
      setCompletedSurveys(s.completedSurveys || []);
      setRound(s.round || 0);
      setRevealed(s.revealed || []);
      setTeamAScore(s.teamAScore || 0);
      setTeamBScore(s.teamBScore || 0);
      setTeamAStrikes(s.teamAStrikes || 0);
      setTeamBStrikes(s.teamBStrikes || 0);
      setCurrentTeam(s.currentTeam ?? null);
      setPointsToAdd(s.pointsToAdd || 0);
      setMusicPlaying(!!s.musicPlaying);
      // fast money restore
      if (s.fastMoneyActive) setFastMoneyActive(true);
      setFastMoneyPlayer(s.fastMoneyPlayer || 0);
      setFastMoneyPoints(s.fastMoneyPoints || [Array(5).fill(0), Array(5).fill(0)]);
      setFastMoneyTotals(s.fastMoneyTotals || [0, 0]);
      setFastMoneyLeader(typeof s.fastMoneyLeader === 'number' ? s.fastMoneyLeader : null);
      setFastMoneyPlayerNames(s.fastMoneyPlayerNames || ["", ""]);
      setFastMoneyScore(s.fastMoneyScore || [0,0]);
      setFastMoneyAnswers(s.fastMoneyAnswers || [Array(5).fill(""), Array(5).fill("")]);
      setSurveyWrappings(s.surveyWrappings || []);
      setSurveyRibbons(s.surveyRibbons || []);
      setSurveysState(s.surveys || surveysDefault);
      setRoundMultiplier(s.roundMultiplier || 1);
    } catch (e) {
      console.error("Failed to load saved game:", e);
    }
  };

  const saveAll = useCallback(() => {
    try {
      const payload = {
        gameStarted,
        teamAName,
        teamBName,
        surveySelected,
        selectedSurveyName: selectedSurvey?.name || null,
        completedSurveys,
        round,
        revealed,
        teamAScore,
        teamBScore,
        teamAStrikes,
        teamBStrikes,
        currentTeam,
        pointsToAdd,
        musicPlaying,
        fastMoneyActive,
        roundMultiplier,
        fastMoneyPlayer,
        fastMoneyPoints,
        fastMoneyTotals,
        fastMoneyLeader,
        fastMoneyPlayerNames,
        fastMoneyScore,
        fastMoneyAnswers,
        surveyWrappings,
        surveyRibbons,
        surveys: surveysState,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error("Failed to save game:", e);
    }
  }, [
    gameStarted,
    teamAName,
    teamBName,
    surveySelected,
    selectedSurvey,
    completedSurveys,
    round,
    revealed,
    teamAScore,
    teamBScore,
    teamAStrikes,
    teamBStrikes,
    currentTeam,
    pointsToAdd,
    musicPlaying,
    fastMoneyActive,
    roundMultiplier,
    fastMoneyPlayer,
    fastMoneyPoints,
    fastMoneyTotals,
    fastMoneyLeader,
    fastMoneyPlayerNames,
    fastMoneyScore,
    fastMoneyAnswers,
    surveyWrappings,
    surveyRibbons,
    surveysState,
  ]);

  const startGame = (start = true) => {
    // assign unique wrapping + ribbon pairs (1..8 each) for each survey
    // build all possible pairs and shuffle, then take first N
    const pairs = [];
    for (let wi = 1; wi <= 8; wi++) {
      for (let ri = 1; ri <= 8; ri++) {
        pairs.push([wi, ri]);
      }
    }
    // Fisher-Yates shuffle
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = pairs[i]; pairs[i] = pairs[j]; pairs[j] = tmp;
    }
    const count = surveysState.length;
    const chosen = pairs.slice(0, count);
    const w = chosen.map(p => p[0]);
    const r = chosen.map(p => p[1]);
    setSurveyWrappings(w);
    setSurveyRibbons(r);
    setGameStarted(start);
  };

  // Fast Money helpers
  const startFastMoney = () => {
    // generic start (not used) - kept for API
    setFastMoneyActive(true);
    setFastMoneyPlayer(0);
    setFastMoneyPoints([Array(5).fill(0), Array(5).fill(0)]);
    setFastMoneyTotals([0, 0]);
    setFastMoneyPlayerNames(["",""]);
    setFastMoneyLeader(null);
    setFastMoneyNamesEntered(false);
    setFastMoneyAnswers([Array(5).fill(""), Array(5).fill("")]);
    setFastMoneyFinished(false);
  };

  const startFastMoneyFromSelection = () => {
    // determine leader at time of starting fast money
    if (teamAScore === teamBScore) {
      alert("No team is currently leading — Fast Money requires a leading team.");
      return;
    }
    const leader = teamAScore > teamBScore ? 0 : 1;
    setFastMoneyLeader(leader);
    setFastMoneyActive(true);
    setFastMoneyPlayer(0);
    setFastMoneyPoints([Array(5).fill(0), Array(5).fill(0)]);
    setFastMoneyTotals([0, 0]);
    setFastMoneyPlayerNames(["",""]);
    setFastMoneyNamesEntered(false);
    setFastMoneyAnswers([Array(5).fill(""), Array(5).fill("")]);
    setFastMoneyFinished(false);
  };

  const handleFastMoneyPointChange = (player, idx, val) => {
    const copy = fastMoneyPoints.map((arr) => arr.slice());
    const n = Number(val);
    const safe = Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
    copy[player][idx] = safe;
    setFastMoneyPoints(copy);
  };

  // Persist inline answer edits into the selected survey immediately (skip while Fast Money active)
  useEffect(() => {
    if (fastMoneyActive) return;
    if (!selectedSurvey) return;
    if (!answerTexts || answerTexts.length === 0) return;
    const q = selectedSurvey.questions[round];
    if (!q) return;
    // only update when lengths match to avoid clobbering
    if (q.answers.length !== answerTexts.length) return;
    const updatedSurvey = {
      ...selectedSurvey,
      questions: selectedSurvey.questions.map((qq, qi) => {
        if (qi !== round) return qq;
        return {
          ...qq,
          answers: qq.answers.map((ans, i) => ({ ...ans, text: answerTexts[i] ?? ans.text })),
        };
      }),
    };
    // Only update state if the answers actually changed to avoid an update loop.
    setSelectedSurvey((prev) => {
      try {
        if (!prev) return updatedSurvey;
        const prevAnswers = (prev.questions[round].answers || []).map(a => a.text || "");
        const newAnswers = (answerTexts || []).map(a => a || "");
        const same = prevAnswers.length === newAnswers.length && prevAnswers.every((v, i) => v === newAnswers[i]);
        if (same) return prev;
      } catch (e) {
        // if anything goes wrong, fall back to updating
      }
      return updatedSurvey;
    });
  }, [answerTexts, selectedSurvey, round, fastMoneyActive]);

  const submitFastMoneyPlayer = () => {
    const total = fastMoneyPoints[fastMoneyPlayer].reduce((a, b) => a + Number(b), 0);
    const totalsCopy = [...fastMoneyTotals];
    totalsCopy[fastMoneyPlayer] = total;
    setFastMoneyTotals(totalsCopy);
    if (fastMoneyPlayer === 0) {
      setFastMoneyPlayer(1);
    } else {
      const combined = totalsCopy[0] + totalsCopy[1];
      // award combined to the leading team's fast money score (separate from main score)
      if (typeof fastMoneyLeader === 'number') {
        const scores = [...fastMoneyScore];
        scores[fastMoneyLeader] = (scores[fastMoneyLeader] || 0) + combined;
        setFastMoneyScore(scores);
      }
      if (combined > 0) {
        applauseSound.current.currentTime = 0;
        applauseSound.current.play();
      }
      // Celebration if combined >= 200
      if (combined >= 200) {
        try {
          setFastMoneyCelebrate(true);
          // show persistent toast with celebration message (do not auto-hide)
          try { if (toastTimeoutRef.current) { clearTimeout(toastTimeoutRef.current); toastTimeoutRef.current = null; } } catch(e){}
          const leaderName = typeof fastMoneyLeader === 'number' ? (fastMoneyLeader === 0 ? teamAName || 'Team A' : teamBName || 'Team B') : 'Team';
          setToastMessage('Congratulations!');
          setToastVisible(true);
          if (musicRef.current) {
            musicRef.current.currentTime = 0;
            musicRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
          }
          // also set a secondary message in the overlay via state by leaving fastMoneyCelebrate true
        } catch (e) { console.error('celebration play failed', e); }
      } else {
        // not enough points — show a toast
        showToast('Better luck next time');
      }
      // mark finished but stay on FM screen; ensure answers are visible
      setFastMoneyFinished(true);
      setFastMoneyHidePlayer1(false);
      // stop timer
      if (fastMoneyTimerRef.current) { clearInterval(fastMoneyTimerRef.current); fastMoneyTimerRef.current = null; }
    }
  };

  // compute live totals as points change
  useEffect(() => {
    const t0 = fastMoneyPoints[0].reduce((a, b) => a + Number(b || 0), 0);
    const t1 = fastMoneyPoints[1].reduce((a, b) => a + Number(b || 0), 0);
    setFastMoneyTotals([t0, t1]);
  }, [fastMoneyPoints]);

  useEffect(() => {
    loadSaved();
    const handler = () => saveAll();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep answerTexts in sync with selected survey/round
  useEffect(() => {
    if (selectedSurvey) {
      const arr = selectedSurvey.questions[round].answers.map((a) => a.text || "");
      setAnswerTexts(arr);
    } else {
      setAnswerTexts([]);
    }
  }, [selectedSurvey, round]);

  // fast money timer: start when player changes and names entered
  useEffect(() => {
    // When entering Fast Money or switching players, initialize the time left
    // but do NOT automatically start the interval — the timer should start
    // only when the user clicks the timer control.
    if (!fastMoneyActive || !fastMoneyNamesEntered) return;
    // clear any existing running interval
    if (fastMoneyTimerRef.current) {
      clearInterval(fastMoneyTimerRef.current);
      fastMoneyTimerRef.current = null;
    }
    const duration = fastMoneyDurations[fastMoneyPlayer] || 20;
    setFastMoneyTimeLeft(duration);
    setFastMoneyTimerRunning(false);
    // no interval started here; user must click to start
    return () => {
      if (fastMoneyTimerRef.current) { clearInterval(fastMoneyTimerRef.current); fastMoneyTimerRef.current = null; }
    };
  }, [fastMoneyActive, fastMoneyNamesEntered, fastMoneyPlayer]);

  const toggleFastMoneyTimer = useCallback(() => {
    if (!fastMoneyActive || !fastMoneyNamesEntered) return;
    if (fastMoneyTimerRef.current) {
      // pause
      clearInterval(fastMoneyTimerRef.current);
      fastMoneyTimerRef.current = null;
      setFastMoneyTimerRunning(false);
    } else {
      // start or resume
      const duration = fastMoneyTimeLeft > 0 ? fastMoneyTimeLeft : (fastMoneyDurations[fastMoneyPlayer] || 20);
      setFastMoneyTimeLeft(duration);
      setFastMoneyTimerRunning(true);
      fastMoneyTimerRef.current = setInterval(() => {
        setFastMoneyTimeLeft((s) => {
          if (s <= 1) {
            clearInterval(fastMoneyTimerRef.current);
            fastMoneyTimerRef.current = null;
            setFastMoneyTimerRunning(false);
            try { timerBellRef.current?.play(); } catch (e) {}
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
  }, [fastMoneyActive, fastMoneyNamesEntered, fastMoneyPlayer, fastMoneyTimeLeft]);

  // animate team scores when underlying values change; animate FM score/totals live
  useEffect(() => {
    if (scoreAnimRef.current) { clearInterval(scoreAnimRef.current); scoreAnimRef.current = null; }
    const animate = (from, to, setter) => {
      if (from === to) { setter(to); return; }
      const steps = 20;
      const delta = (to - from) / steps;
      let i = 0;
      scoreAnimRef.current = setInterval(() => {
        i++;
        const next = Math.round(from + delta * i);
        setter(next);
        if (i >= steps) { clearInterval(scoreAnimRef.current); scoreAnimRef.current = null; }
      }, 20);
    };
    animate(displayTeamAScore, teamAScore, setDisplayTeamAScore);
    animate(displayTeamBScore, teamBScore, setDisplayTeamBScore);

    // FM display: animate per-player display to either live totals (while active) or awarded fastMoneyScore
    const targetFM = fastMoneyActive ? fastMoneyTotals : fastMoneyScore;
    // clear existing fm intervals
    fmScoreAnimRef.current.forEach((id, idx) => { if (id) { clearInterval(id); fmScoreAnimRef.current[idx] = null; } });
    const animateFM = (from, to, idx) => {
      if (from === to) { setDisplayFMScore(prev => { const n = [...prev]; n[idx] = to; return n; }); return; }
      const steps = 20;
      const delta = (to - from) / steps;
      let i = 0;
      fmScoreAnimRef.current[idx] = setInterval(() => {
        i++;
        const next = Math.round(from + delta * i);
        setDisplayFMScore(prev => { const n = [...prev]; n[idx] = next; return n; });
        if (i >= steps) { clearInterval(fmScoreAnimRef.current[idx]); fmScoreAnimRef.current[idx] = null; }
      }, 20);
    };
    animateFM(displayFMScore[0], targetFM[0], 0);
    animateFM(displayFMScore[1], targetFM[1], 1);

    return () => {
      if (scoreAnimRef.current) { clearInterval(scoreAnimRef.current); scoreAnimRef.current = null; }
      fmScoreAnimRef.current.forEach((id, idx) => { if (id) { clearInterval(id); fmScoreAnimRef.current[idx] = null; } });
    };
  }, [teamAScore, teamBScore, fastMoneyScore, fastMoneyActive, fastMoneyTotals]);

  useEffect(() => {
    saveAll();
  }, [saveAll]);

  const revealAnswer = (index) => {
    if (revealed.includes(index)) return;
    const answer = selectedSurvey.questions[round].answers[index];
    dingSound.current.currentTime = 0;
    dingSound.current.play();
    setRevealed([...revealed, index]);
    setPointsToAdd(pointsToAdd + answer.points);
  };

  const markIncorrect = () => {
    // If we're currently in a steal attempt (stealVictim set), then the opposing team
    // only gets one strike allowed — a single incorrect ends the round and awards
    // the accumulated points back to the victim team.
    // Prevent adding strikes when no team is selected (and we're not in a steal)
    if (!stealVictim && !currentTeam) {
      showToast('Select a team first');
      return;
    }
    if (stealVictim) {
      // currentTeam is the stealing team; any incorrect ends the steal attempt
      const stealingTeam = currentTeam;
      // increment their visible strike (will usually go to 1)
      if (stealingTeam === "A") setTeamAStrikes((s) => s + 1);
      else setTeamBStrikes((s) => s + 1);

      buzzSound.current.currentTime = 0;
      buzzSound.current.play();

      setGiantXCount(1);
      setShowGiantX(true);
      setTimeout(() => {
        setShowGiantX(false);
        // Steal failed — award points to the victim team and enter post-award mode
        const victim = stealVictim;
          const awarded = Math.max(0, Math.floor(pointsToAdd * (roundMultiplier || 1)));
          if (awarded > 0) {
            applauseSound.current.currentTime = 0;
            applauseSound.current.play();
          }
          if (victim === 'A') setTeamAScore((s) => s + awarded);
          else setTeamBScore((s) => s + awarded);
          // show toast for award after the giant X animation is cleared
          setTimeout(() => {
            const name = victim === 'A' ? teamAName || 'Team A' : teamBName || 'Team B';
            showToast(`${name} awarded ${awarded} points${roundMultiplier > 1 ? ` (${roundMultiplier}x)` : ''}`);
          }, 150);
        // cleanup and prepare for post-award UI
        setPointsToAdd(0);
        setPostAwardMode(true);
        setShowContinue(true);
        // reset round-related states
        setStealVictim(null);
        setTeamAStrikes(0);
        setTeamBStrikes(0);
      }, 750);
      return;
    }

    let newStrikes = 0;
    if (currentTeam === "A") {
      newStrikes = teamAStrikes + 1;
      setTeamAStrikes(newStrikes);
    } else {
      newStrikes = teamBStrikes + 1;
      setTeamBStrikes(newStrikes);
    }

    buzzSound.current.currentTime = 0;
    buzzSound.current.play();

    // Flash giant X
    setGiantXCount(newStrikes);
    setShowGiantX(true);
    // Wait for the giant X flash to finish (0.75s) before hiding and showing alert
    setTimeout(() => {
      setShowGiantX(false);
      if (newStrikes >= 3) {
        // Enter steal state: keep the victim's strikes visible, switch turn to other team
        const victim = currentTeam;
        const other = victim === "A" ? "B" : "A";
        // Show a non-blocking toast after the giant X is removed, and switch turn to allow steal
        setTimeout(() => {
          showToast(`${victim === "A" ? teamAName || "Team A" : teamBName || "Team B"} has 3 strikes — other team may steal.`);
        }, 150);
        setStealVictim(victim);
        setCurrentTeam(other);
        // reset the stealing team's strikes to 0 so they start fresh (they get one strike allowed)
        if (other === "A") setTeamAStrikes(0);
        else setTeamBStrikes(0);
        // Keep revealed answers visible after 3 strikes (other team can steal)
        // Do not clear `revealed` or `pointsToAdd` here.
      }
    }, 750);
  };

  const awardPoints = () => {
    const awarded = Math.max(0, Math.floor(pointsToAdd * (roundMultiplier || 1)));
    if (currentTeam === "A") setTeamAScore(teamAScore + awarded);
    else setTeamBScore(teamBScore + awarded);

    if (awarded > 0) {
      applauseSound.current.currentTime = 0;
      applauseSound.current.play();
    }

    // Enter post-award mode: keep unrevealed answers hidden but allow
    // manual clicks to reveal them. Show the Continue button to finish.
    setPointsToAdd(0);
    setTeamAStrikes(0);
    setTeamBStrikes(0);
    setPostAwardMode(true);
    setShowContinue(true);
    // reset multiplier after awarding
    setRoundMultiplier(1);
  };

  const continueToSelection = () => {
    // mark survey completed and return to selection screen
    setCompletedSurveys([...completedSurveys, selectedSurvey.name]);
    setSurveySelected(false);
    setSelectedSurvey(null);
    setRound(0);
    setCurrentTeam(null);
    setShowContinue(false);
    setPostAwardMode(false);
    setQuestionVisible(false);
    // keep revealed visible briefly (they're already revealed)
  };

  const toggleMusic = () => {
    // Robust toggle: guard for musicRef and handle play/pause
    try {
      if (!musicRef.current) {
        setMusicPlaying(false);
        return;
      }
      if (!musicPlaying) {
        // unmute / play
        setUserMuted(false);
        musicRef.current.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
      } else {
        // mute / pause and reset
        setUserMuted(true);
        musicRef.current.pause();
        try { musicRef.current.currentTime = 0; } catch (e) {}
        setMusicPlaying(false);
      }
    } catch (e) {
      console.warn('toggleMusic failed', e);
      setMusicPlaying(false);
    }
  };

  // Ensure music stops whenever the game actually starts — music should only play on the start screen.
  useEffect(() => {
    if (gameStarted && musicRef.current && !musicRef.current.paused) {
      try {
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
      } catch (e) {}
      setMusicPlaying(false);
    }
  }, [gameStarted]);

  const resetGame = () => {
    if (window.confirm("Are you sure you want to reset the game? All progress will be lost.")) {
      setGameStarted(false);
      setSurveySelected(false);
      setSelectedSurvey(null);
      setTeamAName("");
      setTeamBName("");
      setRound(0);
      setRevealed([]);
      setTeamAScore(0);
      setTeamBScore(0);
      setTeamAStrikes(0);
      setTeamBStrikes(0);
      setCurrentTeam(null);
      setPointsToAdd(0);
      setCompletedSurveys([]);
      setMusicPlaying(false);
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
      localStorage.removeItem(STORAGE_KEY);
      // Reset fast money state
      setFastMoneyActive(false);
      setFastMoneyPlayer(0);
      setFastMoneyPoints([Array(5).fill(0), Array(5).fill(0)]);
      setFastMoneyTotals([0, 0]);
      setQuestionVisible(false);
    }
    setShowContinue(false);
    setPostAwardMode(false);
  };

  // Reset everything without a confirmation dialog (used by Fast Money Continue)
  const resetEverything = () => {
    setGameStarted(false);
    setSurveySelected(false);
    setSelectedSurvey(null);
    setTeamAName("");
    setTeamBName("");
    setRound(0);
    setRevealed([]);
    setTeamAScore(0);
    setTeamBScore(0);
    setTeamAStrikes(0);
    setTeamBStrikes(0);
    setCurrentTeam(null);
    setPointsToAdd(0);
    setCompletedSurveys([]);
    setMusicPlaying(false);
    try { musicRef.current?.pause(); musicRef.current.currentTime = 0; } catch(e){}
    localStorage.removeItem(STORAGE_KEY);
    // Reset fast money state
    setFastMoneyActive(false);
    setFastMoneyPlayer(0);
    setFastMoneyPoints([Array(5).fill(0), Array(5).fill(0)]);
    setFastMoneyTotals([0, 0]);
    setFastMoneyAnswers([Array(5).fill(""), Array(5).fill("")]);
    setFastMoneyPlayerNames(["",""]);
    setFastMoneyLeader(null);
    setFastMoneyScore([0,0]);
    setFastMoneyNamesEntered(false);
    setFastMoneyHidePlayer1(false);
    setFastMoneyFinished(false);
    setFastMoneyCelebrate(false);
    setQuestionVisible(false);
    setShowContinue(false);
    setPostAwardMode(false);
    // clear any persistent toast left by celebration
    setToastVisible(false);
    setToastMessage("");
  };

  // --- SCREENS ---

  if (!gameStarted) {
    return (
      <>
        { /* Help button + modal for start screen (and general help) */ }
        <button className="help-button" title="How to play" onClick={handleHelpToggle} aria-label="How to play">?</button>
        {showHelp && (
          <div className="help-modal" onClick={() => setShowHelp(false)}>
            <div className="help-inner" onClick={(e) => e.stopPropagation()}>
              <h2>How to play</h2>
              <HowToPlay />
              <div className="help-close">
                <button onClick={() => setShowHelp(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
        <div className={"toast " + (toastVisible ? 'visible' : '')}>{toastMessage}</div>
        <StartScreen
          musicPlaying={musicPlaying}
          toggleMusic={toggleMusic}
          teamAName={teamAName}
          setTeamAName={setTeamAName}
          teamBName={teamBName}
          setTeamBName={setTeamBName}
          setGameStarted={startGame}
        />
      </>
    );
  }


  // Show Fast Money full-screen even from the survey selection screen
  if (fastMoneyActive) {
    const fmProps = {
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
      fastMoneyCelebrate,
      fastMoneyLeader,
      teamAName,
      teamBName,
      resetEverything,
      fastMoneyTimerRunning,
      toggleFastMoneyTimer,
      fastMoneyTimeLeft,
    };

    return (
      <>
        { /* Help button + FM help modal */ }
        <button className="help-button" title="How to play" onClick={handleHelpToggle} aria-label="How to play">?</button>
        {showFMHelp && (
          <div className="help-modal" onClick={() => setShowFMHelp(false)}>
            <div className="help-inner" onClick={(e) => e.stopPropagation()}>
              <h2>Fast Money</h2>
              <FastMoneyHelp />
              <div className="help-close">
                <button onClick={() => setShowFMHelp(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
        <div className={"toast " + (toastVisible ? 'visible' : '')}>{toastMessage}</div>
        <FastMoney {...fmProps} />
      </>
    );
  }

  // Surveys editor handlers
  const exportSurveys = () => {
    const blob = new Blob([JSON.stringify(surveysState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'surveys.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const resetSurveysToDefault = () => {
    if (!window.confirm('Reset surveys to default? This will remove any edits you made.')) return;
    setSurveysState(surveysDefault);
    setShowSurveysEditor(false);
    showToast('Surveys reset to default');
  };

  if (!surveySelected) {
    return (
      <>
        { /* Help toggle available on survey selection */ }
        <button className="help-button" title="How to play" onClick={handleHelpToggle} aria-label="How to play">?</button>
        {showHelp && (
          <div className="help-modal" onClick={() => setShowHelp(false)}>
            <div className="help-inner" onClick={(e) => e.stopPropagation()}>
              <h2>How to play</h2>
              <HowToPlay />
              <div className="help-close">
                <button onClick={() => setShowHelp(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
        <div className={"toast " + (toastVisible ? 'visible' : '')}>{toastMessage}</div>
        {showSurveysEditor && (
          <SurveysEditor
            surveys={surveysState}
            setSurveys={setSurveysState}
            onClose={() => setShowSurveysEditor(false)}
            onResetToDefault={resetSurveysToDefault}
            onExport={exportSurveys}
            showToast={showToast}
          />
        )}
        <SurveySelection
          surveys={surveysState}
          completedSurveys={completedSurveys}
          surveyWrappings={surveyWrappings}
          surveyRibbons={surveyRibbons}
          setSelectedSurvey={setSelectedSurvey}
          setSurveySelected={setSurveySelected}
          setRound={setRound}
          setRevealed={setRevealed}
          setQuestionVisible={setQuestionVisible}
          resetGame={resetGame}
          startFastMoneyFromSelection={startFastMoneyFromSelection}
          teamAScore={teamAScore}
          teamBScore={teamBScore}
          teamAName={teamAName}
          teamBName={teamBName}
          teamAStrikes={teamAStrikes}
          teamBStrikes={teamBStrikes}
          currentTeam={currentTeam}
          roundMultiplier={roundMultiplier}
          setRoundMultiplier={setRoundMultiplier}
          onEditSurveys={() => setShowSurveysEditor(true)}
          setCurrentTeam={setCurrentTeam}
          showToast={showToast}
        />
      </>
    );
  }

  const current = selectedSurvey.questions[round];

  // Fast Money handled earlier in render path

  const mainProps = {
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
  };

  return (
    <>
      { /* Help toggle available on main game */ }
      <button className="help-button" title="How to play" onClick={handleHelpToggle} aria-label="How to play">?</button>
      {showHelp && (
        <div className="help-modal" onClick={() => setShowHelp(false)}>
          <div className="help-inner" onClick={(e) => e.stopPropagation()}>
            <h2>How to play</h2>
            <ul className="help-list">
              <li>Reveal answers by clicking them; points accumulate for revealed answers.</li>
              <li>Award points to the team at the end of the round.</li>
              <li>Click a team name to set which team is playing.</li>
              <li>After 3 strikes, the other team can steal.</li>
              <li>Double/Triple multipliers apply when selected on the survey selection screen.</li>
            </ul>
            <div className="help-close">
              <button onClick={() => setShowHelp(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div className={"toast " + (toastVisible ? 'visible' : '')}>{toastMessage}</div>
      <MainGame {...mainProps} />
    </>
  );
}
