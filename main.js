// ═══ CUSTOM CURSOR ═══
var dot = document.getElementById('cursorDot');
var ring = document.getElementById('cursorRing');
var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.transform = 'translate(' + (mouseX - 4) + 'px,' + (mouseY - 4) + 'px)';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.transform = 'translate(' + (ringX - 20) + 'px,' + (ringY - 20) + 'px)';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .service-card, .project-card, .ticker-tag, .cert-chip, .qa-item, .faq-item, .blog-card, .testimonial-card, .story-stat, .framework-step, .logo-item').forEach(function(el) {
  el.addEventListener('mouseenter', function() { ring.classList.add('hovering'); });
  el.addEventListener('mouseleave', function() { ring.classList.remove('hovering'); });
});

// ═══ SERVICE CARD MOUSE GLOW ═══
document.querySelectorAll('.service-card').forEach(function(card) {
  card.addEventListener('mousemove', function(e) {
    var r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });
});

// ═══ NAV SCROLL ═══
var nav = document.getElementById('nav');
window.addEventListener('scroll', function() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Active nav link (only for hash links on current page)
var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
var observerNav = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function(l) { l.classList.remove('active'); });
      var link = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.3 });
sections.forEach(function(s) { observerNav.observe(s); });

// ═══ SCROLL REVEAL ═══
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(function(el) { revealObserver.observe(el); });

// ═══ TIMELINE ═══
var tlObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e, i) {
    if (e.isIntersecting) { setTimeout(function() { e.target.classList.add('visible'); }, i * 120); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.timeline-item').forEach(function(el) { tlObserver.observe(el); });

// ═══ SKILL BARS ═══
var skillObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-bar-item').forEach(function(el) { skillObserver.observe(el); });

// ═══ DYNAMIC YEARS ═══
var yearsEl = document.getElementById('yearsCount');
if (yearsEl) {
  var startYear = 2018;
  var yearsExp = new Date().getFullYear() - startYear;
  yearsEl.dataset.count = yearsExp;
}

// ═══ COUNTER ANIMATION ═══
var counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      var el = entry.target;
      var target = parseInt(el.dataset.count);
      var suffix = el.dataset.suffix || '';
      var current = 0;
      var step = Math.max(1, Math.floor(target / 40));
      var interval = setInterval(function() {
        current += step;
        if (current >= target) { current = target; clearInterval(interval); }
        el.textContent = current + suffix;
      }, 35);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(function(el) { counterObserver.observe(el); });

// ═══ SKILLS RADAR CHART ═══
(function() {
  var svg = document.getElementById('skillsRadar');
  if (!svg) return;
  var cx = 200, cy = 200, maxR = 150;
  var skills = [
    { name: 'Link Building', value: 0.95 },
    { name: 'SEO Strategy', value: 0.93 },
    { name: 'AI Automation', value: 0.90 },
    { name: 'Multilingual', value: 0.88 },
    { name: 'Programmatic', value: 0.87 },
    { name: 'Local SEO', value: 0.85 },
    { name: 'Digital PR', value: 0.82 },
    { name: 'Analytics', value: 0.80 }
  ];
  var n = skills.length, angleStep = (2 * Math.PI) / n;
  function point(i, r) {
    var a = -Math.PI / 2 + i * angleStep;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }
  var html = '';
  [0.25, 0.5, 0.75, 1].forEach(function(pct) {
    var pts = [];
    for (var i = 0; i < n; i++) pts.push(point(i, maxR * pct).join(','));
    html += '<polygon points="' + pts.join(' ') + '" fill="none" stroke="rgba(123,154,138,0.12)" stroke-width="1"/>';
  });
  for (var i = 0; i < n; i++) {
    var p = point(i, maxR);
    html += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p[0] + '" y2="' + p[1] + '" stroke="rgba(123,154,138,0.08)" stroke-width="1"/>';
  }
  var dataPts = skills.map(function(s, i) { return point(i, maxR * s.value).join(','); }).join(' ');
  html += '<polygon points="' + dataPts + '" fill="rgba(0,232,123,0.1)" stroke="#00E87B" stroke-width="2" stroke-linejoin="round"><animate attributeName="opacity" from="0" to="1" dur="1s" fill="freeze"/></polygon>';
  skills.forEach(function(s, i) {
    var dp = point(i, maxR * s.value);
    html += '<circle cx="' + dp[0] + '" cy="' + dp[1] + '" r="4" fill="#00E87B" stroke="#050A08" stroke-width="2"><animate attributeName="r" from="0" to="4" dur="0.6s" begin="' + (0.2 + i * 0.08) + 's" fill="freeze"/></circle>';
    var lp = point(i, maxR + 24);
    var anchor = lp[0] < cx - 10 ? 'end' : lp[0] > cx + 10 ? 'start' : 'middle';
    html += '<text x="' + lp[0] + '" y="' + lp[1] + '" text-anchor="' + anchor + '" dominant-baseline="middle" fill="#7B9A8A" font-family="Syne,sans-serif" font-size="11" font-weight="600">' + s.name + '</text>';
  });
  svg.innerHTML = html;
})();

// ═══ MOBILE NAV CLOSE ═══
document.querySelectorAll('.nav-link').forEach(function(link) {
  link.addEventListener('click', function() {
    document.getElementById('navLinks').classList.remove('open');
  });
});
