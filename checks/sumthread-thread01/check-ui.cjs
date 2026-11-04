const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function element(){return{textContent:'',disabled:false,attrs:{},listeners:{},style:{setProperty(k,v){this[k]=v;}},classList:{toggle(){}},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,fn){this.listeners[k]=fn;},querySelector(){return this.step??=element();}};}
const ids=Object.fromEntries(['status','progress','ring','sum','targets','undo','path','reset'].map(x=>[x,element()])),cells=Array.from({length:9},element);
const ctx=vm.createContext({document:{querySelectorAll:()=>cells,getElementById:id=>ids[id]}});
vm.runInContext(fs.readFileSync(__dirname+'/engine.js','utf8')+'\n'+fs.readFileSync(__dirname+'/app.js','utf8'),ctx);
const click=i=>cells[i].listeners.click();
click(4);assert.match(ids.status.textContent,/top-left/);assert.equal(ids.progress.textContent,'0 / 9');
click(0);click(4);assert.match(ids.status.textContent,/No diagonals/);assert.equal(ids.progress.textContent,'1 / 9');
click(1);click(2);assert.equal(ids.sum.textContent,'Segment sum: 0 / 9');assert.equal(ids.targets.textContent,'✓ 6 → 9 → 6');
click(1);assert.equal(ids.progress.textContent,'2 / 9');assert.equal(ids.sum.textContent,'Segment sum: 3 / 6');
ids.undo.listeners.click();assert.equal(ids.progress.textContent,'1 / 9');
ids.reset.listeners.click();assert.equal(ids.undo.disabled,true);assert.equal(ids.ring.style['--progress'],'0deg');
for(const i of [0,1,2,5,4,3,6,7,8])click(i);
assert.match(ids.status.textContent,/Solved/);assert.equal(ids.progress.textContent,'9 / 9');assert.equal(ids.ring.style['--progress'],'360deg');assert.equal(ids.sum.textContent,'All three targets complete');
ids.undo.listeners.click();assert.equal(ids.progress.textContent,'8 / 9');assert.equal(ids.sum.textContent,'Segment sum: 3 / 6');click(8);assert.match(ids.status.textContent,/Solved/);
ids.reset.listeners.click();assert.equal(cells.filter(c=>c.attrs['aria-pressed']==='true').length,0);assert.equal(ids.path.textContent,'No tiles selected yet.');
console.log('UI state checks pass: invalid starts/jumps, checkpoint reset, backtrack, undo, win, replay, reset.');
