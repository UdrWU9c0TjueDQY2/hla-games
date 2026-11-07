// Honest Little Apps • Sumbriska browser companion, 2025-11-06 through 2026-11-05.
// Run "node reproduce-bridge-census.mjs" to print CSV, or redirect its output to a file.
// Snapshot of the five-island generator. These dates are inputs, not player activity.
const bridges = [[0,1],[1,2],[2,3],[3,4],[4,0],[0,2],[1,3],[0,3]];

function seededRandom(date) {
  let seed = 0;
  for (const character of date) seed = (seed * 31 + character.charCodeAt(0)) | 0;
  return function nextNumber() {
    seed = (seed + 0x6D2B79F5) | 0;
    let mixed = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}
function totals(values, arrows) {
  const sums = [0, 0, 0, 0, 0];
  bridges.forEach(([left,right], i) => sums[arrows[i] ? right : left] += values[i]);
  return sums;
}
function makeBoard(date) {
  const random = seededRandom(date);
  const values = bridges.map(() => 1 + Math.floor(random() * 9));
  const witness = bridges.map(() => random() < 0.5 ? 0 : 1);
  const start = witness.map(side => random() < 0.5 ? 1-side : side);
  let differences = distance(start, witness);
  for (let i = 0; differences < 3 && i < start.length; i++) {
    if (start[i] === witness[i]) { start[i] = 1-start[i]; differences++; }
  }
  const targets = totals(values, witness);
  if (totals(values, start).every((v,i) => v === targets[i])) start[0] = 1-start[0];
  return { values, witness, start, targets };
}
function distance(first, second) {
  return first.reduce((count,side,i) => count + Number(side !== second[i]), 0);
}
function inspect(date) {
  const { values, witness, start, targets } = makeBoard(date);
  let valid = 0;
  let minimum = Infinity;
  for (let mask = 0; mask < 2 ** bridges.length; mask++) {
    const directions = bridges.map((_,i) => (mask >>> i) & 1);
    if (totals(values, directions).every((value,i) => value === targets[i])) {
      valid++;
      minimum = Math.min(minimum, distance(start, directions));
    }
  }
  return [date,valid,minimum,distance(start,witness)].join(',');
}
console.log('utc_date,valid_arrangements,minimum_flips,flips_to_generator_witness');
for (let day = Date.UTC(2025,10,6); day <= Date.UTC(2026,10,5); day += 86400000) {
  console.log(inspect(new Date(day).toISOString().slice(0,10)));
}
