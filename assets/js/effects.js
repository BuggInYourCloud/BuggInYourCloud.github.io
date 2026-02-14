(function() {
  /* ── Scroll Reveal ── */
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('vis');
      var children = e.target.querySelectorAll('.reveal-stagger');
      children.forEach(function(c) {
        Array.from(c.children).forEach(function(child, i) {
          child.style.transitionDelay = (i * 120) + 'ms';
        });
        setTimeout(function() { c.classList.add('vis'); }, 150);
      });
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(function(el) { io.observe(el); });

  /* ── 3D Tilt + Cursor Spotlight ── */
  document.querySelectorAll('[data-tilt]').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      card.style.transform = 'perspective(800px) rotateX(' + ((0.5-y)*10) + 'deg) rotateY(' + ((x-0.5)*10) + 'deg) scale(1.02)';
      card.style.setProperty('--mx', (x*100)+'%');
      card.style.setProperty('--my', (y*100)+'%');
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
      card.style.transition = 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)';
    });
    card.addEventListener('mouseenter', function() {
      card.style.transition = 'box-shadow 400ms ease, background 400ms ease, border-color 400ms ease';
    });
  });

  /* ── Magnetic Links ── */
  document.querySelectorAll('[data-magnetic]').forEach(function(link) {
    link.addEventListener('mousemove', function(e) {
      var r = link.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;
      var dx = (e.clientX - cx) * 0.15;
      var dy = (e.clientY - cy) * 0.15;
      link.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    });
    link.addEventListener('mouseleave', function() {
      link.style.transform = '';
      link.style.transition = 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)';
    });
    link.addEventListener('mouseenter', function() {
      link.style.transition = 'background 400ms ease, border-color 400ms ease, box-shadow 400ms ease';
    });
  });
})();
