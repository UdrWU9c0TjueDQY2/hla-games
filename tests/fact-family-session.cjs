const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
class Element{
 constructor(){this.children=[];this.handlers={};this.textContent='';this.checked=false;this.disabled=false;}
 appendChild(x){this.children.push(x);return x;}
 replaceChildren(){this.children=[];}
 addEventListener(name,fn){this.handlers[name]=fn;}
 focus(){focused=this;}
}
let focused;
const els=new Map(),get=id=>{if(!els.has(id))els.set(id,new Element());return els.get(id);};
const context={document:{getElementById:get,createElement:()=>new Element()}};
vm.createContext(context);
vm.runInContext(fs.readFileSync('src/number-beasts/fact-family-sort/app.js','utf8'),context);
const click=id=>get(id).handlers.click();
const rows=()=>get('options').children;
const choices=()=>rows().map(x=>x.children[0].checked);
const choose=(equation,value=true)=>{const row=rows().find(x=>x.children[1].textContent===equation);assert.ok(row,equation);row.children[0].checked=value;row.children[0].handlers.change();};
for(const eq of ['3 + 7 = 10','7 + 3 = 10','10 − 3 = 7','10 − 7 = 3'])choose(eq);
click('check');assert.match(get('feedback').textContent,/Family complete/);
const original=choices();click('next');assert.equal(focused,get('progress'));click('previous');assert.deepEqual(choices(),original);assert.match(get('feedback').textContent,/Family complete/);
choose('3 + 7 = 10',false);assert.equal(get('feedback').textContent,'');assert.match(get('completion').textContent,/without reveal: 0/);
click('next');click('previous');assert.equal(rows().find(x=>x.children[1].textContent==='3 + 7 = 10').children[0].checked,false);
click('check');assert.match(get('feedback').textContent,/1 family equation/);
click('next');click('previous');assert.match(get('feedback').textContent,/1 family equation/);
click('reveal');const revealed=choices(),explanations=get('explanations').children.length;assert.ok(explanations>0);click('next');click('previous');assert.deepEqual(choices(),revealed);assert.equal(get('explanations').children.length,explanations);assert.match(get('completion').textContent,/Families revealed: 1/);
choose('3 + 7 = 10',false);assert.equal(get('explanations').children.length,0);click('next');click('previous');assert.equal(get('explanations').children.length,0);click('reveal');click('check');assert.match(get('feedback').textContent,/revealed set/);assert.match(get('completion').textContent,/without reveal: 0/);
click('next');click('next');choose('6 + 6 = 12');choose('12 − 6 = 6');click('check');assert.match(get('feedback').textContent,/2 distinct equations/);click('previous');click('next');assert.equal(choices().filter(Boolean).length,2);
click('restart');assert.equal(focused,get('progress'));assert.equal(choices().filter(Boolean).length,0);assert.equal(get('feedback').textContent,'');assert.match(get('completion').textContent,/Families revealed: 0/);click('next');click('next');assert.equal(choices().filter(Boolean).length,0);
console.log('PASS: active-session choices, correct/incorrect/revealed feedback, edit invalidation, doubles, navigation focus and full reset.');
