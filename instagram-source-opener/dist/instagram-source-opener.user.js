// ==UserScript==
// @name             Instagram Source Opener
// @version          1.3.0
// @description      Open the original source of an IG post, story or profile picture
// @author           jomifepe
// @license          MIT
// @icon             https://www.instagram.com/favicon.ico
// @match            https://www.instagram.com/*
// @grant            GM_xmlhttpRequest
// @grant            GM.xmlHttpRequest
// @grant            GM_registerMenuCommand
// @grant            GM.registerMenuCommand
// @grant            GM_getValue
// @grant            GM.getValue
// @grant            GM_setValue
// @grant            GM.setValue
// @grant            GM_deleteValue
// @grant            GM.deleteValue
// @grant            GM_openInTab
// @grant            GM.openInTab
// @connect          instagram.com
// @connect          i.instagram.com
// @namespace        https://jomifepe.github.io/
// @supportURL       https://github.com/jomifepe/userscripts/issues
// @homepage         https://github.com/jomifepe/userscripts/tree/main/instagram-source-opener
// @updateURL        https://raw.githubusercontent.com/jomifepe/userscripts/main/instagram-source-opener/dist/instagram-source-opener.user.js
// @downloadURL      https://raw.githubusercontent.com/jomifepe/userscripts/main/instagram-source-opener/dist/instagram-source-opener.user.js
// @contributionURL  https://www.paypal.com/donate?hosted_button_id=JT2G5E5SM9C88
// @require          https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// ==/UserScript==

