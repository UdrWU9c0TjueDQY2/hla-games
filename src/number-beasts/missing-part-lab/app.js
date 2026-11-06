(() => {
  const rounds = [[10, 6], [10, 3], [15, 7], [15, 11], [20, 8], [20, 17]];
  const correctPositions = [1, 2, 0, 2, 0, 1];
  const byId = id => document.getElementById(id);
  const countControls = document.createElement('div');
  const countButton = document.createElement('button');
  const countStatus = document.createElement('p');
  countButton.type = 'button';
  countButton.className = 'secondary';
  countStatus.setAttribute('role', 'status');
  countControls.append(countButton, countStatus);
  byId('choices').before(countControls);
  byId('question').tabIndex = -1;
  let round = 0;
  let jumps = 0;
  let solved = false;

  function showRound(moveFocus = false) {
    const [whole, part] = rounds[round];
    const answer = whole - part;
    solved = false;
    jumps = 0;
    countControls.hidden = false;
    countButton.disabled = false;
    countButton.textContent = 'Count on from ' + part;
    countStatus.textContent = '';
    byId('round').textContent = 'Round ' + (round + 1) + ' of ' + rounds.length;
    byId('question').textContent = part + ' + ? = ' + whole;
    byId('known').textContent = part;
    byId('known').style.width = (part / whole * 100) + '%';
    byId('missing').style.width = (answer / whole * 100) + '%';
    byId('missing').textContent = '?';
    byId('feedback').textContent = '';
    byId('next').disabled = true;
    byId('next').textContent = round === rounds.length - 1 ? 'See recap' : 'Next puzzle';
    byId('choices').replaceChildren();
    const choices = [answer - 1, answer + 2];
    choices.splice(correctPositions[round], 0, answer);
    for (const n of choices) {
      const choice = document.createElement('button');
      choice.type = 'button';
      choice.textContent = n;
      choice.setAttribute('aria-label', 'Answer ' + n);
      choice.addEventListener('click', () => {
        if (solved) return;
        if (n !== answer) {
          const direction = part + n < whole ? 'below' : 'above';
          byId('feedback').textContent = part + ' + ' + n + ' = ' + (part + n) +
            ', which is ' + direction + ' ' + whole + '. Try another part.';
          return;
        }
        solved = true;
        byId('missing').textContent = answer;
        countControls.hidden = true;
        byId('feedback').textContent = 'Yes. ' + part + ' + ' + answer + ' = ' + whole +
          ', so ' + whole + ' − ' + part + ' = ' + answer + '.';
        byId('next').disabled = false;
        byId('next').focus();
      });
      byId('choices').append(choice);
    }
    if (moveFocus) byId('question').focus();
  }

  countButton.addEventListener('click', () => {
    const [whole, part] = rounds[round];
    if (solved || part + jumps >= whole) return;
    jumps++;
    const reached = part + jumps;
    const path = Array.from({length: jumps + 1}, (_, offset) => part + offset).join(' → ');
    const total = jumps + (jumps === 1 ? ' jump' : ' jumps');
    countStatus.textContent = path + '. ' + total + (reached === whole
      ? ' to reach the whole. Choose the number of jumps.'
      : ' so far. Keep counting to ' + whole + '.');
    countButton.textContent = reached === whole ? 'Reached ' + whole : 'Count one more';
    countButton.disabled = reached === whole;
    if (countButton.disabled) byId('choices').querySelector('button').focus();
  });

  byId('next').addEventListener('click', () => {
    if (!solved) return;
    if (round < rounds.length - 1) {
      round++;
      showRound(true);
      return;
    }
    byId('round').textContent = 'Six puzzles completed';
    byId('question').textContent = 'Two parts. One whole.';
    byId('choices').replaceChildren();
    byId('next').disabled = true;
    byId('feedback').textContent = 'You used the same relationship with wholes of 10, 15 and 20. Ready to plan a whole chain? Explore Number Beasts below.';
    byId('question').focus();
  });
  byId('restart').addEventListener('click', () => {
    round = 0;
    showRound(true);
  });
  const copyButton = byId('copy-embed');
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const field = byId('embed-code');
      const status = byId('copy-embed-status');
      try {
        await navigator.clipboard.writeText(field.value);
        status.textContent = 'Embed code copied.';
      } catch {
        field.focus();
        field.select();
        status.textContent = 'The code is selected. Copy it with your browser or keyboard.';
      }
    });
  }
  showRound();
})();
