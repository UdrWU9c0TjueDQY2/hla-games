const checks=[...document.querySelectorAll('input[type=checkbox]')];
const copyButton=document.getElementById('copy-result');
const downloadButton=document.getElementById('download-result');
const resultNote=document.getElementById('result-note');
const resultStatus=document.getElementById('result-status');
const resultText=()=>[
  'Sumbriska practice complete',
  'Predict → Check → Explain',
  '6 of 6 practice checks completed.',
  'No board answer included.',
  '',
  'Practice guide: https://udrwu9c0tjuedqy2.github.io/hla-games/sumbriska/predict-check-explain/'
].join('\n');

function update(){
  const n=checks.filter(c=>c.checked).length;
  const complete=n===6;
  document.getElementById('done').textContent=`${n} of 6`;
  document.getElementById('ring').style.setProperty('--angle',`${n*60}deg`);
  document.getElementById('status').textContent=complete
    ?'Practice sheet complete. Pick one observation to bring to your next board.'
    :`Next: ${checks.find(c=>!c.checked).dataset.task}`;
  copyButton.disabled=!complete;
  downloadButton.disabled=!complete;
  resultNote.textContent=complete
    ?'Ready: this completion says only that all six practice checks were marked. It contains no board answer.'
    :'Finish all six checks to unlock a spoiler-safe completion.';
  if(!complete) resultStatus.textContent='';
}

async function copyResult(){
  const text=resultText();
  try{
    await navigator.clipboard.writeText(text);
    resultStatus.textContent='Spoiler-safe completion copied.';
  }catch{
    const field=document.createElement('textarea');
    field.value=text;
    field.setAttribute('readonly','');
    field.className='copy-fallback';
    document.body.append(field);
    field.select();
    const copied=document.execCommand('copy');
    field.remove();
    resultStatus.textContent=copied?'Spoiler-safe completion copied.':'Copy was unavailable. Download the text result instead.';
  }
}

function downloadResult(){
  const blob=new Blob([resultText()],{type:'text/plain;charset=utf-8'});
  const link=document.createElement('a');
  link.href=URL.createObjectURL(blob);
  link.download='sumbriska-practice-complete.txt';
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  resultStatus.textContent='Text completion downloaded.';
}

checks.forEach(c=>c.addEventListener('change',update));
document.getElementById('reset').addEventListener('click',()=>{
  checks.forEach(c=>c.checked=false);
  update();
  checks[0].focus();
});
copyButton.addEventListener('click',copyResult);
downloadButton.addEventListener('click',downloadResult);
update();
