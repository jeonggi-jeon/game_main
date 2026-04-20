(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let width = 0;
  let height = 0;
  let particles = [];
  let rafId = 0;
  let resizeTimer = 0;

  function particleCount() {
    return reducedMotion.matches ? 0 : 56;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function initParticles() {
    particles = [];
    const n = particleCount();
    if (n === 0) return;
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: randomBetween(0.6, 2.2),
        vx: randomBetween(-0.35, 0.35),
        vy: randomBetween(-0.25, 0.25),
        hue: Math.random() > 0.5 ? 188 : 290,
        alpha: randomBetween(0.15, 0.55),
      });
    }
  }

  function drawStaticStars() {
    ctx.clearRect(0, 0, width, height);
    const n = 80;
    for (let i = 0; i < n; i++) {
      const x = (Math.sin(i * 9999) * 43758.5453) % 1;
      const y = (Math.cos(i * 7777) * 22468.1337) % 1;
      const px = ((x + 1) / 2) * width;
      const py = ((y + 1) / 2) * height;
      const r = 0.4 + (i % 3) * 0.35;
      ctx.fillStyle = "rgba(148, 163, 184, 0.35)";
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tick() {
    if (reducedMotion.matches || particleCount() === 0 || particles.length === 0) {
      cancelAnimationFrame(rafId);
      drawStaticStars();
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, "rgba(34, 211, 238, 0.03)");
    g.addColorStop(1, "rgba(232, 121, 249, 0.03)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      const fill = `hsla(${p.hue}, 90%, 70%, ${p.alpha})`;
      ctx.shadowColor = fill;
      ctx.shadowBlur = 12;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    rafId = requestAnimationFrame(tick);
  }

  function onMotionChange() {
    cancelAnimationFrame(rafId);
    resize();
    if (reducedMotion.matches) {
      drawStaticStars();
    } else {
      tick();
    }
  }

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });

  reducedMotion.addEventListener("change", onMotionChange);

  resize();
  if (reducedMotion.matches) {
    drawStaticStars();
  } else {
    tick();
  }
})();
