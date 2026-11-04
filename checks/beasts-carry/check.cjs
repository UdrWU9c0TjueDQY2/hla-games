const assert=require('node:assert/strict');const {carryShot}=require('./engine.js');
assert.deepEqual(carryShot(7,[5,8]),{steps:[{shot:7,beast:5,sum:12,kind:'bridge',left:2},{shot:2,beast:8,sum:10,kind:'bond',left:0}],spill:0});
assert.equal(carryShot(4,[5,8]).steps.length,1);assert.equal(carryShot(4,[5,8]).steps[0].kind,'feed');
assert.equal(carryShot(5,[5,8]).steps.length,1);assert.equal(carryShot(5,[5,8]).steps[0].kind,'bond');assert.equal(carryShot(9,[5,8]).spill,2);
for(let shot=1;shot<=9;shot++)for(let a=1;a<=9;a++)for(let b=1;b<=9;b++){
 const r=carryShot(shot,[a,b]);let current=shot;
 for(const s of r.steps){assert.equal(s.shot,current);assert.equal(s.sum,s.shot+s.beast);assert.equal(s.kind,s.sum<10?'feed':s.sum===10?'bond':'bridge');assert.equal(s.left,Math.max(0,s.sum-10));current=s.left;}
 assert.equal(r.spill,current);if(r.steps[0].sum<=10)assert.equal(r.steps.length,1);
}
console.log('729 two-target routes and all four displayed examples pass');
