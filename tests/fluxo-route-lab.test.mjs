import assert from 'node:assert/strict';
import {courses,inspect,continuations} from '../src/fluxo/gravity-flip-route-lab/model.mjs';
let checked=0;
for(const c of courses){
 const independentlySafe=[];
 // Independent lane-sequence oracle, not action sequences.
 for(let mask=0;mask<256;mask++){
  const lanes=Array.from({length:8},(_,i)=>(mask>>i)&1);
  if(lanes.some((lane,i)=>(c.gates[i]===1&&lane===0)||(c.gates[i]===2&&lane===1)))continue;
  let prev=c.start;const actions=lanes.map(l=>{const f=l===prev?0:1;prev=l;return f;});
  independentlySafe.push({lanes,actions,flips:actions.reduce((a,b)=>a+b,0)});
 }
 assert.ok(independentlySafe.length>0);
 const found=continuations(c);assert.equal(found.length,independentlySafe.length);
 assert.equal(found[0].flips,Math.min(...independentlySafe.map(x=>x.flips)));
 for(let mask=0;mask<256;mask++){
  const actions=Array.from({length:8},(_,i)=>(mask>>i)&1),r=inspect(c,actions);
  const match=independentlySafe.find(x=>x.actions.every((a,i)=>a===actions[i]));
  assert.equal(r.valid,!!match); if(match){assert.deepEqual(r.lanes,match.lanes);assert.equal(r.flips,match.flips);assert.ok(r.complete);}checked++;
 }
 // Every valid partial route can be completed; hint retains prefix and is optimal.
 for(let len=0;len<=8;len++)for(let mask=0;mask<2**len;mask++){
  const actions=Array.from({length:len},(_,i)=>(mask>>i)&1);if(!inspect(c,actions).valid)continue;
  const expected=independentlySafe.filter(x=>actions.every((a,i)=>a===x.actions[i]));
  const actual=continuations(c,actions);assert.equal(actual.length,expected.length);
  assert.equal(actual[0].flips,Math.min(...expected.map(x=>x.flips)));checked++;
 }
}
assert.throws(()=>inspect(courses[0],[2]));assert.throws(()=>inspect(courses[0],Array(9).fill(0)));
console.log(`PASS: ${courses.length} courses; ${checked} independent route/prefix checks; invalid input rejection.`);
console.log(courses.map(c=>({course:c.name,minimum:continuations(c)[0].flips,moves:continuations(c)[0].actions.join('')})));

