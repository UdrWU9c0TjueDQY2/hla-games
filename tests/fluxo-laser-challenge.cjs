'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');

const root=path.resolve(__dirname,'..');
const target=process.env.TARGET_DIR||'src';
const base=path.join(root,target,'fluxo/laser-gate-timing-puzzle');
const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const js=fs.readFileSync(path.join(base,'app.js'),'utf8');
const model=require(path.join(base,'app.js'));

assert.deepEqual(model.sharedState('?course=3&start=19'),{courseIndex:2,start:19});
for(const search of ['', '?course=0&start=1', '?course=4&start=1', '?course=1&start=-1', '?course=1&start=20', '?course=1&start=1.5', '?course=x&start=3'])assert.equal(model.sharedState(search),null);
const item=model.challenge(0,6);
assert.equal(item.url,'https://udrwu9c0tjuedqy2.github.io/hla-games/fluxo/laser-gate-timing-puzzle/?course=1&start=6#tool');
assert.match(item.text,/Course 1, departure tick 6/);
assert.doesNotMatch(item.text,/clear course|blocked start|open|closed/i);

function page(url='https://udrwu9c0tjuedqy2.github.io/hla-games/fluxo/laser-gate-timing-puzzle/'){
 const dom=new JSDOM(html,{url,runScripts:'outside-only',pretendToBeVisual:true});
 dom.window.eval(js);
 return dom;
}
const click=(dom,id)=>dom.window.document.getElementById(id).dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
const input=(dom,id)=>dom.window.document.getElementById(id).dispatchEvent(new dom.window.Event('input',{bubbles:true}));

(async()=>{
 const dom=page(),d=dom.window.document,copied=[];
 Object.defineProperty(dom.window.navigator,'clipboard',{configurable:true,value:{writeText:async value=>copied.push(value)}});
 assert.equal(d.getElementById('challenge').hidden,true);
 d.getElementById('start').value='6';click(dom,'check');
 assert.equal(d.getElementById('challenge').hidden,false);
 assert.match(d.getElementById('status').textContent,/Clear course/);
 assert.doesNotMatch(d.getElementById('copy-challenge').dataset.text,/Clear course|Blocked start/);
 click(dom,'copy-challenge');await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(copied.length,1);assert.match(copied[0],/course=1&start=6#tool/);
 assert.match(d.getElementById('challenge-status').textContent,/result is not included/);
 d.getElementById('start').value='7';input(dom,'start');
 assert.equal(d.getElementById('challenge').hidden,true);assert.equal(d.getElementById('challenge-status').textContent,'');

 Object.defineProperty(dom.window.navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('denied')}}});
 click(dom,'check');click(dom,'copy-challenge');await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(d.getElementById('challenge-fallback-label').hidden,false);
 assert.match(d.getElementById('challenge-fallback').value,/course=1&start=7#tool/);
 assert.equal(d.getElementById('challenge-fallback').selectionStart,0);
 assert.equal(d.getElementById('challenge-fallback').selectionEnd,d.getElementById('challenge-fallback').value.length);

 let resolveWrite;
 Object.defineProperty(dom.window.navigator,'clipboard',{configurable:true,value:{writeText:()=>new Promise(resolve=>{resolveWrite=resolve})}});
 click(dom,'copy-challenge');d.getElementById('start').value='8';input(dom,'start');resolveWrite();await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(d.getElementById('challenge-status').textContent,'');
 assert.equal(d.getElementById('challenge').hidden,true);

 const shared=page('https://udrwu9c0tjuedqy2.github.io/hla-games/fluxo/laser-gate-timing-puzzle/?course=3&start=19#tool'),sd=shared.window.document;
 assert.equal(sd.getElementById('course').value,'2');assert.equal(sd.getElementById('start').value,'19');
 assert.match(sd.getElementById('status').textContent,/shared departure is loaded/i);
 assert.equal(sd.getElementById('challenge').hidden,true);
 click(shared,'check');assert.equal(sd.getElementById('challenge').hidden,false);assert.match(sd.getElementById('copy-challenge').dataset.text,/Course 3, departure tick 19/);

 click(shared,'reset');assert.equal(sd.getElementById('start').value,'0');assert.equal(sd.getElementById('challenge').hidden,true);
 console.log('PASS '+target+' Fluxo spoiler-free challenge link, copy success/fallback/race, shared-state validation and reset');
})().catch(error=>{console.error(error);process.exitCode=1});
