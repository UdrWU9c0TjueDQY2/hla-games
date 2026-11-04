(() => {
 const modes={zen:['ZEN','Get a feel for the timing.','Zen offers relaxed practice with no wipeouts. Use it to see how a tap changes your path before moving to a score-focused run.'],classic:['CLASSIC','Try the core run.','Classic is the standard gravity-flipping run. Focus on one obstacle at a time and use the instant restart to try a different timing.'],hyper:['HYPER','Trade breathing room for speed.','Hyper brings faster speed and double gold. Start here if you already enjoy the controls and want a more demanding pace.']};
 const buttons=document.querySelectorAll('[data-mode]');
 buttons.forEach(button=>button.addEventListener('click',()=>{const mode=button.dataset.mode;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));['mode','result-title','result-body'].forEach((id,i)=>document.getElementById(id).textContent=modes[mode][i]);}));
 const preview=document.getElementById('preview'),toggle=document.getElementById('motion');
 let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function render(){preview.classList.toggle('paused',paused);toggle.textContent=paused?'Resume preview motion':'Pause preview motion';}
 toggle.addEventListener('click',()=>{paused=!paused;render();});render();
})();

