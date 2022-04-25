(async () => {
  const content = await fetch('content.html');
  const contentHtml = await content.text();
  document.querySelector('.content').innerHTML = contentHtml;

  function openMenu() {
    const list = document.querySelector('.__RSTART__C_STORIES_MODAL_LIST__REND__');
    list.innerHTML = `
      ${[...Array(8)]
        .map(
          () => `
        <a
          class="__RSTART__C_STORIES_MODAL_LIST_ITEM__REND__"
          href="https://picsum.photos/1080/1920"
        >
          <img src="https://picsum.photos/1080/1920" />
          <time datetime="2022-04-23T17:19:51.000Z">3h</time>
        </a>
      `
        )
        .join('')}
    `;
    document.querySelector('.__RSTART__C_MODAL_BACKDROP__REND__').style.display = 'flex';
  }
  function closeMenu() {
    document.querySelector('.__RSTART__C_MODAL_BACKDROP__REND__').style.display = 'none';
  }

  document.querySelector('#openMenuBtn')?.addEventListener('click', openMenu);
  document.querySelector('.__RSTART__C_MODAL_CLOSE_BTN__REND__')?.addEventListener('click', closeMenu);
  document.querySelector('.__RSTART__C_MODAL_BACKDROP__REND__')?.addEventListener('click', closeMenu);
  document.querySelector('.__RSTART__C_MODAL_WRAPPER__REND__')?.addEventListener('click', e => {
    e.stopPropagation();
  });

  openMenu();
})();
