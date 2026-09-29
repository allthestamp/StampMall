(() => {
  const selector = document.querySelector('.type-selector');
  if (selector) {
    const tabs = Array.from(selector.querySelectorAll('.type-tab'));
    const panels = Array.from(document.querySelectorAll('.type-panel'));
    selector.setAttribute('role', 'tablist');

    const readType = () => {
      const type = window.location.hash.slice(1).trim().toLowerCase();
      return ['b', 'c', 'd'].includes(type) ? type : 'b';
    };

    function renderType(type) {
      tabs.forEach((tab) => {
        const active = tab.hash === `#${type}`;
        tab.classList.toggle('active', active);
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', String(active));
        tab.setAttribute('aria-controls', tab.hash.slice(1));
        tab.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.setAttribute('role', 'tabpanel');
        panel.hidden = panel.id !== type;
        panel.tabIndex = 0;
      });
    }

    function selectTab(tab, focus = false) {
      const type = tab.hash.slice(1);
      if (readType() !== type || window.location.hash !== tab.hash) {
        history.pushState(null, '', tab.hash);
      }
      renderType(type);
      if (focus) tab.focus();
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        selectTab(tab);
      });
      tab.addEventListener('keydown', (event) => {
        let target;
        if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') target = 0;
        if (event.key === 'End') target = tabs.length - 1;
        if (target !== undefined) {
          event.preventDefault();
          selectTab(tabs[target], true);
        }
        if (event.key === ' ') {
          event.preventDefault();
          selectTab(tab);
        }
      });
    });
    window.addEventListener('hashchange', () => renderType(readType()));
    window.addEventListener('popstate', () => renderType(readType()));
    renderType(readType());
  }

  document.querySelectorAll('[data-guide-gif]').forEach((img) => {
    const errorMessage = img.nextElementSibling;
    const fail = () => {
      img.hidden = true;
      if (errorMessage) errorMessage.hidden = false;
    };
    img.addEventListener('error', fail);
    img.addEventListener('load', () => {
      img.hidden = false;
      if (errorMessage) errorMessage.hidden = true;
    });
    if (img.complete && img.naturalWidth === 0) fail();
  });

  const toTop = document.querySelector('.to-top');
  if (toTop) {
    const update = () => { toTop.hidden = window.scrollY <= 360; };
    toTop.addEventListener('click', () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
    });
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
})();
