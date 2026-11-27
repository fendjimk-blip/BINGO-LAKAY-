/* BINGO LAKAY - Navigation entre écrans et paramètres */
(function () {
  'use strict';

  var E = window.BingoEngine;
  var t = window.I18N.t;
  var KEY = 'bingoLakay.settings';
  var DEFAULTS = { name: '', difficulty: 'fasil', autoMark: false };
  var SCREENS = ['menu', 'modes', 'rules', 'settings', 'game'];

  // ---------- Paramètres (sauvegardés sur le téléphone) ----------
  function loadSettings() {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY));
      return Object.assign({}, DEFAULTS, saved || {});
    } catch (e) {
      return Object.assign({}, DEFAULTS);
    }
  }
  function saveSettings() {
    try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch (e) { /* stockage indisponible */ }
  }
  var settings = loadSettings();

  // ---------- Message temporaire ----------
  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1400);
  }

  // ---------- Navigation (le bouton Retour d'Android fonctionne grâce au #hash) ----------
  function show(name) {
    if (SCREENS.indexOf(name) === -1) name = 'menu';
    if (name === 'game' && !(window.LakayGame && window.LakayGame.isRunning())) { location.replace('#menu'); return; }
    if (name !== 'game' && window.LakayGame) window.LakayGame.stop();
    for (var i = 0; i < SCREENS.length; i++) {
      document.getElementById('screen-' + SCREENS[i]).classList.toggle('active', SCREENS[i] === name);
    }
    window.scrollTo(0, 0);
  }
  function route() { show(location.hash.replace('#', '') || 'menu'); }

  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest('[data-go]');
    if (!btn) return;
    var target = btn.getAttribute('data-go');
    if (location.hash.replace('#', '') === target) route();
    else location.hash = target;
  });
  window.addEventListener('hashchange', route);

  // ---------- Écran Paramèt ----------
  var nameEl = document.getElementById('set-name');
  var diffEl = document.getElementById('set-difficulty');
  var autoEl = document.getElementById('set-auto');

  function fillSettings() {
    nameEl.value = settings.name;
    diffEl.value = settings.difficulty;
    autoEl.checked = settings.autoMark;
  }
  nameEl.addEventListener('change', function () {
    settings.name = nameEl.value.trim().slice(0, 16);
    nameEl.value = settings.name;
    saveSettings(); toast(t('set.saved'));
  });
  diffEl.addEventListener('change', function () {
    settings.difficulty = diffEl.value;
    saveSettings(); toast(t('set.saved'));
  });
  autoEl.addEventListener('change', function () {
    settings.autoMark = autoEl.checked;
    saveSettings(); toast(t('set.saved'));
  });
  document.getElementById('btn-reset').addEventListener('click', function () {
    if (!window.confirm(t('set.reset.confirm'))) return;
    settings = Object.assign({}, DEFAULTS);
    try { localStorage.removeItem(KEY); } catch (e) { /* rien */ }
    fillSettings();
    toast(t('set.reset.done'));
  });

  // ---------- Carte d'exemple (générée par le vrai moteur de règles) ----------
  function renderSampleCard() {
    var host = document.getElementById('sample-card');
    host.innerHTML = '';
    var colors = ['#00209f', '#d21034', '#1f9d55', '#e08a00', '#7b2cbf'];
    var i, r, c, d;
    for (i = 0; i < 5; i++) {
      d = document.createElement('div');
      d.className = 'cell head';
      d.textContent = E.LETTERS[i];
      d.style.background = colors[i];
      host.appendChild(d);
    }
    var card = E.generateCard();
    for (r = 0; r < 5; r++) {
      for (c = 0; c < 5; c++) {
        d = document.createElement('div');
        if (card[r][c] === E.FREE) { d.className = 'cell free'; d.textContent = '★'; }
        else { d.className = 'cell'; d.textContent = card[r][c]; }
        host.appendChild(d);
      }
    }
  }
  document.getElementById('btn-newcard').addEventListener('click', renderSampleCard);

  // ---------- Mode Solo ----------
  window.LakayToast = toast;
  document.getElementById('btn-solo').addEventListener('click', function () {
    window.LakayGame.startSolo(settings);
    location.hash = 'game';
  });

  // ---------- Démarrage ----------
  window.I18N.apply(document);
  fillSettings();
  renderSampleCard();
  route();

  // Les prochaines étapes (solo, 2 joueurs, en ligne) utiliseront ces réglages.
  window.LakayApp = { settings: function () { return settings; }, show: function (n) { location.hash = n; } };
})();
                           
