const choices=[...document.querySelectorAll('[data-shot]')];
const result=document.getElementById('result');
const route=document.getElementById('route');
const workshopHandoff=document.getElementById('workshop-handoff');
function play(n){
 choices.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.shot)===n)));
 const run=carryShot(n,[5,8]);
 route.textContent='';
 run.steps.forEach((s,i)=>{
  const item=document.createElement('li');
  item.textContent=s.kind==='feed'?`${s.shot} + ${s.beast} = ${s.sum}. Feed: beast ${i+1} becomes ${s.sum}; this launch stops.`:s.kind==='bond'?`${s.shot} + ${s.beast} = 10. Bond: beast ${i+1} clears; nothing carries on.`:`${s.shot} + ${s.beast} = ${s.sum}. Bridge: beast ${i+1} clears; ${s.left} carries on.`;
  route.append(item);
 });
 const cleared=run.steps.filter(s=>s.kind!=='feed').length;
 if(workshopHandoff)workshopHandoff.hidden=!(cleared===2&&!run.spill);
 result.textContent=cleared===2&&!run.spill?'Both beasts cleared. The carry was used exactly.':run.spill?`Both beasts cleared, but ${run.spill} is unused. In the game, unused carry spills back as a new beast.`:`${cleared} of 2 beasts cleared. Try a different starting number to compare the route.`;
 document.getElementById('shot-label').textContent=String(n);
 document.getElementById('carry-label').textContent=run.steps[0].left?String(run.steps[0].left):'—';
}
choices.forEach(b=>b.addEventListener('click',()=>play(Number(b.dataset.shot))));
document.getElementById('reset').addEventListener('click',()=>{
 if(workshopHandoff)workshopHandoff.hidden=true;
 choices.forEach(b=>b.setAttribute('aria-pressed','false'));route.textContent='';
 result.textContent='Choose a starting number. Watch what carries past the first beast.';
 document.getElementById('shot-label').textContent='?';document.getElementById('carry-label').textContent='?';
});
