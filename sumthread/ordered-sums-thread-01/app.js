let path=[];const cells=[...document.querySelectorAll('[data-cell]')];
const status=document.getElementById('status');
function draw(message){
 const s=inspectPath(path);cells.forEach((b,i)=>{const at=path.indexOf(i);b.classList.toggle('used',at>=0);b.classList.toggle('checkpoint',s.checkpoints.includes(i));b.setAttribute('aria-pressed',String(at>=0));b.querySelector('.step').textContent=at>=0?`Step ${at+1}`:i===0?'START':'';});
 document.getElementById('progress').textContent=`${path.length} / 9`;
 document.getElementById('ring').style.setProperty('--progress',`${path.length*40}deg`);
 document.getElementById('sum').textContent=s.won?'All three targets complete':`Segment sum: ${s.total} / ${TARGETS[s.target]}`;
 document.getElementById('targets').textContent=TARGETS.map((t,i)=>`${i<s.target?'✓ ':''}${t}`).join(' → ');
 document.getElementById('undo').disabled=path.length===0;
 status.textContent=message||(s.won?'Solved. Nine tiles, one continuous path, targets 6 → 9 → 6.':path.length?'Keep the thread going. Tap an earlier tile to backtrack.':'Start at the top-left 1. Build the first target of 6.');
 document.getElementById('path').textContent=path.length?path.map(i=>`R${Math.floor(i/3)+1}C${i%3+1}`).join(' → '):'No tiles selected yet.';
}
cells.forEach((b,i)=>b.addEventListener('click',()=>{const at=path.indexOf(i);if(at>=0){path=path.slice(0,at+1);draw('Backtracked to that tile. Continue from here.');return;}const candidate=[...path,i],r=inspectPath(candidate);if(!r.ok){status.textContent=r.error;return;}path=candidate;draw();}));
document.getElementById('undo').addEventListener('click',()=>{path.pop();draw();});
document.getElementById('reset').addEventListener('click',()=>{path=[];draw();});draw();
