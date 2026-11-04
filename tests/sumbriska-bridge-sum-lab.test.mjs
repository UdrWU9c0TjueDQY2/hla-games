import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const html=fs.readFileSync(new URL('../src/sumbriska/bridge-sum-lab/index.html',import.meta.url),'utf8');
const model=html.match(/<script type="module">([\s\S]*?)const \$=id/)[1]+'\nexport {boards,totals,targets,solved,flip,solutions};';
const {boards,totals,targets,solved,flip,solutions}=await import('data:text/javascript;base64,'+Buffer.from(model).toString('base64'));
for(const b of boards){
test(`${b.name}: unique solvable board and exhaustive conservation`,()=>{
 assert.equal(solutions(b).length,1);assert.ok(solved(b,b.solution));assert.ok(!solved(b,b.edges.map(()=>0)));
 for(let m=0;m<2**b.edges.length;m++)for(const tide of b.high?[0,1]:[0]){
  const state=b.edges.map((_,i)=>(m>>i)&1),t=totals(b,state,tide),constant=b.edges.reduce((s,[a,c,l,r],i)=>s+(tide?b.high[i][0]+b.high[i][1]:l+r),0);
  assert.equal(t.reduce((s,n)=>s+n,0),constant);
  b.edges.forEach(([a,c,l,r],i)=>{const changed=totals(b,flip(state,i),tide);assert.equal(changed[a]-t[a],t[c]-changed[c]);t.forEach((n,j)=>{if(j!==a&&j!==c)assert.equal(changed[j],n);});assert.deepEqual(flip(flip(state,i),i),state);});
 }
});}
test('Known target fixtures',()=>{assert.deepEqual(targets(boards[0]),[4,1]);assert.deepEqual(targets(boards[1]),[4,3,9]);assert.deepEqual(targets(boards[2]),[13,3,4,9]);assert.deepEqual(totals(boards[0],[0]),[1,4]);});
test('Reject malformed arrangements and bridge indices',()=>{assert.throws(()=>totals(boards[0],[]));assert.throws(()=>totals(boards[0],[2]));assert.throws(()=>flip([0],-1));assert.throws(()=>flip([0],1));});
test('Published source has assets, canonical, accessible feedback and compact layout',()=>{
assert.equal((html.match(/<h1 /g)||[]).length,1);
assert.match(html,/https:\/\/apps.apple.com\/app\/id6829238551/);
assert.match(html,/aria-live="polite"/);
assert.match(html,/\.board\.five-islands\{height:400px\}/);
assert.equal((html.match(/data:image\/webp;base64,/g)||[]).length,3);
assert.ok(!html.includes('rubberducked'));
JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
});
