'use strict';

const byId = id => document.getElementById(id);
const form = byId('ladder');
const result = byId('result');
const breakdown = byId('breakdown');
const rows = byId('rows');
const previewLimit = 20;

// The browser accepts decimals and scientific notation. Represent its numeric
// value as a fraction so an exact half-cent always rounds up at each purchase.
function fraction(value) {
  const [coefficient, exponent = '0'] = String(value).split('e');
  const [whole, decimal = ''] = coefficient.split('.');
  const digits = BigInt(whole + decimal);
  const scale = decimal.length - Number(exponent);
  return scale > 0
    ? { numerator: digits, denominator: 10n ** BigInt(scale) }
    : { numerator: digits * 10n ** BigInt(-scale), denominator: 1n };
}

function roundHalfUp(numerator, denominator) {
  return (numerator * 2n + denominator) / (denominator * 2n);
}

function credits(cents) {
  return (cents / 100n).toLocaleString('en-US') + '.' + (cents % 100n).toString().padStart(2, '0');
}

function ladder(firstPrice, growth, quantity, budget) {
  const steps = [];
  const divisor = growth.denominator * 100n;
  let quantityBought = 0;
  let total = 0n;
  let price = firstPrice;
  let lastStep;
  while (quantityBought < quantity && (budget === null || total + price <= budget)) {
    const next = roundHalfUp(price * (divisor + growth.numerator), divisor);
    let copies = 1;
    // If a rounded price repeats, every later copy costs the same. A balance
    // of one million at one cent per copy should take one batch, not 100M steps.
    if (next === price) {
      copies = budget === null ? quantity - quantityBought : Number((budget - total) / price);
    }
    const shown = Math.min(copies, previewLimit - steps.length);
    for (let i = 1; i <= shown; i++) {
      steps.push({ number: quantityBought + i, price, total: total + BigInt(i) * price });
    }
    quantityBought += copies;
    total += BigInt(copies) * price;
    lastStep = { number: quantityBought, price, total };
    price = next;
  }
  if (quantityBought > previewLimit) steps.push(lastStep);
  return { steps, quantityBought, total, nextPrice: price };
}

function clearResult() {
  result.textContent = '';
  rows.replaceChildren();
  breakdown.hidden = true;
  byId('after-result').hidden = true;
  form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
}

function invalid(id, message) {
  const field = byId(id);
  field.setAttribute('aria-invalid', 'true');
  result.textContent = message;
  field.focus();
}

function show() {
  clearResult();
  const price = byId('price').valueAsNumber;
  const growth = byId('growth').valueAsNumber;
  const byBudget = byId('mode-budget').checked;
  if (!Number.isFinite(price) || price < 0.01 || price > 10000) {
    return invalid('price', 'Enter a first price from 0.01 to 10,000 credits.');
  }
  if (!Number.isFinite(growth) || growth < 0 || growth > 100) {
    return invalid('growth', 'Enter a price increase from 0 to 100 percent.');
  }
  const inputPrice = fraction(price);
  const firstPrice = roundHalfUp(inputPrice.numerator * 100n, inputPrice.denominator);
  let quantity = Infinity;
  let balance = null;
  if (byBudget) {
    const budget = byId('budget').valueAsNumber;
    if (!Number.isFinite(budget) || budget < 0 || budget > 1000000) {
      return invalid('budget', 'Enter a budget from 0 to 1,000,000 fictional credits.');
    }
    const inputBudget = fraction(budget);
    if ((inputBudget.numerator * 100n) % inputBudget.denominator !== 0n) {
      return invalid('budget', 'Enter a budget in whole credits or cents, with up to two decimal places.');
    }
    balance = (inputBudget.numerator * 100n) / inputBudget.denominator;
  } else {
    quantity = byId('count').valueAsNumber;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return invalid('count', 'Enter a whole purchase count from 1 to 20.');
    }
  }
  const { steps, quantityBought, total, nextPrice } = ladder(firstPrice, fraction(growth), quantity, balance);
  const n = quantityBought.toLocaleString('en-US');
  const upgrades = quantityBought === 1 ? 'upgrade' : 'upgrades';
  if (byBudget) {
    const left = balance - total;
    result.textContent = `${credits(balance)} credits can buy ${n} ${upgrades}.\nSpent ${credits(total)}. Left over ${credits(left)}.\nThe next upgrade costs ${credits(nextPrice)}. You need ${credits(nextPrice - left)} more.`;
  } else {
    const flat = firstPrice * BigInt(quantityBought);
    result.textContent = `${n} ${upgrades} ${quantityBought === 1 ? 'costs' : 'cost'} ${credits(total)} credits.\nAt the first price throughout, the same quantity would cost ${credits(flat)}. The price increases add ${credits(total - flat)}.\nThe next upgrade costs ${credits(nextPrice)}.`;
  }
  byId('after-result').hidden = false;
  if (!steps.length) return;
  byId('caption').textContent = quantityBought > previewLimit + 1
    ? `Showing the first ${previewLimit} purchases and purchase ${n}.`
    : 'Price and running total, in fictional credits';
  for (const step of steps) {
    const row = document.createElement('tr');
    const label = document.createElement('th');
    label.scope = 'row';
    label.textContent = step.number.toLocaleString('en-US');
    row.append(label);
    for (const value of [step.price, step.total]) {
      const cell = document.createElement('td');
      cell.textContent = credits(value);
      row.append(cell);
    }
    rows.append(row);
  }
  breakdown.hidden = false;
}

function setMode() {
  const byBudget = byId('mode-budget').checked;
  byId('count-field').hidden = byBudget;
  byId('budget-field').hidden = !byBudget;
  byId('count').disabled = byBudget;
  byId('budget').disabled = !byBudget;
  byId('calculate').textContent = byBudget ? 'Find affordable upgrades' : 'Show every purchase';
  clearResult();
}

form.addEventListener('submit', event => { event.preventDefault(); show(); });
form.querySelectorAll('input[type="number"]').forEach(input => input.addEventListener('input', clearResult));
form.querySelectorAll('input[name="mode"]').forEach(input => input.addEventListener('change', setMode));
byId('reset-example').addEventListener('click', () => { form.reset(); setMode(); show(); });
setMode();
show();
