const assert=require('node:assert/strict');const {inspectPath}=require('./engine.js');
const solution=[0,1,2,5,4,3,6,7,8];
for(let n=0;n<=9;n++)assert.equal(inspectPath(solution.slice(0,n)).ok,true);
assert.equal(inspectPath(solution).won,true);assert.deepEqual(inspectPath(solution).checkpoints,[2,3,8]);
for(const bad of [[1],[0,4],[0,1,0],[0,1,4,5],[0,3,6,7],[0,9]])assert.equal(inspectPath(bad).ok,false);
let solutions=0,visited=0;function dfs(p){visited++;const r=inspectPath(p);if(!r.ok)return;if(r.won){solutions++;return;}for(let i=0;i<9;i++)if(!p.includes(i))dfs([...p,i]);}dfs([]);assert.ok(solutions>0);console.log({solutions,visited,validPrefixes:10,invalidRoutes:6});
