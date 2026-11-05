import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const lessons = [
  { id:'polite', title:'Polite-ish beginnings', subtitle:'For when you are still pretending to be civil', level:'Easy', emoji:'🥐', phrases:[
    {fr:'Je voudrais un café, s\'il vous plaît.',pron:'zhuh voo-dreh uhn kah-fay, seel voo pleh',literal:'I would like a coffee, if it pleases you.',meaning:'I would like a coffee, please.',note:'A genuinely useful phrase. We do teach those occasionally.'},
    {fr:'Laissez-moi tranquille.',pron:'leh-say mwah trahn-keel',literal:'Leave me peaceful.',meaning:'Leave me alone.',note:'The polite version. Keep it in your pocket for awkward moments.'},
    {fr:'Je suis crevé.',pron:'zhuh swee kruh-vay',literal:'I am burst / flat-out.',meaning:'I am exhausted.',note:'Crevé is informal. Use crevée if the speaker is female.'}
  ]},
  { id:'irritation', title:'Mildly miffed', subtitle:'The patience bar is starting to flicker', level:'Medium', emoji:'😑', phrases:[
    {fr:'Tu me fatigues.',pron:'too muh fah-teeg',literal:'You tire me.',meaning:'You are doing my head in.',note:'A wonderfully efficient way to say someone is exhausting.'},
    {fr:'J\'en ai marre.',pron:'zhahn ay mahr',literal:'I have had enough of it.',meaning:'I am fed up.',note:'One of the most useful everyday expressions in this entire course.'},
    {fr:'Ça suffit maintenant !',pron:'sah sue-fee mah(n)-tuh-nahn',literal:'That is enough now!',meaning:'That's enough now!',note:'Firm, clear, and suitable for a surprising number of situations.'}
  ]},
  { id:'fedup', title:'Absolutely fed up', subtitle:'The customer-service smile has left the building', level:'Spicy', emoji:'🌶️', phrases:[
    {fr:'Foutez-moi la paix !',pron:'foo-tay mwah lah peh',literal:'Give me peace!',meaning:'Leave me the hell alone!',note:'Blunt and rude. This is the vous form, but it is not remotely polite.'},
    {fr:'Va te faire foutre !',pron:'vah tuh fair footr',literal:'Go get yourself f***ed.',meaning:'Go fuck yourself!',note:'Very offensive. Best admired from a safe distance.'},
    {fr:'Tu me casses les couilles.',pron:'too muh kass lay koo-yuh',literal:'You are breaking my balls.',meaning:'You are doing my fucking head in.',note:'Very vulgar and informal. Not one for the school newsletter.'}
  ]},
  { id:'creative', title:'Creative hostility', subtitle:'A little poetry, a lot of questionable intent', level:'Expert', emoji:'🍍', phrases:[
    {fr:'Va t\'asseoir sur un cactus !',pron:'vah tah-swahr sewr uhn kak-tews',literal:'Go sit on a cactus!',meaning:'Go squat on a cactus!',note:'Understandable and gloriously silly. Not a standard French idiom.'},
    {fr:'Va manger un sac de merde !',pron:'vah mahn-zhay uhn sak duh mehrd',literal:'Go eat a bag of shit!',meaning:'Go eat a bag of shit!',note:'A deliberately ridiculous insult, not a fixed traditional expression.'},
    {fr:'J\'espère que ta prochaine merde sera un ananas.',pron:'zheh-spehr kuh tah proh-shen mehrd suh-rah uhn ah-nah-nahs',literal:'I hope your next turd will be a pineapple.',meaning:'I hope your next shit is a pineapple.',note:'Not a recognised French saying. It is our own deeply regrettable contribution.'}
  ]}
];

const questions = [
  {q:'Someone keeps interrupting your coffee break. What do you say?',a:['Foutez-moi la paix !','Je voudrais un croissant.','Il pleut des cordes.'],correct:0,why:'Correct. You are asking to be left in peace. The coffee remains sacred.'},
  {q:'What does “J\'en ai marre” mean?',a:['I have a horse.','I am fed up.','I want more jam.'],correct:1,why:'Exactly. It is a natural, common way to say you have had enough.'},
  {q:'Which phrase means “I am exhausted”?',a:['Je suis crevé.','Je suis une baguette.','Je mange la lune.'],correct:0,why:'Correct. Crevé is informal for exhausted.'},
  {q:'Which phrase is the most vulgar?',a:['Laissez-moi tranquille.','Ça suffit maintenant.','Va te faire foutre !'],correct:2,why:'Yes. Very offensive. Use only if you understand the consequences.'}
];

function App(){
  const [tab,setTab]=useState('learn');
  const [lessonId,setLessonId]=useState(null);
  const [phraseIndex,setPhraseIndex]=useState(0);
  const [quizIndex,setQuizIndex]=useState(0);
  const [choice,setChoice]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [quizDone,setQuizDone]=useState(false);
  const [xp,setXp]=useState(()=>Number(localStorage.getItem('duomingo-xp')||0));
  const [completed,setCompleted]=useState(()=>JSON.parse(localStorage.getItem('duomingo-completed')||'[]'));
  const [learned,setLearned]=useState(()=>JSON.parse(localStorage.getItem('duomingo-learned')||'[]'));
  const [showLiteral,setShowLiteral]=useState(true);
  const [toast,setToast]=useState('');

  useEffect(()=>localStorage.setItem('duomingo-xp',String(xp)),[xp]);
  useEffect(()=>localStorage.setItem('duomingo-completed',JSON.stringify(completed)),[completed]);
  useEffect(()=>localStorage.setItem('duomingo-learned',JSON.stringify(learned)),[learned]);

  const lesson=lessons.find(l=>l.id===lessonId);
  const phrase=lesson?.phrases[phraseIndex];
  const progress=Math.round((completed.length/lessons.length)*100);
  const totalPhrases=lessons.reduce((n,l)=>n+l.phrases.length,0);

  function openLesson(id){setLessonId(id);setPhraseIndex(0);setTab('lesson');}
  function markLearned(p){if(!learned.includes(p.fr)){setLearned(v=>[...v,p.fr]);setXp(v=>v+5);setToast('+5 XP. Votre français progresse !');setTimeout(()=>setToast(''),1800);}}
  function nextPhrase(){if(phraseIndex<lesson.phrases.length-1){setPhraseIndex(v=>v+1);}else{if(!completed.includes(lesson.id)){setCompleted(v=>[...v,lesson.id]);setXp(v=>v+20);}setLessonId(null);setTab('learn');setToast('Lesson complete! +20 XP');setTimeout(()=>setToast(''),2200);}}
  function startQuiz(){setQuizIndex(0);setChoice(null);setAnswered(false);setQuizDone(false);setTab('quiz');}
  function submitAnswer(){if(choice===null)return;setAnswered(true);if(choice===questions[quizIndex].correct)setXp(v=>v+10);}
  function nextQuestion(){if(quizIndex<questions.length-1){setQuizIndex(v=>v+1);setChoice(null);setAnswered(false);}else{setQuizDone(true);}}
  function resetQuiz(){setQuizIndex(0);setChoice(null);setAnswered(false);setQuizDone(false);}

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={()=>{setTab('learn');setLessonId(null)}} aria-label="DuoMingo home"><span className="brand-mark">🦩</span><span>Duo<span>Mingo</span><small>FRENCH FOR THE THOROUGHLY FED UP</small></span></button>
      <div className="stats"><span className="stat">⚡ {xp} XP</span><span className="stat">🔥 {completed.length} / {lessons.length}</span></div>
    </header>

    <main>
      {tab==='learn' && <div className="layout">
        <section className="welcome">
          <div><p className="eyebrow">BONJOUR, TROUBLE</p><h1>Learn French.<br/><em>Lose your patience</em><br/>in style.</h1><p className="intro">The language course for people who have already tried being polite.</p><button className="primary" onClick={()=>openLesson(lessons.find(l=>!completed.includes(l.id))?.id||lessons[0].id)}>Continue learning <span>→</span></button></div>
          <div className="hero-art"><div className="sun"></div><div className="speech">FOUTEZ-MOI<br/>LA PAIX !</div><div className="flamingo">🦩</div><div className="coffee">☕</div></div>
        </section>
        <section className="progress-card"><div className="progress-head"><div><p className="eyebrow">YOUR FRENCH REVOLUTION</p><h2>Course progress</h2></div><strong>{progress}%</strong></div><div className="progress-track"><div style={{width:progress+'%'}}/></div><p className="muted">{completed.length} of {lessons.length} lessons completed · {learned.length} of {totalPhrases} phrases collected</p></section>
        <div className="section-heading"><div><p className="eyebrow">THE CURRICULUM</p><h2>Choose your level of outrage</h2></div><span className="tiny-stamp">100% educational-ish</span></div>
        <div className="lesson-grid">{lessons.map((l,i)=><button className={'lesson-card '+(completed.includes(l.id)?'done':'')} key={l.id} onClick={()=>openLesson(l.id)}><div className="lesson-top"><span className="lesson-emoji">{l.emoji}</span><span className="level">{l.level}</span></div><h3>{String(i+1).padStart(2,'0')} · {l.title}</h3><p>{l.subtitle}</p><div className="lesson-bottom"><span>{l.phrases.length} phrases</span><span>{completed.includes(l.id)?'✓ Completed':'Start lesson →'}</span></div></button>)}</div>
        <section className="daily"><div className="daily-icon">🧠</div><div><p className="eyebrow">DAILY REMINDER</p><h3>“La patience est une vertu.”</h3><p>Patience is a virtue. Shame we left ours on the bus.</p></div></section>
      </div>}

      {tab==='lesson' && lesson && phrase && <section className="lesson-view">
        <button className="back" onClick={()=>{setTab('learn');setLessonId(null)}}>← Back to lessons</button>
        <div className="lesson-progress"><span>{lesson.emoji} {lesson.title}</span><span>{phraseIndex+1} / {lesson.phrases.length}</span></div>
        <div className="mini-track"><div style={{width:((phraseIndex+1)/lesson.phrases.length*100)+'%'}}/></div>
        <div className="phrase-card"><p className="eyebrow">SAY IT WITH FEELING</p><div className="phrase-emoji">{lesson.emoji}</div><h1>{phrase.fr}</h1><p className="pronunciation">🔊 {phrase.pron}</p><div className="translation"><div><span className="label">NATURAL MEANING</span><strong>{phrase.meaning}</strong></div><button className="text-button" onClick={()=>setShowLiteral(v=>!v)}>{showLiteral?'Hide':'Show'} literal translation</button>{showLiteral&&<div className="literal"><span className="label">WORD-FOR-WORD</span>{phrase.literal}</div>}</div><p className="note">💡 {phrase.note}</p><button className="primary full" onClick={()=>{markLearned(phrase);nextPhrase()}}>{phraseIndex===lesson.phrases.length-1?'Finish lesson':'Got it, next phrase'} <span>→</span></button></div>
      </section>}

      {tab==='quiz' && <section className="quiz-view">
        <button className="back" onClick={()=>setTab('learn')}>← Back to lessons</button>
        {!quizDone?<><div className="quiz-heading"><p className="eyebrow">THE PATIENCE EXAM</p><h1>Prove you've been<br/><em>paying attention.</em></h1><div className="mini-track"><div style={{width:((quizIndex+1)/questions.length*100)+'%'}}/></div><p className="muted">Question {quizIndex+1} of {questions.length}</p></div><div className="question-card"><h2>{questions[quizIndex].q}</h2><div className="answers">{questions[quizIndex].a.map((a,i)=><button key={a} className={'answer '+(choice===i?'selected':'')+(answered&&i===questions[quizIndex].correct?' correct':'')+(answered&&choice===i&&i!==questions[quizIndex].correct?' wrong':'')} onClick={()=>!answered&&setChoice(i)}>{String.fromCharCode(65+i)}. {a}</button>)}</div>{answered?<div className="feedback"><strong>{choice===questions[quizIndex].correct?'Très bien !':'Pas tout à fait !'}</strong><p>{questions[quizIndex].why}</p><button className="primary full" onClick={nextQuestion}>{quizIndex===questions.length-1?'See results':'Next question →'}</button></div>:<button className="primary full" disabled={choice===null} onClick={submitAnswer}>Check answer</button>}</div></>:<div className="result-card"><div className="result-emoji">🏆</div><p className="eyebrow">EXAMINÉ ET LÉGÈREMENT DANGEREUX</p><h1>Well played,<br/><em>Pascal.</em></h1><p>You survived the patience exam. Your French is improving. Your manners are another matter.</p><button className="primary full" onClick={()=>{resetQuiz();setTab('learn')}}>Back to learning</button></div>}
      </section>}

      {tab==='phrases' && <section className="phrasebook"><p className="eyebrow">YOUR POCKET-SIZED SURVIVAL KIT</p><h1>The phrasebook</h1><p className="intro">Every phrase you've met so far, ready for deployment.</p>{lessons.flatMap(l=>l.phrases).map(p=><article className="phrase-row" key={p.fr}><div><h3>{p.fr}</h3><p className="pronunciation">{p.pron}</p><strong>{p.meaning}</strong><p className="muted">{p.literal}</p></div><span className="collected">{learned.includes(p.fr)?'✓ Learned':'☆'}</span></article>)}</section>}
    </main>
    {tab!=='lesson'&&<nav className="bottom-nav"><button className={tab==='learn'?'active':''} onClick={()=>setTab('learn')}>🗺️<span>Learn</span></button><button className={tab==='quiz'?'active':''} onClick={startQuiz}>🎯<span>Quiz</span></button><button className={tab==='phrases'?'active':''} onClick={()=>setTab('phrases')}>📖<span>Phrasebook</span></button></nav>}
    {toast&&<div className="toast">{toast}</div>}
    <footer>DUOMINGO · APPRENDRE À DIRE N'IMPORTE QUOI · MADE WITH QUESTIONABLE INTENT 🇫🇷</footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>);
