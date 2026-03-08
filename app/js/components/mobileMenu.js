export function setupMobileMenu() {
  const html = document.documentElement;
  const body = document.body;
  const menuBtn = document.querySelector('.menu-btn');
  const headerMobile = document.querySelector('.header__mobile');

  const top = menuBtn.querySelector('.top');
  const middle = menuBtn.querySelector('.middle');
  const bottom = menuBtn.querySelector('.bottom');

  let isLocked = false;

  function closeMenu() {
    if (!menuBtn.classList.contains('active')) return;

    top.style.transition = 'transform 0.40s ease';
    bottom.style.transition = 'transform 0.40s ease';
    top.style.transform = 'translateX(-50%) rotate(0deg)';
    bottom.style.transform = 'translateX(-50%) rotate(0deg)';

    setTimeout(() => {
      top.style.transition = 'top 0.40s ease';
      bottom.style.transition = 'bottom 0.40s ease';
      top.style.top = '5px';
      bottom.style.bottom = '5px';
    }, 250);

    setTimeout(() => {
      middle.style.transition = 'width 0.40s ease';
      middle.style.width = '38px';
    }, 500);

    menuBtn.classList.remove('active');
    html.classList.remove('active');
    body.classList.remove('menu-active');
    headerMobile.classList.remove('active');

    setTimeout(() => { isLocked = false; }, 750);
  }

  menuBtn.addEventListener('click', () => {
    if (isLocked) return;
    isLocked = true;
    menuBtn.blur();

    if (!menuBtn.classList.contains('active')) {
      menuBtn.classList.add('active');

      middle.style.transition = 'width 0.40s ease';
      middle.style.width = '4px';

      setTimeout(() => {
        top.style.transition = 'top 0.40s ease';
        bottom.style.transition = 'bottom 0.40s ease';
        top.style.top = '50%';
        bottom.style.bottom = '46%';
      }, 250);

      setTimeout(() => {
        top.style.transition = 'transform 0.40s ease';
        bottom.style.transition = 'transform 0.40s ease';
        top.style.transform = 'translateX(-50%) rotate(45deg)';
        bottom.style.transform = 'translateX(-50%) rotate(135deg)';
      }, 500);

      html.classList.add('active');
      body.classList.add('menu-active');
      headerMobile.classList.add('active');

      setTimeout(() => { isLocked = false; }, 750);
    } else {
      closeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (
      !menuBtn.contains(event.target) &&
      !headerMobile.contains(event.target)
    ) {
      closeMenu();
    }
  });
}