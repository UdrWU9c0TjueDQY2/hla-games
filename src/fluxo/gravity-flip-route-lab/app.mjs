import {courses,inspect,continuations,safe} from './model.mjs';
const $=id=>document.getElementById(id);let index=0,actions=[];
const laneName=n=>n?'ceiling':'floor';
function render(message=''){
 const c=courses[index],s=inspect(c,actions),i=actions.length,min=continuations(c)[0].flips;
 $('course-name').textContent=c.name;$('course-note').textContent=c.note;
 $('position').textContent=s.complete?'Course complete':`Gate ${i+1} of ${c.gates.length}`;
 $('lane').textContent=laneName(s.lane);$('flips').textContent=s.flips;
 $('target').textContent=`Fewest possible: ${min} flips`;
 $('gates').replaceChildren(...c.gates.map((gate,j)=>{
  const col=document.createElement('div');col.className='gate'+(j===i?' current':'')+(j<i?' visited':'');
  const n=document.createElement('span');n.textContent=j+1;col.append(n);
  for(const lane of [1,0]){const cell=document.createElement('div');cell.className='cell'+(!safe(gate,lane)?' blocked':'')+(s.lanes[j]===lane?' route':'');cell.textContent=!safe(gate,lane)?'x':s.lanes[j]===lane?'?':'�';col.append(cell);}
  return col;
 }));
 $('gate-description').textContent=s.complete?`You reached the exit in ${s.flips} flips. ${s.flips===min?'That matches the fewest possible.':'A shorter route uses '+min+' flips. Reset to try another route.'}`:`Next gate: ${c.gates[i]===0?'both lanes clear':c.gates[i]===1?'floor blocked; ceiling clear':'ceiling blocked; floor clear'}. You are on the ${laneName(s.lane)}.`;
 $('route-text').textContent=s.lanes.length?'Your route: '+s.lanes.map((l,j)=>`${j+1} ${laneName(l)}`).join('  '):`Start on the ${laneName(c.start)}. No gates passed yet.`;
 $('stay').disabled=$('flip').disabled=$('hint').disabled=s.complete;$('undo').disabled=!i;
 $('status').textContent=message||(s.complete?`Finished in ${s.flips} flips. ${s.flips===min?'One of the shortest routes.':'You can reach the exit with fewer flips.'}`:`Gate ${i+1}. ${$('gate-description').textContent} Choose Stay or Flip.`);
}
function move(flip){const c=courses[index],s=inspect(c,actions);if(s.complete)return;const next=s.lane^flip;if(!safe(c.gates[actions.length],next)){render(`That would enter the blocked ${laneName(next)}. Your route has not changed. Try the other move.`);return;}actions.push(flip);render();}
$('stay').onclick=()=>move(0);$('flip').onclick=()=>move(1);
$('undo').onclick=()=>{actions.pop();render('Last move undone.');};
$('reset').onclick=()=>{actions=[];render('Route reset. Start again.');};
$('hint').onclick=()=>{const best=continuations(courses[index],actions)[0];render(`Hint: ${best.actions[actions.length]?'Flip':'Stay'} is one best next move from your current route. The best finish from here totals ${best.flips} flips.`);};
$('course').onchange=e=>{index=Number(e.target.value);actions=[];render('New course ready.');};
$('controls').hidden=false;render();

