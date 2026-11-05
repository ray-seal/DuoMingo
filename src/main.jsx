import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import { authClient } from './auth-client.js';
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));

const lessons = [
  {id:'french-words-1',language:'fr',pathOrder:1,singleWords:true,title:'First words: the essentials',subtitle:'Five small words with enormous emotional range',level:'Beginner',emoji:'🧱',phrases:[
    {fr:'Merde',pron:'mehrd',literal:'Shit',meaning:'Shit! / Damn!',note:'A very common swear word. It can express frustration, surprise or anger. It is vulgar, but often used as an everyday exclamation.'},
    {fr:'Putain',pron:'pew-tan',literal:'Whore',meaning:'Fuck! / Bloody hell!',note:'One of the most frequently heard French swear words. Literally offensive, but often used as an exclamation. Context and tone matter.'},
    {fr:'Con',pron:'kohn',literal:'Idiot / fool',meaning:'Idiot / dickhead',note:'A common, blunt insult. Connasse is the feminine form. It can be playful between friends or genuinely insulting.'},
    {fr:'Connard',pron:'koh-nar',literal:'Arsehole',meaning:'Arsehole / bastard',note:'Stronger and more personal than con. Usually directed at a man; connasse is the feminine form.'},
    {fr:'Bordel',pron:'bor-del',literal:'Brothel',meaning:'Fucking hell! / What a mess!',note:'Used as an exclamation or to describe chaos. Quel bordel ! means what a bloody mess!'}
  ]},
  {id:'french-words-2',language:'fr',pathOrder:2,singleWords:true,title:'More words for bad days',subtitle:'Build your vocabulary before building your insults',level:'Beginner',emoji:'🧩',phrases:[
    {fr:'Chiant',pron:'shee-ahn',literal:'A pain / annoying',meaning:'A pain in the arse / annoying',note:'Informal and mildly vulgar. C’est chiant means it is a pain or really annoying.'},
    {fr:'Foutre',pron:'footr',literal:'To fuck',meaning:'To fuck / to do (vulgar)',note:'A very vulgar verb that appears in many common expressions, including foutre la paix. Learn to recognise it before deploying it.'},
    {fr:'Merdeux',pron:'mehr-duh',literal:'Shitty / little shit',meaning:'A little shit / snotty brat',note:'Insulting and dismissive. Often used about someone considered immature or unpleasant.'},
    {fr:'Abruti',pron:'ah-brew-tee',literal:'Imbecile',meaning:'Idiot / moron',note:'A common insult. Espèce d’abruti means you absolute idiot.'},
    {fr:'Crétin',pron:'kray-tan',literal:'Cretin',meaning:'Idiot / moron',note:'A recognisable insult, usually less vulgar than connard.'}
  ]},
  {id:'french-building-1',language:'fr',pathOrder:3,title:'Put the words to work',subtitle:'Turn single swear words into useful little explosions',level:'Beginner',emoji:'🧱',phrases:[
    {fr:'Merde alors !',pron:'mehrd ah-lor',literal:'Shit then!',meaning:'Well, shit! / Bloody hell!',note:'A natural exclamation of surprise or frustration. The alors adds emphasis.'},
    {fr:'Oh putain !',pron:'oh pew-tan',literal:'Oh, whore!',meaning:'Oh, fuck! / Oh, bloody hell!',note:'A very common spoken exclamation. Strong language, but often used as an emotional reaction.'},
    {fr:'Quel bordel !',pron:'kell bor-del',literal:'What a brothel!',meaning:'What a bloody mess!',note:'A common expression for chaos, disorder or a ridiculous situation.'},
    {fr:'C’est chiant.',pron:'say shee-ahn',literal:'It is annoying / a pain.',meaning:'It’s a pain in the arse.',note:'Everyday informal French. Useful when a situation is irritating.'},
    {fr:'Quel con !',pron:'kell kohn',literal:'What an idiot!',meaning:'What a dickhead!',note:'A short, direct insult. Quel connard is stronger and more personal.'}
  ]},
  {id:'french-building-2',language:'fr',pathOrder:4,title:'Short phrases for the fed up',subtitle:'The patience bar is officially flashing red',level:'Elementary',emoji:'😤',phrases:[
    {fr:'J’en ai marre.',pron:'zhahn ay mahr',literal:'I have had enough of it.',meaning:'I’m fed up.',note:'One of the most useful everyday French expressions. Informal, but not especially vulgar.'},
    {fr:'Ça me saoule.',pron:'sah muh sohl',literal:'That bores me / fills me with drink.',meaning:'That does my head in.',note:'Very common informal French. Literally linked to making someone drunk, but used to mean something is annoying.'},
    {fr:'Laisse-moi tranquille.',pron:'less mwah trahn-keel',literal:'Leave me peaceful.',meaning:'Leave me alone.',note:'Direct but not particularly rude. A useful first boundary phrase.'},
    {fr:'C’est n’importe quoi !',pron:'say nahm-por-tuh kwah',literal:'It is anything!',meaning:'That’s complete nonsense!',note:'Extremely useful everyday French. It can express disbelief, criticism or frustration.'},
    {fr:'Tu m’énerves.',pron:'tew may-nairv',literal:'You annoy me.',meaning:'You’re annoying me.',note:'Direct and clear. Less vulgar than telling someone to go away.'}
  ]},

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
  {id:'french-fedup',language:'fr',title:'Pour les gens à bout',subtitle:'Useful phrases for the thoroughly fed up',level:'Survival',emoji:'😤',phrases:[
    {fr:'J’en ai ras le bol !',pron:'zhahn ay rah luh bol',literal:'I have a bowl full of it.',meaning:'I’ve had absolutely enough!',note:'Very common informal French. Stronger and more emphatic than j’en ai marre.'},
    {fr:'Lâche-moi les baskets !',pron:'lash mwah lay bas-ket',literal:'Let go of my trainers!',meaning:'Get off my back!',note:'A familiar informal expression meaning stop bothering me. Nothing to do with actual footwear.'},
    {fr:'Fiche-moi la paix !',pron:'feesh mwah lah peh',literal:'Give me peace!',meaning:'Leave me alone!',note:'Informal and forceful, but milder than fous-moi la paix.'},
    {fr:'J’en peux plus !',pron:'zhahn puh plew',literal:'I can no more.',meaning:'I can’t take any more!',note:'Extremely common spoken French for exhaustion, frustration or general human overload.'},
    {fr:'Ça commence sérieusement à me gonfler.',pron:'sah koh-mahns say-ree-uhz-mahn ah muh gon-flay',literal:'That is seriously starting to inflate me.',meaning:'This is seriously starting to piss me off.',note:'Informal and mildly vulgar. Gonfler quelqu’un means to annoy or get on their nerves.'}
  ]},
  {id:'french-insults',language:'fr',title:'Les insultes du quotidien',subtitle:'A practical guide to calling out absolute nonsense',level:'Spicy',emoji:'🌶️',phrases:[
    {fr:'Quel connard !',pron:'kell koh-nar',literal:'What an arsehole!',meaning:'What a fucking idiot / What an arsehole!',note:'Very vulgar and direct. Connard is commonly aimed at a man; connasse is the feminine form.'},
    {fr:'Espèce d’abruti !',pron:'ess-pess dah-brew-tee',literal:'Species of imbecile!',meaning:'You absolute idiot!',note:'A natural, common insult. Abruti suggests someone is being incredibly stupid.'},
    {fr:'T’as rien dans le crâne !',pron:'tah ree-ehn dahn luh kran',literal:'You have nothing in the skull!',meaning:'There’s nothing going on in your head!',note:'Informal spoken French. T’as is the contraction of tu as.'},
    {fr:'Casse-toi !',pron:'kass twah',literal:'Break yourself!',meaning:'Get lost! / Fuck off!',note:'Blunt and rude. Cassez-vous is the plural or formal form.'},
    {fr:'Va te faire voir !',pron:'vah tuh fair vwar',literal:'Go get yourself seen!',meaning:'Get lost! / Go to hell!',note:'Dismissive, but less explicit than va te faire foutre.'}
  ]},
  {id:'french-feral',language:'fr',title:'Le mode sauvage',subtitle:'For when polite society has left the premises',level:'Feral',emoji:'🦝',phrases:[
    {fr:'Tu te fous de ma gueule ?',pron:'tew tuh foo duh mah guhl',literal:'Are you making fun of my face?',meaning:'Are you taking the piss out of me?',note:'Very informal and vulgar. Used when someone seems to be taking liberties or talking nonsense.'},
    {fr:'C’est pas bientôt fini, ce bordel ?',pron:'say pah byan-toh fee-nee suh bor-del',literal:'Is this mess not going to finish soon?',meaning:'Are you going to pack this bloody nonsense in?',note:'Very colloquial. Dropping ne is normal in everyday spoken French.'},
    {fr:'Mais t’es complètement malade !',pron:'may tay kom-plet-mahn mah-lad',literal:'But you are completely ill!',meaning:'You’re absolutely bloody mad!',note:'Informal and emphatic, often used in disbelief rather than literally.'},
    {fr:'Faut arrêter les conneries !',pron:'foh ah-ray-tay lay kon-ree',literal:'It is necessary to stop the stupidities!',meaning:'Stop this fucking nonsense!',note:'Very colloquial and vulgar. Faut is a spoken contraction of il faut.'},
    {fr:'Tu me prends pour un jambon ?',pron:'tew muh prahn poor uhn zhahm-bohn',literal:'Are you taking me for a ham?',meaning:'Do you think I’m an idiot? / Are you trying to fool me?',note:'A genuine French expression. Être pris pour un jambon means being treated like a fool.'}
  ]},
  {id:'french-sarcastic',language:'fr',title:'Le sarcasme à la française',subtitle:'A raised eyebrow can do most of the work',level:'Advanced',emoji:'🙄',phrases:[
    {fr:'C’est pas le couteau le plus aiguisé du tiroir.',pron:'say pah luh koo-toh luh plew ay-gwee-zay dew tee-rwar',literal:'It is not the sharpest knife in the drawer.',meaning:'Not the sharpest tool in the box.',note:'A familiar French equivalent. Usually teasing or insulting, depending on delivery.'},
    {fr:'On n’est pas sortis de l’auberge !',pron:'ohn nay pah sor-tee duh loh-berzh',literal:'We have not left the inn!',meaning:'We’re not out of the woods yet!',note:'A genuine idiom used when a problem is far from solved.'},
    {fr:'Quelle délicatesse !',pron:'kell day-lee-kah-tess',literal:'What delicacy!',meaning:'How tactless! / Well, that was subtle!',note:'The words sound complimentary. Tone can make the meaning entirely different.'},
    {fr:'C’est d’une intelligence rare.',pron:'say dew-nehn-tel-ee-zhahns rahr',literal:'That is of a rare intelligence.',meaning:'That’s a spectacularly stupid thing to do.',note:'A sarcastic construction. The delivery tells the listener that rare does not mean impressive.'},
    {fr:'Bravo, quelle performance...',pron:'brah-voh kell pair-for-mahns',literal:'Well done, what a performance...',meaning:'Well done. That was a spectacular disaster.',note:'Can be sincere, but with a pause and raised eyebrow it becomes dry sarcasm.'}
  ]},
  {id:'french-boundaries',language:'fr',title:'Les limites sont posées',subtitle:'Useful ways to say no, stop and absolutely not',level:'Essential',emoji:'🛑',phrases:[
    {fr:'Ça suffit. Arrête maintenant.',pron:'sah swee-fee ah-ret man-tuh-nahn',literal:'That is enough. Stop now.',meaning:'That’s enough. Stop it now.',note:'Clear and firm. Useful when you need someone to stop immediately.'},
    {fr:'Ne me parle pas sur ce ton.',pron:'nuh muh parl pah sewr suh tohn',literal:'Do not speak to me in that tone.',meaning:'Don’t speak to me like that.',note:'A direct boundary. Keeping ne makes the phrase sound firmer.'},
    {fr:'Je ne suis pas d’accord.',pron:'zhuh nuh swee pah dah-kor',literal:'I am not of agreement.',meaning:'I don’t agree.',note:'A useful, neutral disagreement. You can be firm without swearing.'},
    {fr:'Occupe-toi de tes affaires.',pron:'oh-kewp twah duh tay zah-fair',literal:'Occupy yourself with your business.',meaning:'Mind your own business.',note:'Direct and dismissive. The vous form is occupez-vous de vos affaires.'},
    {fr:'Laisse tomber. Ça n’en vaut pas la peine.',pron:'less tom-bay sah nahn voh pah lah pen',literal:'Let it fall. It is not worth the trouble.',meaning:'Forget it. It isn’t worth the effort.',note:'A useful way to disengage from an argument going nowhere.'}
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

  ,{id:'british-basics',language:'en',title:'British insults: the foundations',subtitle:'A masterclass in beautifully unnecessary vocabulary',level:'Home turf',emoji:'🫖',phrases:[
    {fr:'You absolute muppet.',pron:'yoo ab-suh-loot mup-it',literal:'You are a complete puppet.',meaning:'You absolute idiot.',note:'Muppet is a familiar British insult. Often comic rather than genuinely hostile.'},
    {fr:'You daft pillock.',pron:'yoo daft pil-ock',literal:'You foolish person.',meaning:'You silly idiot.',note:'Pillock is distinctly British and rude, but usually not the nuclear option.'},
    {fr:'What a complete plonker.',pron:'wot uh kum-pleet plonk-er',literal:'What a complete fool.',meaning:'What an absolute idiot.',note:'Plonker is mild-to-medium British insult territory. Best delivered with disappointment.'},
    {fr:'You absolute weapon.',pron:'yoo ab-suh-loot wep-un',literal:'You are an actual weapon.',meaning:'You are spectacularly stupid or chaotic.',note:'Modern British slang. Context can make it affectionate or properly cutting.'},
    {fr:'Could you be any more of a prat?',pron:'kood yoo bee en-ee mor uhv uh prat',literal:'Could you be more foolish?',meaning:'You are being a complete idiot.',note:'Prat is rude but fairly everyday. The question format adds theatrical disbelief.'}
  ]},
  {id:'british-poetry',language:'en',title:'Weapons-grade British insults',subtitle:'An advanced qualification in verbal craftsmanship',level:'Highly unnecessary',emoji:'🎓',phrases:[
    {fr:'You absolute walnut.',pron:'yoo ab-suh-loot wall-nut',literal:'You are a walnut.',meaning:'You utter idiot.',note:'A harmless, absurd insult. The sillier the noun, the more comic the effect.'},
    {fr:'You rancid little turnip.',pron:'yoo ran-sid lit-ul turn-ip',literal:'You unpleasant small root vegetable.',meaning:'You deeply irritating fool.',note:'Invented insult. Not a fixed expression, just vegetable-based disappointment.'},
    {fr:'Your brain has the structural integrity of wet cardboard.',pron:'yor brayn haz thuh struk-chuh-rul in-teg-ri-tee uhv wet kard-bord',literal:'Your thinking organ is poorly constructed.',meaning:'That was spectacularly stupid.',note:'A long-form insult for when a simple idiot simply will not do.'},
    {fr:'You magnificent spanner.',pron:'yoo mag-nif-ih-sent span-er',literal:'You impressive tool.',meaning:'You glorious fool.',note:'Spanner is British slang for an idiot. Magnificent makes it oddly affectionate.'}
  ]},
  {id:'spanish-survival',language:'es',title:'Spanish survival swearing',subtitle:'A tiny starter kit for a very long day',level:'Starter',emoji:'🌶️',phrases:[
    {fr:'¡Mierda!',pron:'myer-dah',literal:'Shit!',meaning:'Shit! / Damn it!',note:'Common vulgar exclamation. Used for frustration, surprise or a mistake.'},
    {fr:'¡Joder!',pron:'ho-der',literal:'To fuck!',meaning:'Fuck! / For fuck’s sake!',note:'Very common in Spain and strongly informal. Intensity depends on tone and context.'},
    {fr:'Estoy hasta las narices.',pron:'es-toy as-tah las nah-ree-ses',literal:'I am up to the nostrils.',meaning:'I am absolutely fed up.',note:'A familiar Spanish expression for having had enough.'},
    {fr:'Déjame en paz.',pron:'deh-hah-meh en pahs',literal:'Leave me in peace.',meaning:'Leave me alone.',note:'Useful and direct. The peaceful option before the vocabulary gets spicy.'},
    {fr:'Una cerveza, por favor.',pron:'oo-nah ser-veh-sah por fah-vor',literal:'A beer, please.',meaning:'A beer, please.',note:'Priorities. In Spain, cerveza is beer. You can ask for una caña for a small draught beer.'}
  ]}

  ,{id:'french-public',language:'fr',title:'Getting around without losing it',subtitle:'Stations, queues and public transport',level:'Useful',emoji:'🚇',phrases:[
    {fr:'Excusez-moi, je cherche la gare.',pron:'ex-kew-zay mwah, zhuh shersh lah gahr',literal:'Excuse me, I am looking for the station.',meaning:'Excuse me, I’m looking for the station.',note:'A polite way to ask for directions. Add s’il vous plaît to soften the request.'},
    {fr:'C’est par où, s’il vous plaît ?',pron:'say par oo, seel voo pleh',literal:'It is by where, if it pleases you?',meaning:'Which way is it, please?',note:'A useful, natural question when you need directions.'},
    {fr:'Je suis perdu. Vous pouvez m’aider ?',pron:'zhuh swee pair-dew. voo poo-vay may-day',literal:'I am lost. Can you help me?',meaning:'I’m lost. Can you help me?',note:'Perdu is masculine; perdue is feminine. The pronunciation is the same.'},
    {fr:'Est-ce que cette place est libre ?',pron:'ess kuh set plahs eh leebr',literal:'Is this seat free?',meaning:'Is this seat taken?',note:'Handy on trains, buses and in cafés.'},
    {fr:'Je fais la queue depuis vingt minutes.',pron:'zhuh feh lah kuh duh-pwee van mee-newt',literal:'I make the queue since twenty minutes.',meaning:'I’ve been queuing for twenty minutes.',note:'A sentence that works particularly well when your patience has packed its bags.'}
  ]},
  {id:'german-survival',language:'de',title:'German: genug ist genug',subtitle:'Precision-engineered frustration',level:'Starter',emoji:'🇩🇪',phrases:[
    {fr:'Ich habe die Nase voll.',pron:'ikh hah-buh dee nah-zuh fol',literal:'I have the nose full.',meaning:'I’ve had it up to here.',note:'A common idiom meaning you are completely fed up.'},
    {fr:'Lass mich in Ruhe!',pron:'lass mikh in roo-uh',literal:'Let me in peace!',meaning:'Leave me alone!',note:'Informal singular. Use Lassen Sie mich in Ruhe for the formal version.'},
    {fr:'So ein Quatsch!',pron:'zoh ine kvatch',literal:'Such nonsense!',meaning:'What a load of rubbish!',note:'A useful everyday dismissal. Less aggressive than the strongest swear words.'},
    {fr:'Ein Bier, bitte.',pron:'ine beer bit-tuh',literal:'A beer, please.',meaning:'A beer, please.',note:'Short, simple and very useful.'},
    {fr:'Sprich mich nicht an, bis ich mein Bier ausgetrunken habe.',pron:'shprikh mikh nikht an biss ikh mine beer owss-guh-troon-ken hah-buh',literal:'Do not speak to me until I have drunk my beer up.',meaning:'Don’t talk to me until I’ve finished my beer.',note:'A long sentence for a very important boundary. German compound words are only the beginning.'}
  ]},
  {id:'british-decency',language:'en',title:'Basic human decency',subtitle:'A tiny island of manners in a sea of utter nonsense',level:'Essential',emoji:'🌸',phrases:[
    {fr:'Please.',pron:'pleez',literal:'A polite request marker.',meaning:'Please.',note:'Compulsory British equipment. Even a request to move a wheelie bin may require it.'},
    {fr:'Thank you.',pron:'thank-yoo',literal:'An expression of gratitude.',meaning:'Thank you.',note:'Always thank the bus driver. Even if the journey involved near-death experiences.'},
    {fr:'Sorry, are you alright?',pron:'sor-ee, ar yoo awl-ryt',literal:'An apology followed by a welfare check.',meaning:'Sorry, are you okay?',note:'Can be used when someone bumps into you. You may also apologise to the doorframe.'},
    {fr:'After you.',pron:'af-ter yoo',literal:'You may proceed before me.',meaning:'Please go first.',note:'A small act of courtesy. Often accompanied by an elaborate doorway dance.'},
    {fr:'No worries, you’re welcome.',pron:'noh wur-eez, yor wel-kum',literal:'There is no problem; you are welcome.',meaning:'No problem at all.',note:'A friendly response to thanks. British politeness levels remain operational.'}
  ]},
  {id:'british-apologies',language:'en',title:'Sorry for absolutely everything',subtitle:'Taking responsibility for events you did not cause',level:'Survival',emoji:'🙏',phrases:[
    {fr:'Sorry, I didn’t see you there.',pron:'sor-ee, eye did-unt see yoo thair',literal:'An apology for not noticing someone.',meaning:'Sorry, I didn’t notice you.',note:'Frequently said when somebody else walks directly into you.'},
    {fr:'I’m terribly sorry to bother you.',pron:'aym tair-uh-blee sor-ee tuh both-er yoo',literal:'I regret interrupting you.',meaning:'Excuse me, may I ask you something?',note:'A very polite opener. Can precede a perfectly reasonable request or a complaint of volcanic proportions.'},
    {fr:'Sorry, was that my fault?',pron:'sor-ee, woz that my fawlt',literal:'An apology while checking responsibility.',meaning:'Sorry, did I cause that?',note:'The British instinct is to apologise first and investigate the wreckage later.'},
    {fr:'I’m sure it was an honest mistake.',pron:'aym shoor it woz an on-ist mis-tayk',literal:'I believe the error was accidental.',meaning:'It’s okay, I think you made an honest mistake.',note:'A generous phrase. Tone determines whether you mean it or are preparing a strongly worded email.'},
    {fr:'No, no, it’s absolutely fine.',pron:'noh noh, its ab-suh-loot-lee fine',literal:'Everything is entirely acceptable.',meaning:'It’s fine.',note:'May mean it is genuinely fine, or that the speaker has mentally written a 900-word complaint.'}
  ]},
  {id:'british-pub',language:'en',title:'Pub diplomacy',subtitle:'Keeping the peace between the crisps and the fruit machine',level:'Cultural exchange',emoji:'🍺',phrases:[
    {fr:'You alright, mate?',pron:'yoo awl-ryt mayt',literal:'Are you well, friend?',meaning:'Hello, how are you?',note:'Often a greeting rather than a request for a detailed medical history.'},
    {fr:'Could I get a pint, please?',pron:'kood eye get uh pynt pleez',literal:'May I have a pint?',meaning:'Could I have a pint, please?',note:'Polite ordering. The please is not optional, even when the queue is six deep.'},
    {fr:'It’s my round.',pron:'its my rownd',literal:'I am buying the group’s drinks this turn.',meaning:'I’m buying the next drinks.',note:'A social promise with financial consequences. Keep track of whose round it is.'},
    {fr:'Let’s not make a thing of it.',pron:'lets not mayk uh thing uhv it',literal:'Let us not turn this into an issue.',meaning:'Let’s leave it alone and move on.',note:'A useful de-escalation phrase when pub diplomacy is wobbling.'},
    {fr:'I think we’ve both had enough for tonight.',pron:'eye think weev both had ee-nuf for tuh-nyt',literal:'We have each reached our limit this evening.',meaning:'Let’s call it a night.',note:'A tactful exit line. Often the wisest sentence spoken in the building.'}
  ]},
  {id:'british-backhanded',language:'en',title:'Compliments with a suspicious aftertaste',subtitle:'Technically kind. Emotionally complicated.',level:'Advanced',emoji:'🎀',phrases:[
    {fr:'Well, that’s certainly one way of doing it.',pron:'well thats sur-tun-lee wun way uhv doo-ing it',literal:'That is one possible method.',meaning:'I would not have done it that way.',note:'A classic diplomatic response. The word certainly carries a suspicious amount of weight.'},
    {fr:'You’re looking very well.',pron:'yor look-ing ver-ee well',literal:'You appear healthy.',meaning:'You look good.',note:'Usually sincere, but context and delivery can turn it into a wonderfully ambiguous observation.'},
    {fr:'That’s an interesting choice.',pron:'thats an in-truh-sting choys',literal:'That choice is interesting.',meaning:'I would never have chosen that.',note:'A polite phrase with a wide emotional range. Use responsibly.'},
    {fr:'I admire your confidence.',pron:'eye ad-my-er yor kon-fi-dens',literal:'I respect your self-assurance.',meaning:'You are certainly confident.',note:'Can be genuine praise or a velvet-wrapped expression of disbelief.'},
    {fr:'You’ve certainly made an impression.',pron:'yoov sur-tun-lee mayd an im-presh-un',literal:'You have caused people to notice you.',meaning:'People will remember that.',note:'The impression may be excellent. The sentence carefully declines to confirm this.'}
  ]},
  {id:'british-absurd',language:'en',title:'The zoological insult department',subtitle:'For when ordinary vocabulary has failed you',level:'Highly unnecessary',emoji:'🐿️',phrases:[
    {fr:'I’m sorry you have the IQ of a dilapidated squirrel. It’s not your fault.',pron:'aym sor-ee yoo hav the eye-kyoo uhv uh dih-lap-ih-day-tid skwir-ul. its not yor fawlt',literal:'Your intelligence is compared with a worn-out squirrel, with added sympathy.',meaning:'You are spectacularly foolish, and I am pretending to feel sorry for you.',note:'An original absurdist insult from the DuoMingo phrasebook. Dilapidated squirrels are not a recognised scientific IQ category.'},
    {fr:'Your father was a hamster and your mother smells of elderberries.',pron:'yor fah-thur woz uh ham-ster and yor muh-thur smellz uhv el-der-ber-eez',literal:'An accusation involving a hamster and elderberries.',meaning:'A deliberately ridiculous insult about someone’s family.',note:'A playful reworking of the famous Monty Python insult. This version is not a standard British expression.'},
    {fr:'Go shit out a hedgehog.',pron:'goh shit owt uh hedj-hog',literal:'A highly improbable digestive instruction.',meaning:'Go away. I am thoroughly fed up with you.',note:'Invented comic abuse, not a conventional idiom. Hedgehogs are advised to remain uninvolved.'},
    {fr:'You absolute weapons-grade plum.',pron:'yoo ab-suh-loot wep-uns-grayd plum',literal:'A plum of exceptional weapon quality.',meaning:'You are an extraordinary idiot.',note:'Freshly manufactured British nonsense. No actual weapons certification is implied.'},
    {fr:'You rancid little turnip.',pron:'yoo ran-sid lit-ul turn-ip',literal:'A small, unpleasant root vegetable.',meaning:'You are deeply irritating.',note:'An invented vegetable-based insult. Best delivered with the grave disappointment of a disappointed headteacher.'}
  ]},
  {id:'british-queue',language:'en',title:'Queue etiquette and public fury',subtitle:'The sacred British art of being cross in silence',level:'Survival',emoji:'🚶',phrases:[
    {fr:'I think there’s a queue.',pron:'eye think thairz uh kyoo',literal:'I believe people are waiting in line.',meaning:'There is a queue. Please join the back.',note:'A gentle correction. The unspoken rules of queuing are extremely serious.'},
    {fr:'Sorry, I believe you were before me.',pron:'sor-ee, eye buh-leev yoo wur buh-for mee',literal:'I think you arrived earlier than I did.',meaning:'You were ahead of me in the queue.',note:'Polite, fair and quietly protective of the queue.'},
    {fr:'I’ve been waiting here for ages.',pron:'ayv bin way-ting heer for ay-jiz',literal:'I have waited here for a long time.',meaning:'I’ve been waiting a very long time.',note:'A standard complaint. The exact duration may be measured in geological eras.'},
    {fr:'There’s no need to push.',pron:'thairz noh need tuh push',literal:'Pushing is unnecessary.',meaning:'Please stop pushing.',note:'A calm boundary. The tone may become less calm if repeated.'},
    {fr:'Well, this is taking forever.',pron:'well this iz tay-king for-ev-er',literal:'This is taking an extremely long time.',meaning:'This is taking ages.',note:'A universal queue-side observation, usually delivered to absolutely nobody in particular.'}
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
  const [language,setLanguage]=useState('fr');
  const [session,setSession]=useState(null);
  const [accountOpen,setAccountOpen]=useState(false);
  const [authMode,setAuthMode]=useState('signin');
  const [authEmail,setAuthEmail]=useState('');
  const [authPassword,setAuthPassword]=useState('');
  const [authName,setAuthName]=useState('');
  const [authBusy,setAuthBusy]=useState(false);
  const [authError,setAuthError]=useState('');
  const [syncStatus,setSyncStatus]=useState('Saved on this device');
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
  const [exerciseIndex,setExerciseIndex]=useState(0);
  const [exerciseChoice,setExerciseChoice]=useState(null);
  const [exerciseAnswered,setExerciseAnswered]=useState(false);
  const [mistakes,setMistakes]=useState([]);
  const [lessonPhase,setLessonPhase]=useState('intro');
  const [reviewIndex,setReviewIndex]=useState(0);

  useEffect(()=>localStorage.setItem('duomingo-xp',String(xp)),[xp]);
  useEffect(()=>localStorage.setItem('duomingo-completed',JSON.stringify(completed)),[completed]);
  useEffect(()=>localStorage.setItem('duomingo-learned',JSON.stringify(learned)),[learned]);


  useEffect(()=>{
    if(!authClient) return;
    let live=true;
    authClient.getSession().then(async result=>{
      const current=result?.data?.session;
      if(!live || !current) return;
      setSession(current);
      try {
        const tokenResult=await authClient.token();
        const token=tokenResult?.data?.token;
        if(!token) return;
        const response=await fetch('/api/progress',{headers:{Authorization:'Bearer '+token}});
        if(!response.ok) throw new Error('Sync unavailable');
        const remote=await response.json();
        setCompleted(v=>[...new Set([...v,...(remote.completedLessons||[])])]);
        setLearned(v=>[...new Set([...v,...(remote.learnedPhrases||[])])]);
        setXp(v=>Math.max(v,Number(remote.xp)||0));
        setSyncStatus('Synced to your account');
      } catch { setSyncStatus('Signed in · sync will retry'); }
    }).catch(()=>{});
    return ()=>{live=false;};
  },[]);

  useEffect(()=>{
    if(!session || !authClient) return;
    const timer=setTimeout(async()=>{
      try {
        const tokenResult=await authClient.token();
        const token=tokenResult?.data?.token;
        if(!token) return;
        const response=await fetch('/api/progress',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({xp,completedLessons:completed,learnedPhrases:learned})});
        if(!response.ok) throw new Error('Sync failed');
        setSyncStatus('Synced to your account');
      } catch { setSyncStatus('Sync paused · will retry'); }
    },1200);
    return ()=>clearTimeout(timer);
  },[session,xp,completed,learned]);

  async function handleAuthSubmit(event){
    event.preventDefault();setAuthBusy(true);setAuthError('');
    try {
      if(!authClient) throw new Error('Neon Auth is not configured in this deployment.');
      const result=authMode==='signup'
        ? await authClient.signUp.email({email:authEmail,password:authPassword,name:authName||authEmail.split('@')[0]})
        : await authClient.signIn.email({email:authEmail,password:authPassword});
      if(result?.error) throw new Error(result.error.message||'Authentication failed.');

      // Neon Auth can return the authenticated user with the sign-in response
      // before its session lookup has refreshed. Prefer the direct response,
      // then fall back to the persisted browser session.
      let activeSession=result?.data?.session||null;
      let activeUser=result?.data?.user||null;
      if(!activeSession){
        const current=await authClient.getSession();
        activeSession=current?.data?.session||null;
        activeUser=activeUser||current?.data?.user||null;
      }
      if(activeSession || activeUser){
        setSession(activeSession||{user:activeUser});
        setAccountOpen(false);
        setSyncStatus('Signed in · syncing progress…');
      } else {
        throw new Error(authMode==='signup'
          ? 'Your account request was accepted, but no session was returned. Switch to Sign in and log in with the account you just created.'
          : 'Your details were accepted, but Safari did not return an active session. Please close and reopen DuoMingo, then try signing in again.');
      }
    } catch(error){setAuthError(error.message||'Could not sign in. Please try again.');}
    finally{setAuthBusy(false);}
  }
  async function handleSignOut(){await authClient?.signOut();setSession(null);setSyncStatus('Saved on this device');}

  const courseLessons=lessons.filter(l=>(l.language||'fr')===language).sort((a,b)=>(a.pathOrder??(a.language==='en'?100:20))-(b.pathOrder??(b.language==='en'?100:20)));
  const lesson=lessons.find(l=>l.id===lessonId);
  const phrase=lesson?.phrases[phraseIndex];
  const currentExercises=lesson&&phrase?phraseExercises(phrase,lesson):[];
  const currentExercise=currentExercises[exerciseIndex];
  const progress=Math.round((completed.filter(id=>courseLessons.some(l=>l.id===id)).length/Math.max(1,courseLessons.length))*100);
  const totalPhrases=courseLessons.reduce((n,l)=>n+l.phrases.length,0);

  function openLesson(id){setLessonId(id);setPhraseIndex(0);setExerciseIndex(0);setExerciseChoice(null);setExerciseAnswered(false);setMistakes([]);setLessonPhase('intro');setReviewIndex(0);setTab('lesson');}
  function phraseExercises(p, course){
    const pool=course.phrases.filter(x=>x.fr!==p.fr);
    if(course.singleWords){
      const distractors=pool.map(x=>x.meaning);
      const words=pool.map(x=>x.fr);
      const sounds=pool.map(x=>x.pron);
      const pick=(answer,others)=>[...new Set([answer,...others.filter(x=>x!==answer)])].slice(0,4).sort((a,b)=>a.localeCompare(b));
      return [
        {prompt:'What does this French word mean?',display:p.fr,options:pick(p.meaning,distractors),answer:p.meaning,explain:p.note},
        {prompt:'Choose the correct French word',display:'“'+p.meaning+'”',options:pick(p.fr,words),answer:p.fr,explain:'The word is '+p.fr+'.'},
        {prompt:'How is it pronounced?',display:p.fr,options:pick(p.pron,sounds),answer:p.pron,explain:'Pronunciation: '+p.pron},
        {prompt:'How strong is this word?',display:p.fr,options:pick(p.note,['Polite and formal.','A neutral everyday greeting.','A vulgar or insulting expression.']),answer:p.note,explain:p.note},
        {prompt:'Which situation fits this word best?',display:p.fr,options:pick(p.meaning,distractors),answer:p.meaning,explain:p.note}
      ];
    }
    const unique=values=>[...new Set(values.filter(Boolean))];
    const words=p.fr.replace(/[!?.,¿¡]/g,'').split(' ').filter(Boolean);
    const missing=words[0]||p.fr;
    const options=(answer,distractors)=>unique([answer,...distractors.filter(value=>value!==answer)]).slice(0,4).sort((a,b)=>a.localeCompare(b));
    const meanings=pool.map(x=>x.meaning);
    const phrases=pool.map(x=>x.fr);
    const sounds=pool.map(x=>x.pron);
    return [
      {prompt:'What does this phrase mean?',display:p.fr,options:options(p.meaning,[...meanings,'Good morning.','Where is the station?']),answer:p.meaning,explain:p.note},
      {prompt:'Find the missing word',display:p.fr.replace(missing,'_____'),options:options(missing,[...words.slice(1),...pool.map(x=>x.fr.split(' ')[0]),'bonjour','merci']),answer:missing,explain:'The complete phrase is: '+p.fr},
      {prompt:'Translate this into the language you are learning',display:'“'+p.meaning+'”',options:options(p.fr,[...phrases,'Bonjour !','Merci beaucoup !']),answer:p.fr,explain:'The phrase is: '+p.fr},
      {prompt:'Which word order makes the correct phrase?',display:'Build the phrase: '+p.meaning,options:options(p.fr,[...phrases,'Bonjour !','Merci beaucoup !']),answer:p.fr,explain:'Correct phrase: '+p.fr},
      {prompt:'Choose the pronunciation',display:p.fr,options:options(p.pron,[...sounds,'bon-zhoor','mah-ree']),answer:p.pron,explain:'Pronunciation: '+p.pron},
      {prompt:'What does this phrase communicate?',display:p.fr,options:options(p.meaning,[...meanings,'I would like a table.','See you tomorrow.']),answer:p.meaning,explain:p.literal+' → '+p.meaning},
      {prompt:'Which description best fits this phrase?',display:p.fr,options:options(p.note,['A polite greeting.','A request for directions.','An order at a café.']),answer:p.note,explain:p.meaning}
    ];
  }
  function chooseExercise(value){if(!exerciseAnswered)setExerciseChoice(value);}
  function checkExercise(){if(exerciseChoice===null)return;const q=currentExercises[exerciseIndex];if(exerciseChoice!==q.answer)setMistakes(v=>[...v,{question:q,chosen:exerciseChoice}]);else setXp(v=>v+2);setExerciseAnswered(true);}
  function finishPhraseLesson(){if(phraseIndex<lesson.phrases.length-1){setPhraseIndex(v=>v+1);setLessonPhase('intro');setExerciseIndex(0);setExerciseChoice(null);setExerciseAnswered(false);setMistakes([]);setReviewIndex(0);return;}if(!completed.includes(lesson.id))setCompleted(v=>[...v,lesson.id]);setXp(v=>v+20);setLessonId(null);setTab('learn');setLessonPhase('intro');setToast('Lesson complete! +20 XP');setTimeout(()=>setToast(''),2200);}
  function advanceExercise(){if(exerciseIndex<currentExercises.length-1){setExerciseIndex(v=>v+1);setExerciseChoice(null);setExerciseAnswered(false);}else if(mistakes.length){setLessonPhase('review');setReviewIndex(0);setExerciseChoice(null);setExerciseAnswered(false);}else finishPhraseLesson();}
  function finishReview(){setMistakes([]);finishPhraseLesson();}
  function markLearned(p){if(!learned.includes(p.fr)){setLearned(v=>[...v,p.fr]);setXp(v=>v+5);setToast(language==='fr'?'+5 XP. Votre français progresse !':language==='es'?'+5 XP. ¡Tu español mejora!':'+5 XP. Your English is improving!');setTimeout(()=>setToast(''),1800);}}
  function nextPhrase(){if(phraseIndex<lesson.phrases.length-1){setPhraseIndex(v=>v+1);}else{if(!completed.includes(lesson.id)){setCompleted(v=>[...v,lesson.id]);setXp(v=>v+20);}setLessonId(null);setTab('learn');setToast(language==='fr'?'Leçon terminée ! +20 XP':language==='es'?'¡Lección completada! +20 XP':'Lesson complete! +20 XP');setTimeout(()=>setToast(''),2200);}}
  function startQuiz(){setQuizIndex(0);setChoice(null);setAnswered(false);setQuizDone(false);setTab('quiz');}
  function submitAnswer(){if(choice===null)return;setAnswered(true);if(choice===questions[quizIndex].correct)setXp(v=>v+10);}
  function nextQuestion(){if(quizIndex<questions.length-1){setQuizIndex(v=>v+1);setChoice(null);setAnswered(false);}else{setQuizDone(true);}}
  function resetQuiz(){setQuizIndex(0);setChoice(null);setAnswered(false);setQuizDone(false);}

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={()=>{setTab('learn');setLessonId(null)}} aria-label="DuoMingo home"><img className="brand-logo" src="/flamingo.svg" alt=""/><span>Duo<span>Mingo</span><small>LANGUAGES FOR THE THOROUGHLY FED UP</small></span></button>
      <div className="stats"><span className="stat">⚡ {xp} XP</span><span className="stat">🔥 {completed.length} / {lessons.length}</span><button className="account-button" onClick={()=>setAccountOpen(true)}>{session?.user?.name||"Sign in"}</button></div>
    </header>

    <main>
      {tab==='learn' && <div className="layout">
        <section className="welcome">
          <div><p className="eyebrow">BONJOUR, TROUBLE</p><h1>Learn languages.<br/><em>Lose your patience</em><br/>in style.</h1><p className="intro">French and British English. Useful phrases, glorious insults and absolutely no patience required.</p><button className="primary" onClick={()=>openLesson(courseLessons.find(l=>!completed.includes(l.id))?.id||courseLessons[0].id)}>Continue learning <span>→</span></button></div>
          <div className="hero-art"><div className="sun"></div><div className="speech">FOUTEZ-MOI<br/>LA PAIX !</div><div className="flamingo">🦩</div><div className="coffee">☕</div></div>
        </section>
        <section className="progress-card"><div className="progress-head"><div><p className="eyebrow">YOUR INTERNATIONAL REVOLUTION</p><h2>Course progress</h2></div><strong>{progress}%</strong></div><div className="progress-track"><div style={{width:progress+'%'}}/></div><p className="muted">{completed.length} of {lessons.length} lessons completed · {learned.length} of {totalPhrases} phrases collected</p></section>
        <div className="section-heading"><div><p className="eyebrow">THE CURRICULUM</p><h2>Choose your level of outrage</h2></div><select className="language-select" value={language} onChange={e=>setLanguage(e.target.value)}><option value="fr">🇫🇷 French</option><option value="en">🇬🇧 British English</option></select></div>
        <div className="lesson-grid">{courseLessons.map((l,i)=><button className={'lesson-card '+(completed.includes(l.id)?'done':'')} key={l.id} onClick={()=>openLesson(l.id)}><div className="lesson-top"><span className="lesson-emoji">{l.emoji}</span><span className="level">{l.level}</span></div><h3>{String(i+1).padStart(2,'0')} · {l.title}</h3><p>{l.subtitle}</p><div className="lesson-bottom"><span>{l.phrases.length} phrases</span><span>{completed.includes(l.id)?'✓ Completed':'Start lesson →'}</span></div></button>)}</div>
        <section className="daily"><div className="daily-icon">🧠</div><div><p className="eyebrow">DAILY REMINDER</p><h3>“La patience est une vertu.”</h3><p>Patience is a virtue. Shame we left ours on the bus.</p></div></section>
      </div>}

       {tab==='lesson' && lesson && phrase && <section className="lesson-view">
        <button className="back" onClick={()=>{setTab('learn');setLessonId(null)}}>← Back to lessons</button>
        <div className="lesson-progress"><span>{lesson.emoji} {lesson.title}</span><span>{lessonPhase==='intro'?'Phrase '+(phraseIndex+1)+' / '+lesson.phrases.length:lessonPhase==='review'?'Previous mistakes':'Practice '+(exerciseIndex+1)+' / '+currentExercises.length}</span></div>
        <div className="mini-track"><div style={{width:(lessonPhase==='intro'?((phraseIndex)/lesson.phrases.length*100):lessonPhase==='review'?100:((exerciseIndex+1)/currentExercises.length*100))+'%'}}/></div>
        {lessonPhase==='intro'&&<div className="phrase-card"><p className="eyebrow">MEET YOUR NEW PHRASE</p><div className="phrase-emoji">{lesson.emoji}</div><h1>{phrase.fr}</h1><p className="pronunciation">🔊 {phrase.pron}</p><div className="translation"><div><span className="label">NATURAL MEANING</span><strong>{phrase.meaning}</strong></div><button className="text-button" onClick={()=>setShowLiteral(v=>!v)}>{showLiteral?'Hide':'Show'} literal translation</button>{showLiteral&&<div className="literal"><span className="label">WORD-FOR-WORD</span>{phrase.literal}</div>}</div><p className="note">💡 {phrase.note}</p><button className="primary full" onClick={()=>{setLessonPhase('practice');setExerciseIndex(0);setExerciseChoice(null);setExerciseAnswered(false);}}>Practise this phrase <span>→</span></button></div>}
        {lessonPhase==='practice'&&currentExercise&&<div className="question-card"><p className="eyebrow">PHRASE PRACTICE · {exerciseIndex+1} OF {currentExercises.length}</p><h2>{currentExercise.prompt}</h2><div className="exercise-prompt">{currentExercise.display}</div><div className="answers">{currentExercise.options.map((option,i)=><button key={option} className={'answer '+(exerciseChoice===option?'selected':'')+(exerciseAnswered&&option===currentExercise.answer?' correct':'')+(exerciseAnswered&&exerciseChoice===option&&exerciseChoice!==currentExercise.answer?' wrong':'')} onClick={()=>chooseExercise(option)}>{String.fromCharCode(65+i)}. {option}</button>)}</div>{exerciseAnswered&&<div className="feedback"><strong>{exerciseChoice===currentExercise.answer?'Correct! Très bien.':'Not quite. We’ll bring that one back.'}</strong><p>{currentExercise.explain}</p></div>}{!exerciseAnswered?<button className="primary full" disabled={exerciseChoice===null} onClick={checkExercise}>Check answer</button>:<button className="primary full" onClick={advanceExercise}>{exerciseIndex===currentExercises.length-1?(mistakes.length?'Review mistakes':'Finish phrase'):'Continue'} <span>→</span></button>}</div>}
        {lessonPhase==='review'&&<div className="question-card"><p className="eyebrow">PREVIOUS MISTAKES · ROUND {reviewIndex+1} OF {mistakes.length}</p><h2>Let's have another go, with a little help.</h2><div className="exercise-prompt">{mistakes[reviewIndex].question.display}</div><p className="muted">This time, choose from a smaller set of answers.</p><div className="answers">{[mistakes[reviewIndex].question.answer,...mistakes[reviewIndex].question.options.filter(x=>x!==mistakes[reviewIndex].question.answer).slice(0,2)].sort((a,b)=>a.localeCompare(b)).map((option,i)=><button key={option} className={'answer '+(exerciseChoice===option?'selected':'')+(exerciseAnswered&&option===mistakes[reviewIndex].question.answer?' correct':'')+(exerciseAnswered&&exerciseChoice===option&&exerciseChoice!==mistakes[reviewIndex].question.answer?' wrong':'')} onClick={()=>chooseExercise(option)}>{String.fromCharCode(65+i)}. {option}</button>)}</div>{exerciseAnswered&&<div className="feedback"><strong>{exerciseChoice===mistakes[reviewIndex].question.answer?'Recovered! Nice work.':'Still tricky. The correct answer is highlighted.'}</strong><p>{mistakes[reviewIndex].question.explain}</p></div>}{!exerciseAnswered?<button className="primary full" disabled={exerciseChoice===null} onClick={()=>setExerciseAnswered(true)}>Check answer</button>:<button className="primary full" onClick={()=>{if(reviewIndex<mistakes.length-1){setReviewIndex(v=>v+1);setExerciseChoice(null);setExerciseAnswered(false);}else finishReview();}}>{reviewIndex===mistakes.length-1?'Finish review':'Next mistake'} <span>→</span></button>}</div>}
      </section>}
{tab==='quiz' && <section className="quiz-view">
        <button className="back" onClick={()=>setTab('learn')}>← Back to lessons</button>
        {!quizDone?<><div className="quiz-heading"><p className="eyebrow">THE PATIENCE EXAM</p><h1>Prove you've been<br/><em>paying attention.</em></h1><div className="mini-track"><div style={{width:((quizIndex+1)/questions.length*100)+'%'}}/></div><p className="muted">Question {quizIndex+1} of {questions.length}</p></div><div className="question-card"><h2>{questions[quizIndex].q}</h2><div className="answers">{questions[quizIndex].a.map((a,i)=><button key={a} className={'answer '+(choice===i?'selected':'')+(answered&&i===questions[quizIndex].correct?' correct':'')+(answered&&choice===i&&i!==questions[quizIndex].correct?' wrong':'')} onClick={()=>!answered&&setChoice(i)}>{String.fromCharCode(65+i)}. {a}</button>)}</div>{answered?<div className="feedback"><strong>{choice===questions[quizIndex].correct?'Très bien !':'Pas tout à fait !'}</strong><p>{questions[quizIndex].why}</p><button className="primary full" onClick={nextQuestion}>{quizIndex===questions.length-1?'See results':'Next question →'}</button></div>:<button className="primary full" disabled={choice===null} onClick={submitAnswer}>Check answer</button>}</div></>:<div className="result-card"><div className="result-emoji">🏆</div><p className="eyebrow">EXAMINÉ ET LÉGÈREMENT DANGEREUX</p><h1>Well played,<br/><em>Pascal.</em></h1><p>You survived the patience exam. Your language skills are improving. Your manners are another matter.</p><button className="primary full" onClick={()=>{resetQuiz();setTab('learn')}}>Back to learning</button></div>}
      </section>}

      {tab==='phrases' && <section className="phrasebook"><p className="eyebrow">YOUR POCKET-SIZED SURVIVAL KIT</p><h1>The phrasebook</h1><p className="intro">Every phrase you've met so far, ready for deployment.</p>{lessons.flatMap(l=>l.phrases).map(p=><article className="phrase-row" key={p.fr}><div><h3>{p.fr}</h3><p className="pronunciation">{p.pron}</p><strong>{p.meaning}</strong><p className="muted">{p.literal}</p></div><span className="collected">{learned.includes(p.fr)?'✓ Learned':'☆'}</span></article>)}</section>}
    </main>
    {tab!=='lesson'&&<nav className="bottom-nav"><button className={tab==='learn'?'active':''} onClick={()=>setTab('learn')}>🗺️<span>Learn</span></button><button className={tab==='quiz'?'active':''} onClick={startQuiz}>🎯<span>Quiz</span></button><button className={tab==='phrases'?'active':''} onClick={()=>setTab('phrases')}>📖<span>Phrasebook</span></button></nav>}

    {accountOpen&&<div className="modal-backdrop" onClick={()=>setAccountOpen(false)}><section className="account-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setAccountOpen(false)}>×</button><p className="eyebrow">YOUR PERSONAL LANGUAGE MENACE PROFILE</p><h2>{session?'Account synced. Excellent.':'Save your progress'}</h2>{session?<><p className="muted">{session.user?.email}</p><p className="sync-status">{syncStatus}</p><button className="primary full" onClick={handleSignOut}>Sign out</button></>:<><p className="muted">Carry your XP, lessons and phrasebook between devices.</p><form onSubmit={handleAuthSubmit} className="auth-form">{authMode==='signup'&&<input value={authName} onChange={e=>setAuthName(e.target.value)} placeholder="Display name" autoComplete="name"/>}<input type="email" required value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="Email address" autoComplete="email"/><input type="password" required minLength="8" value={authPassword} onChange={e=>setAuthPassword(e.target.value)} placeholder="Password (8+ characters)" autoComplete={authMode==='signup'?'new-password':'current-password'}/>{authError&&<p className="auth-error">{authError}</p>}<button className="primary full" disabled={authBusy}>{authBusy?'One moment…':authMode==='signup'?'Create account':'Sign in'}</button></form><button className="text-button mode-toggle" onClick={()=>{setAuthMode(v=>v==='signup'?'signin':'signup');setAuthError('')}}>{authMode==='signup'?'Already have an account? Sign in':'New here? Create an account'}</button><p className="sync-status">{syncStatus}</p></>}</section></div>}

    {toast&&<div className="toast">{toast}</div>}
    <aside className="legal-disclaimer" aria-label="DuoMingo legal disclaimer">
      <h2>⚠️ DuoMingo Legal Disclaimer</h2>
      <p>All translations are provided for educational and entertainment purposes. While we endeavour to ensure linguistic accuracy, we accept absolutely no responsibility for:</p>
      <ul>
        <li>Facial expressions becoming increasingly hostile.</li>
        <li>Unscheduled diplomatic incidents.</li>
        <li>Being introduced to someone's fist at close range.</li>
        <li>The sudden withdrawal of baguette-related services.</li>
        <li>Discovering that the person you've insulted is, in fact, considerably larger than you.</li>
      </ul>
      <p>Please use your new vocabulary responsibly. Or at least understand the consequences before deployment.</p>
      <p className="disclaimer-signoff">DuoMingo: Languages for the thoroughly fed up. We teach the words. You deal with the aftermath.</p>
    </aside>
    <footer>DUOMINGO · LEARN TO SAY ABSOLUTELY ANYTHING · MADE WITH QUESTIONABLE INTENT 🌍</footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>);
