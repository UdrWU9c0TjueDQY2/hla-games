function carryShot(shot, beasts) {
  let carry=shot; const steps=[];
  for (const beast of beasts) {
    if (carry===0) break;
    const sum=carry+beast;
    const kind=sum<10?'feed':sum===10?'bond':'bridge';
    steps.push({shot:carry,beast,sum,kind,left:sum>10?sum-10:0});
    carry=sum>10?sum-10:0;
  }
  return {steps,spill:carry};
}
if(typeof module!=='undefined') module.exports={carryShot};
