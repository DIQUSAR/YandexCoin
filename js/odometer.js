const Odometer = (() => {
  const SETS = 2;
  const $root = document.getElementById('odometer');

  const _reelPos      = new Map();
  const _reelSnapback = new Map();
  let _lastFormatted  = '';

  const _createStrip = () => {
    const strip = document.createElement('div');
    strip.className = 'odometer__strip';
    for (let s = 0; s < SETS; s++) {
      for (let d = 0; d <= 9; d++) {
        const span = document.createElement('span');
        span.textContent = d;
        strip.appendChild(span);
      }
    }
    return strip;
  };

  const _buildDOM = (formatted) => {
    $root.innerHTML = '';
    _lastFormatted  = formatted;
    _reelPos.clear();
    _reelSnapback.clear();

    for (const ch of formatted) {
      if (ch === '.') {
        const sep = document.createElement('span');
        sep.className   = 'odometer__sep';
        sep.textContent = '.';
        $root.appendChild(sep);
      } else {
        const reel = document.createElement('div');
        reel.className = 'odometer__reel';
        reel.appendChild(_createStrip());
        _reelPos.set(reel, 0);
        $root.appendChild(reel);
      }
    }
  };

  const _positionReel = (reel, digit, delayMs, animate) => {
    const strip      = reel.querySelector('.odometer__strip');
    const currentRow = _reelPos.get(reel) ?? 0;

    const cancel = _reelSnapback.get(reel);
    if (cancel) { cancel(); _reelSnapback.delete(reel); }

    const needsWrap = animate && digit < (currentRow % 10);
    const targetSet = needsWrap ? 1 : (currentRow >= 10 ? 1 : 0);
    const targetRow = targetSet * 10 + digit;

    _reelPos.set(reel, targetRow);

    if (animate) {
      strip.style.transition      = 'transform .32s cubic-bezier(.4,0,.2,1)';
      strip.style.transitionDelay = `${delayMs}ms`;
    } else {
      strip.style.transition      = 'none';
      strip.style.transitionDelay = '0ms';
    }

    strip.style.transform = `translateY(-${targetRow * DIGIT_H}px)`;

    if (animate && targetRow >= 10) {
      let cancelled = false;
      _reelSnapback.set(reel, () => { cancelled = true; });

      strip.addEventListener('transitionend', () => {
        if (cancelled || _reelPos.get(reel) !== targetRow) return;
        _reelSnapback.delete(reel);
        strip.style.transition = 'none';
        strip.style.transform  = `translateY(-${digit * DIGIT_H}px)`;
        _reelPos.set(reel, digit);
      }, { once: true });
    }
  };

  const update = (value, animate = true) => {
    const formatted    = formatBalance(value);
    const needsRebuild = formatted.length !== _lastFormatted.length;

    if (needsRebuild) { _buildDOM(formatted); animate = false; }

    const reels  = [...$root.querySelectorAll('.odometer__reel')];
    const digits = [...formatted].filter(ch => ch !== '.');

    reels.forEach((reel, i) => {
      const delay = animate ? (reels.length - 1 - i) * REEL_DELAY_MS : 0;
      _positionReel(reel, parseInt(digits[i], 10), delay, animate);
    });

    if (!animate) {
      requestAnimationFrame(() => {
        $root.querySelectorAll('.odometer__strip').forEach(s => {
          s.style.transition = s.style.transitionDelay = '';
        });
      });
    }
  };

  return { update };
})();
