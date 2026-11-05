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
    {fr:'Ça suffit maintenant !',pron:'sah sue-fee mah(n)-tuh-nahn',literal:'That is enough now!',meaning:'That\'s enough now!',note:'Firm, clear, and suitable for a surprising number of situations.'}
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
  ]},
  { id:'sarcasm', title:'Sarcasm & fake politeness', subtitle:'Smile sweetly while your soul leaves the room', level:'Advanced', emoji:'🙃', phrases:[
    {fr:'Quelle brillante idée !',pron:'kell bree-yahnt ee-day',literal:'What a brilliant idea!',meaning:'What a brilliant idea! (Usually the opposite.)',note:'The words are positive. Your tone does all the damage. Deliver slowly with a perfectly straight face.'},
    {fr:'C\'est vraiment passionnant...',pron:'say vray-mahn pah-see-yoh-nahn',literal:'It is truly fascinating...',meaning:'This is absolutely riveting... (It is not.)',note:'A classic bit of dry sarcasm. The longer the pause, the stronger the effect.'},
    {fr:'Tu as toujours le don de choisir le bon moment.',pron:'tew ah too-zhoor luh don duh shwah-zeer luh bon moh-mahn',literal:'You always have the gift of choosing the right moment.',meaning:'You really know how to pick your moments.',note:'Polite grammar, devastating subtext. Best used when someone interrupts you.'},
    {fr:'Mais quelle surprise !',pron:'may kell sewr-preez',literal:'But what a surprise!',meaning:'Well, what a surprise. (Not surprised.)',note:'A wonderfully compact way to express absolutely no surprise whatsoever.'}
  ]},
  { id:'afterwork', title:'After work: drinks & peace', subtitle:'You have clocked off. Humanity can wait.', level:'Essential', emoji:'🍺', phrases:[
    {fr:'Une bière pression, s\'il vous plaît.',pron:'ewn byair press-yohn, seel voo pleh',literal:'A draught beer, if it pleases you.',meaning:'A draught beer, please.',note:'A useful bar phrase. Une bière blonde is a lager; une bière brune is a dark beer.'},
    {fr:'Un whisky, sans glace, s\'il vous plaît.',pron:'uhn wees-kee, sahn glass, seel voo pleh',literal:'A whisky, without ice, if it pleases you.',meaning:'A whisky, no ice, please.',note:'Sans glace means without ice. Simple, clear, and straight to the point.'},
    {fr:'L\'addition, s\'il vous plaît.',pron:'lah-dee-syohn, seel voo pleh',literal:'The addition, if it pleases you.',meaning:'The bill, please.',note:'Essential when it is time to leave. In France, service is generally included, but rounding up for good service is appreciated.'},
    {fr:'Laisse-moi finir ma bière tranquille.',pron:'less mwah fee-neer mah byair trahn-keel',literal:'Let me finish my beer peacefully.',meaning:'Leave me alone until I have finished my beer.',note:'Informal and very natural. Laisse-moi is for one person you know. The beer has priority.'},
    {fr:'Ne me parle pas avant que j\'aie fini mon joint.',pron:'nuh muh parl pah ah-vahn kuh zhay fee-nee mon zhwan',literal:'Do not speak to me before I have finished my joint.',meaning:'Don\'t talk to me until I have finished my joint.',note:'Direct and colloquial. Avant que takes the subjunctive here: j\'aie fini. A very clear boundary, delivered with maximum calm.'},
    {fr:'Je décompresse. On verra ça demain.',pron:'zhuh day-kom-press. on veh-rah sah duh-man',literal:'I am decompressing. We will see that tomorrow.',meaning:'I am unwinding. We can deal with that tomorrow.',note:'A useful way to declare the working day officially deceased.'}
  ]}
  ,{ id:'swearing', title:'Swearing: the essentials', subtitle:'Five little words with enormous emotional range', level:'Foundations', emoji:'🤬', phrases:[
    {fr:'Merde !',pron:'mehrd',literal:'Shit!',meaning:'Shit! / Damn it!',note:'Common, versatile and vulgar. Often an exclamation of frustration rather than an insult.'},
    {fr:'Putain !',pron:'pew-tan',literal:'Whore!',meaning:'Fuck! / Bloody hell!',note:'Extremely common in informal speech, but literally a very offensive word. Context and tone matter.'},
    {fr:'Bordel !',pron:'bor-del',literal:'Brothel!',meaning:'For fuck’s sake! / What a bloody mess!',note:'A punchy exclamation. Also used in expressions like quel bordel ! for what a mess.'},
    {fr:'Ça fait chier.',pron:'sah feh shee-ay',literal:'That makes shit.',meaning:'That’s fucking annoying.',note:'Vulgar and everyday. The phrase describes something irritating, not necessarily a person.'},
    {fr:'C’est chiant.',pron:'say shee-ahn',literal:'It is shitting.',meaning:'It’s a pain in the arse / It’s boring.',note:'Informal and mildly vulgar. A useful everyday complaint.'}
  ]},
  { id:'british', title:'The British insult translator', subtitle:'For muppets, pillocks and weapons-grade plonkers', level:'Cultural exchange', emoji:'🫖', phrases:[
    {fr:'Espèce d’abruti !',pron:'ess-pess dah-brew-tee',literal:'Species of imbecile!',meaning:'You absolute idiot / You muppet!',note:'A natural French insult for someone behaving foolishly. Not a word-for-word translation of muppet.'},
    {fr:'Quel crétin !',pron:'kell cray-tan',literal:'What a cretin!',meaning:'What a prat!',note:'A recognisable insult, less explosive than the strongest options.'},
    {fr:'Gros con !',pron:'groh kon',literal:'Big idiot!',meaning:'You massive arsehole!',note:'Very rude. Con is a strong everyday insult in France. Do not mistake its shortness for politeness.'},
    {fr:'Tête de nœud !',pron:'tet duh nuh',literal:'Knot head!',meaning:'You knobhead!',note:'A colourful insult with a similar comic feel. Still rude, but often less severe than gros con.'},
    {fr:'Quel boulet !',pron:'kell boo-lay',literal:'What a cannonball!',meaning:'What a liability / What a muppet!',note:'Boulet is often used for someone who is a burden or keeps making things difficult.'},
    {fr:'Pauvre type !',pron:'povr teep',literal:'Poor type!',meaning:'What a sad loser.',note:'Dismissive and contemptuous. The tone does a lot of the work.'}
  ]},
  { id:'workplace', title:'Office diplomacy for the furious', subtitle:'Professional wording. Unprofessional thoughts.', level:'Survival', emoji:'💼', phrases:[
    {fr:'Je vais prendre quelques minutes pour y réfléchir.',pron:'zhuh veh prahndr kell-kuh mee-newt poor ee ray-flay-sheer',literal:'I will take a few minutes to think about it.',meaning:'I need a moment before I respond.',note:'Perfectly professional. Also buys you time not to say what you are thinking.'},
    {fr:'Ce n’est pas exactement ce que j’avais demandé.',pron:'suh nay pah eg-zakt-mahn suh kuh zhah-vay duh-mahn-day',literal:'That is not exactly what I had asked.',meaning:'That is absolutely not what I asked for.',note:'Polite correction with a very clear message.'},
    {fr:'Je préfère que nous en restions là.',pron:'zhuh pray-fair kuh noo zahn ress-tyohn lah',literal:'I prefer that we stay there.',meaning:'I think we should leave it there.',note:'A calm way to end a conversation that is going nowhere.'},
    {fr:'Merci pour cette contribution… intéressante.',pron:'mehr-see poor set kon-tree-bew-syohn an-tay-ray-sahnt',literal:'Thank you for this… interesting contribution.',meaning:'Thank you for that… interesting input.',note:'The pause is essential. Deploy only when you can maintain a straight face.'},
    {fr:'Nous n’avons manifestement pas la même définition de “urgent”.',pron:'noo nah-von mah-nee-fest-mahn pah lah mem day-fee-nee-syohn duh ewhr-zhahn',literal:'We evidently do not have the same definition of “urgent”.',meaning:'Your emergency is not my emergency.',note:'A longer, more diplomatic way to establish priorities and boundaries.'}
  ]}

];

