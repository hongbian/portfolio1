/* ============================================================
   ✦ portfolio script — soft interactions
   ============================================================ */

(() => {

  // -----------------------------------------
  // banner reveal on scroll
  // -----------------------------------------
  const banners = document.querySelectorAll('.banner');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // small stagger
        setTimeout(() => entry.target.classList.add('is-visible'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
  banners.forEach(b => io.observe(b));

  // safety net: if any banner is in viewport on load, reveal it immediately
  // (handles case where banner is already visible on page load)
  requestAnimationFrame(() => {
    banners.forEach((b, i) => {
      const rect = b.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(() => b.classList.add('is-visible'), i * 80);
      }
    });
  });
  // ultimate fallback: after 3s, reveal anything still hidden
  setTimeout(() => {
    banners.forEach(b => b.classList.add('is-visible'));
  }, 3000);

  // -----------------------------------------
  // banner 3D tilt on mouse move
  // -----------------------------------------
  banners.forEach(banner => {
    const inner = banner.querySelector('.banner-inner');
    if (!inner) return;

    banner.addEventListener('mousemove', (e) => {
      const rect = banner.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0 -> 1
      const y = (e.clientY - rect.top) / rect.height;   // 0 -> 1
      const rotY = (x - 0.5) * 8;   // -4 to 4 deg
      const rotX = (0.5 - y) * 6;   // -3 to 3 deg
      inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    banner.addEventListener('mouseleave', () => {
      inner.style.transform = '';
    });
  });

  // -----------------------------------------
  // character parallax — follows mouse softly,
  // making the "pop out" feel 3D
  // -----------------------------------------
  const stage = document.querySelector('.char-stage');
  const charImg = document.querySelector('.char-img');
  const panelFrame = document.querySelector('.panel-frame');

  if (stage && charImg && panelFrame) {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = (e.clientX - cx) / window.innerWidth;   // -0.5 to 0.5
      targetY = (e.clientY - cy) / window.innerHeight;  // -0.5 to 0.5
    });

    const baseRot = -2; // matches CSS

    function tick() {
      // ease toward target
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      // char moves more than frame (parallax)
      const cTx = currentX * 18;
      const cTy = currentY * 12;
      charImg.style.transform =
        `translateX(calc(-50% + ${cTx}px)) translateY(calc(-8% + ${cTy}px))`;

      // frame tilts slightly opposite
      const fRot = baseRot + currentX * -2;
      const fTy = currentY * -6;
      panelFrame.style.transform =
        `rotate(${fRot}deg) translateY(${fTy}px)`;

      requestAnimationFrame(tick);
    }
    // only run on devices that aren't touch-only
    if (window.matchMedia('(hover: hover)').matches) {
      tick();
    }
  }

  // -----------------------------------------
  // animated typing tagline (subtle)
  // -----------------------------------------
  // (nothing here — kept restrained per brief)

  // -----------------------------------------
  // konami-style easter egg: press ↑↑↓↓ for a wink
  // -----------------------------------------
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown'];
  let pos = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key === code[pos]) {
      pos++;
      if (pos === code.length) {
        document.body.style.transition = 'filter .8s ease';
        document.body.style.filter = 'hue-rotate(40deg) saturate(1.2)';
        setTimeout(() => { document.body.style.filter = ''; }, 1400);
        pos = 0;
      }
    } else {
      pos = 0;
    }
  });

})();
