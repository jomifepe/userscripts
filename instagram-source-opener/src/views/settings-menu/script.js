(async () => {
  const content = await fetch('content.html');
  const contentHtml = await content.text();
  document.querySelector('.content').innerHTML = contentHtml;

  function openMenu() {
    document.querySelector('.__VS__C_MODAL_BACKDROP__VE__').style.display = 'flex';
  }
  function closeMenu() {
    document.querySelector('.__VS__C_MODAL_BACKDROP__VE__').style.display = 'none';
  }

  document.querySelector('#openMenuBtn')?.addEventListener('click', openMenu);
  document.querySelector('.__VS__C_MODAL_CLOSE_BTN__VE__')?.addEventListener('click', closeMenu);
  document.querySelector('.__VS__C_MODAL_BACKDROP__VE__')?.addEventListener('click', closeMenu);
  document.querySelector('.__VS__C_MODAL_WRAPPER__VE__')?.addEventListener('click', e => e.stopPropagation());
  document.querySelector('#__VS__ID_SETTINGS_DEVELOPER_OPTIONS_BTN__VE__')?.addEventListener('click', () => {
    document
      .querySelector('#__VS__ID_SETTINGS_DEVELOPER_OPTIONS_BTN__VE__')
      .classList.toggle('__VS__C_SETTINGS_SECTION_COLLAPSED__VE__');
    document
      .querySelector('#__VS__ID_SETTINGS_DEVELOPER_OPTIONS_CONTAINER__VE__')
      .classList.toggle('__VS__C_SETTINGS_SECTION_COLLAPSED__VE__');
  });

  openMenu();
})();
