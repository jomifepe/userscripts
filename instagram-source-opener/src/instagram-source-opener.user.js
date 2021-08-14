// ==UserScript==
// @name             Instagram Source Opener
// @version          1.1.20
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
// @updateURL        https://raw.githubusercontent.com/jomifepe/userscripts/main/instagram-source-opener/src/instagram-source-opener.user.js
// @downloadURL      https://raw.githubusercontent.com/jomifepe/userscripts/main/instagram-source-opener/src/instagram-source-opener.user.js
// @contributionURL  https://www.paypal.com/donate?hosted_button_id=JT2G5E5SM9C88
// @require          https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// ==/UserScript==

/* jshint esversion: 10 */
(function () {
  'use strict';

  const LOGGING_ENABLED = false;

  const SCRIPT_NAME = 'Instagram Source Opener',
    SCRIPT_NAME_SHORT = 'ISO',
    LOGGING_TAG = `[${SCRIPT_NAME_SHORT}]`,
    HOMEPAGE_URL = 'https://greasyfork.org/en/scripts/372366-instagram-source-opener',
    SESSION_ID_INFO_URL = 'https://greasyfork.org/en/scripts/372366-instagram-source-opener#sessionid',
    USER_AGENT =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 105.0.0.11.118 (iPhone11,8; iOS 12_3_1; en_US; en-US; scale=2.00; 828x1792; 165586599)';

  /* Instagram classes and selectors */
  const IG_S_STORY_CONTAINER = '.yS4wN,.vUg3G',
    IG_S_SINGLE_POST_CONTAINER = '.JyscU',
    IG_S_PROFILE_CONTAINER = '.v9tJq',
    IG_S_STORY_MEDIA_CONTAINER = '.qbCDp',
    IG_S_POST_IMG = '.FFVAD',
    IG_S_POST_VIDEO = '.tWeCl',
    IG_S_MULTI_POST_LIST_ITEMS = '.vi798 .Ckrof',
    IG_S_MULTI_POST_PREV_ARROW_BTN = '.POSa_',
    IG_S_MULTI_POST_NEXT_ARROW_BTN = '._6CZji',
    IG_S_POST_CONTAINER = '._8Rm4L',
    IG_S_POST_BUTTONS = '.eo2As > section',
    IG_S_PROFILE_PIC_CONTAINER = '.RR-M-',
    IG_S_PRIVATE_PROFILE_PIC_CONTAINER = '.M-jxE',
    IG_S_PRIVATE_PIC_IMG_CONTAINER = '._2dbep',
    IG_S_PRIVATE_PROFILE_PIC_IMG_CONTAINER = '.IalUJ',
    IG_S_PROFILE_USERNAME_TITLE = '.fKFbl,h2',
    IG_S_POST_BLOCKER = '._9AhH0',
    IG_S_TOP_BAR = '.Hz2lF,._lz6s',
    IG_S_POST_TIME_ANCHOR = '.c-Yi7',
    IG_S_MULTI_POST_INDICATOR = '.Yi5aA',
    IG_C_MULTI_POST_INDICATOR_ACTIVE = 'XCodT';

  /* Custom classes and selectors */
  const C_BTN_STORY = 'iso-story-btn',
    C_BTN_STORY_CONTAINER = 'iso-story-container',
    C_POST_WITH_BUTTON = 'iso-post',
    C_BTN_POST_OUTER_SPAN = 'iso-post-container',
    C_BTN_POST = 'iso-post-btn',
    C_BTN_POST_INNER_SPAN = 'iso-post-span',
    C_BTN_PROFILE_PIC_CONTAINER = 'iso-profile-pic-container',
    C_BTN_PROFILE_PIC = 'iso-profile-picture-btn',
    C_BTN_PROFILE_PIC_SPAN = 'iso-profile-picture-span',
    /* Script settings */
    C_SETTINGS_CONTAINER = 'iso-settings-container',
    C_SETTINGS_BTN = 'iso-settings-btn',
    C_SETTINGS_MENU = 'iso-settings-menu',
    C_SETTINGS_MENU_TITLE_CONTAINER = 'iso-settings-menu-title-container',
    C_SETTINGS_MENU_TITLE = 'iso-settings-menu-title',
    C_SETTINGS_MENU_TITLE_LINK = 'iso-settings-menu-title-link',
    C_SETTINGS_MENU_TITLE_CLOSE_BTN = 'iso-settings-menu-close-btn',
    C_SETTINGS_MENU_OPTIONS = 'iso-settings-menu-options',
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
    S_IG_POST_CONTAINER_WITHOUT_BUTTON = `${IG_S_POST_CONTAINER}:not(.${C_POST_WITH_BUTTON})`;

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

  const TRIGGER = {
    ARRIVE: 'arrive',
    LEAVE: 'leave',
  };

  const PATTERN = {
    URL_PATH_PARTS: /\/([a-zA-Z0-9._]{0,})/,
    IG_VALID_USERNAME: /^([a-zA-Z0-9._]{0,30})$/,
    COOKIE_VALUE: key => new RegExp(`(^| )${key}=([^;]+)`),
  };

  const GMFunc = {
    getValue: ['GM_getValue', 'GM.getValue'],
    setValue: ['GM_setValue', 'GM.setValue'],
    deleteValue: ['GM_deleteValue', 'GM.deleteValue'],
    registerMenuCommand: ['GM_registerMenuCommand', 'GM.registerMenuCommand'],
    openInTab: ['GM_openInTab', 'GM.openInTab'],
    xmlHttpRequest: ['GM_xmlhttpRequest', 'GM.xmlHttpRequest'],
  };

  const API = {
    IG_POST_INFO_API: postRelUrl => `https://www.instagram.com${postRelUrl}?__a=1`,
    IG__A1: username => `https://www.instagram.com/${username}?__a=1`,
    IG__A1_CURRENT_PAGE: () => `${window.location.href}?__a=1`,
    IG_USER_INFO_API: userId => `https://i.instagram.com/api/v1/users/${userId}/info/`,
  };

  let isStoryKeyBindingSetup, isSinglePostKeyBindingSetup, isProfileKeyBindingSetup;
  let openPostStoryKeyBinding = DEFAULT_KB_POST_STORY;
  let openProfilePictureKeyBinding = DEFAULT_KB_PROFILE_PICTURE;
  let openSourceBehavior = DEFAULT_BUTTON_BEHAVIOR;
  let sessionId = '';

  //#region Logging utilities

  const log = (...args) => LOGGING_ENABLED && console.log(...[LOGGING_TAG, ...args]);
  const error = (...args) => LOGGING_ENABLED && console.error(...[LOGGING_TAG, ...args]);
  const warn = (...args) => LOGGING_ENABLED && console.warn(...[LOGGING_TAG, ...args]);
  const message = (...args) => alert(`${SCRIPT_NAME}:\n\n${args.join(' ')}`);
  const errorMessage = (msg, ...errorArgs) => {
    if (LOGGING_ENABLED) error(msg, ...errorArgs);
    message(msg);
  };

  //#endregion

  const pages = {
    feed: {
      isVisible: () => window.location.pathname === '/',
      onLoadActions: () => {
        document.querySelectorAll(S_IG_POST_CONTAINER_WITHOUT_BUTTON).forEach(node => generatePostButton(node));
      },
    },
    story: {
      isVisible: () => window.location.pathname.startsWith('/stories/'),
      onLoadActions: () => {
        const node = document.querySelector(IG_S_STORY_CONTAINER);
        if (!node) return;
        generateStoryButton(node);
        setupStoryEventListeners();
      },
    },
    profile: {
      isVisible: () => window.location.pathname.length > 1 && document.querySelector(IG_S_PROFILE_CONTAINER),
      onLoadActions: () => {
        const node = document.querySelector(IG_S_PROFILE_CONTAINER);
        if (!node) return;
        generateProfilePictureButton(node);
        setupProfileEventListeners();
      },
    },
    post: {
      isVisible: () => window.location.pathname.startsWith('/p/'),
      onLoadActions: () => {
        const node = document.querySelector(IG_S_SINGLE_POST_CONTAINER);
        if (!node) return;
        generatePostButton(node);
        setupSinglePostEventListeners();
      },
    },
  };

  const actionTriggers = {
    [TRIGGER.ARRIVE]: {
      /* triggered whenever a new instagram post is loaded on the feed */
      [S_IG_POST_CONTAINER_WITHOUT_BUTTON]: node => generatePostButton(node),
      /* triggered whenever a single post is opened (on a profile) */
      [IG_S_SINGLE_POST_CONTAINER]: node => {
        generatePostButton(node);
        setupSinglePostEventListeners();
      },
      /* triggered whenever a story is opened */
      [IG_S_STORY_CONTAINER]: node => {
        generateStoryButton(node);
        setupStoryEventListeners();
      },
      /* triggered whenever a profile page is loaded */
      [IG_S_PROFILE_CONTAINER]: node => {
        generateProfilePictureButton(node);
        setupProfileEventListeners();
      },
      /* triggered whener the top bar is created */
      [IG_S_TOP_BAR]: generateSettingsPageMenu,
    },
    [TRIGGER.LEAVE]: {
      /* triggered whenever a single post is closed (on a profile) */
      [IG_S_SINGLE_POST_CONTAINER]: removeSinglePostEventListeners,
      /* triggered whenever a story is closed */
      [IG_S_STORY_CONTAINER]: removeStoryEventListeners,
      /* triggered whenever a profile page is left */
      [IG_S_PROFILE_CONTAINER]: removeProfileEventListeners,
    },
  };

  const profilePictureSources = {
    'user info API': () => getProfilePictureFromUserInfoApi(),
  };

  //#region Script setup and on load actions

  registerMenuCommands(); /* register GM menu commands */
  injectStyles(); /* injects the needed CSS into DOM */
  setupTriggers(); /* setup arrive and leave triggers for elements */
  performOnLoadActions(); /* first load actions */
  window.onload = performOnLoadActions; /* first load actions (backup) */

  //#endregion

  /**
   * Setup the arrive and leave triggers for relevant elements
   */
  function setupTriggers() {
    let count = 0;
    for (const [event, triggers] of Object.entries(actionTriggers)) {
      for (const [actuator, fireTrigger] of Object.entries(triggers)) {
        document[event](actuator, node => {
          if (!node) return;
          fireTrigger(node);
          log(`Triggered ${event} for selector ${actuator}`);
        });
        count++;
      }
    }
    log(`Created ${count} element triggers`);
  }

  /**
   * Performs actions that need to be performed on page load.
   */
  function performOnLoadActions() {
    for (const [name, page] of Object.entries(pages)) {
      if (page.isVisible()) {
        page.onLoadActions();
        log(`Performed onload actions for ${name} page`);
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
      const savedOsb = await callGMFunction(GMFunc.getValue, STORAGE_KEY_BUTTON_BEHAVIOR, DEFAULT_BUTTON_BEHAVIOR);
      if (!savedOsb || !BUTTON_BEHAVIOR_OPTIONS.includes(savedOsb)) {
        error('No valid saved button behavior option found');
      } else {
        openSourceBehavior = savedOsb;
        log('[Loaded preference] Open button behavior:', savedOsb);
      }
    }
    if (!sessionId) {
      const savedSID = await callGMFunction(GMFunc.getValue, STORAGE_KEY_SESSION_ID, null);
      if (!savedSID) {
        error('No saved session id found');
      } else {
        sessionId = savedSID;
        log(`[Loaded preference] Session id: ${getHalfString(savedSID)}...`);
      }
    }
  }

  //#endregion

  //#region Settings menu

  /**
   * Creates the commands to appear on the menu created by the <Any>monkey extension that's being used
   * For example, on Tampermonkey, this menu is accessible by clicking on the extension icon
   */
  function registerMenuCommands() {
    callGMFunction(GMFunc.registerMenuCommand, 'Change post & story shortcut', handleMenuPostStoryKBCommand, null);
    callGMFunction(GMFunc.registerMenuCommand, 'Change profile picture shortcut', handleMenuProfilePicKBCommand, null);
    log('Registered menu commands');
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
      error('Invalid option for source button behavior');
      return;
    }
    const result = await callGMFunction(GMFunc.setValue, STORAGE_KEY_BUTTON_BEHAVIOR, option);
    if (result === null) error('Failed to save button behavior option on storage');
    openSourceBehavior = option;
    log('Changed open source button behavior to', option);
  }

  /**
   * Handle a new sessionid entered on the developer options section of the settings menu
   * @param {string} value sessionid
   */
  async function handleSessionIdChange(value) {
    const newSessionId = value?.trim();
    if (value === null || typeof myVar !== 'undefined' || newSessionId === sessionId) return; // empty values are accepted
    if (newSessionId.length === 0 && sessionId) {
      await callGMFunction(GMFunc.deleteValue, STORAGE_KEY_SESSION_ID);
      sessionId = '';
      log('Deleted saved session id');
      return;
    }
    const result = await callGMFunction(GMFunc.setValue, STORAGE_KEY_SESSION_ID, newSessionId);
    if (result === null) error('Failed to save session id on storage');
    sessionId = newSessionId;
    log(`Saved current session id ${getHalfString(newSessionId)}...`);
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
    let currentKey = await callGMFunction(GMFunc.getValue, keyBindingStorageKey, defaultKeyBinding);
    if (currentKey == null) {
      currentKey = defaultKeyBinding;
      log(`Falling back to default key binding: Alt + ${defaultKeyBinding}`);
    }

    const newKeyBinding = prompt(
      `${SCRIPT_NAME}:\n\nKey binding to open a ${keyBindingName}:\n` +
        'Choose a letter to be combined with the Alt/⌥ key\n\n' +
        `Current key binding: Alt/⌥ + ${currentKey.toUpperCase()}`
    );
    if (newKeyBinding == null) return null;
    if (!isKeyBindingValid(newKeyBinding)) {
      errorMessage(`Couldn't save new key binding to open ${keyBindingName}, invalid option`);
      return null;
    }

    const successMessage = `Saved new shortcut to open ${keyBindingName}:\nAlt + ${newKeyBinding.toUpperCase()}`;
    const result = await callGMFunction(GMFunc.setValue, keyBindingStorageKey, newKeyBinding);
    if (result === null) return null;
    message(successMessage);
    return newKeyBinding;
  }

  /**
   * Changes the visibility of the page settings menu
   * @param {boolean} visible
   */
  function setSettingsMenuVisible(visible) {
    if (visible) {
      document.querySelector(`.${C_SETTINGS_CONTAINER}`).style.display = 'flex';
      /* load values on the menu */
      const buttonBehaviorSelect = document.querySelector(`#${ID_SETTINGS_BUTTON_BEHAVIOR_SELECT}`);
      if (buttonBehaviorSelect) buttonBehaviorSelect.value = openSourceBehavior;
      const sessionIdInput = document.querySelector(`#${ID_SETTINGS_SESSION_ID_INPUT}`);
      if (sessionIdInput) sessionIdInput.value = sessionId;
    } else {
      document.querySelector(`.${C_SETTINGS_CONTAINER}`).style.display = 'none';
    }
  }

  //#endregion

  //#region Element creation

  /**
   * Creates a visual settings menu on the page, as an alternative to the commands menu method,
   * since it isn't supported by all extensions
   */
  function generateSettingsPageMenu() {
    if (!document.querySelector(`.${C_SETTINGS_BTN}`)) {
      /* Create the settings button */
      const button = document.createElement('button');
      button.classList.add(C_SETTINGS_BTN);
      button.setAttribute('type', 'button');
      button.setAttribute('title', `Open ${SCRIPT_NAME_SHORT} settings`);
      button.addEventListener('click', () => setSettingsMenuVisible(true));
      document.querySelector(IG_S_TOP_BAR)?.appendChild(button);
      log('Created script settings button');
    }

    if (!document.querySelector(`.${C_SETTINGS_CONTAINER}`)) {
      /* Create the settings menu */
      const menu = document.createElement('div');
      menu.innerHTML = `<div class="${C_SETTINGS_CONTAINER}"><div class="${C_SETTINGS_MENU}"><div class="${C_SETTINGS_MENU_TITLE_CONTAINER}"><div class="${C_SETTINGS_MENU_TITLE}">${SCRIPT_NAME_SHORT} Settings<a class="${C_SETTINGS_MENU_TITLE_LINK}" href="${HOMEPAGE_URL}" target="_blank" title="What's this?">(?)</a></div><button class="${C_SETTINGS_MENU_TITLE_CLOSE_BTN}" title="Close"><div class="coreSpriteClose"></div></button></div><div class="${C_SETTINGS_MENU_OPTIONS}"><button id="${ID_SETTINGS_POST_STORY_KB_BTN}" class="${C_SETTINGS_MENU_OPTION_BTN}">Change post/story shortcut</button><button id="${ID_SETTINGS_PROFILE_PICTURE_KB_BTN}" class="${C_SETTINGS_MENU_OPTION_BTN}">Change profile picture shortcut</button><div class="${C_SETTINGS_MENU_OPTION}"><label for="${ID_SETTINGS_BUTTON_BEHAVIOR_SELECT}">Open source click behavior:</label><select id="${ID_SETTINGS_BUTTON_BEHAVIOR_SELECT}"><option value="${BUTTON_BEHAVIOR_REDIR}">Redirect</option><option value="${BUTTON_BEHAVIOR_NEW_TAB_FOCUS}">New tab and focus</option><option value="${BUTTON_BEHAVIOR_NEW_TAB_BG}">New tab in the background</option></select></div><div id="${ID_SETTINGS_DEVELOPER_OPTIONS_BTN}" class="${C_SETTINGS_MENU_OPTION_BTN} ${C_SETTINGS_SECTION_COLLAPSED}">Developer options <span class="${C_SETTINGS_SELECT_ARROW}"></div><div id="${ID_SETTINGS_DEVELOPER_OPTIONS_CONTAINER}" class="${C_SETTINGS_MENU_OPTION} ${C_SETTINGS_SECTION_COLLAPSED}"><label for="${ID_SETTINGS_SESSION_ID_INPUT}">Session ID<a class="${C_SETTINGS_MENU_TITLE_LINK}" href="${SESSION_ID_INFO_URL}" target="_blank" title="What's this?">(?)</a></label><input id="${ID_SETTINGS_SESSION_ID_INPUT}" type="text" placeholder="Your current session id"></div></div></div></div>`;

      menu.querySelector(`.${C_SETTINGS_MENU}`)?.addEventListener('click', event => event.stopPropagation());
      /* close settings menu on background click */
      menu.querySelector(`.${C_SETTINGS_CONTAINER}`)?.addEventListener('click', () => setSettingsMenuVisible(false));
      /* close settings menu on close button click */
      menu
        .querySelector(`.${C_SETTINGS_MENU_TITLE_CLOSE_BTN}`)
        ?.addEventListener('click', () => setSettingsMenuVisible(false));
      menu.querySelector(`#${ID_SETTINGS_POST_STORY_KB_BTN}`)?.addEventListener('click', handleMenuPostStoryKBCommand);
      /* save profile picture key binding */
      menu
        .querySelector(`#${ID_SETTINGS_PROFILE_PICTURE_KB_BTN}`)
        ?.addEventListener('click', handleMenuProfilePicKBCommand);
      /* save button behavior on option select */
      menu
        .querySelector(`#${ID_SETTINGS_BUTTON_BEHAVIOR_SELECT}`)
        ?.addEventListener('change', e => handleMenuButtonBehaviorChange(e.target.value));
      /* show developer option on click */
      menu.querySelector(`#${ID_SETTINGS_DEVELOPER_OPTIONS_BTN}`).addEventListener('click', () => {
        menu.querySelector(`#${ID_SETTINGS_DEVELOPER_OPTIONS_BTN}`)?.classList.toggle(C_SETTINGS_SECTION_COLLAPSED);
        menu
          .querySelector(`#${ID_SETTINGS_DEVELOPER_OPTIONS_CONTAINER}`)
          ?.classList.toggle(C_SETTINGS_SECTION_COLLAPSED);
      });
      /* save session id */
      menu
        .querySelector(`#${ID_SETTINGS_SESSION_ID_INPUT}`)
        ?.addEventListener('blur', e => handleSessionIdChange(e.target.value));

      document.body.appendChild(menu);
      log('Created script settings menu');
    }
  }

  /**
   * Appends new elements to DOM containing the story source opening button
   * @param {HTMLElement} node DOM element node
   */
  function generateStoryButton(node) {
    /* exits if the story button already exists */
    if (!node || elementExistsInNode(`.${C_BTN_STORY_CONTAINER}`, node)) return;

    try {
      const buttonStoryContainer = document.createElement('div');
      const buttonStory = document.createElement('button');

      buttonStoryContainer.classList.add(C_BTN_STORY_CONTAINER);
      buttonStory.classList.add(C_BTN_STORY);
      buttonStoryContainer.setAttribute('title', 'Open source');
      buttonStory.addEventListener('click', () => openStoryContent(node));

      buttonStoryContainer.appendChild(buttonStory);
      node.appendChild(buttonStoryContainer);
    } catch (err) {
      error('Failed to generate story button', err);
    }
  }

  /**
   * Appends new elements to DOM containing the post source opening button
   * @param {HTMLElement} node DOM element node
   */
  function generatePostButton(node) {
    /* exits if the post button already exists */
    if (!node || elementExistsInNode(`.${C_BTN_POST_OUTER_SPAN}`, node)) return;

    try {
      /* removes the div that's blocking the img element on a post */
      const blocker = node.querySelector(IG_S_POST_BLOCKER);
      if (blocker) blocker.parentNode.removeChild(blocker);

      const buttonsContainer = node.querySelector(IG_S_POST_BUTTONS);
      if (!buttonsContainer) {
        error(`Failed to generate post button, couldn't find by selector ${IG_S_POST_BUTTONS}`);
        return;
      }
      const newElementOuterSpan = document.createElement('span');
      const newElementButton = document.createElement('button');
      const newElementInnerSpan = document.createElement('span');

      newElementOuterSpan.classList.add(C_BTN_POST_OUTER_SPAN);
      newElementButton.classList.add(C_BTN_POST);
      newElementInnerSpan.classList.add(C_BTN_POST_INNER_SPAN);
      newElementOuterSpan.setAttribute('title', 'Open source');
      newElementButton.addEventListener('click', () => openPostSourceFromSrcAttribute(node));

      newElementButton.appendChild(newElementInnerSpan);
      newElementOuterSpan.appendChild(newElementButton);
      buttonsContainer.appendChild(newElementOuterSpan);
      node.classList.add(C_POST_WITH_BUTTON);

      const timeElement = node.querySelector(`${IG_S_POST_TIME_ANCHOR} time`);
      if (timeElement) {
        const fullDateTime = timeElement.getAttribute('datetime');
        const localeDateTime = fullDateTime && new Date(fullDateTime)?.toLocaleString();
        if (localeDateTime) timeElement.innerHTML += ` (${localeDateTime})`;
      }
    } catch (err) {
      error('Failed to generate post button', err);
    }
  }

  /**
   * Appends new elements to DOM containing the profile picture source opening button
   * @param {HTMLElement} node DOM element node
   */
  function generateProfilePictureButton(node) {
    /* exits if the profile picture button already exists */
    if (!node || elementExistsInNode(`.${C_BTN_PROFILE_PIC_CONTAINER}`, node)) return;

    try {
      let profilePictureContainer = node.querySelector(IG_S_PROFILE_PIC_CONTAINER);
      /* if the profile is private and the user isn't following or isn't logged in */
      if (!profilePictureContainer) {
        profilePictureContainer = node.querySelector(IG_S_PRIVATE_PROFILE_PIC_CONTAINER);
      }
      if (!profilePictureContainer) {
        error(`Failed to generate profile picture button, couldn't find by selector ${IG_S_PROFILE_PIC_CONTAINER}`);
        return;
      }
      const newElementOuterSpan = document.createElement('span');
      const newElementButton = document.createElement('button');
      const newElementInnerSpan = document.createElement('span');
      newElementOuterSpan.setAttribute('title', 'Open full size picture');
      newElementButton.addEventListener('click', e => {
        e.stopPropagation();
        openProfilePicture();
      });

      newElementOuterSpan.classList.add(C_BTN_PROFILE_PIC_CONTAINER);
      newElementButton.classList.add(C_BTN_PROFILE_PIC);
      newElementInnerSpan.classList.add(C_BTN_PROFILE_PIC_SPAN);

      newElementButton.appendChild(newElementInnerSpan);
      newElementOuterSpan.appendChild(newElementButton);
      profilePictureContainer.appendChild(newElementOuterSpan);
    } catch (err) {
      error(err);
    }
  }

  //#endregion

  //#region Content parsing logic and opening

  /**
   * Finds the story source url from the src attribute on the node and opens it in a new tab
   * @param {HTMLElement} node DOM element node
   */
  function openStoryContent(node = null) {
    try {
      const container = (node || document).querySelector(IG_S_STORY_MEDIA_CONTAINER);
      const video = container.querySelector('video');
      const image = container.querySelector('img');
      if (video) {
        const source = getStoryVideoSrc(video);
        if (!source) throw 'Video source not available';
        openUrl(source);
        return;
      }
      if (image) {
        const source = getStoryImageSrc(image);
        if (!source) throw 'Video source not available';
        openUrl(source);
        return;
      }
      throw 'Story media source not available';
    } catch (exception) {
      errorMessage('Failed to open story source', exception);
    }
  }

  /**
   * Gets the source url of a post from the src attribute on the node and opens it in a new tab
   * @param {HTMLElement} node DOM element node containing the post
   */
  async function openPostSourceFromSrcAttribute(node = document.querySelector(IG_S_SINGLE_POST_CONTAINER)) {
    /* if is on single post page and the node is null, the picture container can be found, since there's only one */
    if (node == null) return;

    try {
      const postRelativeUrl = node.querySelector(IG_S_POST_TIME_ANCHOR)?.getAttribute('href');
      const sourceListItems = node.querySelectorAll(IG_S_MULTI_POST_LIST_ITEMS);
      if (sourceListItems.length == 0 /* is single post */) {
        await openPostMediaSource(node, postRelativeUrl);
        return;
      }

      const postIndex = getMultiPostIndex(node);
      if (sourceListItems.length == 2 /* is on the first or last item */) {
        if (node.querySelector(IG_S_MULTI_POST_NEXT_ARROW_BTN) /* next arrow exist */) {
          await openPostMediaSource(sourceListItems[0], postRelativeUrl, postIndex); /* opens first item */
        } else if (node.querySelector(IG_S_MULTI_POST_PREV_ARROW_BTN) /* previous arrow exists */) {
          await openPostMediaSource(sourceListItems[1], postRelativeUrl, postIndex); /* opens last item */
        } /* something is not right */ else {
          errorMessage('Failed to open post source', 'Failed to open first or last post carousel item');
        }
      } else if (sourceListItems.length == 3 /* is on any other item */) {
        await openPostMediaSource(sourceListItems[1], postRelativeUrl, postIndex);
      } /* something is not right */ else {
        errorMessage('Failed to open post source', 'Failed to open post carousel item other than first and last');
      }
    } catch (exception) {
      errorMessage('Failed to open post source', exception);
    } finally {
      document.body.style.cursor = 'default';
    }
  }

  /**
   * Gets the source url of a post from the src attribute on the node and opens it in a new tab
   * @param {HTMLElement} node DOM element node containing the post
   * @param {string} postRelativeUrl url of the post
   * @param {number} postIndex current index of the post carousel
   */
  async function openPostMediaSource(node, postRelativeUrl, postIndex) {
    let image = node.querySelector(IG_S_POST_IMG);
    let video = node.querySelector(IG_S_POST_VIDEO);
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
      if (!postRelativeUrl) throw 'No post relative url found';

      /* try to get the video url using the IG api */
      document.body.style.cursor = 'wait';
      const response = await httpGETRequest(API.IG_POST_INFO_API(postRelativeUrl));
      let postData = response?.graphql?.shortcode_media;
      if (postIndex != undefined) postData = postData?.edge_sidecar_to_children?.edges?.[postIndex]?.node; // multi
      if (!postData) throw 'No post data found';
      if (!postData.is_video) throw 'Post is not a video';
      if (!postData.video_url) throw 'No video url found';

      openUrl(postData.video_url);
      return;
    }
    throw 'Failed to open source, no media found';
  }

  /**
   * Tries to get the source URL of the user's profile picture using multiple methods
   * Opens the image or shows an alert if it doesn't find any URL
   */
  async function openProfilePicture() {
    try {
      const username = getProfileUsername();
      if (!username) throw "Couldn't find username";

      document.body.style.cursor = 'wait';
      let pictureUrl = null;
      for (const [sourceName, getProfilePicture] of Object.entries(profilePictureSources)) {
        log(`Trying to get user's profile picture from ${sourceName}`);
        const url = await getProfilePicture(username);
        if (!url) {
          error(`Couldn't get profile picture url from ${sourceName}`);
          continue;
        }
        pictureUrl = url;
        break;
      }
      if (!pictureUrl) throw 'No profile picture found on any of the external sources';

      log('Profile picture found, opening in a new tab...');
      openUrl(pictureUrl);
    } catch (err) {
      errorMessage("Couldn't get user's profile picture", err);
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
      const videoElement = video.querySelector('source');
      return videoElement ? videoElement.getAttribute('src') : null;
    } catch (err) {
      error('Failed to get story video source', err);
      return null;
    }
  }

  /**
   * Get the source url of a story image
   * @param {HTMLElement} image DOM element node containing the image
   */
  function getStoryImageSrc(image) {
    const defaultSrc = image.getAttribute('src');
    try {
      const srcs = image.getAttribute('srcset').split(',');
      const images = srcs.map(src => {
        const [url, size] = src.split(' ');
        return { url, size: parseInt(size.replace(/[^0-9.,]/g, '')) };
      });
      return images ? images.reduce((pi, ci) => (pi.size > ci.size ? pi : ci)).url : defaultSrc;
    } catch (err) {
      error('Failed to get story image source', err);
      return defaultSrc || null;
    }
  }

  //#endregion

  //#region Content sources

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
    const lowResPicture = user?.profile_pic_url_hd || user?.profile_pic_url;
    let highResPicture =
      Boolean(user?.id && sessionId) &&
      isLoggedIn() &&
      (await httpGETRequest(API.IG_USER_INFO_API(user.id), {
        'User-Agent': USER_AGENT,
        Cookie: `sessionid=${sessionId}`,
      }));
    highResPicture = (highResPicture?.user || highResPicture?.graphql?.user)?.hd_profile_pic_url_info?.url;

    if (!highResPicture) {
      if (!lowResPicture) {
        error("Unable to get user's profile picture");
        return null;
      }
      error("Unable to get user's high-res profile picture, fallback to low-res...");
      if (sessionId) {
        warn("Make sure you are logged in and using a session id that hasn't expired or been revoked (logged out)");
      }
      return lowResPicture;
    }
    return highResPicture;
  }

  /**
   * Return the data from a certain user using IG's __a=1 API
   * @returns {Promise<any|null>} Object containing the user data or undefined
   */
  async function getUserDataFromIG(username) {
    const data = (await httpGETRequest(API.IG__A1(username)))?.graphql?.user;
    return data;
  }

  //#endregion

  //#region Key bindings and other event listeners

  /**
   * Loads the key bind to open a single post or a story from storage into a global scope variable, in order
   * to be used on the key binding handler method
   */
  async function loadPostStoryKeyBindings() {
    const kbName = 'single post and story';
    try {
      const kb = await loadKeyBindingFromStorage(STORAGE_KEY_POST_STORY_KB, DEFAULT_KB_POST_STORY, kbName);
      if (kb) openPostStoryKeyBinding = kb;
    } catch (err) {
      error(`Failed to load "${kbName}" key binding, considering default (Alt + ${DEFAULT_KB_POST_STORY})`, err);
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
    } catch (err) {
      error(`Failed to load "${kbName}" key binding, considering default (Alt + ${DEFAULT_KB_PROFILE_PICTURE})`, err);
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
    let kb = await callGMFunction(GMFunc.getValue, storageKey, defaultKeyBinding);
    if (kb === null) {
      kb = defaultKeyBinding;
      log(`Falling back to default key binding: Alt + ${defaultKeyBinding}`);
    }

    try {
      if (isKeyBindingValid(kb)) {
        const newKey = kb.toUpperCase();
        log(`Discovered ${keyBindingName} key binding: Alt + ${newKey}`);
        return newKey;
      } else {
        error(
          `Couldn't load "${keyBindingName}" key binding, "${kb}" key is invalid, using default (Alt + ${defaultKeyBinding})`
        );
        return defaultKeyBinding;
      }
    } catch (err) {
      if (kb != defaultKeyBinding) {
        error(
          `Failed to load "${keyBindingName}" key binding, falling back to default: Alt + ${defaultKeyBinding}`,
          err
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

  /**
   * Adds event listener(s) to the current document meant to handle key presses on a profile page
   */
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
   * @param {() => void} loadingFn Async function used to load the key binding
   * @param {() => void} keyPressHandler Handler function for the event (key binding press)
   * @param {() => void} callback Function to call after adding the event listener
   * @param {string} logMessage Message logged after adding the event listener
   */
  function setupKBEventListener(condition, loadingFn, keyPressHandler, callback, logMessage) {
    if (condition) return;
    loadingFn().then(() => {
      document.addEventListener('keydown', keyPressHandler);
      callback();
      log(logMessage);
    });
  }

  /**
   * Removes the previously added event listener(s) meant to handle key presses on a single post page
   */
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

  /**
   * Removes the previously added event listener(s) meant to handle key presses on a story page
   */
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

  /**
   * Removes the previously added event listener(s) meant to handle key presses on a profile page
   */
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
    log(logMessage);
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
      openPostSourceFromSrcAttribute
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
      log(logMessageString);
      keyPressAction();
    }
  }

  //#endregion

  //#region Networking

  /**
   * Performs an HTTP GET request using the GM_xmlhttpRequest or GM.xmlHttpRequest function
   * @param {string} url Target url to perform the request
   * @param {boolean} [parseToJSON = true] Default true
   * @returns {Promise<string|any>} Response text or an exception error object
   */
  function httpGETRequest(url, headers = {}, parseToJSON = true) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url,
        headers,
        timeout: 10000,
        onload: res => {
          if (res.status && res?.status !== 200) {
            reject('Status Code', res?.status, res?.statusText || '');
            return;
          }
          let data = res.responseText;
          if (parseToJSON) {
            data = JSON.parse(res.responseText);
          }
          resolve(data);
        },
        onerror: error => {
          error(`Failed to perform GET request to ${url}`, error);
          reject(error);
        },
        ontimeout: () => {
          error('GET Request Timeout');
          reject('GET Request Timeout');
        },
        onabort: () => {
          error('GET Request Aborted');
          reject('GET Request Aborted');
        },
      };

      const fnResponse = callGMFunction(GMFunc.xmlHttpRequest, options);
      if (fnResponse === null) {
        error(`Failed to perform GET request to ${url}`);
        reject();
      }
    });
  }

  //#endregion

  //#region Utils & others

  /**
   * Opens a URL depending on the behavior defined in the settings
   * @param {string} url URL to open
   */
  function openUrl(url) {
    if (openSourceBehavior === BUTTON_BEHAVIOR_NEW_TAB_BG) {
      callGMFunction(GMFunc.openInTab, url, true);
    } else if (openSourceBehavior === BUTTON_BEHAVIOR_REDIR) {
      window.location.replace(url);
    } else {
      window.open(url, '_blank');
    }
  }

  /**
   * Calls a GreaseMonkey function using the multiple formats for compatibility
   * @param {string[]} gmFunctionVariants GM functions to call (multiple variants)
   * @param {any[]} args Array of arguments passed to the GM function
   * @returns {Promise<any>} Returns the GM function result, undefined if the function doesn't succeeds but doesn't
   * return anything and null if the function(s) fail to execute
   */
  async function callGMFunction(gmFunctionVariants, ...args) {
    for (const fnName of gmFunctionVariants) {
      try {
        const fn = eval(fnName);
        if (typeof fn !== 'function') throw 'No function found';
        const res = await fn(...args);
        return res;
      } catch (error) {
        warn(`Failed to call ${fnName} function...`);
      }
    }
    error(`Failed to call all GM function variants (${gmFunctionVariants.join(', ')})`);
    return null;
  }

  /**
   * Finds the current position on a post carousel
   * @param {HTMLElement} node DOM element node containing the post
   * @return {number} current index
   */
  function getMultiPostIndex(node) {
    const indicators = node.querySelectorAll(IG_S_MULTI_POST_INDICATOR);
    for (let i = 0; i < indicators.length; i++) {
      if (indicators[i].classList.contains(IG_C_MULTI_POST_INDICATOR_ACTIVE)) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Check if the key is valid to used as a key binding
   * @param {string} key Key binding key
   * @returns {boolean}
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
    return node && node.querySelector(selector) != null;
  }

  /**
   * Returns half of a provided string
   * @param {string} str
   * @return {string} half of str
   */
  function getHalfString(str) {
    return str?.slice(0, Math.ceil(str.length / 2));
  }

  /**
   * Checks if the user is logged in
   * @return {boolean} whether the user is logged in or not
   */
  function isLoggedIn() {
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
    const pageUsername = document.querySelector(IG_S_PROFILE_USERNAME_TITLE)?.innerText;
    const isNotUsername = !PATTERN.IG_VALID_USERNAME.test(pageUsername);
    if (isNotUsername) {
      const urlPathParts = window.location.pathname.match(PATTERN.URL_PATH_PARTS);
      return urlPathParts.length >= 2 ? urlPathParts[1] : null;
    }
    return pageUsername;
  }

  /**
   * Appends the necessary style elements to DOM
   */
  function injectStyles() {
    const opacityTransition =
      'transition:opacity .2s ease-in-out;-webkit-transition:opacity .2s ease-in-out;-moz-transition:opacity .2s ease-in-out;-ms-transition:opacity .2s ease-in-out;-o-transition:opacity .2s ease-in-out;';

    const styles = `
      :root{
        --iso-settings-post-btn-icon:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB9wAAAfcBHrop/AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAViSURBVHic7ZtfaB1FFMZ/s7ShDUn6T0mTYlGslZaioEYrpIixVQs1FfWlRVCfpOJLVfAPQl8UtYIgttIXFcE+iFZqqVbpQ60oNaYq+FJQtEFJ1bRJq4nGNE3Gh9kLcw+7m9nduXOT1A+GsJM7Z77z7cyZ2bOzSmuNTyilWoA7gTVAe1yWxX+bgd+BfuBUXPqBz4Be7ZuMC18ffSql2oFuYDPQBTQUMHMKOADsB45orc+XJuYCrXXhAnQAh4FJQHssfwLPAwvK8HPyoaDjK4H3cjg0CZwGTgL/5Gh3BtgONEwLAYAFwB5gPIP0WeAdYCuwFlguHQAWAquA24AngWNTjKKTwH11FQBYAZxIITgM7AbWA3MLjqo24GHgaIYQLwNRcAEwgW0ogdA48DrQ6pUU3A58lyLCxz5jgwuZR1KG/D5gZS2GZdyviqdRX0LfJ4Crai5A7HzSXd9WK8cTOCzCrDSSxymgvWYCxMNe3vlBoCuU8xaXOcCuBBG+BuZ5FyAOeHLO/wCsCO284LUtYbXY61UAzFIno/1gvZ23+D2bMBKe8inAnoQ5H3zYTyHCu4LjBLCmtACYHZ6c98ECXg4BGoFvBc+DPgSQ29t99XY2Q4QrgTHB95bCAmAebGxj56fLvM8Q4RXBuaeMAHKtfbXeDjoIsBjz7GHzvje3AJhkhb28nAMuqbeDjiI8IQT4ME/7CINuzNazgje01meYGdgN/G1db1BKNbo2rgiwWdQfKMsqFLTWo5jpW8F84A7X9lGcw+uy6oaAL/zQCwZ5w+52bRhhEph2Du8jrfWED1YBcRATwyrYpJSK0n5sI8Jkb20c8sUqFLTWp4HjVtViYKlL2wizAtj4yROv0JC8l7k0ShKg3wud8JC8pV+JiKhWagLz4mImorAA9g//mIEBsILCAjRb18Pe6ISH5N6c+CuBiOoh3+aNTnhI7gMujSKqh06LUqrJG6WwkFHfKZZFmOxqlqGZgv8FENfOAsjo2eGFTkAopRRwvVU1iXmfOCUizOEEG91+aAXFDVQve8e11mddGkZAL9XTYK1S6lKP5EJA3rRPXRtG2qRV7MfJCNjkg1VASAE+cW1YeWTcL+q3lKITEEqp1cA1VtU5oMe1fUWAI8BfVv0GpdSt5ekFwQvi+u1c23krufgc1cnFXuJDVNO1AOsE53/J+cbYNtaC2T7aBrfU28kpBPhK8N2V24Yw+Kgw2AcsqrejKc4/JLiOAZeVFWAu8KMwfBiYU2+HBc8OYFTw3FnIVoLxu4ThQkOrhs63YXavNr9vKHiULq0TGRCnxVtiYB5mibN5DVPivFBaRwqzN7A7mgSeqaPzSxOCngYeKGU3o8Mm4PuEDvdS8lxOAeevA35N4DIOdNZEgLjjK4BfEjruAZYHcn4r5t2f5GBPgcIiuBBoBb5M6HgUeAlYWCPHbwY+T3FanmIpLIIrmQbgzRQyg8DjwHxPjq8GPkjpawR4EOiMnS4tQl5y24ELGeTeB+4n5+YJuBbYQfrxWB3/72qrjRcRcn8woZRaBbxIduLkAuYE+M+YXMNv8d8RzJRqx6zn7ZhkxuUZtsYxhySf1lqPCS6dmHeZdiJ3BNiotXZ7w11iqK4jeVnyVUaB15hie0vJkeBjzt6D2TPk+RAiqwwAO8lxAr2MCKUFsEg0Yk6avIX5OsTV4Yl4JO0AbqTg9wBFRfDy0ZREfDihFbN7a7NKcyzOgFX6tNZDnvrNHRNqIkA9kVcEp2MkMwmxkxsxTlfQBByKxanCrBMA8okwKwUAdxFmrQDgJsKsC4JJyAiM6y8KASBVhKOzegrYSJkOSy6aEVCBUuomTB5jCfDYf7qkKwGO/Em3AAAAAElFTkSuQmCC');
        --iso-settings-story-btn-icon:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAeFBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////GqOSsAAAAJ3RSTlMAAgMLDRQVFkVOUGFiaIKap6ipqquszM/Q0dbY5ufv8PP0+fr8/f7DeTSmAAAAAWJLR0QnLQ+oIwAAALpJREFUOMvNk90SgiAUBj8tzdK0JCv7tdJ4/zfsqIgI6Ex37o3M7MoZRgRmgp+9eEuZAKtrvxZkXPIAgm5dyoDeP7GG3RpwY1rc6kIGnJ+d4dCo0gJm+Oo+EZD/btl40HiMB60fD+r5ET1jfrEGnYcb+LZA7K/RB3bfB3J/YvNMjED12CvfQgSh6i3HXH5Ubwnc4zvEVABngelgyJ+BfmFoXq4EdOVypkG+kMGBW0ll4LHC1EXqzeW3/AFfeiRd23tgxAAAAABJRU5ErkJggg==');
        --iso-settings-btn-icon:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAD+UlEQVR4nO3aS4xkYxQH8F8rNDozpmcyk8hoYSEEM0IiYUkvJJN4TLcMCwsRZsXOxpL9JMaClcdGLDw34zUJKxlsxDOTiKaHYEEahWFUd1l8Lemp+m7Vvd/9bnWR+idnUzfnf87536/O97pMMMEEE+TFHhzGp/gN3UQ7hS/xOC4aaQWJmMYTWJVedJG1cfvoSqmOabwtf+EbrYO7RlVQVTyp2eL/tb+NoQh79A/7E1jElgS+WNFjLcJj+ovfXoOvV4A7jbkInzk9ucWafL0CMOYi/Or0xFKG/UbEBGCMRShKuAm+O/SL0MHdGeImY5QCMIYijFoAxkyEzRCAMRJhswRgTETYTAEonh1uy5BLKeQWoN3Dd2EJn5gIbcxlyGcocgvwfg/fa9JFOJwhn6E4goexD5dn4HtQv6ip9kWGfEaOaXwojwB/jTj3bNgtnwj/WZyNB3BMf2PMJsBUA4lvNnqLHljjGTUC3YBtCX4tXFsj7qZjDq8KSr+LmQq+U3hm3fdlzczTjfaAq7HSE+A97Crhew6e7/FdwXzmHBsV4AKsRYJ8j/uFInvRwq34POLXxS2Zc2y8CX6EvQXP2ngHXwkHpbtxo+IR0hH6yO8JeRShUhNMwVPyrdQ+zp1cJMZApMwCXyf4FOHHjFxJSBGglTF+rGeMFCkCXJox/lXyCto4WvhGvh7QxU2Zc2x0GlyMBKhrr2fOsTEBzsdSJEAOuydjno0IcB7eiJDnspPYnynX7ALsxQcR4pgtY0G4HtsqFHW8pG9H+Bpktma+WQSYFQp5Sf8526DiY8lvV61xnsSLOFjANwy1BdgnvI2qw3hhAOeBBL6utKPtSgLE1gE7pc3Nbw149mYCH6HxNoqYAHUOSYqQuiFZy5pFBLFif07kGrSvvzmBbxU/JeZSC7PC3v4F/KH8//W4eNPagW9Lcpxaj7sg7bhNhLMWZoWpqWxTPCFcWG5dtwPKzwDHcGXdhCO8WbBfmJ5SOnkZO4JzM+XaiABwb4Q8hy0JoyUXGhOAsHHJLcCg9UMKGhVgPhKgji3LP+02KkALv0SCpNqzuROMxBiIquqvCsfbubCUkSsJKcPvz4zxOxm56F86t4c5pAiwM8GnCJdk5KJ/xbk8zOHMigFmcNmA5z8IFyPfCf3iYuHMr2iau65i/EHYgUM9vx3NyI9wxRVrZp8I2+jYiJrGfYIovX5rwnVbHRStODu4oiZ3H+b1X44+JxQ5DLuE5e5G3xXF12yPKj+bxKyxD6TmhKvtLp5Wbas7I1ypd9c5ir7+eki94o/irAp5JeEaaQcn23B9wbMpPCJ+A13GOsKbb7z4JrAFr6hedFvoQYc08J+fYIIJ/t/4By9tfiJ9bFVlAAAAAElFTkSuQmCC');
        --iso-settings-select-arrow-icon:url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
        --iso-settings-separator-color:rgba(219, 219, 219, 1);
      }
      .${C_BTN_POST_OUTER_SPAN}{margin-left:8px}
      .${C_BTN_POST}{outline:none;-webkit-box-align:center;align-items:center;background:0;border:0;cursor:pointer;display:flex;-webkit-box-flex:0;flex-grow:0;-webkit-box-pack:center;justify-content:center;padding:8px 0 8px 8px}
      .${C_BTN_POST_INNER_SPAN},.${C_BTN_PROFILE_PIC_SPAN}{display:block;background-repeat:no-repeat;height:24px;width:24px;background-image:var(--iso-settings-post-btn-icon);background-size:24px 24px;cursor:pointer;opacity:1;${opacityTransition}}
      .${C_BTN_POST_INNER_SPAN}:hover{opacity:.6}
      .${C_BTN_PROFILE_PIC}{outline:none;background-color:white;border:0;cursor:pointer;min-height:40px;min-width:40px;padding:0;border-radius:50%;transition:background-color .5s ease;-webkit-transition:background-color .5s ease}
      .${C_BTN_PROFILE_PIC}:hover{background-color:#D0D0D0;transition:background-color .5s ease;-webkit-transition:background-color .5s ease}
      .${C_BTN_PROFILE_PIC_SPAN}{margin:auto}
      .${C_BTN_STORY_CONTAINER}{position:fixed;top:32px;right:0;margin:16px;z-index:99}
      .${C_BTN_STORY}{width:24px;height:24px;margin:8px;border:none;cursor:pointer;background-color:transparent;background-image:var(--iso-settings-story-btn-icon);background-size:24px 24px;opacity:1;${opacityTransition}}
      .${C_BTN_STORY}:hover{opacity:0.8}
      .${C_BTN_PROFILE_PIC_CONTAINER}{transition:.5s ease;opacity:0;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);text-align:center}
      ${IG_S_PRIVATE_PIC_IMG_CONTAINER}>img{transition:.5s ease;backface-visibility:hidden}
      ${IG_S_PRIVATE_PROFILE_PIC_IMG_CONTAINER}>img{transition:.5s ease;backface-visibility:hidden}
      ${IG_S_PROFILE_PIC_CONTAINER}:hover .${C_BTN_PROFILE_PIC_CONTAINER}{opacity:1}
      ${IG_S_PRIVATE_PROFILE_PIC_CONTAINER}:hover .${C_BTN_PROFILE_PIC_CONTAINER}{opacity:1}
      .${C_SETTINGS_BTN}{width:22px;height:22px;cursor:pointer;top:16px;border:none;right:16px;position:fixed;background-color:transparent;background-image:var(--iso-settings-btn-icon);background-size:22px 22px;opacity:.8;transition:opacity .2s ease-in-out;-webkit-transition:opacity .2s ease-in-out;-moz-transition:opacity .2s ease-in-out;-ms-transition:opacity .2s ease-in-out;-o-transition:opacity .2s ease-in-out}
      @media only screen and (max-width: 1024px) {.${C_SETTINGS_BTN}{top:64px}}
      .${C_SETTINGS_BTN}:hover{opacity:1}
      .${C_SETTINGS_CONTAINER}{position:fixed;justify-content:center;align-items:center;width:100vw;height:100vh;top:0;left:0;background-color:rgba(0,0,0,.7);display:none}
      .${C_SETTINGS_MENU}{width:320px;display:flex;flex-direction:column;background-color:#fff;border-radius:6px;z-index:5;box-shadow:-1px 2px 14px 3px rgba(0,0,0,.5)}
      .${C_SETTINGS_MENU_TITLE_CONTAINER}{display:flex;flex-direction:row;justify-content:space-between;font-weight:700;border-bottom:1px solid var(--iso-settings-separator-color)}
      .${C_SETTINGS_MENU_TITLE}{display:flex;justify-content:center;flex-direction:row;font-size:16px;padding:16px;text-align:left}
      .${C_SETTINGS_MENU_TITLE_CLOSE_BTN}{width:24px;height:24px;border:0;padding:0;background-color:transparent;margin-top:8px;margin-right:8px;cursor:pointer}
      .${C_SETTINGS_MENU_TITLE_LINK}{margin-left:4px;color:#4287f5!important;text-decoration:none}
      .${C_SETTINGS_MENU_OPTIONS}{display:flex;flex-direction:column}
      .${C_SETTINGS_MENU_OPTION}{display:flex;flex-direction:column;padding:12px 16px;border:none;background-color:transparent;font-size:14px;padding-left:16px;text-align:left}
      .${C_SETTINGS_MENU_OPTION_BTN}{display:flex;flex-direction: row;padding:12px 16px;border:none;background-color:transparent;font-size:14px;padding-left:16px;text-align:left;cursor:pointer;transition:background-color .2s ease}
      .${C_SETTINGS_MENU_OPTION_BTN}:hover{background-color:rgba(214,214,214,.3)}
      .${C_SETTINGS_MENU_OPTION_BTN}:active{background-color:rgba(214,214,214,.4)}
      [for='${ID_SETTINGS_BUTTON_BEHAVIOR_SELECT}'],[for='${ID_SETTINGS_SESSION_ID_INPUT}']{font-size:12px;margin-bottom:6px}
      .${C_SETTINGS_MENU} input,.${C_SETTINGS_MENU} select{height:32px;font-size:14px;border:1px solid gray;border-radius:4px;padding:0 6px;-moz-appearance:none;-webkit-appearance:none;appearance:none}
      #${ID_SETTINGS_BUTTON_BEHAVIOR_SELECT}{background-image:var(--iso-settings-select-arrow-icon);background-repeat:no-repeat;background-position-x:99%;background-position-y:50%}
      #${ID_SETTINGS_DEVELOPER_OPTIONS_CONTAINER}{border-top:1px solid var(--iso-settings-separator-color)}
      #${ID_SETTINGS_DEVELOPER_OPTIONS_BTN}{display:flex;flex-direction: row;justify-content:space-between;align-items:center}
      .${C_SETTINGS_MENU_OPTION}.${C_SETTINGS_SECTION_COLLAPSED}{display:none}
      #${ID_SETTINGS_DEVELOPER_OPTIONS_BTN}.${C_SETTINGS_SECTION_COLLAPSED} .${C_SETTINGS_SELECT_ARROW}{transform:rotate(-90deg)}
      .${C_SETTINGS_SELECT_ARROW}{background-color:transparent;background-image:var(--iso-settings-select-arrow-icon);background-size:24px 24px;width:24px;height:24px}
    `;

    const element = document.createElement('style');
    element.textContent = styles;
    document.head.appendChild(element);
    log('Injected CSS into DOM');
  }

  //#endregion
})();
