'use strict';
const SETS=[[3,7],[4,9],[6,6],[0,8],[7,8],[9,11]];
function family(a,b){const c=a+b;return [...new Set([a+' + '+b+' = '+c,b+' + '+a+' = '+c,c+' − '+a+' = '+b,c+' − '+b+' = '+a])];}
function deck(a,b){const c=a+b,valid=family(a,b);const good=valid.map(eq=>({eq,valid:true,why:'This is a true equation using the family numbers.'}));const bad=[{eq:'1 + '+(c-1)+' = '+c,valid:false,why:'True arithmetic, but 1 is not one of these family numbers.'},{eq:c+' − 1 = '+(c-1),valid:false,why:'True arithmetic, but it belongs to a different family.'},{eq:a+' + '+b+' = '+(c+1),valid:false,why:'The addition result should be '+c+', not '+(c+1)+'.'}];return good.concat(bad).sort((x,y)=>x.eq.localeCompare(y.eq));}
let index=0,done=new Set(),revealed=new Set();const $=id=>document.getElementById(id);
const work=SETS.map(()=>({chosen:[],feedback:'',explanations:false}));
function showExplanations(){
  $('explanations').replaceChildren();
  if(work[index].explanations)deck(...SETS[index]).forEach(x=>{const p=document.createElement('p');p.textContent=x.eq+' — '+x.why;$('explanations').appendChild(p);});
}
function render(){const [a,b]=SETS[index],c=a+b;$('progress').textContent='Family '+(index+1)+' of '+SETS.length;$('numbers').textContent=a+' · '+b+' · '+c;$('options').replaceChildren();$('feedback').textContent='';$('explanations').replaceChildren();
deck(a,b).forEach((item,i)=>{const label=document.createElement('label');label.className='equation';const input=document.createElement('input');input.type='checkbox';input.value=String(i);input.checked=!!work[index].chosen[i];input.addEventListener('change',()=>{work[index].chosen=selected();work[index].feedback='';work[index].explanations=false;done.delete(index);$('feedback').textContent='';$('explanations').replaceChildren();updateCount();});label.appendChild(input);const text=document.createElement('span');text.textContent=item.eq;label.appendChild(text);$('options').appendChild(label);});
$('feedback').textContent=work[index].feedback;showExplanations();$('previous').disabled=index===0;$('next').disabled=index===SETS.length-1;updateCount();}
function updateCount(){$('completion').textContent='Correctly checked without reveal: '+done.size+'. Families revealed: '+revealed.size+'. Practice families: 6.';}
function selected(){return Array.from($('options').children).map(l=>l.children[0].checked);}
function check(){const items=deck(...SETS[index]),chosen=selected();let missing=0,extra=0;items.forEach((x,i)=>{if(x.valid&&!chosen[i])missing++;if(!x.valid&&chosen[i])extra++;});$('explanations').replaceChildren();
work[index].chosen=chosen;work[index].explanations=false;
if(!missing&&!extra){if(!revealed.has(index))done.add(index);work[index].feedback=(revealed.has(index)?'The revealed set is correct. ':'Family complete. ')+items.filter(x=>x.valid).length+' distinct equations connect these numbers.';}
else{done.delete(index);work[index].feedback='Not yet: '+missing+' family equation(s) still missing; '+extra+' selected equation(s) do not belong. Try again, or reveal the explanation.';}
$('feedback').textContent=work[index].feedback;updateCount();}
function reveal(){revealed.add(index);done.delete(index);const items=deck(...SETS[index]);work[index].chosen=items.map(x=>x.valid);Array.from($('options').children).forEach((l,i)=>l.children[0].checked=items[i].valid);work[index].explanations=true;work[index].feedback='Answer revealed. Read why each equation belongs or does not belong.';showExplanations();$('feedback').textContent=work[index].feedback;updateCount();}
$('check').addEventListener('click',check);$('reveal').addEventListener('click',reveal);$('next').addEventListener('click',()=>{if(index<5){index++;render();$('progress').focus();}});$('previous').addEventListener('click',()=>{if(index>0){index--;render();$('progress').focus();}});$('restart').addEventListener('click',()=>{index=0;done.clear();revealed.clear();work.forEach(x=>{x.chosen=[];x.feedback='';x.explanations=false;});render();$('progress').focus();});render();
