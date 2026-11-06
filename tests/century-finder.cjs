const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(__dirname + '/../src/pastrush/century-finder/index.html','utf8');
const canonical = 'https://udrwu9c0tjuedqy2.github.io/hla-games/pastrush/century-finder/';
function element() {
  return {
    value:'', textContent:'', style:{}, dataset:{}, listeners:{}, attributes:{},
    addEventListener(name, handler) { this.listeners[name] = handler; },
    setAttribute(name, value) { this.attributes[name] = value; },
    focus() { this.focused = true; },
    select() { this.selected = true; }
  };
}
function initialise(hash='') {
  const nodes = Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)].map(([,id]) => [id, element()]));
  const presets = [...html.matchAll(/data-year="(\d+)" data-era="([^"]+)"/g)].map(([,year,era]) =>
    Object.assign(element(), {dataset:{year,era}}));
  const rail = element();
  const win = Object.assign(element(), {location:{hash}});
  const clipboard = {writeText(text) { this.text=text; return Promise.resolve(); }};
  const context = {
    URL, navigator:{clipboard}, window:win,
    history:{replaceState(_,__,fragment) { win.location.hash = fragment; }},
    document:{getElementById:id=>nodes[id], querySelector:s=>s==='.rail'?rail:{href:canonical}, querySelectorAll:()=>presets}
  };
  vm.createContext(context);
  for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) vm.runInContext(match[1],context);
  return {context,nodes,presets,rail,clipboard};
}
async function main() {
  const {context,nodes,presets,rail,clipboard} = initialise();
  for(let year=1; year<=9999; year++) for(const era of ['BCE','CE']) {
    const r=context.century(String(year),era), n=Math.ceil(year/100);
    assert.equal(r.n,n);
    assert.equal(r.first, era==='CE' ? (n-1)*100+1 : n*100);
    assert.equal(r.last, era==='CE' ? n*100 : (n-1)*100+1);
    assert.ok(r.pos>=1 && r.pos<=100);
  }
  for(const value of ['','0','-1','1.5','1e3','10000','NaN']) {
    assert.equal(context.century(value,'CE'),null);
    assert.equal(context.yearGap(value,'BCE','10','CE'),null);
  }
  for (const [n,s] of [[1,'1st'],[2,'2nd'],[3,'3rd'],[11,'11th'],[12,'12th'],[13,'13th'],[21,'21st'],[100,'100th']]) assert.equal(context.ordinal(n),s);
  presets[3].listeners.click(); assert.equal(nodes.answer.textContent,'2nd century BCE'); assert.equal(nodes.pin.style.left,'100%');
  nodes.year.listeners.input(); assert.equal(nodes.result.hidden,true);
  nodes.year.value='0'; nodes.form.listeners.submit({preventDefault(){}}); assert.equal(rail.hidden,true);
  assert.equal(context.yearGap('1','BCE','1','CE').distance,1);
  const yearCoordinate = label => {
    const [year, era]=label.split(' ');
    return era==='BCE' ? 1-Number(year) : Number(year);
  };
  const pairs = new Set();
  for (let set=1; set<=4; set++) {
    assert.match(nodes['round-label'].textContent,new RegExp('Set '+set+' of 4'));
    for(let round=0; round<4; round++) {
      const buttons=[nodes['earlier-a'],nodes['earlier-b']];
      const dates=buttons.map(button=>button.textContent);
      const key=dates.slice().sort().join('|'); assert.ok(!pairs.has(key)); pairs.add(key);
      const answer=yearCoordinate(dates[0]) < yearCoordinate(dates[1]) ? 0 : 1;
      buttons[answer].listeners.click();
      const feedback=nodes.feedback.textContent;
      buttons[1-answer].listeners.click(); assert.equal(nodes.feedback.textContent,feedback);
      assert.equal(nodes['challenge-finish'].hidden,round!==3);
      if(round<3) nodes['next-round'].listeners.click(); else assert.match(feedback,/4 of 4/);
    }
    await nodes['copy-set'].listeners.click(); assert.equal(clipboard.text,canonical+'#chronology-set-'+set);
    assert.equal(initialise('#chronology-set-'+set).nodes['earlier-a'].textContent,vm.runInContext('decks['+(set-1)+'][0].dates[0]',context));
    if(set===4) {
      clipboard.writeText=()=>Promise.reject(new Error('Clipboard unavailable'));
      await nodes['copy-set'].listeners.click(); assert.equal(nodes['manual-copy'].hidden,false);
      assert.equal(nodes['replay-url'].value,canonical+'#chronology-set-4');
      assert.ok(nodes['replay-url'].selected);
      nodes['next-round'].listeners.click(); assert.equal(nodes['challenge-finish'].hidden,true);
      assert.match(nodes['round-label'].textContent,/Set 4 of 4 · Round 1 of 4/);
    }
    nodes['new-set'].listeners.click();
  }
  assert.equal(pairs.size,16);
  assert.equal(context.window.location.hash,'#chronology-set-1');
  assert.match(initialise('#nonsense').nodes['round-label'].textContent,/Set 1 of 4/);
  assert.ok(html.includes('id6818795908')); assert.ok(!/localStorage|XMLHttpRequest|fetch\(/.test(html));
  console.log('Verified 19,998 year/era placements, all 16 unique pairs, replay, repeat clicks, all four shared links and denied clipboard fallback.');
}
main().catch(error=>{console.error(error);process.exit(1);});
