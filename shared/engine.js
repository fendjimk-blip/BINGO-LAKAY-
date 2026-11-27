const assert = require('assert');
const E = require('../shared/engine.js');

let passed = 0;
function test(name, fn) { fn(); passed++; console.log('OK  ' + name); }

// rng qui force le tirage d'une boule précise
function rngFor(state, n) {
  const idx = state.remaining.indexOf(n);
  assert(idx !== -1, 'boule déjà tirée');
  return () => (idx + 0.5) / state.remaining.length;
}
function forceDraw(state, n) {
  return E.draw(state, state.turn, rngFor(state, n));
}
const P = [{ id: 'a', name: 'Ana' }, { id: 'b', name: 'Bob' }];

test('cartes valides (colonnes, doublons, case gratuite)', () => {
  for (let k = 0; k < 2000; k++) {
    const card = E.generateCard();
    assert.strictEqual(card[2][2], E.FREE);
    const seen = new Set();
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      if (r === 2 && c === 2) continue;
      const v = card[r][c];
      assert(v >= E.RANGES[c][0] && v <= E.RANGES[c][1], 'hors colonne');
      assert(!seen.has(v), 'doublon');
      seen.add(v);
    }
  }
});

test('tirage : tour imposé et boules uniques', () => {
  const g = E.createGame(P);
  assert.strictEqual(E.draw(g, 'b').error, 'not_your_turn');
  const seen = new Set();
  for (let i = 0; i < 75; i++) {
    const r = E.draw(g, g.turn);
    assert(r.ok); assert(!seen.has(r.ball)); seen.add(r.ball);
  }
  assert.strictEqual(E.draw(g, g.turn).error, 'no_balls_left');
});

test('marquage : seulement la dernière boule, sur sa carte', () => {
  const g = E.createGame(P);
  const n = g.cards.a[0][0];
  assert.strictEqual(E.mark(g, 'a', n).error, 'not_last_ball');
  forceDraw(g, n);
  assert(E.mark(g, 'a', n).ok);
  assert.strictEqual(E.mark(g, 'a', n).error, 'already_marked');
  const other = g.cards.b.flat().find(v => v !== E.FREE && !g.cards.a.flat().includes(v));
  forceDraw(g, other);
  assert.strictEqual(E.mark(g, 'a', other).error, 'not_on_card');
});

test('faux BINGO : pénalité sur le tirage suivant', () => {
  const g = E.createGame(P);
  const r = E.callBingo(g, 'a');
  assert(r.ok && r.valid === false);
  assert.strictEqual(g.penalty.a, 1);
  const n = g.cards.a[0][0];
  forceDraw(g, n);
  assert.strictEqual(E.mark(g, 'a', n).error, 'penalty');
  assert.strictEqual(g.penalty.a, 0);
});

test('BINGO valide : ligne gagnée, score +1', () => {
  const g = E.createGame(P);
  const row = g.cards.a[0];
  g.marks.a = row.slice(0, 4);
  forceDraw(g, row[4]);
  assert(E.mark(g, 'a', row[4]).ok);
  const r = E.callBingo(g, 'a');
  assert(r.valid);
  assert.deepStrictEqual(g.roundWinners, ['a']);
  assert.strictEqual(g.scores.a, 1);
  assert.strictEqual(g.phase, 'roundOver');
  assert(E.nextRound(g).ok);
  assert.strictEqual(g.pattern, 'kwen');
});

test('égalité : même tirage = point pour chacun', () => {
  const g = E.createGame(P);
  const row = g.cards.a[0];
  g.cards.b[0] = row.slice();
  g.marks.a = row.slice(0, 4);
  g.marks.b = row.slice(0, 4);
  forceDraw(g, row[4]);
  E.mark(g, 'a', row[4]); E.mark(g, 'b', row[4]);
  const r = E.callBingo(g, 'a');
  assert(r.valid);
  assert.deepStrictEqual(g.roundWinners.sort(), ['a', 'b']);
  assert.strictEqual(g.scores.a, 1); assert.strictEqual(g.scores.b, 1);
});

test('Kwen : 4 coins + centre', () => {
  const g = E.createGame(P);
  g.round = 1; g.pattern = 'kwen';
  const c = g.cards.a;
  assert.strictEqual(E.isComplete(c, [c[0][0], c[0][4], c[4][0]], 'kwen'), false);
  assert.strictEqual(E.isComplete(c, [c[0][0], c[0][4], c[4][0], c[4][4]], 'kwen'), true);
});

test('Kat plen : carte entière', () => {
  const c = E.generateCard();
  const all = c.flat().filter(v => v !== E.FREE);
  assert.strictEqual(E.isComplete(c, all, 'katplen'), true);
  assert.strictEqual(E.isComplete(c, all.slice(1), 'katplen'), false);
});

test('marquage automatique', () => {
  const g = E.createGame(P, { autoMark: true });
  const n = g.cards.a[1][1];
  forceDraw(g, n);
  assert(g.marks.a.includes(n));
});

test('vue joueur : cartes adverses et sac cachés', () => {
  const g = E.createGame(P);
  const v = E.viewFor(g, 'a');
  assert(!('remaining' in v) && !('cards' in v));
  assert.deepStrictEqual(Object.keys(v.others), ['b']);
});

test('partie complète simulée (500 parties, fin garantie)', () => {
  for (let k = 0; k < 500; k++) {
    const g = E.createGame(P, { autoMark: true });
    let guard = 0;
    while (g.phase !== 'gameOver' && guard++ < 1000) {
      if (g.phase === 'roundOver') { E.nextRound(g); continue; }
      E.draw(g, g.turn);
      for (const p of g.players) {
        if (E.isComplete(g.cards[p.id], g.marks[p.id], g.pattern)) { E.callBingo(g, p.id); break; }
      }
    }
    assert.strictEqual(g.phase, 'gameOver');
    assert(g.winners.length >= 1);
  }
});

console.log('\n' + passed + ' tests réussis.');
    
