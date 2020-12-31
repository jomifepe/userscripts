window.onload = function () {
  document.querySelector('._ISOCS_C_SETTINGS_MENU_TITLE_CLOSE_BTN_ISOCE_').addEventListener('click', closeMenu);
  document.querySelector('._ISOCS_C_SETTINGS_MENU_ISOCE_').addEventListener('click', e => e.stopPropagation());
  document.querySelector('._ISOCS_C_SETTINGS_CONTAINER_ISOCE_').addEventListener('click', closeMenu);
  document.querySelector('#_ISOCS_ID_SETTINGS_DEVELOPER_OPTIONS_BTN_ISOCE_').addEventListener('click', e => {
    document
      .querySelector('#_ISOCS_ID_SETTINGS_DEVELOPER_OPTIONS_BTN_ISOCE_')
      .classList.toggle('_ISOCS_C_SETTINGS_SECTION_COLLAPSED_ISOCE_');
    document
      .querySelector('#_ISOCS_ID_SETTINGS_DEVELOPER_OPTIONS_CONTAINER_ISOCE_')
      .classList.toggle('_ISOCS_C_SETTINGS_SECTION_COLLAPSED_ISOCE_');
  });
};

function openMenu() {
  document.querySelector('._ISOCS_C_SETTINGS_CONTAINER_ISOCE_').style.display = 'flex';
}
function closeMenu() {
  document.querySelector('._ISOCS_C_SETTINGS_CONTAINER_ISOCE_').style.display = 'none';
}
