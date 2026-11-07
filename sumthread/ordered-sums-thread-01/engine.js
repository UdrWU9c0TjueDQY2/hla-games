const VALUES=[1,2,3,3,2,4,1,2,3],TARGETS=[6,9,6];
function inspectPath(path){
 let total=0,target=0;const seen=new Set(),checkpoints=[];
 for(let i=0;i<path.length;i++){
  const cell=path[i];
  if(!Number.isInteger(cell)||cell<0||cell>8)return{ok:false,error:'Choose a tile on the board.'};
  if(i===0&&cell!==0)return{ok:false,error:'Begin at START in the top-left corner.'};
  if(seen.has(cell))return{ok:false,error:'A tile can appear only once in the path.'};
  if(i){const last=path[i-1];if(Math.abs(Math.floor(last/3)-Math.floor(cell/3))+Math.abs(last%3-cell%3)!==1)return{ok:false,error:'Move one tile up, down, left or right. No diagonals.'};}
  if(target>=TARGETS.length)return{ok:false,error:'All targets must finish on the final tile.'};
  seen.add(cell);total+=VALUES[cell];
  if(total>TARGETS[target])return{ok:false,error:`That would pass target ${TARGETS[target]}. Try a different route or undo.`};
  if(total===TARGETS[target]){checkpoints.push(cell);target++;total=0;if(target===TARGETS.length&&i!==8)return{ok:false,error:'The final target must finish on tile nine.'};}
 }
 if(path.length===9&&target!==3)return{ok:false,error:'Every tile is used, but the ordered targets are not complete.'};
 return{ok:true,total,target,checkpoints,won:path.length===9&&target===3};
}
if(typeof module!=='undefined')module.exports={VALUES,TARGETS,inspectPath};
