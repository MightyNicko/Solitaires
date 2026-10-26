// Helskärm på iPad som hemskärmsapp.
// Med statusfältsstilen black-translucent börjar sidan under statusfältet, men iOS räknar
// höjden utan statusfältet. Det lämnar en svart remsa längst ned. Här sätts --app-h till
// skärmens verkliga höjd, och sidorna använder den i stället för 100%.
(function () {
  const standalone = navigator.standalone || matchMedia('(display-mode: standalone)').matches;
  function fit() {
    let h = innerHeight;
    if (standalone && screen.width && screen.height) {
      const portrait = innerHeight >= innerWidth;
      const sw = portrait ? Math.min(screen.width, screen.height) : Math.max(screen.width, screen.height);
      const sh = portrait ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
      // Bara när appen täcker hela skärmens bredd (inte Split View/Stage Manager) och glappet är litet
      if (Math.abs(sw - innerWidth) < 3 && sh > h && sh - h < 100) h = sh;
    }
    document.documentElement.style.setProperty('--app-h', h + 'px');
  }
  fit();
  addEventListener('resize', fit);
  addEventListener('orientationchange', () => setTimeout(() => { fit(); dispatchEvent(new Event('resize')); }, 350));
})();