const questions = [
  {q:'Someone keeps interrupting your coffee break. What do you say?',a:['Foutez-moi la paix !','Je voudrais un croissant.','Il pleut des cordes.'],correct:0,why:'Correct. You are asking to be left in peace. The coffee remains sacred.'},
  {q:'What does “J\'en ai marre” mean?',a:['I have a horse.','I am fed up.','I want more jam.'],correct:1,why:'Exactly. It is a natural, common way to say you have had enough.'},
  {q:'Which phrase means “I am exhausted”?',a:['Je suis crevé.','Je suis une baguette.','Je mange la lune.'],correct:0,why:'Correct. Crevé is informal for exhausted.'},
  {q:'Which French exclamation often means “Fuck!” or “Bloody hell!”?',a:['Putain !','Bonjour !','Merci !'],correct:0,why:'Putain is very common in informal speech, but it is still a strong vulgarity.'},
  {q:'How could you call someone a “knobhead” with comic flair?',a:['Tête de nœud !','Une bière !','À demain !'],correct:0,why:'Tête de nœud has a similar colourful feel. Not a literal translation.'},
  {q:'Which phrase politely ends a pointless conversation?',a:['Je préfère que nous en restions là.','Je veux une baguette.','Quel beau temps !'],correct:0,why:'It means “I think we should leave it there”. Office diplomacy at its finest.'},
  {q:'Which phrase means “That’s fucking annoying”?',a:['Ça fait chier.','Je suis ravi.','À votre santé.'],correct:0,why:'Ça fait chier is vulgar and commonly used to describe something irritating.'},
  {q:'Which phrase means “What a liability / what a muppet”?',a:['Quel boulet !','Une table.','Je décompresse.'],correct:0,why:'Boulet is a colourful way to describe someone who makes things difficult.'}
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
