const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#64ffda",
  "bg": "#0a192f",
  "font": "'Inter', sans-serif",
  "fontSize": 16
}/*EDITMODE-END*/;

// Tweaks panel
(function () {
  const accentEl = document.getElementById('tw-accent');
  const bgEl     = document.getElementById('tw-bg');
  const fontEl   = document.getElementById('tw-font');
  const sizeEl   = document.getElementById('tw-size');

  function applyTweaks() {
    const accent   = accentEl.value;
    const bg       = bgEl.value;
    const fontSize = sizeEl.value + 'px';
    const font     = fontEl.value;

    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--bg', bg);
    document.body.style.background  = bg;
    document.body.style.fontSize    = fontSize;
    document.body.style.fontFamily  = font;

    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits: { accent, bg, font, fontSize: parseInt(sizeEl.value) }
    }, '*');
  }

  [accentEl, bgEl, fontEl, sizeEl].forEach(el => el && el.addEventListener('input', applyTweaks));

  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === '__activate_edit_mode')   document.getElementById('tweaks-panel').classList.add('visible');
    if (e.data && e.data.type === '__deactivate_edit_mode') document.getElementById('tweaks-panel').classList.remove('visible');
  });

  window.parent.postMessage({ type: '__edit_mode_available' }, '*');
})();

// Experience tabs
(function () {
  const tabs      = document.querySelectorAll('.exp-tab');
  const panels    = document.querySelectorAll('.exp-panel');
  const indicator = document.getElementById('exp-indicator');

  function activateTab(index) {
    tabs.forEach(function (t) { t.classList.remove('active'); });
    panels.forEach(function (p) { p.classList.remove('active'); });
    tabs[index].classList.add('active');
    document.getElementById('exp-panel-' + index).classList.add('active');
    indicator.style.top = (index * 46) + 'px';
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activateTab(i); });
  });
})();

// Video modal
(function () {
  var modal    = document.getElementById('video-modal');
  var iframe   = document.getElementById('video-modal-iframe');
  var backdrop = modal.querySelector('.video-modal-backdrop');
  var closeBtn = modal.querySelector('.video-modal-close');

  function openModal(videoId) {
    iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    iframe.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-video-id]').forEach(function (btn) {
    btn.addEventListener('click', function () { openModal(btn.dataset.videoId); });
  });

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();

// Scroll spy + smooth scroll
(function () {
  const sections = ['about', 'experience', 'projects', 'contact'];
  const links    = document.querySelectorAll('.nav-link');

  function updateNav() {
    var scrollY      = window.scrollY + 535;
    var current      = 'about';
    var nearBottom   = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100;

    if (nearBottom) {
      current = 'contact';
    } else {
      sections.forEach(function (id) {
        var el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      });
    }

    links.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var id = link.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', updateNav);
  updateNav();
})();
