const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync(process.argv[2]||'src/pastrush/resized-map-scale-lab/app.js','utf8');
class El{constructor(value=''){this.value=value;this.textContent='';this.hidden=false;this.disabled=false;this.style={};this.listeners={};this.children=[];}addEventListener(t,f){this.listeners[t]=f;}append(x){this.children.push(x);}click(){if(this.listeners.click)this.listeners.click();this.clicked=true;}remove(){this.removed=true;}fire(t){this.listeners[t]();}}
const els={scale:new El('50000'),resize:new El('150'),length:new El('3'),unit:new El('cm'),calculate:new El(),reset:new El(),result:new El(),diagram:new El(),copyline:new El(),copylabel:new El()};
const actions=new El(),body=new El();let madeUrl='',revoked='',blobParts;
const document={getElementById:id=>els[id],querySelector:q=>q==='.actions'?actions:null,createElement:tag=>new El(),body};
function Blob(parts,opts){blobParts=parts;this.parts=parts;this.type=opts.type;}
const URL={createObjectURL:()=>madeUrl='blob:test',revokeObjectURL:u=>revoked=u};
vm.runInNewContext(source,{document,Blob,URL,setTimeout:f=>f()});
const save=actions.children[0];assert.equal(save.textContent,'Download result');assert.equal(save.disabled,true);
els.calculate.fire('click');assert.equal(save.disabled,false);assert.match(els.result.textContent,/1:33,333\.333333/);assert.match(els.result.textContent,/Distance: 1,000 metres \(1 km\)/);assert.match(els.result.textContent,/does not send it to PastRush/);
save.fire('click');assert.equal(madeUrl,'blob:test');assert.equal(revoked,'blob:test');assert.equal(body.children[0].download,'resized-map-scale-result.txt');assert.match(blobParts[0],/Original ratio: 1:50,000/);assert.match(blobParts[0],/Uniform print size: 150%/);assert.match(blobParts[0],/Measured length: 3 cm/);assert.match(blobParts[0],/not a route or navigation estimate/);
els.length.value='4';els.length.fire('input');assert.equal(save.disabled,true);assert.equal(els.result.textContent,'');assert.equal(els.diagram.hidden,true);
save.fire('click');assert.equal(body.children.length,1);
els.scale.value='1.5';els.calculate.fire('click');assert.match(els.result.textContent,/whole scale denominator/);assert.equal(save.disabled,true);
els.scale.value='50000';els.length.value='3';els.unit.value='in';els.calculate.fire('click');assert.match(els.result.textContent,/Distance: 2,540 metres/);assert.equal(save.disabled,false);
els.unit.fire('input');assert.equal(save.disabled,true);
els.reset.fire('click');assert.equal(els.scale.value,'50000');assert.equal(els.resize.value,'150');assert.equal(els.length.value,'3');assert.equal(els.unit.value,'cm');assert.equal(save.disabled,true);
console.log('PastRush resized-map export checks passed: 15 assertions');
