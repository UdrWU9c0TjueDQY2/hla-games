const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('src/cash-empire-clicker/big-number-compare/app.js','utf8');
class El{constructor(value=''){this.value=value;this.textContent='';this.hidden=false;this.style={};this.listeners={};this.children=[];}addEventListener(t,f){this.listeners[t]=f;}append(x){this.children.push(x);}focus(){this.focused=true;}select(){this.selected=true;}click(){if(this.listeners.click)return this.listeners.click();this.clicked=true;}remove(){this.removed=true;}fire(t){return this.listeners[t]&&this.listeners[t]();}}
const ids=['a','b','compare','swap','copy','download','error','output','full-a','full-b','bar-a','bar-b','result','portable-status','manual','portable-text','example0','example1','example2'];
const els=Object.fromEntries(ids.map(id=>[id,new El()]));els.a.value='950K';els.b.value='1.2M';els.output.hidden=true;els.manual.hidden=true;
const body=new El(),links=[];let clipboard='',blobParts=[],created='',revoked='';
const document={getElementById:id=>els[id],createElement:()=>{const e=new El();links.push(e);return e;},body};
const navigator={clipboard:{writeText:async t=>{clipboard=t;}}};
function Blob(parts,opts){blobParts=parts;this.type=opts.type;}
const URL={createObjectURL:()=>created='blob:comparison',revokeObjectURL:u=>revoked=u};
vm.runInNewContext(source,{document,navigator,Blob,URL,setTimeout:f=>f()});
assert.equal(els.output.hidden,false);assert.match(els['portable-text'].value,/Number A: 950K = 950,000/);assert.match(els['portable-text'].value,/Number B: 1.2M = 1,200,000/);assert.match(els['portable-text'].value,/not an affordability check/i);
Promise.resolve(els.copy.fire('click')).then(()=>{assert.match(clipboard,/Exact difference between typed values: 250,000/);assert.match(els['portable-status'].textContent,/not been sent anywhere/);els.download.fire('click');assert.equal(created,'blob:comparison');assert.equal(links[0].download,'idle-game-number-comparison.txt');assert.match(blobParts[0],/Honest Little Apps/);assert.equal(revoked,'blob:comparison');els.a.value='2M';els.a.fire('input');assert.equal(els.output.hidden,true);assert.equal(els['portable-text'].value,'');assert.equal(els.manual.hidden,true);navigator.clipboard=null;els.compare.fire('click');return Promise.resolve(els.copy.fire('click'));}).then(()=>{assert.equal(els.manual.hidden,false);assert.equal(els['portable-text'].selected,true);assert.match(els['portable-status'].textContent,/Automatic copy was blocked/);console.log('Cash Empire portable comparison checks passed');});
