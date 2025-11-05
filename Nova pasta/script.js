(() => {
  const output = document.getElementById('output');
  const historyEl = document.getElementById('history');
  const keys = document.querySelectorAll('.keys .btn');

  let current = '0';
  let previous = null;
  let operator = null;
  let justEvaluated = false;

  function updateDisplay() {
    output.value = current.toString().replace('.', ',');
    historyEl.textContent = previous ? `${previous} ${operator || ''}` : '';
  }

  function inputNumber(num) {
    if (justEvaluated) {
      current = num === '.' ? '0.' : num;
      justEvaluated = false;
      return;
    }

    if (num === '.') {
      if (current.includes('.')) return;
      current += '.';
    } else {
      if (current === '0') current = num;
      else current += num;
    }
  }

  function toggleSign() {
    if (current === '0') return;
    current = (parseFloat(current) * -1).toString();
  }

  function inputPercent() {
    current = (parseFloat(current) / 100).toString();
  }

  function clearAll() {
    current = '0';
    previous = null;
    operator = null;
    justEvaluated = false;
  }

  function setOperator(op) {
    if (operator && !justEvaluated) {
      evaluate();
    }
    previous = current;
    operator = op;
    current = '0';
    justEvaluated = false;
  }

  function evaluate() {
    if (!operator || previous === null) return;
    const a = parseFloat(previous);
    const b = parseFloat(current);
    let result = 0;

    if (Number.isNaN(a) || Number.isNaN(b)) return;

    switch (operator) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/':
        if (b === 0) {
          current = 'Erro';
          previous = null;
          operator = null;
          justEvaluated = true;
          updateDisplay();
          return;
        }
        result = a / b; break;
      default: return;
    }

    result = roundResult(result);
    current = result.toString();
    previous = null;
    operator = null;
    justEvaluated = true;
  }

  function roundResult(n) {
    const s = Number(n.toPrecision(12));
    return s;
  }

  keys.forEach(btn => {
    btn.addEventListener('click', () => {
      const num = btn.getAttribute('data-number');
      const action = btn.getAttribute('data-action');

      if (num !== null) {
        const value = (num === ',') ? '.' : num;
        inputNumber(value);
        updateDisplay();
        return;
      }

      switch (action) {
        case 'clear': clearAll(); updateDisplay(); break;
        case 'toggle-sign': toggleSign(); updateDisplay(); break;
        case 'percent': inputPercent(); updateDisplay(); break;
        case 'operator':
          setOperator(btn.getAttribute('data-value'));
          updateDisplay();
          break;
        case 'equals': evaluate(); updateDisplay(); break;
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
      inputNumber(e.key);
      updateDisplay();
      return;
    }

    if (e.key === '.' || e.key === ',') {
      inputNumber('.');
      updateDisplay();
      return;
    }

    if (e.key === 'Enter' || e.key === '=') {
      evaluate(); updateDisplay(); return;
    }

    if (e.key === 'Backspace') {
      if (justEvaluated) { clearAll(); updateDisplay(); return; }
      if (current.length <= 1 || current === '-0') current = '0';
      else current = current.slice(0, -1);
      updateDisplay();
      return;
    }

    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
      setOperator(e.key);
      updateDisplay();
      return;
    }

    if (e.key.toLowerCase() === 'c') {
      clearAll(); updateDisplay(); return;
    }

    if (e.key === '%') {
      inputPercent(); updateDisplay();
      return;
    }
  });

  clearAll();
  updateDisplay();
})();
