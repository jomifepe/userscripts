(async () => {
  const content = await fetch('content.html');
  const contentHtml = await content.text();
  document.querySelector('.content').innerHTML = contentHtml;

  function openMenu() {
    document.querySelector('.__RSTART__C_MODAL_BACKDROP__REND__').style.display = 'flex';
  }
  function closeMenu() {
    document.querySelector('.__RSTART__C_MODAL_BACKDROP__REND__').style.display = 'none';
  }

  document.querySelector('#openMenuBtn')?.addEventListener('click', openMenu);
  document.querySelector('.__RSTART__C_MODAL_CLOSE_BTN__REND__')?.addEventListener('click', closeMenu);
  document.querySelector('.__RSTART__C_MODAL_BACKDROP__REND__')?.addEventListener('click', closeMenu);
  document.querySelector('.__RSTART__C_MODAL_WRAPPER__REND__')?.addEventListener('click', e => e.stopPropagation());
  document.querySelector('#__RSTART__ID_SETTINGS_DEVELOPER_OPTIONS_BTN__REND__')?.addEventListener('click', e => {
    document
      .querySelector('#__RSTART__ID_SETTINGS_DEVELOPER_OPTIONS_BTN__REND__')
      .classList.toggle('__RSTART__C_SETTINGS_SECTION_COLLAPSED__REND__');
    document
      .querySelector('#__RSTART__ID_SETTINGS_DEVELOPER_OPTIONS_CONTAINER__REND__')
      .classList.toggle('__RSTART__C_SETTINGS_SECTION_COLLAPSED__REND__');
  });

  openMenu();
})();
