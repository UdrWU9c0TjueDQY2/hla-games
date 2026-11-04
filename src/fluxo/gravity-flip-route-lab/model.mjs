// Original discrete route puzzle; not Fluxo's native movement model.
export const courses = [
 {name:'First crossing',start:0,gates:[0,1,0,2,0,1,1,0],note:'A clear gate gives you a choice. A blocked lane does not.'},
 {name:'Hold your line',start:0,gates:[0,0,1,0,0,1,0,2],note:'Changing lanes at every clear gate adds work. Look at the next blocked lane.'},
 {name:'Ceiling start',start:1,gates:[2,0,0,1,0,2,0,1],note:'Start on the ceiling. The same two choices still work.'},
 {name:'Alternating signals',start:0,gates:[1,2,1,0,2,1,2,0],note:'Several changes are necessary here. Count only the changes you actually make.'},
 {name:'The long gap',start:1,gates:[0,0,2,0,0,0,1,0],note:'Several equally short routes can cross a long clear gap.'},
 {name:'Look one gate ahead',start:0,gates:[2,0,1,0,2,0,1,2],note:'Use clear gates to prepare, or wait until the next gate. Both can be valid.'}
];
// Gate 0: both clear. Gate 1: floor blocked. Gate 2: ceiling blocked.
export const safe = (gate,lane) => gate !== lane+1;
export function inspect(course,actions) {
 if(!Array.isArray(actions)||actions.length>course.gates.length||actions.some(a=>a!==0&&a!==1)) throw new Error('Invalid route');
 let lane=course.start,flips=0; const lanes=[];
 for(let i=0;i<actions.length;i++){lane^=actions[i];flips+=actions[i];lanes.push(lane);if(!safe(course.gates[i],lane))return {valid:false,collision:i,lane,flips,lanes,complete:false};}
 return {valid:true,lane,flips,lanes,complete:actions.length===course.gates.length};
}
export function continuations(course,actions=[]) {
 const state=inspect(course,actions);if(!state.valid)return [];
 const remaining=course.gates.length-actions.length, found=[];
 for(let mask=0;mask<2**remaining;mask++){
  const tail=Array.from({length:remaining},(_,i)=>(mask>>i)&1),route=[...actions,...tail],s=inspect(course,route);
  if(s.valid)found.push({actions:route,flips:s.flips,lanes:s.lanes});
 }
 return found.sort((a,b)=>a.flips-b.flips);
}

