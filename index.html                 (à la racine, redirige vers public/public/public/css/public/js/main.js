/* BINGO LAKAY - Tèks an kreyòl ayisyen */
(function () {
  'use strict';

  var ht = {
    'app.title': 'BINGO LAKAY',
    'app.tagline': 'Jwèt Bingo ayisyen an',
    'app.footer': 'Fèt pou Ayiti 🇭🇹',

    'common.back': 'Retounen',
    'common.soon': 'Byento',

    'menu.play': 'Jwe',
    'menu.rules': 'Règleman',
    'menu.settings': 'Paramèt',

    'modes.title': 'Chwazi mòd jwèt la',
    'modes.solo': 'Solo',
    'modes.solo.desc': 'Ou kont òdinatè a.',
    'modes.local': 'De jwè',
    'modes.local.desc': 'De moun sou yon sèl telefòn.',
    'modes.online': 'Anliy',
    'modes.online.desc': 'Jwe ak yon zanmi ak yon kòd prive.',
    'modes.note': 'Solo disponib. De jwè ak Anliy ap vini nan pwochen etap yo.',

    'rules.title': 'Règleman jwèt la',
    'rules.s1.h': 'Kat la',
    'rules.s1.p': 'Chak jwè gen yon kat 5×5. Kolòn yo se B-I-N-G-O : B (1-15), I (16-30), N (31-45), G (46-60), O (61-75). Ti kare nan mitan an gratis.',
    'rules.s2.h': 'Tiraj la',
    'rules.s2.p': 'Chak tou, jwè ki gen tou a tire yon bil nan kalbas la. Tout moun wè nimewo a epi yo ka make l sou kat yo anvan tiraj pwochen an. Ou ka make sèlman dènye nimewo ki tire a.',
    'rules.s3.h': 'Fig ki fè w genyen',
    'rules.s3.p': 'Manch 1 : Liy (yon liy, yon kolòn oswa yon dyagonal). Manch 2 : Kwen (4 kwen yo ak mitan an). Manch 3 : Kat plen (tout kat la).',
    'rules.s4.h': 'BINGO !',
    'rules.s4.p': 'Lè w fini fig la, rele BINGO ! Si se vre, ou genyen manch lan. Si se fo, ou pa ka make nimewo pwochen tiraj la.',
    'rules.s5.h': 'Pati a',
    'rules.s5.p': 'Premye jwè ki genyen 2 manch sou 3 genyen pati a. Si de jwè fini fig la sou menm tiraj la, chak moun jwenn yon pwen.',
    'rules.example': 'Egzanp yon kat',
    'rules.newcard': 'Nouvo kat',

    'pat.liy': 'Liy',
    'pat.kwen': 'Kwen',
    'pat.katplen': 'Kat plen',
    'game.round': 'Manch {n}/3',
    'game.you': 'Ou',
    'game.bot': 'Òdinatè',
    'game.yourTurn': 'Se tou ou : tire yon bil',
    'game.botTurn': 'Òdinatè a ap tire...',
    'game.draw': 'Tire yon bil',
    'game.bingo': 'BINGO !',
    'game.botNeeds': 'Òdinatè a bezwen {n} nimewo ankò',
    'game.err.last': 'Ou ka make sèlman dènye nimewo ki tire a',
    'game.err.penalty': 'Penalite : ou pa ka make nimewo sa a',
    'game.fake': 'Fo BINGO ! Ou pa ka make pwochen nimewo a',
    'game.quit': 'Kite pati a ?',
    'game.score': 'Pwen',
    'game.win.round': 'Ou genyen manch lan !',
    'game.lose.round': 'Òdinatè a genyen manch lan',
    'game.tie.round': 'Egalite ! Chak moun jwenn yon pwen',
    'game.win.game': 'Ou genyen pati a !',
    'game.lose.game': 'Òdinatè a genyen pati a',
    'game.tie.game': 'Pati a fini egal',
    'game.next': 'Manch swivan',
    'game.again': 'Rejwe',
    'game.exit': 'Kite',

    'set.title': 'Paramèt',
    'set.name': 'Non ou',
    'set.name.ph': 'Egzanp : Mimoz',
    'set.difficulty': 'Nivo òdinatè a',
    'set.difficulty.hint': 'Sa ap sèvi nan mòd Solo.',
    'set.easy': 'Fasil',
    'set.medium': 'Mwayen',
    'set.hard': 'Difisil',
    'set.auto': 'Make nimewo yo otomatikman',
    'set.auto.hint': 'Si w pa aktive sa, w ap make nimewo yo ak men w.',
    'set.reset': 'Efase paramèt yo',
    'set.reset.confirm': 'Efase tout paramèt yo ?',
    'set.reset.done': 'Paramèt yo efase',
    'set.saved': 'Anrejistre'
  };

  var lang = ht;

  function t(key) { return lang[key] !== undefined ? lang[key] : key; }

  function apply(root) {
    root = root || document;
    var nodes = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = t(nodes[i].getAttribute('data-i18n'));
    var ph = root.querySelectorAll('[data-i18n-ph]');
    for (var j = 0; j < ph.length; j++) ph[j].setAttribute('placeholder', t(ph[j].getAttribute('data-i18n-ph')));
  }

  window.I18N = { t: t, apply: apply };
})();
      
