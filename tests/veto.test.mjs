import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = fs.readFileSync('src/utils/veto.ts', 'utf8');
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context);
const stage = JSON.parse(fs.readFileSync('src/data/tournaments/clash-for-glory-s1.json')).stages[0];
const maps = new Map(fs.readdirSync('src/data/maps').map(f => [f.slice(0, -5), { data: JSON.parse(fs.readFileSync(`src/data/maps/${f}`)) }]));
test('tournament veto resolves canonical maps and leaves two wheel candidates', () => {
  const result = context.exports.resolveVeto(stage, maps);
  assert.equal(result.maps.length - result.steps.length, 2);
  assert.equal(result.maps[0].name, maps.get('desert').data.name);
});
test('invalid pools and pick sequences are rejected', () => {
  for (const mutate of [s => s.veto.mapPoolIds.push('desert'), s => s.veto.mapPoolIds.push('missing'), s => s.veto.steps.pop() && s.veto.steps.pop() && s.veto.steps.pop(), s => s.series.mapCount = 5, s => s.veto.mapPoolIds.splice(0, 5)]) {
    const copy = structuredClone(stage); mutate(copy);
    assert.throws(() => context.exports.resolveVeto(copy, maps));
  }
});
test('stages without veto settings remain unavailable', () => {
  const copy = structuredClone(stage); delete copy.veto;
  assert.equal(context.exports.resolveVeto(copy, maps), undefined);
});
test('switching matches cancels a pending wheel and starts a fresh configured session', () => {
  const elements = new Map();
  const drawing = new Proxy({}, { get: () => () => {} });
  const el = id => {
    if (!elements.has(id)) elements.set(id, { style: {}, classList: { add() {}, remove() {} }, addEventListener(event, fn) { this[event] = fn; }, getContext: () => drawing, width: 320, height: 320 });
    return elements.get(id);
  };
  const veto = context.exports.resolveVeto(stage, maps);
  const matches = ['m01', 'm02'].map(id => ({ id, veto, tournament: 'Test', status: 'completed', team1: { id: 'a', name: 'A', tag: 'A' }, team2: { id: 'b', name: 'B', tag: 'B' } }));
  el('match-data').textContent = JSON.stringify(matches);
  const pending = new Map(); let timer = 0;
  const script = fs.readFileSync('src/pages/veto.astro', 'utf8').split('<script is:inline>')[1].split('</script>')[0];
  const sandbox = { document: { getElementById: el, querySelectorAll: () => [] }, location: { search: '' }, URLSearchParams, setInterval: () => 1, clearInterval() {}, setTimeout(fn) { pending.set(++timer, fn); return timer; }, clearTimeout(id) { pending.delete(id); }, requestAnimationFrame(fn) { fn(); } };
  vm.runInNewContext(script.replace('    init();', '    globalThis.api = { onMapClick, spinWheel, voidCurrentStep, tick, getState: () => state }; init();'), sandbox);
  el('match-select').change({ target: { value: 'm01' } });
  for (let i = 0; i < 25; i++) sandbox.api.tick();
  assert.equal(sandbox.api.getState().reserveTimer.A, 85);
  assert.equal(sandbox.api.getState().reserveTimer.B, 90);
  veto.maps.slice(0, 4).forEach(map => sandbox.api.onMapClick(map.id));
  sandbox.api.voidCurrentStep();
  sandbox.api.voidCurrentStep();
  assert.notEqual(el('pick-map-a').textContent, el('pick-map-b').textContent);
  assert.notEqual(el('pick-map-a').textContent, 'VOID');
  sandbox.api.voidCurrentStep();
  sandbox.api.voidCurrentStep();
  pending.clear();
  sandbox.api.spinWheel();
  assert.equal(pending.size, 1);
  el('match-select').change({ target: { value: 'm02' } });
  assert.equal(pending.size, 0);
  assert.equal(el('spin-btn').disabled, false);
  assert.equal(el('veto-results').style.display, 'none');

  el('match-select').change({ target: { value: '' } });
  assert.equal(el('veto-interface').style.display, 'none');
  el('scrim-data').textContent = JSON.stringify(veto);
  el('scrim-a').value = '<img src=x onerror=alert(1)>';
  el('scrim-b').value = 'Scrim B';
  el('scrim-form').submit({ preventDefault() {} });
  assert.equal(sandbox.api.getState().match.team2.name, 'Scrim B');
  assert.ok(!el('veto-prompt').innerHTML.includes('<img'));
  assert.ok(el('veto-prompt').innerHTML.includes('&lt;img'));
  sandbox.api.onMapClick(veto.maps[0].id);
  for (let i = 0; i < 27; i++) sandbox.api.tick();
  assert.equal(sandbox.api.getState().reserveTimer.A, 90);
  assert.equal(sandbox.api.getState().reserveTimer.B, 83);

});