/* jshint esversion: 10 */
(function () {
  'use strict';

  const LOGGING_ENABLED = false;

  /* eslint-disable no-unused-vars */

  const SCRIPT_NAME = 'Instagram Source Opener',
    SCRIPT_NAME_SHORT = 'ISO',
    HOMEPAGE_URL = 'https://greasyfork.org/en/scripts/372366-instagram-source-opener',
    SESSION_ID_INFO_URL = 'https://greasyfork.org/en/scripts/372366-instagram-source-opener#sessionid',
    USER_AGENT =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 105.0.0.11.118 (iPhone11,8; iOS 12_3_1; en_US; en-US; scale=2.00; 828x1792; 165586599)',
    IG_APP_ID = '936619743392459';

  /* Instagram classes and selectors */
  const IG_S_STORY_CONTAINER = '.yS4wN,.vUg3G,.yUdUG',
    IG_S_SINGLE_POST_CONTAINER = '.JyscU,.PdwC2',
    IG_S_PROFILE_CONTAINER = '.v9tJq,.XjzKX',
    IG_S_STORY_MEDIA_CONTAINER = '.qbCDp',
    IG_S_POST_IMG = '.FFVAD',
    IG_S_POST_VIDEO = '.tWeCl',
    IG_S_MULTI_POST_LIST_ITEMS = '.vi798 .Ckrof',
    IG_S_POST_CONTAINER = '._8Rm4L',
    IG_S_POST_BUTTONS = '.eo2As > section',
    IG_S_PROFILE_PIC_CONTAINER = '.RR-M-',
    IG_S_PRIVATE_PROFILE_PIC_CONTAINER = '._4LQNo',
    IG_S_PRIVATE_PIC_IMG_CONTAINER = '._2dbep',
    IG_S_PRIVATE_PROFILE_PIC_IMG_CONTAINER = '.IalUJ',
    IG_S_PROFILE_USERNAME_TITLE = '.fKFbl,h2',
    IG_S_POST_BLOCKER = '._9AhH0',
    IG_S_TOP_BAR = '.Hz2lF,._lz6s',
    IG_S_POST_TIME_ANCHOR = '.c-Yi7',
    IG_S_MULTI_POST_INDICATOR = '.Yi5aA',
    IG_C_MULTI_POST_INDICATOR_ACTIVE = 'XCodT',
    IG_S_PROFILE_PRIVATE_MESSAGE = '.rkEop',
    IG_S_PROFILE_HAS_STORIES_INDICATOR = '.h5uC0';

  /* Custom classes and selectors */
  const C_BTN_STORY = 'iso-story-btn',
    C_POST_WITH_BUTTON = 'iso-post',
    C_BTN_POST = 'iso-post-btn',
    C_PROFILE_BUTTON_CONTAINER = 'iso-profile-button-container',
    C_BTN_PROFILE_PIC = 'iso-profile-picture-btn',
    C_BTN_ANONYMOUS_STORIES = 'iso-anonymous-stories-btn',
    /* Base modal classes */
    C_MODAL_BACKDROP = 'iso-modal-backdrop',
    C_MODAL_WRAPPER = 'iso-modal-wrapper',
    C_MODAL_TITLE_CONTAINER = 'iso-modal-title-container',
    C_MODAL_TITLE = 'iso-modal-title',
    C_MODAL_TITLE_LINK = 'iso-modal-title-link',
    C_MODAL_CLOSE_BTN = 'iso-modal-close-btn',
    C_MODAL_CONTENT_CONTAINER = 'iso-modal-content-container',
    /* Script settings */
    C_SETTINGS_BTN = 'iso-settings-btn',
    C_SETTINGS_MODAL = 'iso-settings-modal',
    C_SETTINGS_MENU_OPTION = 'iso-settings-menu-option',
    C_SETTINGS_MENU_OPTION_BTN = 'iso-settings-menu-option-button',
    C_SETTINGS_SECTION_COLLAPSED = 'iso-settings-section-collapsed',
    C_SETTINGS_SELECT_ARROW = 'iso-settings-select-arrow',
    ID_SETTINGS_POST_STORY_KB_BTN = 'iso-settings-post-story-kb-btn',
    ID_SETTINGS_PROFILE_PICTURE_KB_BTN = 'iso-settings-profile-picture-kb-btn',
    ID_SETTINGS_BUTTON_BEHAVIOR_SELECT = 'iso-settings-button-behavior-select',
    ID_SETTINGS_DEVELOPER_OPTIONS_BTN = 'iso-settings-developer-options-btn',
    ID_SETTINGS_DEVELOPER_OPTIONS_CONTAINER = 'iso-settings-developer-options-container',
    ID_SETTINGS_SESSION_ID_INPUT = 'iso-settings-session-id-input',
    S_IG_POST_CONTAINER_WITHOUT_BUTTON = `${IG_S_POST_CONTAINER}:not(.${C_POST_WITH_BUTTON})`,
    /* Anonymous stories modal */
    C_STORIES_MODAL = 'iso-stories-modal',
    C_STORIES_MODAL_LIST = 'iso-stories-modal-list',
    C_STORIES_MODAL_LIST_ITEM = 'iso-stories-modal-list-item';

  /* Storage and cookie keys */
  const STORAGE_KEY_POST_STORY_KB = 'iso_post_story_kb',
    STORAGE_KEY_PROFILE_PICTURE_KB = 'iso_profile_picture_kb',
    STORAGE_KEY_BUTTON_BEHAVIOR = 'iso_button_behavior',
    STORAGE_KEY_SESSION_ID = 'iso_session_id',
    COOKIE_IG_USER_ID = 'ds_user_id',
    /* Default letters for key bindings */
    DEFAULT_KB_POST_STORY = 'O',
    DEFAULT_KB_PROFILE_PICTURE = 'P',
    /* Open source button behavior keys */
    BUTTON_BEHAVIOR_REDIR = 'bb_redirect',
    BUTTON_BEHAVIOR_NEW_TAB_FOCUS = 'bb_tab_focus',
    BUTTON_BEHAVIOR_NEW_TAB_BG = 'bb_tab_background',
    DEFAULT_BUTTON_BEHAVIOR = BUTTON_BEHAVIOR_NEW_TAB_FOCUS,
    BUTTON_BEHAVIOR_OPTIONS = [BUTTON_BEHAVIOR_REDIR, BUTTON_BEHAVIOR_NEW_TAB_FOCUS, BUTTON_BEHAVIOR_NEW_TAB_BG];

  /* eslint-enable no-unused-vars */

  const PATTERN = {
    URL_PATH_PARTS: /\/([a-zA-Z0-9._]{0,})/,
    IG_VALID_USERNAME: /^([a-zA-Z0-9._]{0,30})$/,
    COOKIE_VALUE: (key) => new RegExp(`(^| )${key}=([^;]+)`),
    PAGE_SINGLE_MEDIA: /^\/(p|reel|tv)\//,
    PAGE_STORIES: /^\/stories\//,
  };

  const API = {
    /** @type {(postRelUrl: string) => string} */
    IG_POST_INFO_API: (postRelUrl) => `https://www.instagram.com${postRelUrl}?__a=1`,
    /** @type {(username: string) => string} */
    IG__A1: (username) => `https://www.instagram.com/${username}?__a=1`,
    /** @type {() => string} */
    IG__A1_CURRENT_PAGE: () => `${window.location.href}?__a=1`,
    /** @type {(userId: string) => string} */
    IG_USER_INFO_API: (userId) => `https://i.instagram.com/api/v1/users/${userId}/info/`,
    /** @type {(userId: string) => string} */
    IG_REELS_FEED_API: (userId) => `https://i.instagram.com/api/v1/feed/reels_media?reel_ids=${userId}`,
  };

  const Logger = createLogger(SCRIPT_NAME_SHORT);

  const cachedApiData = {
    userBasicInfo: buildCache(),
    userInfo: buildCache(),
    userStories: buildCache(),
    userProfilePicture: buildCache(),
    post: buildCache(),
  };

  let isStoryKeyBindingSetup, isSinglePostKeyBindingSetup, isProfileKeyBindingSetup;
  let openPostStoryKeyBinding = DEFAULT_KB_POST_STORY;
  let openProfilePictureKeyBinding = DEFAULT_KB_PROFILE_PICTURE;
  let openSourceBehavior = '';
  let sessionId = '';

  const pages = {
    feed: {
      isVisible: () => window.location.pathname === '/',
      onLoadActions: () => {
        qsa(document, S_IG_POST_CONTAINER_WITHOUT_BUTTON).forEach((node) => generatePostButtons(node));
      },
    },
    story: {
      isVisible: () => PATTERN.PAGE_STORIES.test(window.location.pathname),
      onLoadActions: () => {
        const node = qs(document, IG_S_STORY_CONTAINER);
        if (!node) return;
        generateStoryButton(node);
        setupStoryEventListeners();
      },
    },
    profile: {
      isVisible: () => !!(window.location.pathname.length > 1 && qs(document, IG_S_PROFILE_CONTAINER)),
      onLoadActions: () => {
        if (!checkIsLoggedIn()) return;
        const node = qs(document, IG_S_PROFILE_CONTAINER);
        if (!node) return;
        generateProfileElements(node);
        setupProfileEventListeners();
      },
    },
    post: {
      isVisible: () => PATTERN.PAGE_SINGLE_MEDIA.test(window.location.pathname),
      onLoadActions: () => {
        const node = qs(document, IG_S_SINGLE_POST_CONTAINER);
        if (!node) return;
        generatePostButtons(node);
        setupSinglePostEventListeners();
      },
    },
  };

  const actionTriggers = {
    arrive: {
      /* triggered whenever a new instagram post is loaded on the feed */
      [S_IG_POST_CONTAINER_WITHOUT_BUTTON]: generatePostButtons,
      /* triggered whenever a single post is opened (on a profile) */
      [IG_S_SINGLE_POST_CONTAINER]: (node) => {
        generatePostButtons(node);
        setupSinglePostEventListeners();
      },
      /* triggered whenever a story is opened */
      [IG_S_STORY_CONTAINER]: (node) => {
        generateStoryButton(node);
        setupStoryEventListeners();
      },
      /* triggered whenever a profile page is loaded */
      [IG_S_PROFILE_CONTAINER]: (node) => {
        generateProfileElements(node);
        setupProfileEventListeners();
      },
      /* triggered whenever the top bar is created */
      [IG_S_TOP_BAR]: generateSettingsPageMenu,
    },
    leave: {
      /* triggered whenever a single post is closed (on a profile) */
      [IG_S_SINGLE_POST_CONTAINER]: removeSinglePostEventListeners,
      /* triggered whenever a story is closed */
      [IG_S_STORY_CONTAINER]: removeStoryEventListeners,
      /* triggered whenever a profile page is left */
      [IG_S_PROFILE_CONTAINER]: removeProfileEventListeners,
    },
  };

  const profilePictureSources = {
    'user info API': getProfilePictureFromUserInfoApi,
  };

  registerMenuCommands(); /* register GM menu commands */
  injectStyles(); /* injects the needed CSS into DOM */
  setupTriggers(); /* setup arrive and leave triggers for elements */
  performOnLoadActions(); /* first load actions */
  window.onload = performOnLoadActions; /* first load actions (backup) */

  /** Setup the arrive and leave triggers for relevant elements */
  function setupTriggers() {
    let count = 0;
    for (const [event, triggers] of Object.entries(actionTriggers)) {
      for (const [actuator, fireTrigger] of Object.entries(triggers)) {
        document[event](actuator, (node) => {
          if (!node) return;
          fireTrigger(node);
          Logger.log(`Triggered ${event} for selector ${actuator}`);
        });
        count++;
      }
    }
    Logger.log(`Created ${count} element triggers`);
  }

  /**
   * Performs actions that need to be performed on page load.
   */
  function performOnLoadActions() {
    for (const [name, page] of Object.entries(pages)) {
      if (page.isVisible()) {
        page.onLoadActions();
        Logger.log(`Performed onload actions for ${name} page`);
      }
    }
    loadPreferences();
    generateSettingsPageMenu();
  }

  /**
   * Loads preferences that are needed on multiple occasions from the storage to the corresponding variables
   */
  async function loadPreferences() {
    if (!openSourceBehavior) {
      const savedOsb = await callGMFunction('getValue', STORAGE_KEY_BUTTON_BEHAVIOR, undefined);
      if (!savedOsb) {
        Logger.log('Loaded default button behavior');
        openSourceBehavior = DEFAULT_BUTTON_BEHAVIOR;
      } else if (BUTTON_BEHAVIOR_OPTIONS.includes(savedOsb)) {
        openSourceBehavior = savedOsb;
        Logger.log('[Loaded preference] Open button behavior:', savedOsb);
      }
    }

    if (!sessionId) {
      const savedSID = await callGMFunction('getValue', STORAGE_KEY_SESSION_ID, null);
      if (!savedSID) {
        Logger.log('No saved session id found');
      } else {
        sessionId = savedSID;
        Logger.log(`[Loaded preference] Session id: ...${getLast4Digits(savedSID)}`);
      }
    }
  }

  /**
   * Creates the commands to appear on the menu created by the <Any>monkey extension that's being used
   * For example, on Tampermonkey, this menu is accessible by clicking on the extension icon
   */
  function registerMenuCommands() {
    callGMFunction('registerMenuCommand', 'Change post & story shortcut', handleMenuPostStoryKBCommand);
    callGMFunction('registerMenuCommand', 'Change profile picture shortcut', handleMenuProfilePicKBCommand);
    Logger.log('Registered menu commands');
  }

  /**
   * Handle the click on the settings menu option to change the single post and story opening key binding
   */
  async function handleMenuPostStoryKBCommand() {
    const kb = await handleKBMenuCommand(STORAGE_KEY_POST_STORY_KB, DEFAULT_KB_POST_STORY, 'single post and story');
    if (!kb) return;
    openPostStoryKeyBinding = kb;
    if (pages.post.isVisible()) {
      removeSinglePostEventListeners();
      setupSinglePostEventListeners();
      return;
    }
    if (pages.story.isVisible()) {
      removeStoryEventListeners();
      setupStoryEventListeners();
      return;
    }
  }

  /**
   * Handle the click on the settings menu option to change the profile picture opening key binding
   */
  async function handleMenuProfilePicKBCommand() {
    const kb = await handleKBMenuCommand(STORAGE_KEY_PROFILE_PICTURE_KB, DEFAULT_KB_PROFILE_PICTURE, 'profile picture');
    if (!kb) return;
    openProfilePictureKeyBinding = kb;
    removeProfileEventListeners();
    setupProfileEventListeners();
  }

  /**
   * Handle the click on the settings menu option to change the profile picture opening key binding
   * @param {string} option Button behavior option to use, has to be one of BUTTON_BEHAVIOR_OPTIONS
   */
  async function handleMenuButtonBehaviorChange(option) {
    if (!BUTTON_BEHAVIOR_OPTIONS.includes(option)) {
      Logger.error('Invalid option for source button behavior');
      return;
    }
    const result = await callGMFunction('setValue', STORAGE_KEY_BUTTON_BEHAVIOR, option);
    if (result === null) Logger.error('Failed to save button behavior option on storage');
    openSourceBehavior = option;
    Logger.log('Changed open source button behavior to', option);
  }

  /**
   * Handle a new sessionid entered on the developer options section of the settings menu
   * @param {string} value sessionid
   */
  async function handleSessionIdChange(value) {
    const newSessionId = value?.trim();
    if (value === null || typeof myVar !== 'undefined' || newSessionId === sessionId) return; // empty values are accepted
    if (newSessionId.length === 0 && sessionId) {
      await callGMFunction('deleteValue', STORAGE_KEY_SESSION_ID);
      sessionId = '';
      Logger.log('Deleted saved session id');
      return;
    }
    const result = await callGMFunction('setValue', STORAGE_KEY_SESSION_ID, newSessionId);
    if (result === null) Logger.error('Failed to save session id on storage');
    sessionId = newSessionId;
    Logger.log(`Saved current session id: ...${getLast4Digits(newSessionId)}`);
  }

  /**
   * Generic handler for the click action on the key binding changing options of the settings menu.
   * Launches a prompt that asks the user for a new key binding for a specific action, saves it locally and returns it
   * @param {string} keyBindingStorageKey Unique name used to store the key binding
   * @param {string} defaultKeyBinding Default key binding, used on the prompt message
   * @param {string} keyBindingName Key binding name to show on log messages, just for context
   * @returns {Promise<string|null>} Promise object, returns either the new key binding or null if it failed
   */
  async function handleKBMenuCommand(keyBindingStorageKey, defaultKeyBinding, keyBindingName) {
    let currentKey = await callGMFunction('getValue', keyBindingStorageKey, defaultKeyBinding);
    if (currentKey == null) {
      currentKey = defaultKeyBinding;
      Logger.log(`Falling back to default key binding: Alt + ${defaultKeyBinding}`);
    }

    const newKeyBinding = prompt(
      `${SCRIPT_NAME}:\n\nKey binding to open a ${keyBindingName}:\n` +
        'Choose a letter to be combined with the Alt/⌥ key\n\n' +
        `Current key binding: Alt/⌥ + ${currentKey.toUpperCase()}`
    );
    if (newKeyBinding == null) return null;
    if (!isKeyBindingValid(newKeyBinding)) {
      Logger.alertAndLog(`Couldn't save new key binding to open ${keyBindingName}, invalid option`);
      return null;
    }

    const successMessage = `Saved new shortcut to open ${keyBindingName}:\nAlt + ${newKeyBinding.toUpperCase()}`;
    const result = await callGMFunction('setValue', keyBindingStorageKey, newKeyBinding);
    if (result === null) return null;
    Logger.alert(successMessage);
    return newKeyBinding;
  }

  /**
   * Changes the visibility of the page settings menu
   * @param {boolean} visible
   */
  function setSettingsMenuVisible(visible) {
    if (visible) {
      qs(document, `.${C_SETTINGS_MODAL}`).style.display = 'flex';
      /* load values on the menu */
      const buttonBehaviorSelect = qs(document, `#${ID_SETTINGS_BUTTON_BEHAVIOR_SELECT}`);
      if (buttonBehaviorSelect) buttonBehaviorSelect.value = openSourceBehavior;
      const sessionIdInput = qs(document, `#${ID_SETTINGS_SESSION_ID_INPUT}`);
      if (sessionIdInput) sessionIdInput.value = sessionId;
    } else {
      qs(document, `.${C_SETTINGS_MODAL}`).style.display = 'none';
    }
  }

  /**
   * Toggles the visibility of the settings menu
   * @param {boolean} visible
   */
  function setAnonymousStoriesModalVisible(visible) {
    qs(document, `.${C_STORIES_MODAL}`).style.display = visible ? 'flex' : 'none';
  }

  /**
   * Creates a visual settings menu on the page, as an alternative to the commands menu method,
   * since it isn't supported by all extensions
   */
  function generateSettingsPageMenu() {
    if (!qs(document, `.${C_SETTINGS_BTN}`)) {
      /* Create the settings button */
      const button = createElementFromHtml(`
        <button class="${C_SETTINGS_BTN}" type="button" title="Open ${SCRIPT_NAME} settings" />
      `);
      button.addEventListener('click', () => setSettingsMenuVisible(true));
      qs(document, IG_S_TOP_BAR)?.appendChild(button);
      Logger.log('Created settings button');
    }

    if (!qs(document, `.${C_SETTINGS_MODAL}`)) {
      /* Create the settings menu */
      const modal = createElementFromHtml(`
        <div class="${C_MODAL_BACKDROP} ${C_SETTINGS_MODAL}"><div class="${C_MODAL_WRAPPER}"><div class="${C_MODAL_TITLE_CONTAINER}"><div class="${C_MODAL_TITLE}">${SCRIPT_NAME_SHORT} Settings <a class="${C_MODAL_TITLE_LINK}" href="${HOMEPAGE_URL}" target="_blank" title="What's this?">(?)</a></div><button class="${C_MODAL_CLOSE_BTN}" title="Close"><div class="coreSpriteClose"></div></button></div><div class="${C_MODAL_CONTENT_CONTAINER}"><button id="${ID_SETTINGS_POST_STORY_KB_BTN}" class="${C_SETTINGS_MENU_OPTION_BTN}">Change post/story shortcut</button> <button id="${ID_SETTINGS_PROFILE_PICTURE_KB_BTN}" class="${C_SETTINGS_MENU_OPTION_BTN}">Change profile picture shortcut</button><div class="${C_SETTINGS_MENU_OPTION}"><label for="${ID_SETTINGS_BUTTON_BEHAVIOR_SELECT}">Open source click behavior:</label> <select id="${ID_SETTINGS_BUTTON_BEHAVIOR_SELECT}"><option value="${BUTTON_BEHAVIOR_REDIR}">Redirect</option><option value="${BUTTON_BEHAVIOR_NEW_TAB_FOCUS}">New tab and focus</option><option value="${BUTTON_BEHAVIOR_NEW_TAB_BG}">New tab in the background</option></select></div><div id="${ID_SETTINGS_DEVELOPER_OPTIONS_BTN}" class="${C_SETTINGS_MENU_OPTION_BTN} ${C_SETTINGS_SECTION_COLLAPSED}">Developer options <span class="${C_SETTINGS_SELECT_ARROW}"></span></div><div id="${ID_SETTINGS_DEVELOPER_OPTIONS_CONTAINER}" class="${C_SETTINGS_MENU_OPTION} ${C_SETTINGS_SECTION_COLLAPSED}"><label for="${ID_SETTINGS_SESSION_ID_INPUT}">Session ID <a class="${C_MODAL_TITLE_LINK}" href="${SESSION_ID_INFO_URL}" target="_blank" title="What's this?">(?)</a></label> <input id="${ID_SETTINGS_SESSION_ID_INPUT}" type="text" placeholder="Your current session id"></div></div></div></div>
      `);

      /* handle modal backdrop click */
      modal.addEventListener('click', (event) => {
        if (!isModalBackdrop(event)) return;
        setSettingsMenuVisible(false);
      });
      /* ignore clicks inside the modal content */
      qsael(modal, `.${C_SETTINGS_MODAL} .${C_MODAL_WRAPPER}`, 'click', (e) => e.stopPropagation());
      /* handle menu close on close button click */
      qsael(modal, `.${C_SETTINGS_MODAL} .${C_MODAL_CLOSE_BTN}`, 'click', () => setSettingsMenuVisible(false));
      /* handle post/story key binding button */
      qsael(modal, `#${ID_SETTINGS_POST_STORY_KB_BTN}`, 'click', handleMenuPostStoryKBCommand);
      /* handle profile picture key binding button */
      qsael(modal, `#${ID_SETTINGS_PROFILE_PICTURE_KB_BTN}`, 'click', handleMenuProfilePicKBCommand);
      /* handle change of button behavior option select */
      qsael(modal, `#${ID_SETTINGS_BUTTON_BEHAVIOR_SELECT}`, 'change', (e) =>
        handleMenuButtonBehaviorChange(e.target.value)
      );
      /* handle click of developer settings button (toggle view) */
      qsael(modal, `#${ID_SETTINGS_DEVELOPER_OPTIONS_BTN}`, 'click', () => {
        qs(modal, `#${ID_SETTINGS_DEVELOPER_OPTIONS_BTN}`)?.classList.toggle(C_SETTINGS_SECTION_COLLAPSED);
        qs(modal, `#${ID_SETTINGS_DEVELOPER_OPTIONS_CONTAINER}`)?.classList.toggle(C_SETTINGS_SECTION_COLLAPSED);
      });
      /* handle blur of the session id input */
      qsael(modal, `#${ID_SETTINGS_SESSION_ID_INPUT}`, 'blur', (e) => handleSessionIdChange(e.target.value));

      document.body.appendChild(modal);
      Logger.log('Created settings menu');
    }
  }

  /**
   * Appends new elements to DOM containing the story source opening button
   * @param {HTMLElement} node DOM element node
   */
  function generateStoryButton(node) {
    /* exits if the story button already exists */
    if (!node || elementExistsInNode(`.${C_BTN_STORY}`, document)) return;

    try {
      const openButton = createElementFromHtml(`
        <button class="${C_BTN_STORY}" type="button" title="Open source" />
      `);
      openButton.addEventListener('click', () => openStoryContent(node));
      node.appendChild(openButton);
    } catch (error) {
      Logger.error('Failed to generate story button', error);
    }
  }

  /**
   * Appends new elements to DOM containing the post source opening button
   * @param {HTMLElement} node DOM element node
   */
  function generatePostButtons(node) {
    /* exits if the post button already exists */
    if (!node || elementExistsInNode(`.${C_BTN_POST}`, node)) return;

    try {
      /* removes the div that's blocking the img element on a post */
      const blocker = qs(node, IG_S_POST_BLOCKER);
      if (blocker) blocker.parentNode.removeChild(blocker);

      const postButtonsContainer = qs(node, IG_S_POST_BUTTONS);
      if (!postButtonsContainer) {
        Logger.error(`Failed to generate post button, couldn't find post buttons container (${IG_S_POST_BUTTONS})`);
        return;
      }

      const sourceButton = createElementFromHtml(`
        <button class="${C_BTN_POST}" title="Open source" />
      `);
      sourceButton.addEventListener('click', () => openPostSource(node));
      postButtonsContainer.appendChild(sourceButton);
      node.classList.add(C_POST_WITH_BUTTON);

      const timeElement = qs(node, `${IG_S_POST_TIME_ANCHOR} time`);
      if (timeElement) {
        const fullDateTime = timeElement.getAttribute('datetime');
        const localeDateTime = fullDateTime && new Date(fullDateTime)?.toLocaleString();
        if (localeDateTime) timeElement.innerHTML += ` (${localeDateTime})`;
      }
    } catch (error) {
      Logger.error('Failed to generate post button', error);
    }
  }

  /**
   * Appends new elements to DOM containing the profile picture source opening button
   * @param {HTMLElement} node DOM element node
   */
  function generateProfileElements(node = document) {
    const profilePicContainer = qs(node, IG_S_PROFILE_PIC_CONTAINER) || qs(node, IG_S_PRIVATE_PROFILE_PIC_CONTAINER);

    if (profilePicContainer) {
      const buttonContainer = createElementFromHtml(`<div class="${C_PROFILE_BUTTON_CONTAINER}"></div>`);
      profilePicContainer.appendChild(buttonContainer);

      /* generate the profile picture source button */
      try {
        if (!elementExistsInNode(`.${C_BTN_PROFILE_PIC}`, node)) {
          const profilePictureButton = createElementFromHtml(`
            <button class="${C_BTN_PROFILE_PIC}" title="Open full size profile picture" />
          `);
          profilePictureButton.addEventListener('click', withStopPropagation(openProfilePicture));
          buttonContainer.appendChild(profilePictureButton);
          Logger.log('Generated profile picture button');
        }
      } catch (error) {
        Logger.error('Failed to generate picture button', error);
      }

      /* generate the anonymous story button */
      try {
        if (!elementExistsInNode(`.${C_BTN_ANONYMOUS_STORIES}`, node)) {
          // if the profile is not private or you follow the user
          if (!qs(document, IG_S_PROFILE_PRIVATE_MESSAGE)) {
            const storiesButton = createElementFromHtml(`
              <button class="${C_BTN_ANONYMOUS_STORIES}" title="View user stories anonymously" />
            `);
            storiesButton.addEventListener('click', withStopPropagation(openAnonymousStoriesModal));
            buttonContainer.appendChild(storiesButton);
            Logger.log('Generated anonymous stories button');
          }
        }
      } catch (error) {
        Logger.error('Failed to generate anonymous stories button', error);
      }
    } else {
      Logger.error(`Couldn't find profile picture container (${IG_S_PROFILE_PIC_CONTAINER})`);
    }

    /* generate the anonymous stories modal */
    try {
      if (!elementExistsInNode(`.${C_STORIES_MODAL}`, node)) {
        const modal = createElementFromHtml(`
          <div class="${C_MODAL_BACKDROP} ${C_STORIES_MODAL}"><div class="${C_MODAL_WRAPPER}"><div class="${C_MODAL_TITLE_CONTAINER}"><div class="${C_MODAL_TITLE}">User Stories (Anonymous) <a class="${C_MODAL_TITLE_LINK}" href="${HOMEPAGE_URL}" target="_blank" title="What's this?">(?)</a></div><button class="${C_MODAL_CLOSE_BTN}" title="Close"><div class="coreSpriteClose"></div></button></div><div class="${C_MODAL_CONTENT_CONTAINER}"><div class="${C_STORIES_MODAL_LIST}"></div></div></div></div>
        `);

        /* handle modal backdrop click */
        modal.addEventListener('click', (event) => {
          if (!isModalBackdrop(event)) return;
          setAnonymousStoriesModalVisible(false);
        });
        /* handle menu close on close button click */
        qsael(modal, `.${C_STORIES_MODAL} .${C_MODAL_CLOSE_BTN}`, 'click', () =>
          setAnonymousStoriesModalVisible(false)
        );
        document.body.appendChild(modal);
        Logger.log('Generated anonymous stories modal');
      }
    } catch (error) {
      Logger.error('Failed to generate anonymous stories modal', error);
    }
  }

  function isModalBackdrop(event) {
    return event.target.classList.contains(C_MODAL_BACKDROP);
  }

  /** Finds the user's stories and displays them in the modal */
  async function openAnonymousStoriesModal() {
    try {
      if (qs(document, IG_S_PROFILE_PRIVATE_MESSAGE)) {
        Logger.alert('You cannot view stories of a private user');
        return;
      }
      if (!qs(document, IG_S_PROFILE_HAS_STORIES_INDICATOR)) {
        Logger.alert('This user has no stories at the moment');
        return;
      }
      document.body.style.cursor = 'wait';
      const stories = await getUserStories(getProfileUsername());
      const listContainer = qs(document, `.${C_STORIES_MODAL_LIST}`);
      const storyCardsHtmlArray = stories?.map(
        (storyImage) => `
        <a
          class="${C_STORIES_MODAL_LIST_ITEM}"
          href="${storyImage.url}"
          target="_blank"
        >
          <img src="${storyImage.thumbnailUrl}" />
          <time datetime="${storyImage.dateTime}">${storyImage.relativeTime}</time>
        </a>
      `
      );
      if (!storyCardsHtmlArray) return;

      listContainer.innerHTML = storyCardsHtmlArray.join('');
      setAnonymousStoriesModalVisible(true);
    } catch (error) {
      Logger.alertAndLog('Failed to get user stories');
    } finally {
      document.body.style.cursor = 'default';
    }
  }

  /**
   * Finds the story source url from the src attribute on the node and opens it
   * @param {HTMLElement} node DOM element node
   */
  function openStoryContent(node = document) {
    try {
      const container = qs(node, IG_S_STORY_MEDIA_CONTAINER);
      const video = qs(container, 'video');
      const image = qs(container, 'img');

      if (video) {
        const source = getStoryVideoSrc(video);
        if (!source) throw new Error('Video source not available');
        openUrl(source);
        return;
      }
      if (image) {
        const source = getStoryImageSrc(image);
        if (!source) throw new Error('Video source not available');
        openUrl(source);
        return;
      }
      throw new Error('Story media source not available');
    } catch (exception) {
      Logger.alertAndLog('Failed to open story source', exception);
    }
  }

  /**
   * Fetches the carousel data from the IG API and opens the url of the current index
   * @param {string} postRelativeUrl url of the post
   * @param {number} carouselIndex current index of the post carousel
   */
  async function openCarouselPostMediaSource(postRelativeUrl, carouselIndex) {
    if (cachedApiData.post.has(postRelativeUrl)) {
      const cachedData = cachedApiData.post.get(postRelativeUrl)[carouselIndex];
      const url = getUrlFromVideoPostApiResponse(cachedData);
      openUrl(url);
      return;
    }

    document.body.style.cursor = 'wait';
    const response = await httpGETRequest(API.IG_POST_INFO_API(postRelativeUrl));
    const carouselMediaItems = response.items[0].carousel_media;
    const url = getUrlFromVideoPostApiResponse(carouselMediaItems[carouselIndex]);
    openUrl(url);
    cachedApiData.post.set(postRelativeUrl, carouselMediaItems);
  }

  /**
   * Gets the source url of a post from the src attribute on the node and opens it
   * @param {HTMLElement} node DOM element node containing the post
   */
  async function openPostSource(node = qs(document, IG_S_SINGLE_POST_CONTAINER)) {
    /* if is on single post page and the node is null, the picture container can be found, since there's only one */
    if (node == null) return;

    try {
      const postRelativeUrl = qs(node, IG_S_POST_TIME_ANCHOR)?.getAttribute('href');
      const isPostCarousel = qsa(node, IG_S_MULTI_POST_LIST_ITEMS).length > 0;
      if (isPostCarousel) {
        await openCarouselPostMediaSource(postRelativeUrl, getCarouselIndex(node));
      } else {
        await openSinglePostMediaSource(node, postRelativeUrl);
      }
    } catch (exception) {
      Logger.alertAndLog('Failed to open post source', exception);
    } finally {
      document.body.style.cursor = 'default';
    }
  }

  /** Maps the response of the IG api for reels to a more friendly format */
  function getUrlFromVideoPostApiResponse(apiDataItems) {
    const getImageOrVideoUrl = ({ video_versions, image_versions2 }) => {
      return video_versions ? getUrlFromBestSource(video_versions) : getUrlFromBestSource(image_versions2.candidates);
    };

    if (Array.isArray(apiDataItems)) return apiDataItems.map(getImageOrVideoUrl);
    return getImageOrVideoUrl(apiDataItems);
  }

  /**
   * Gets the source url of a post from the src attribute on the node and opens it
   * @param {HTMLElement} node DOM element node containing the post
   * @param {string} postRelativeUrl url of the post
   */
  async function openSinglePostMediaSource(node, postRelativeUrl) {
    let image = qs(node, IG_S_POST_IMG);
    let video = qs(node, IG_S_POST_VIDEO);
    if (image) {
      openUrl(image.getAttribute('src'));
      return;
    }
    if (video) {
      /* video url is available on the element */
      const videoSrc = video.getAttribute('src');
      if (!videoSrc?.startsWith('blob')) {
        openUrl(videoSrc);
        return;
      }
      if (!postRelativeUrl) throw new Error('No post relative url found');

      /* try to get the video url using the IG api */
      if (cachedApiData.post.has(postRelativeUrl)) {
        openUrl(cachedApiData.post.get(postRelativeUrl));
        return;
      }
      document.body.style.cursor = 'wait';
      const response = await httpGETRequest(API.IG_POST_INFO_API(postRelativeUrl));
      const url = getUrlFromVideoPostApiResponse(response.items);
      openUrl(url);
      cachedApiData.post.set(postRelativeUrl, url);
      return;
    }
    throw new Error('Failed to open source, no media found');
  }

  /**
   * Fetches the user's profile picture from the IG API and returns it.
   * @param {string} username
   * @param {boolean} cacheFirst Whether to check the cache before making the request
   */
  async function getProfilePicture(username, cacheFirst = true) {
    if (cacheFirst && cachedApiData.userProfilePicture.has(username)) {
      Logger.log('[CACHE HIT] Profile picture');
      return cachedApiData.userProfilePicture.get(username);
    }

    let pictureUrl = null;
    for (const [sourceName, getProfilePicture] of Object.entries(profilePictureSources)) {
      Logger.log(`Getting user's profile picture from ${sourceName}`);
      const url = await getProfilePicture(username);
      if (!url) {
        Logger.error(`Couldn't get profile picture url from ${sourceName}`);
        continue;
      }
      pictureUrl = url;
      cachedApiData.userProfilePicture.set(username, url);
      break;
    }
    return pictureUrl;
  }

  /**
   * Tries to get the source URL of the user's profile picture using multiple methods
   * Opens the image or shows an alert if it doesn't find any URL
   */
  async function openProfilePicture() {
    try {
      const username = getProfileUsername();
      if (!username) throw new Error("Couldn't find username");

      document.body.style.cursor = 'wait';
      const pictureUrl = await getProfilePicture(username);
      if (!pictureUrl) throw new Error('No profile picture found on any of the external sources');

      Logger.log('Profile picture found, opening it...');
      openUrl(pictureUrl);
    } catch (error) {
      Logger.alertAndLog("Couldn't get user's profile picture", error);
    } finally {
      document.body.style.cursor = 'default';
    }
  }

  /**
   * Get the source url of a story video
   * @param {HTMLElement} video DOM element node containing the video
   */
  function getStoryVideoSrc(video) {
    try {
      const videoElement = qs(video, 'source');
      return videoElement ? videoElement.getAttribute('src') : null;
    } catch (error) {
      Logger.error('Failed to get story video source', error);
      return null;
    }
  }

  /**
   * Get the source url of a story image
   * @param {HTMLElement} image DOM element node containing the image
   */
  function getStoryImageSrc(image) {
    const fallbackUrl = image.getAttribute('src');
    try {
      const srcs = image.getAttribute('srcset').split(',');
      const sources = srcs.map((src) => {
        const [url, size] = src.split(' ');
        return { url, size: parseInt(size.replace(/[^0-9.,]/g, '')) };
      });
      /* get the url of the image with the biggest size */
      const biggestSource = sources?.reduce((biggestSrc, src) => {
        return biggestSrc.size > src.size ? biggestSrc : src;
      }, sources[0]);
      return biggestSource?.url ?? fallbackUrl;
    } catch (error) {
      Logger.error('Failed to get story image source', error);
      return fallbackUrl || null;
    }
  }

  /**
   * Finds the best image/video source (size and quality) and returns its url.
   * @param {{ width: number; height: number; url: string; type: number; }[]} imageSources
   * @returns string
   */
  function getUrlFromBestSource(imageSources) {
    return imageSources.reduce((largestSource, source) => {
      if (source.height > largestSource.height) return source;
      if (source.height === largestSource.height && source.type > largestSource.type) return source;
      return largestSource;
    }, imageSources[0])?.url;
  }

  /**
   * Maps the response of the IG api for stories to a more friendly format
   * @param {any[]} apiDataItems
   */
  function mapStoriesApiResponse(apiDataItems) {
    return apiDataItems.map(({ taken_at, video_versions, image_versions2 }) => {
      const timestamp = taken_at * 1000;
      const imageUrl = getUrlFromBestSource(image_versions2.candidates);

      return {
        url: video_versions ? getUrlFromBestSource(video_versions) : imageUrl,
        thumbnailUrl: imageUrl,
        dateTime: new Date().toISOString(),
        relativeTime: getRelativeTime(timestamp),
        timestamp,
      };
    });
  }

  /**
   * Fetches the current stories from a user
   * @param {string} username
   * @param {boolean} cacheFirst Whether to check the cache before making the request
   * @returns {Promise<{ url: string; thumbnailUrl: string; dateTime: string; relativeTime: string }[]>}
   */
  async function getUserStories(username, cacheFirst = true) {
    if (cacheFirst && cachedApiData.userStories.has(username)) {
      Logger.log('[CACHE HIT] User stories');
      return cachedApiData.userStories.get(username);
    }

    Logger.log('Getting user stories...');
    const { id: userId } = await getUserDataFromIG(username);
    const result = await httpGETRequest(API.IG_REELS_FEED_API(userId), {
      headers: {
        'User-Agent': USER_AGENT,
        'x-ig-app-id': IG_APP_ID,
      },
    });

    const mappedStories = mapStoriesApiResponse(result.reels[userId].items);
    cachedApiData.userStories.set(username, mappedStories);

    return mappedStories;
  }

  /**
   * Returns the user's profile picture, obtained from the user info API or __a
   * This uses the sessionid to get a high res version of the picture, if it was provided on the developer
   * options. If no sessionid was provided, it falls back to the low res version, if available.
   * @returns {Promise<string|null>} URL of the profile picture or null if it fails
   */
  async function getProfilePictureFromUserInfoApi() {
    const username = getProfileUsername();
    if (!username) return null;

    const user = await getUserDataFromIG(username);
    const lowResPictureUrl = user?.profile_pic_url_hd || user?.profile_pic_url;

    const userApiInfo = user?.id
      ? await httpGETRequest(API.IG_USER_INFO_API(user.id), {
          headers: {
            'User-Agent': USER_AGENT,
            ...(sessionId ? { Cookie: `sessionid=${sessionId}` } : {}),
          },
        })
      : undefined;

    const highResPictureUrl =
      'user' in userApiInfo
        ? userApiInfo.user.hd_profile_pic_url_info?.url || userApiInfo.user.profile_pic_url
        : userApiInfo.graphql.user.hd_profile_pic_url_info.url;

    if (!highResPictureUrl) {
      if (!lowResPictureUrl) {
        Logger.error("Unable to get user's profile picture");
        return null;
      }
      Logger.error("Unable to get user's high-res profile picture, falling back to to low-res...");
      if (sessionId) {
        Logger.warn(
          "Make sure you are logged in and using a session id that hasn't expired or been revoked (logged out)"
        );
      }
      return lowResPictureUrl;
    }
    return highResPictureUrl;
  }

  /**
   * Return the data from a certain user using IG's __a=1 API
   * @type {(username: string, cacheFirst: boolean) => Promise<{ id: string; profile_pic_url_hd: string; profile_pic_url: string; } | null>}
   */
  async function getUserDataFromIG(username, cacheFirst = true) {
    if (cacheFirst && cachedApiData.userInfo.has(username)) {
      Logger.log('[CACHE HIT] User data from IG __A1');
      return cachedApiData.userInfo.get(username);
    }

    const userInfo = (await httpGETRequest(API.IG__A1(username)))?.graphql?.user;
    cachedApiData.userInfo.set(username, userInfo);
    return userInfo;
  }

  /**
   * Loads the key bind to open a single post or a story from storage into a global scope variable, in order
   * to be used on the key binding handler method
   */
  async function loadPostStoryKeyBindings() {
    const kbName = 'single post and story';
    try {
      const kb = await loadKeyBindingFromStorage(STORAGE_KEY_POST_STORY_KB, DEFAULT_KB_POST_STORY, kbName);
      if (kb) openPostStoryKeyBinding = kb;
    } catch (error) {
      Logger.error(
        `Failed to load "${kbName}" key binding, considering default (Alt + ${DEFAULT_KB_POST_STORY})`,
        error
      );
    }
  }

  /**
   * Loads the key bind to open a profile picture from storage into a global scope variable in order
   * to be used on the key binding handler method
   */
  async function loadProfilePictureKeyBindings() {
    const kbName = 'profile picture';
    try {
      const kb = await loadKeyBindingFromStorage(STORAGE_KEY_PROFILE_PICTURE_KB, DEFAULT_KB_PROFILE_PICTURE, kbName);
      if (kb) openProfilePictureKeyBinding = kb;
    } catch (error) {
      Logger.error(
        `Failed to load "${kbName}" key binding, considering default (Alt + ${DEFAULT_KB_PROFILE_PICTURE})`,
        error
      );
    }
  }

  /**
   * Loads a key binding from storage, if it fails or doesn't have anything stores, returns the fallback key binding
   * @param {string} storageKey Unique name used to store the key binding
   * @param {string} defaultKeyBinding Fallback key binding
   * @param {string} keyBindingName Key binding name to show on log messages, just for context
   * @returns {Promise<string|null>} The saved letter used on the key binding or null if it fails
   */
  async function loadKeyBindingFromStorage(storageKey, defaultKeyBinding, keyBindingName) {
    let kb = await callGMFunction('getValue', storageKey, defaultKeyBinding);
    if (kb === null) {
      kb = defaultKeyBinding;
      Logger.log(`Falling back to default key binding: Alt + ${defaultKeyBinding}`);
    }

    try {
      if (isKeyBindingValid(kb)) {
        const newKey = kb.toUpperCase();
        Logger.log(`Discovered ${keyBindingName} key binding: Alt + ${newKey}`);
        return newKey;
      } else {
        Logger.error(
          `Couldn't load "${keyBindingName}" key binding, "${kb}" key is invalid, using default (Alt + ${defaultKeyBinding})`
        );
        return defaultKeyBinding;
      }
    } catch (error) {
      if (kb != defaultKeyBinding) {
        Logger.error(
          `Failed to load "${keyBindingName}" key binding, falling back to default: Alt + ${defaultKeyBinding}`,
          error
        );
      }
      return null;
    }
  }

  /**
   * Adds event listener(s) to the current document meant to handle key presses on a single post page
   */
  function setupSinglePostEventListeners() {
    setupKBEventListener(
      isSinglePostKeyBindingSetup,
      loadPostStoryKeyBindings,
      handleSinglePostKeyPress,
      () => {
        isSinglePostKeyBindingSetup = true;
      },
      'Defined single post opening event listener'
    );
  }

  /**
   * Adds event listener(s) to the current document meant to handle key presses on a story page
   */
  function setupStoryEventListeners() {
    setupKBEventListener(
      isStoryKeyBindingSetup,
      loadPostStoryKeyBindings,
      handleStoryKeyPress,
      () => {
        isStoryKeyBindingSetup = true;
      },
      'Defined story opening event listener'
    );
  }

  /** Adds event listener(s) to the current document meant to handle key presses on a profile page */
  function setupProfileEventListeners() {
    setupKBEventListener(
      isProfileKeyBindingSetup,
      loadProfilePictureKeyBindings,
      handleProfileKeyPress,
      () => {
        isProfileKeyBindingSetup = true;
      },
      'Defined profile picture opening event listener'
    );
  }

  /**
   * Generic method to add an event listener for a key binding
   * @param {boolean} condition Condition that determines if the event should be added
   * @param {() => Promise<void>} loadingFn Async function used to load the key binding
   * @param {() => void} keyPressHandler Handler function for the event (key binding press)
   * @param {() => void} callback Function to call after adding the event listener
   * @param {string} logMessage Message logged after adding the event listener
   */
  async function setupKBEventListener(condition, loadingFn, keyPressHandler, callback, logMessage) {
    if (condition) return;

    await loadingFn();
    document.addEventListener('keydown', keyPressHandler);
    callback();
    Logger.log(logMessage);
  }

  /** Removes the previously added event listener(s) meant to handle key presses on a single post page */
  function removeSinglePostEventListeners() {
    removeKBEventListeners(
      isSinglePostKeyBindingSetup,
      handleSinglePostKeyPress,
      () => {
        isSinglePostKeyBindingSetup = false;
      },
      'Removed single post opening event listener'
    );
  }

  /** Removes the previously added event listener(s) meant to handle key presses on a story page */
  function removeStoryEventListeners() {
    removeKBEventListeners(
      isStoryKeyBindingSetup,
      handleStoryKeyPress,
      () => {
        isStoryKeyBindingSetup = false;
      },
      'Removed story opening event listener'
    );
  }

  /** Removes the previously added event listener(s) meant to handle key presses on a profile page */
  function removeProfileEventListeners() {
    removeKBEventListeners(
      isProfileKeyBindingSetup,
      handleProfileKeyPress,
      () => {
        isProfileKeyBindingSetup = false;
      },
      'Removed profile picture opening event listener'
    );
  }

  /**
   * Generic method to remove an event listener for a key binding
   * @param {boolean} condition Condition that determines if the event should be removed
   * @param {() => void} keyPressHandler Handler function previously assigned to the event
   * @param {() => void} callback Function to call after removing the event listener
   * @param {string} logMessage Message logged after removing the event listener
   */
  function removeKBEventListeners(condition, keyPressHandler, callback, logMessage) {
    if (!condition) return;
    document.removeEventListener('keydown', keyPressHandler);
    callback();
    Logger.log(logMessage);
  }

  /**
   * Handles key up events on a story page
   * @param {KeyboardEvent} event Keyboard event
   */
  function handleStoryKeyPress(event) {
    handleKeyPress(
      event,
      openPostStoryKeyBinding,
      () => pages.story.isVisible(),
      'Detected source opening shortcut on a story page',
      openStoryContent
    );
  }

  /**
   * Handles key up events on a single post page
   * @param {KeyboardEvent} event Keyboard even
   */
  function handleSinglePostKeyPress(event) {
    handleKeyPress(
      event,
      openPostStoryKeyBinding,
      () => pages.post.isVisible(),
      'Detected source opening shortcut on a single post page',
      openPostSource
    );
  }

  /**
   * Handles key up events on a profile page
   * @param {KeyboardEvent} event Keyboard even
   */
  function handleProfileKeyPress(event) {
    handleKeyPress(
      event,
      openProfilePictureKeyBinding,
      () => !(pages.story.isVisible() || pages.post.isVisible()),
      'Detected profile picture opening shortcut on a profile page',
      openProfilePicture
    );
  }

  /**
   * Handles key up with the alt key events on certain conditions and performs an action
   * @param {KeyboardEvent} event Keyboard event
   * @param {string} keyBinding Target key binding (letter)
   * @param {() => boolean} checkConditionsAreMet Function that determines if the conditions are met
   * @param {string} logMessageString Message logged when the keybinding is used and the conditions are met
   * @param {() => void} keyPressAction Function executed when the keybinding is used and the conditions are met
   */
  function handleKeyPress(event, keyBinding, checkConditionsAreMet, logMessageString, keyPressAction) {
    if (event.altKey && event.code.toLowerCase() === `key${keyBinding.toLowerCase()}` && checkConditionsAreMet()) {
      Logger.log(logMessageString);
      keyPressAction();
    }
  }

  /**
   * Performs an HTTP GET request using the GM_xmlhttpRequest or GM.xmlHttpRequest function
   * @type {<T = any>(url: string, options?: { headers?: GM.Request['headers']; parseToJson?: boolean }) => Promise<T>}
   */
  function httpGETRequest(url, options) {
    const { headers, parseToJson = true } = options || {};

    return new Promise((resolve, reject) => {
      /** @type {GM.Request} */
      const requestOptions = {
        method: 'GET',
        url,
        headers,
        timeout: 15000,
        onload: (res) => {
          if (res.status && res?.status !== 200) {
            reject('Status Code', res?.status, res?.statusText || '');
            return;
          }
          let data = res.responseText;
          if (parseToJson) {
            data = JSON.parse(res.responseText);
          }
          resolve(data);
        },
        onerror: (error) => {
          error(`Failed to perform GET request to ${url}`, error);
          reject(error);
        },
        ontimeout: () => {
          Logger.error('GET Request Timeout');
          reject('GET Request Timeout');
        },
        onabort: () => {
          Logger.error('GET Request Aborted');
          reject('GET Request Aborted');
        },
      };

      const fnResponse = callGMFunction('xmlHttpRequest', requestOptions);
      if (fnResponse === null) {
        Logger.error(`Failed to perform GET request to ${url}`);
        reject();
      }
    });
  }

  /**
   * Opens a URL depending on the behavior defined in the settings
   * @param {string} url URL to open
   */
  function openUrl(url) {
    if (openSourceBehavior === BUTTON_BEHAVIOR_NEW_TAB_BG) {
      callGMFunction('openInTab', url, true);
    } else if (openSourceBehavior === BUTTON_BEHAVIOR_REDIR) {
      window.location.replace(url);
    } else {
      window.open(url, '_blank');
    }
  }

  /**
   * Calls a both formats of a given GreaseMonkey method, for compatibility.
   * @type {<T extends keyof typeof GM>(gmFunctionName: T, ...args: Parameters<typeof GM[T]>) => ReturnType<typeof GM[T]>}
   */
  async function callGMFunction(gmFunctionName, ...args) {
    for (const fnName of [`GM.${gmFunctionName}`, `GM_${gmFunctionName}`]) {
      try {
        const fn = eval(fnName);
        if (typeof fn !== 'function') throw new Error('Not found');
        return await fn(...args);
      } catch (error) {
        Logger.warn(`Failed to call ${fnName} function.`, error);
      }
    }
    Logger.error(`Failed to call all GM function variants of '${gmFunctionName}'`);
    return null;
  }

  /**
   * Finds the current position on a post carousel
   * @param {HTMLElement} node DOM element node containing the post
   * @return {number} current index
   */
  function getCarouselIndex(node) {
    const indicators = qsa(node, IG_S_MULTI_POST_INDICATOR);
    for (let i = 0; i < indicators.length; i++) {
      if (indicators[i].classList.contains(IG_C_MULTI_POST_INDICATOR_ACTIVE)) return i;
    }
    return -1;
  }

  /**
   * Check if the key is valid to be used as a key binding
   * @param {string} key Key binding key
   * @returns {boolean} If it's valid or not
   */
  function isKeyBindingValid(key) {
    return /[a-zA-Z]/gm.test(key);
  }

  /**
   * Matches a CSS selector against a DOM element object to check if the element exist in the node
   * @param {string} selector
   * @param {HTMLElement} node DOM element node to match
   * @returns {boolean} True if the element exists in the node, otherwise false
   */
  function elementExistsInNode(selector, node) {
    return node && qs(node, selector) != null;
  }

  /**
   * Returns the last 4 digits of a provided string
   * @param {string} str
   */
  function getLast4Digits(str) {
    return str?.slice(Math.max(str.length - 4, 0), str.length);
  }

  /**
   * Checks if the user is logged in
   * @return {boolean} whether the user is logged in or not
   */
  function checkIsLoggedIn() {
    return Boolean(getCookie(COOKIE_IG_USER_ID));
  }

  /**
   * Returns an existing cookie by matching it's name
   * @param {string} name name of the cookie
   * @returns {string} value of the cookie
   */
  function getCookie(name) {
    const matches = document.cookie.match(PATTERN.COOKIE_VALUE(name));
    return matches?.[2];
  }

  /**
   * Returns the username of the user from the profile page title or the url as fallback
   * @return {string} username
   */
  function getProfileUsername() {
    const pageUsername = qs(document, IG_S_PROFILE_USERNAME_TITLE)?.innerText;
    const isNotUsername = !PATTERN.IG_VALID_USERNAME.test(pageUsername);
    if (isNotUsername) {
      const urlPathParts = window.location.pathname.match(PATTERN.URL_PATH_PARTS);
      return urlPathParts.length >= 2 ? urlPathParts[1] : null;
    }
    return pageUsername;
  }

  /**
   * Creates an element from a given HTML string
   * @param {string} htmlString HTML string to create the element from
   * @returns {Element | null} The created `Element` or `null` on fail
   */
  function createElementFromHtml(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstElementChild;
  }

  /**
   * Query Selector
   * @param {HTMLElement} node
   * @param {string} selector
   * @returns {Element | null} An `Element` or `null` if not found
   */
  function qs(node, selector) {
    return node.querySelector(selector);
  }

  /**
   * Query Selector All
   * @param {HTMLElement} node
   * @param {string} selector
   * @returns {NodeListOf<Element>} A list with the elements that were found
   */
  function qsa(node, selector) {
    return node.querySelectorAll(selector);
  }

  /**
   * Query Selector & Add Event Listener
   * @param {HTMLElement} node
   * @param {string} selector
   * @param {string} type
   * @param {EventListener} listener
   */
  function qsael(node, selector, type, listener) {
    const element = qs(node, selector);
    element.addEventListener(type, withPreventDefault(listener));
    return element;
  }

  /**
   * Executes the prevent default before the passed function, passing the event down to it
   * @type {<Fn>(callback: Fn) => void}
   */
  function withPreventDefault(callback) {
    /** @param {Event | undefined} event */
    return (event) => {
      event?.preventDefault();
      callback(event);
    };
  }

  /**
   * Executes the stop propagation before the passed function, passing the event down to it
   * @type {<Fn>(callback: Fn) => void}
   */
  function withStopPropagation(callback) {
    /** @param {Event | undefined} event */
    return (event) => {
      event?.stopPropagation();
      callback(event);
    };
  }

  const TIME_UNITS = [
    { unit: 'year', ms: 31536000000 },
    { unit: 'month', ms: 2628000000 },
    { unit: 'day', ms: 86400000 },
    { unit: 'hour', ms: 3600000 },
    { unit: 'minute', ms: 60000 },
    { unit: 'second', ms: 1000 },
  ];
  const RTF = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  /**
   * Converts a timestamp into a relative human readable time (e.g. 3 hours ago)
   * @param {number} timestamp
   * @returns string
   */
  function getRelativeTime(timestamp) {
    const elapsed = timestamp - Date.now();
    for (const { unit, ms } of TIME_UNITS) {
      if (Math.abs(elapsed) > ms || unit === 'second') {
        return RTF.format(Math.floor(elapsed / ms), unit);
      }
    }
  }

  /** Utility that creates an iternal object and methods to use as a cache */
  function buildCache() {
    const keyValueRecord = {};

    /** @type {(key: string) => string | undefined} */
    const get = (key) => keyValueRecord[key];
    /** @type {(key: string, value: any) => void} */
    const set = (key, value) => (keyValueRecord[key] = value);
    /** @type {(key: string) => boolean} */
    const has = (key) => !!get(key);

    return { get, set, has };
  }

  /**
   * Logging utils generator
   * @param {string} loggingTag
   */
  function createLogger(loggingTag) {
    const baseAlert = (...args) => alert(`${SCRIPT_NAME}:\n\n${args.join(' ')}`);
    const baseLog = (type, ...args) => {
      if (!LOGGING_ENABLED) return;
      console[type]?.(`[${loggingTag}]`, ...args);
    };

    return {
      log: (...args) => baseLog('log', ...args),
      warn: (...args) => baseLog('warn', ...args),
      error: (...args) => baseLog('error', ...args),
      alert: (...args) => baseAlert(...args),
      alertAndLog: (...args) => {
        baseLog('log', ...args);
        baseAlert(...args);
      },
    };
  }

  /** Appends the necessary styles to DOM */
  function injectStyles() {
    try {
      const styles = `
        :root{--iso-post-btn-icon:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAEkklEQVR4nO3b24tVdRQH8M+ZGcemwkgJqocoy6QLXTBLp5hKMEQposIeulD0L0gRURB0Af+GLj4ERj1E0EtoZJlMF7OUJIqaSi2zcSwsRUfH08PPgcM+v33mnH07R5wv/BjY7P1dl/3ba62zfmuYxdmNWoWy5mHBaZlHcfj0366iDAecj+UN62bB8IHIvb/jR3yFLdiK/0rQqXTUMIINOIJ6xnUUG7EafVUakBU1rMUPshudtnbjcfRXZk2HWIJPFG94cn2D4Ypsagv9eAVTOjPkH4zhZ+zHiQ6ePYX1mFOBfS1xETaZWeFxvIGncK14AJyDxXgUr+FAG7yjuKQUy9rAIuyZQcEP8RAGM/APYA02zyBjDFfnsCMTLsNvLZTaiRUFyhvG9hbyDqjQCRcLuTqmyAk8rZxI3Yd1mEyRPaaCz6Ef21IU+BN3l60AbpMeH0aVHBifTxG8DwvLFJzAVfglRZf1ZQldIr79/hIie9W4UkifsRS5vGhhNeyICDuBZUUL6wDLxF/K1wqOQ/dHhNTxQpFCMmKduG6PFSWgJpSfSQFfiBc0VaNfPEXuVtAPqFUR8rpi83xeDIvruLoI8g0R4k+LIC4YsYpxY17SQRyKEN+bl7gErNGs5xGcl4d0dYT0b9lq+7IxIF4greqEJBk07ojc876QenoNJ/FB5PpdnZAkHXB95J7NnRBWjC2Ra0vzEI5p3lI35SEsGddo1ndPVrIhoaxMVn7n5FazPAwKn0KyNJ7bLkHjJ3Cu5jb5IRzLp2OpmMRE4loNF7RL0OiAmNeOZ1CqahyOXJvX7sONDoilul6M/knEyvOT7T7c6ICYsW17souYH7l2KAtRn/C9J6NqrsqqZAxqDtyTOjjya9wBp7A3cs/l2fUrHYs1GzsuOKItJAuhXyP33NqZTpUi1gn6thOCpAO+jNxzTyeEFSN2ZDaah3BEcwwY15sHlHNxUMF9izlCXk2SPpiHtCQ8rFnPfxUQtN+NEH+Wl7QEfKRZz9eLIL4zQlzH7UWQF4SVStYx1nTcpQeOp4V4tFO8KVoYHokIqOPZIoVkxDPiuj1QpJA+fB4Rclz4RLqFFZp//taFSZXCcYP4KcyEUIFVjRvFM9QUbilL6KsRgXXhoLJKJyyVPlLzcpmCB/FxiuAJ1XwOw+Jvfjo9l16kXYjvUxQ4JgTGMrLDAF7UepjqD2F0p3QsFAYi0hTZJd5Sz4qVWo/INK59KnRC2k6YXtuEIaks23KucAK1dQYZsbVf6BCXjvlCL34mhQ7ibTyJ68Tr8yFhCOMJvCXMEc7Eu13Y9l11wqAwKJk2vJS2xoUhyb1CyyqWz9PWJJ4TdtYiYdt31QmEOmG0AyOyru2a83zPOKFPKJvbDVidrB24T3p/r2ecMI0RvCM9Z7ezJvCmcMLbTmOz55xAqAlGhAptkzBkGes2T+EnvIeXhNZblnqiJ52QRA2XCql0gVBcDRXIf0Y4oWzMOsGsE9DaCZWVzd1GKyd85wz5h6y8aOWEK7qoV6WIOeGwMAxy1mCRsO2njV/bXXW6gz7hlPusevOzaAf/A63z45sbiSeUAAAAAElFTkSuQmCC');--iso-post-carousel-btn-icon:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2264%22%20height%3D%2264%22%20preserveAspectRatio%3D%22xMidYMid%20meet%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cg%20fill%3D%22none%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M12%202C6.477%202%202%206.477%202%2012s4.477%2010%2010%2010s10-4.477%2010-10S17.523%202%2012%202zm-1%205a4%204%200%201%200%202.032%207.446l1.76%201.761a1%201%200%200%200%201.415-1.414l-1.761-1.761A4%204%200%200%200%2011%207zm0%206a2%202%200%201%200%200-4a2%202%200%200%200%200%204z%22%20fill%3D%22white%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");--iso-story-btn-icon:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAABcklEQVRYhe2WO04DMRRFrwkroIAG2oQKBAuggzolHUVCEAWrYAGUCAE9RGyAAgoWgAIUQbABCn6BNsmhiEeyRvNx4knF3Mb2vM+9fmM/WSpRIgHAEnAF/JCPZ2DeiT0D+gl+feDUl/zDg9jFphP/neHXj/PNJmg4kjRn5x1Jrzmau5JunfWOpG1JFUkbkhYcW8WnAlHZO8BMbkB6ngYwiJfAJzBCO4C8BQxtngHwliZg4h1mkDclHUsykpB0IOlunAQTVwDYi+28ab9fpB3CwgSkkVtbHfgCTqYiAGg6B24I7I8jPkgAsFsY+bgCfMmBCrCF0zGDBQDrsX/eyPA9tH7duC2pE/pioNE1Q1LLGHOe4Vuz43JhAowxD8CaJIwxT5PmCamAjDGPIfHSFDphKaAUUISAXztWCXiQRLA5oj7Qi9uTruGNpLqkVUn3wEughqqkFTu/zvUGasAnxeMdWPSSzOhl3AZ6BRD3gEtv8hL/Dn+PJax2JC/rEwAAAABJRU5ErkJggg==");--iso-settings-btn-icon:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAD+UlEQVR4nO3aS4xkYxQH8F8rNDozpmcyk8hoYSEEM0IiYUkvJJN4TLcMCwsRZsXOxpL9JMaClcdGLDw34zUJKxlsxDOTiKaHYEEahWFUd1l8Lemp+m7Vvd/9bnWR+idnUzfnf87536/O97pMMMEEE+TFHhzGp/gN3UQ7hS/xOC4aaQWJmMYTWJVedJG1cfvoSqmOabwtf+EbrYO7RlVQVTyp2eL/tb+NoQh79A/7E1jElgS+WNFjLcJj+ovfXoOvV4A7jbkInzk9ucWafL0CMOYi/Or0xFKG/UbEBGCMRShKuAm+O/SL0MHdGeImY5QCMIYijFoAxkyEzRCAMRJhswRgTETYTAEonh1uy5BLKeQWoN3Dd2EJn5gIbcxlyGcocgvwfg/fa9JFOJwhn6E4goexD5dn4HtQv6ip9kWGfEaOaXwojwB/jTj3bNgtnwj/WZyNB3BMf2PMJsBUA4lvNnqLHljjGTUC3YBtCX4tXFsj7qZjDq8KSr+LmQq+U3hm3fdlzczTjfaAq7HSE+A97Crhew6e7/FdwXzmHBsV4AKsRYJ8j/uFInvRwq34POLXxS2Zc2y8CX6EvQXP2ngHXwkHpbtxo+IR0hH6yO8JeRShUhNMwVPyrdQ+zp1cJMZApMwCXyf4FOHHjFxJSBGglTF+rGeMFCkCXJox/lXyCto4WvhGvh7QxU2Zc2x0GlyMBKhrr2fOsTEBzsdSJEAOuydjno0IcB7eiJDnspPYnynX7ALsxQcR4pgtY0G4HtsqFHW8pG9H+Bpktma+WQSYFQp5Sf8526DiY8lvV61xnsSLOFjANwy1BdgnvI2qw3hhAOeBBL6utKPtSgLE1gE7pc3Nbw149mYCH6HxNoqYAHUOSYqQuiFZy5pFBLFif07kGrSvvzmBbxU/JeZSC7PC3v4F/KH8//W4eNPagW9Lcpxaj7sg7bhNhLMWZoWpqWxTPCFcWG5dtwPKzwDHcGXdhCO8WbBfmJ5SOnkZO4JzM+XaiABwb4Q8hy0JoyUXGhOAsHHJLcCg9UMKGhVgPhKgji3LP+02KkALv0SCpNqzuROMxBiIquqvCsfbubCUkSsJKcPvz4zxOxm56F86t4c5pAiwM8GnCJdk5KJ/xbk8zOHMigFmcNmA5z8IFyPfCf3iYuHMr2iau65i/EHYgUM9vx3NyI9wxRVrZp8I2+jYiJrGfYIovX5rwnVbHRStODu4oiZ3H+b1X44+JxQ5DLuE5e5G3xXF12yPKj+bxKyxD6TmhKvtLp5Wbas7I1ypd9c5ir7+eki94o/irAp5JeEaaQcn23B9wbMpPCJ+A13GOsKbb7z4JrAFr6hedFvoQYc08J+fYIIJ/t/4By9tfiJ9bFVlAAAAAElFTkSuQmCC");--iso-settings-select-arrow-icon:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAnXwAAJ18BHYa6agAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAACgSURBVHic7dcxDoJAFEXRZ+zdlkuyNC7L0sINuQEtzE8sDBEEkeGchHaG+7pJAAAAAAAAWIfNiGftkuxHPK/LOcntR3f1ckhyn/g7/qxmoClH+Pv4MsUIi4kvY46wuPgyxgiLjS/fjLD4+DJkhGbiS58Rmosvn4zQbHzpGqH5+PJuhNXEl9cRZovfznVxkmuej7FLktOM/wEAAAAAAKzEA6yHqvmapYJUAAAAAElFTkSuQmCC");--iso-anonymous-stories-btn:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAEU0lEQVR4nO2ay29VRRzHPy0klkei5UIFLG0XwgbiggR5llZQd0ZMVN4EwYVL9Q8o7DWwIYEVARLFIFHjE+xSFwRi6YJHwqtACJRQjECh8rjAYuaE3zmce8/MOTP3knQ+yS/33OT3+31n5sw58zoQCAQCo5gGz/lnAp8BE4BjwE/AzYyYycAKYAHwL7ADuOyxjN6YBdwGngh7ABwCNgMl4VsCPgUOAw8TMTeBtpqV2iHfEq9I0h6iKpxW6aTtqW3RizMJGKF6pWzsHvCKj4I2+kgKrAWaHOYbB3zsMJ93+nB39yM7UtMaFGAu7isf2RuuC+vjEdjkIWfERo+5ndCEGrt99YAh4CWXBXbdAz4Amh3nlJSA9zzmL0wv/u5+ZH/UrDaWtANl/DdAGYczQ5ePwCeO81WiEdhQAx0rGoGL+L/7kV2gNo1tzDvUrvKRLXNRcFet6HPsr8TmOmim4nrhY2ojOBhyXfQA1wsfU5qANXXQfQ4fCx9T66tB/QKBwCjkAPV7sfmyA2kVfaGmk/UgNEC9CxAI1BcXh6OtqN2gKagN0UvafNAGdKAWQUNa54onrao0A1uBk6QPOWeBLcQPQPNSAnqAMxW0TmgtL0dnaWxCndiajL3/UWz7ap3OYaI1hOdzgwZge4rwCHActSPchzrITPp8jf3j9lVKnntao1drpu1DbMuhZcTWhNAA6u5OTPhNANYD5xP+Wyy0ehKx51D7DuNTtDag9gilf4+FlhFvA4+FwA9avBrjge9FzCOg00CrU/vKKew4A62DIqYMvGWgZUQD8I9I3guMNYxtBH4TscfI7p5HhP9hYExOrX4cTfTkju8wMM0yfqqOi3IsqeLbKfzuAC2WWq/quCjH8qwAk9b9EnhTX+9CdWsbhlFzhAX6fxk1jH4OfAGsBLpRvep9YJ722wH8aKl1F/WR1UL9/xYOjtL6edaieZ+rLuIvKRMzeV+kIXvR8Zw5YgyJhLZdMqIF+wbIO4kqiRzXs5xNXmZymBvOWahbif+ngX3AUdRjuBD1mdwMB1q3xfXLOXPEuMyzFu3ImaNd5DhHesM3oeYWkd+MFB8TWkWOzDWJyTAxIK4X5SyUjOtHjfNJ/ie+z59Xa7G4HqjopTFpgEPiep11cZ6P+6uK398OtNaLaycfU8wiPjOzPZVdJmIfUP1F2qJ9Iv+uAlqPgNct4yuyVyS+hnqmTWjX/lHsToOYXcL/KuZfg3QAgyJ2t2GcEa2oIUU2QndGTDfxyg+iTpKzmES8IleBpRkxyxMxg8B0Ay0rlgL3hcgT4FdgNeoxada/q4FfEn53gfkWWvN1jMzxM7AK9Ql+pLUW+D3hd5/8k6hMuohPjEzsOvbPcqQle52J3SC7txSmDdhPfHmcZmXUJ/OvFdBqBb4z0HoMfEOOuUORnZPZwIfAu6gX0GTUVtlF4E/UOv5UgfySOcBHqJVpB2q6e0NoHXSoFQgEAoFAYJTwFHhgrSVd8Ek7AAAAAElFTkSuQmCC');--iso-settings-separator-color:rgba(219, 219, 219, 1);--iso-story-button-size:40px;--iso-story-button-icon-size:24px;--iso-post-button-size:40px;--iso-post-button-icon-size:24px;--iso-profile-button-size:40px;--iso-profile-button-icon-size:22px;--iso-profile-button-icon-hover-size:calc(var(--iso-profile-button-icon-size) + 2px);--iso-setting-button-size:22px;--iso-setting-button-icon-size:22px}
        .${C_BTN_ANONYMOUS_STORIES},.${C_BTN_POST},.${C_BTN_PROFILE_PIC},.${C_BTN_STORY},.${C_SETTINGS_BTN},.${C_SETTINGS_MENU_OPTION_BTN},.${C_STORIES_MODAL_LIST_ITEM}{transition:all .2s ease-in-out;-webkit-transition:all .2s ease-in-out;-moz-transition:all .2s ease-in-out;-ms-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out}
        .${C_BTN_POST}{min-height:var(--iso-post-button-size);min-width:var(--iso-post-button-size);max-height:var(--iso-post-button-size);max-width:var(--iso-post-button-size);outline:0;border:none;cursor:pointer;opacity:1;margin-left:6px;margin-right:-8px;background-color:transparent;background-repeat:no-repeat;background-image:var(--iso-post-btn-icon);background-size:var(--iso-post-button-icon-size) var(--iso-post-button-icon-size);background-position:center}
        .${C_BTN_POST}:hover{opacity:.6}
        .${C_PROFILE_BUTTON_CONTAINER}{display:flex;flex-direction:row;justify-content:center;align-items:center;position:absolute;bottom:-16px;right:0;left:0}
        .${C_BTN_ANONYMOUS_STORIES},.${C_BTN_PROFILE_PIC}{outline:0;min-height:var(--iso-profile-button-size);min-width:var(--iso-profile-button-size);max-height:var(--iso-profile-button-size);max-width:var(--iso-profile-button-size);border:0;cursor:pointer;padding:0;border:1.5px solid #000;border-radius:50%;background-color:#fff;background-repeat:no-repeat;background-size:var(--iso-profile-button-icon-size) var(--iso-profile-button-icon-size);background-position:center}
        .${C_BTN_PROFILE_PIC}{background-image:var(--iso-post-btn-icon)}
        .${C_BTN_ANONYMOUS_STORIES}{margin-left:6px;background-image:var(--iso-anonymous-stories-btn)}
        .${C_BTN_ANONYMOUS_STORIES}:hover:not(:disabled),.${C_BTN_PROFILE_PIC}:hover:not(:disabled){background-color:#e8e8e8;background-size:var(--iso-profile-button-icon-hover-size) var(--iso-profile-button-icon-hover-size)}
        ${IG_S_PROFILE_PIC_CONTAINER}:hover .${C_BTN_PROFILE_PIC},${IG_S_PRIVATE_PROFILE_PIC_CONTAINER}:hover .${C_BTN_PROFILE_PIC}{opacity:1}
        .${C_BTN_STORY}{position:absolute;top:56px;right:16px;min-width:var(--iso-story-button-size);min-height:var(--iso-story-button-size);max-height:var(--iso-story-button-size);max-height:var(--iso-story-button-size);padding:16px;border:none;cursor:pointer;z-index:99;opacity:1;background-color:transparent;background-image:var(--iso-story-btn-icon);background-repeat:no-repeat;background-size:var(--iso-story-button-icon-size) var(--iso-story-button-icon-size);background-position:center}
        .${C_BTN_STORY}:hover{opacity:.8}
        .${C_SETTINGS_BTN}{width:var(--iso-setting-button-size);height:var(--iso-setting-button-size);cursor:pointer;top:16px;border:none;right:16px;position:fixed;background-color:transparent;background-image:var(--iso-settings-btn-icon);background-size:var(--iso-setting-button-icon-size) var(--iso-setting-button-icon-size);opacity:.8}
        @media only screen and (max-width:1024px){
        .${C_SETTINGS_BTN}{top:64px}
        }
        .${C_SETTINGS_BTN}:hover{opacity:1}
        .${C_MODAL_BACKDROP}{position:fixed;justify-content:center;align-items:center;width:100vw;height:100vh;top:0;left:0;background-color:rgba(0,0,0,.7);display:none;z-index:1}
        .${C_MODAL_WRAPPER}{display:flex;width:320px;flex-direction:column;background-color:#fff;border-radius:6px;z-index:5;box-shadow:-1px 2px 14px 3px rgba(0,0,0,.5)}
        .${C_STORIES_MODAL} .${C_MODAL_WRAPPER}{width:auto;max-width:calc(100vw - 124px)}
        @media only screen and (max-width:769px){
        .${C_STORIES_MODAL} .${C_MODAL_WRAPPER}{max-width:calc(100vw - 48px)}
        }
        .${C_MODAL_TITLE_CONTAINER}{display:flex;flex-direction:row;justify-content:space-between;font-weight:700;border-bottom:1px solid var(--iso-settings-separator-color)}
        .${C_MODAL_TITLE}{display:flex;justify-content:center;flex-direction:row;font-size:16px;padding:16px;text-align:left}
        .${C_MODAL_CLOSE_BTN}{width:24px;height:24px;border:0;padding:0;background-color:transparent;margin-top:8px;margin-right:8px;cursor:pointer}
        .${C_MODAL_TITLE_LINK}{margin-left:4px;color:#4287f5!important;text-decoration:none}
        .${C_MODAL_CONTENT_CONTAINER}{display:flex;flex-direction:column;flex:1}
        .${C_SETTINGS_MENU_OPTION}{display:flex;flex-direction:column;padding:12px 16px;border:none;background-color:transparent;font-size:14px;padding-left:16px;text-align:left}
        .${C_SETTINGS_MENU_OPTION_BTN}{display:flex;flex-direction:row;padding:12px 16px;border:none;background-color:transparent;font-size:14px;padding-left:16px;text-align:left;cursor:pointer}
        .${C_SETTINGS_MENU_OPTION_BTN}:hover{background-color:rgba(214,214,214,.3)}
        .${C_SETTINGS_MENU_OPTION_BTN}:active{background-color:rgba(214,214,214,.4)}
        [for="${ID_SETTINGS_BUTTON_BEHAVIOR_SELECT}"],[for="${ID_SETTINGS_SESSION_ID_INPUT}"]{font-size:12px;margin-bottom:6px}
        .${C_MODAL_WRAPPER} input,.${C_MODAL_WRAPPER} select{height:32px;font-size:14px;border:1px solid gray;border-radius:4px;padding:0 6px;-moz-appearance:none;-webkit-appearance:none;appearance:none}
        #${ID_SETTINGS_BUTTON_BEHAVIOR_SELECT}{background-image:var(--iso-settings-select-arrow-icon);background-size:24px 24px;background-repeat:no-repeat;background-position-x:99%;background-position-y:50%}
        #${ID_SETTINGS_DEVELOPER_OPTIONS_CONTAINER}{border-top:1px solid var(--iso-settings-separator-color)}
        #${ID_SETTINGS_DEVELOPER_OPTIONS_BTN}{display:flex;flex-direction:row;justify-content:space-between;align-items:center}
        .${C_SETTINGS_MENU_OPTION}.${C_SETTINGS_SECTION_COLLAPSED}{display:none}
        #${ID_SETTINGS_DEVELOPER_OPTIONS_BTN}.${C_SETTINGS_SECTION_COLLAPSED} .${C_SETTINGS_SELECT_ARROW}{transform:rotate(-90deg)}
        .${C_SETTINGS_SELECT_ARROW}{background-color:transparent;background-image:var(--iso-settings-select-arrow-icon);background-size:24px 24px;width:24px;height:24px}
        .${C_STORIES_MODAL_LIST}{display:flex;flex-direction:row;overflow-x:auto;padding:20px 0}
        .${C_STORIES_MODAL_LIST_ITEM}{display:flex;flex-direction:column;align-items:center;margin-left:16px;border-radius:6px;opacity:1;color:#505050}
        .${C_STORIES_MODAL_LIST_ITEM},.${C_STORIES_MODAL_LIST_ITEM}:active,.${C_STORIES_MODAL_LIST_ITEM}:visited{text-decoration:none}
        .${C_STORIES_MODAL_LIST_ITEM}:hover{opacity:.7}
        .${C_STORIES_MODAL_LIST_ITEM}:last-child{margin-right:16px}
        .${C_STORIES_MODAL_LIST_ITEM} img{height:max(256px,calc(100vh / 2));object-fit:cover;border-radius:6px}
        .${C_STORIES_MODAL_LIST_ITEM} time{color:#505050;margin-top:8px}
      `;
      const element = document.createElement('style');
      element.textContent = styles;
      document.head.appendChild(element);
      Logger.log('Injected CSS into DOM');
    } catch (error) {
      Logger.error('Failed to inject CSS into DOM', error);
    }
  }
})();
