// ==UserScript==
// @name             Instagram Source Opener
// @version          1.4.2
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
(async function () {
  'use strict';

  /* eslint-disable no-unused-vars */

  const SCRIPT_NAME = 'Instagram Source Opener',
    SCRIPT_NAME_SHORT = 'ISO',
    HOMEPAGE_URL = 'https://greasyfork.org/en/scripts/372366-instagram-source-opener',
    SESSION_ID_INFO_URL = 'https://greasyfork.org/en/scripts/372366-instagram-source-opener#sessionid',
    USER_AGENT =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 105.0.0.11.118 (iPhone11,8; iOS 12_3_1; en_US; en-US; scale=2.00; 828x1792; 165586599)',
    IG_APP_ID = '936619743392459';

  /* Instagram classes and selectors */
  const IG_S_STORY_CONTAINER = '.yS4wN,.vUg3G,.yUdUG,._a997._ac6a._ac0e',
    IG_S_SINGLE_POST_CONTAINER = '.JyscU,.PdwC2,article[role="presentation"]',
    IG_S_POST_IMAGE_CONTAINER = `${IG_S_SINGLE_POST_CONTAINER} > div:first-child`,
    IG_S_PROFILE_CONTAINER = '.v9tJq,.XjzKX,main._a993',
    IG_S_STORY_MEDIA_CONTAINER = '.qbCDp,._ab8w._ab94._ab97._ab9f._ab9k._ab9p._abcm',
    IG_S_POST_IMG = `.FFVAD,${IG_S_SINGLE_POST_CONTAINER} ._aagv img`,
    IG_S_POST_VIDEO = `.tWeCl,${IG_S_SINGLE_POST_CONTAINER} ._ab1c video`,
    IG_S_POST_BUTTONS = `.eo2As > section,${IG_S_SINGLE_POST_CONTAINER} section`,
    IG_S_PROFILE_PIC_CONTAINER = `.RR-M-,${IG_S_PROFILE_CONTAINER} header > div:first-child > div:first-child`,
    IG_S_PRIVATE_PROFILE_PIC_CONTAINER = '._4LQNo',
    IG_S_PROFILE_USERNAME_TITLE = '.fKFbl,h2',
    IG_S_POST_BLOCKER = '._9AhH0',
    IG_S_TOP_BAR = '.Hz2lF,._lz6s,nav._acbh._acbi',
    IG_S_POST_TIME_ELEMENT = `.c-Yi7,${IG_S_SINGLE_POST_CONTAINER} time._aaqe`,
    IG_S_MULTI_VERTICAL_POST_INDICATOR = '.Yi5aA,._aamk._acvz._acnc._acne > *',
    IG_S_MULTI_HORIZONTAL_POST_INDICATOR = '.Yi5aA,._aamj._acvz._acnc._acng > *',
    IG_S_PROFILE_PRIVATE_MESSAGE = '.rkEop',
    IG_S_PROFILE_HAS_STORIES_INDICATOR = 'header [aria-disabled=false] canvas';

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
    C_MODAL_CLOSE_BTN = 'iso-modal-close-btn',
    /* Script settings */
    C_SETTINGS_BTN = 'iso-settings-btn',
    C_SETTINGS_MODAL = 'iso-settings-modal',
    C_SETTINGS_SECTION_COLLAPSED = 'iso-settings-section-collapsed',
    ID_SETTINGS_POST_STORY_KB_BTN = 'iso-settings-post-story-kb-btn',
    ID_SETTINGS_PROFILE_PICTURE_KB_BTN = 'iso-settings-profile-picture-kb-btn',
    ID_SETTINGS_BUTTON_BEHAVIOR_SELECT = 'iso-settings-button-behavior-select',
    ID_SETTINGS_DEVELOPER_OPTIONS_BTN = 'iso-settings-developer-options-btn',
    ID_SETTINGS_DEVELOPER_OPTIONS_CONTAINER = 'iso-settings-developer-options-container',
    ID_SETTINGS_SESSION_ID_INPUT = 'iso-settings-session-id-input',
    ID_SETTINGS_DEBUGGING_INPUT = 'iso-settings-debugging-checkbox',
    ID_SETTINGS_COPY_DEBUG_LOGS = 'iso-settings-copy-debug-logs',
    S_IG_POST_CONTAINER_WITHOUT_BUTTON = `${IG_S_SINGLE_POST_CONTAINER}:not(.${C_POST_WITH_BUTTON})`,
    /* Anonymous stories modal */
    C_STORIES_MODAL = 'iso-stories-modal',
    C_STORIES_MODAL_LIST = 'iso-stories-modal-list',
    C_STORIES_MODAL_LIST_ITEM = 'iso-stories-modal-list-item';

  /* Storage and cookie keys */
  const STORAGE_KEY_POST_STORY_KB = 'iso_post_story_kb',
    STORAGE_KEY_PROFILE_PICTURE_KB = 'iso_profile_picture_kb',
    STORAGE_KEY_BUTTON_BEHAVIOR = 'iso_button_behavior',
    STORAGE_KEY_SESSION_ID = 'iso_session_id',
    STORAGE_KEY_DEBUGGING_ENABLED = 'iso_debugging_enabled',
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

  const PATTERN = {
    URL_PATH_PARTS: /\/([a-zA-Z0-9._]{0,})/,
    IG_VALID_USERNAME: /^([a-zA-Z0-9._]{0,30})$/,
    COOKIE_VALUE: (key) => new RegExp(`(^| )${key}=([^;]+)`),
    PAGE_SINGLE_MEDIA: /^\/(p|reel|tv)\//,
    PAGE_STORIES: /^\/stories\//,
    /** matches: `/user`, `/user/tagged`, `/user/reels`, or `/user/channel` */
    PAGE_PROFILE: /^\/(([^/]*)\/$|([^/]*)\/(tagged|reels|channel))/,
  };

  const API = {
    /** @type {(postOrUsernamePath: string) => string} */
    IG_INFO_API: (postOrUsernamePath) => `https://www.instagram.com${postOrUsernamePath}?__a=1&__d=1`,
    /** @type {(mediaId: string) => string} */
    IG_MEDIA_INFO_API: (mediaId) => `https://i.instagram.com/api/v1/media/${mediaId}/info/`,
    /** @type {() => string} */
    IG__A1_CURRENT_PAGE: () => `${window.location.href}?__a=1&__d=1`,
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

  let LOGGING_ENABLED = /** @type boolean */ (await callGMFunction('getValue', STORAGE_KEY_DEBUGGING_ENABLED, false));

  let isStoryKeyBindingSetup, isSinglePostKeyBindingSetup, isProfileKeyBindingSetup;
  let openPostStoryKeyBinding = DEFAULT_KB_POST_STORY;
  let openProfilePictureKeyBinding = DEFAULT_KB_PROFILE_PICTURE;
  let openSourceBehavior = '';
  let sessionId = '';

  const pages = {
    feed: {
      isVisible: () => window.location.pathname === '/',
      onLoadActions: () => {
        qsa(document, S_IG_POST_CONTAINER_WITHOUT_BUTTON).forEach(generatePostButtons);
      },
    },
    story: {
      isVisible: () => PATTERN.PAGE_STORIES.test(window.location.pathname),
      onLoadActions: () => {
        generateStoryButton();
        setupStoryEventListeners();
      },
    },
    profile: {
      isVisible: () => PATTERN.PAGE_PROFILE.test(window.location.pathname),
      onLoadActions: () => {
        if (!checkIsLoggedIn()) return;
        const node = qs(document, IG_S_PROFILE_CONTAINER);
        if (!node) return;
        generateProfileElements();
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
      [S_IG_POST_CONTAINER_WITHOUT_BUTTON]: (node) => {
        if (!pages.post.isVisible() && !pages.feed.isVisible()) return;
        generatePostButtons(node);
      },
      /* triggered whenever a single post is opened (on a profile) */
      [IG_S_SINGLE_POST_CONTAINER]: (node) => {
        if (!pages.post.isVisible() && !pages.feed.isVisible()) return;
        generatePostButtons(node);
        setupSinglePostEventListeners();
      },
      /* triggered whenever a story is opened */
      [IG_S_STORY_CONTAINER]: (node) => {
        if (!pages.story.isVisible()) return;
        generateStoryButton(node);
        setupStoryEventListeners();
      },
      /* triggered whenever a profile page is loaded */
      [IG_S_PROFILE_CONTAINER]: (node) => {
        if (!pages.profile.isVisible()) return;
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
   * @param {InputEvent} event Input change event
   */
  async function handleMenuButtonBehaviorChange(event) {
    const option = /** @type string */ event.target.value;
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
   * @param {InputEvent} event Input change event
   */
  async function handleSessionIdChange(event) {
    const value = /** @type string */ (event.target.value);
    const newSessionId = value?.trim();
    if (value === null || typeof myVar !== 'undefined' || newSessionId === sessionId) return; // empty values are accepted
    if (newSessionId.length === 0 && sessionId) {
      await callGMFunction('deleteValue', STORAGE_KEY_SESSION_ID);
      sessionId = '';
      Logger.log('Deleted saved session id');
      return;
    }
    const result = await callGMFunction('setValue', STORAGE_KEY_SESSION_ID, newSessionId);
    if (result === null) Logger.error('Failed to save session id in storage');
    sessionId = newSessionId;
    Logger.log(`Saved current session id: ...${getLast4Digits(newSessionId)}`);
  }

  /**
   * Handle 'debugging enabled' checkbox change events
   * @param {InputEvent} event Input change event
   */
  async function handleDebuggingSettingChange(event) {
    try {
      const enabled = /** @type boolean */ (event.target.checked);
      await callGMFunction('setValue', STORAGE_KEY_DEBUGGING_ENABLED, enabled);
      Logger.force.log(`${enabled ? 'Enabled' : 'Disabled'} debugging`);
      LOGGING_ENABLED = enabled;
    } catch (error) {
      Logger.force.error('Failed to store debugging enabled in storage', error);
    }
  }

  /** Handle 'copy debug logs' button click */
  async function handleCopyDebugLogs() {
    try {
      await navigator.clipboard.writeText(Logger.logs.join('\n'));
      Logger.alert('Coppied to clipboard');
    } catch (error) {
      const message = 'Failed to copy debug logs to clipboard';
      Logger.error(message, error);
      Logger.alert(message);
    }
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
      qs(document, `.${C_SETTINGS_MODAL}`).style.setProperty('display', 'flex', 'important');

      /* load values on the menu */
      const buttonBehaviorSelect = qs(document, `#${ID_SETTINGS_BUTTON_BEHAVIOR_SELECT}`);
      if (buttonBehaviorSelect) buttonBehaviorSelect.value = openSourceBehavior;
      const sessionIdInput = qs(document, `#${ID_SETTINGS_SESSION_ID_INPUT}`);
      if (sessionIdInput) sessionIdInput.value = sessionId;
      const debuggingEnabledInput = qs(document, `#${ID_SETTINGS_DEBUGGING_INPUT}`);
      if (debuggingEnabledInput) debuggingEnabledInput.checked = LOGGING_ENABLED;
    } else {
      qs(document, `.${C_SETTINGS_MODAL}`).style.setProperty('display', 'none', 'important');
    }
  }

  /**
   * Toggles the visibility of the settings menu
   * @param {boolean} visible
   */
  function setAnonymousStoriesModalVisible(visible) {
    const value = visible ? 'flex' : 'none';
    qs(document, `.${C_STORIES_MODAL}`).style.setProperty('display', value, 'important');
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
        include "settings-menu.min.html"
      `);

      /* handle modal backdrop click */
      modal.addEventListener('click', (event) => {
        if (!isModalBackdrop(event)) return;
        setSettingsMenuVisible(false);
      });
      /* ignore clicks inside the modal content */
      qsael(modal, `.${C_SETTINGS_MODAL} .${C_MODAL_WRAPPER}`, 'click', withStopPropagation);
      /* handle menu close on close button click */
      qsael(
        modal,
        `.${C_SETTINGS_MODAL} .${C_MODAL_CLOSE_BTN}`,
        'click',
        withPreventDefault(() => setSettingsMenuVisible(false))
      );
      /* handle post/story key binding button */
      qsael(modal, `#${ID_SETTINGS_POST_STORY_KB_BTN}`, 'click', withPreventDefault(handleMenuPostStoryKBCommand));
      /* handle profile picture key binding button */
      qsael(
        modal,
        `#${ID_SETTINGS_PROFILE_PICTURE_KB_BTN}`,
        'click',
        withPreventDefault(handleMenuProfilePicKBCommand)
      );
      /* handle change of button behavior option select */
      qsael(
        modal,
        `#${ID_SETTINGS_BUTTON_BEHAVIOR_SELECT}`,
        'change',
        withPreventDefault(handleMenuButtonBehaviorChange)
      );
      /* handle click of developer settings button (toggle view) */
      qsael(
        modal,
        `#${ID_SETTINGS_DEVELOPER_OPTIONS_BTN}`,
        'click',
        withPreventDefault(() => {
          qs(modal, `#${ID_SETTINGS_DEVELOPER_OPTIONS_BTN}`)?.classList.toggle(C_SETTINGS_SECTION_COLLAPSED);
          qs(modal, `#${ID_SETTINGS_DEVELOPER_OPTIONS_CONTAINER}`)?.classList.toggle(C_SETTINGS_SECTION_COLLAPSED);
        })
      );
      /* handle blur of the session id input */
      qsael(modal, `#${ID_SETTINGS_SESSION_ID_INPUT}`, 'blur', withPreventDefault(handleSessionIdChange));
      /* handle change of the debugging enabled checkbox */
      qsael(modal, `#${ID_SETTINGS_DEBUGGING_INPUT}`, 'change', handleDebuggingSettingChange);
      qsael(modal, `#${ID_SETTINGS_COPY_DEBUG_LOGS}`, 'click', handleCopyDebugLogs);

      document.body.appendChild(modal);
      Logger.log('Created settings menu');
    }
  }

  /**
   * Appends new elements to DOM containing the story source opening button
   * @param {HTMLElement} node DOM element node
   */
  function generateStoryButton(node = document.body) {
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

      const timeElement = qs(node, IG_S_POST_TIME_ELEMENT);
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
        const hasStories = !!qs(document, IG_S_PROFILE_HAS_STORIES_INDICATOR);
        if (!elementExistsInNode(`.${C_BTN_ANONYMOUS_STORIES}`, node) && hasStories) {
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
          include "stories-menu.min.html"
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
      const message = 'Failed to get user stories';
      Logger.error(message, error);
      Logger.alert(message);
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
      const storiesContainer = qs(node, IG_S_STORY_MEDIA_CONTAINER);
      const activeStoryContainer = qs(storiesContainer, '[style*="scale(1)"]');
      const video = qs(activeStoryContainer, 'video');
      const image = qs(activeStoryContainer, 'img');

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
    const response = await httpGETRequest(API.IG_INFO_API(postRelativeUrl));
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
      const postRelativeUrl = qs(node, IG_S_POST_TIME_ELEMENT)?.closest('a[role="link"]').getAttribute('href');
      if (checkPostIsCarousel(node)) {
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
    const getImageOrVideoUrl = ({ video_versions, image_versions2, original_height, original_width }) => {
      return getUrlFromBestSource(video_versions || image_versions2.candidates, original_width, original_height);
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
    const imageElement = qs(node, IG_S_POST_IMG);
    const videoElement = qs(node, IG_S_POST_VIDEO);

    if (imageElement) {
      openUrl(imageElement.getAttribute('src'));
      return;
    }

    if (videoElement) {
      /* video url is available on the element */
      const videoSrc = videoElement.getAttribute('src');
      if (!videoSrc?.startsWith('blob')) {
        openUrl(videoSrc);
        return;
      }

      if (!postRelativeUrl) {
        throw new Error('No post relative url found');
      }

      /* try to get the video url using the IG api */
      if (cachedApiData.post.has(postRelativeUrl)) {
        openUrl(cachedApiData.post.get(postRelativeUrl));
        return;
      }

      document.body.style.cursor = 'wait';
      const response = await httpGETRequest(API.IG_INFO_API(postRelativeUrl));
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

    Logger.log("Getting user's profile picture from user info API");
    const url = await getProfilePictureFromUserInfoApi(username);
    if (!url) {
      Logger.error("Couldn't get profile picture url from user info API");
      return null;
    }
    cachedApiData.userProfilePicture.set(username, url);
    return url;
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
   * @param {number | undefined} originalWidth
   * @param {number | undefined} originalHeight
   * @returns string
   */
  function getUrlFromBestSource(imageSources, originalWidth, originalHeight) {
    let largestSource = imageSources[0];

    for (const source of imageSources) {
      const { width, height, type } = source;
      if (width === originalWidth && height === originalHeight) {
        largestSource = source;
        break;
      }
      if (height > largestSource.height || (height === largestSource.height && type > largestSource.type)) {
        largestSource = source;
      }
    }

    return largestSource?.url;
  }

  /**
   * Maps the response of the IG api for stories to a more friendly format
   * @param {any[]} apiDataItems
   */
  function mapStoriesApiResponse(apiDataItems) {
    return apiDataItems.map(({ taken_at, video_versions, image_versions2, original_width, original_height }) => {
      const timestamp = taken_at * 1000;
      const imageUrl = getUrlFromBestSource(image_versions2.candidates, original_width, original_height);

      return {
        url: video_versions ? getUrlFromBestSource(video_versions, original_width, original_height) : imageUrl,
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

    const userInfo = (
      await httpGETRequest(API.IG_INFO_API(`/${username}`), {
        headers: { 'User-Agent': USER_AGENT },
      })
    )?.graphql.user;
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
    const indicators = qsa(
      node,
      pages.post.isVisible() ? IG_S_MULTI_HORIZONTAL_POST_INDICATOR : IG_S_MULTI_VERTICAL_POST_INDICATOR
    );
    for (let i = 0; i < indicators.length; i++) {
      if (indicators[i].classList.length > 1) return i;
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
   * Checks wether an Instagram post is has multiple images (carousel)
   * @param {HTMLElement} postContainerNode DOM element node containing the post
   */
  function checkPostIsCarousel(postContainerNode) {
    return qsa(postContainerNode, '[aria-label="Go back"],[aria-label="Next"]').length > 0;
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
    element.addEventListener(type, listener);
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
    const logs = [];

    const baseAlert = (...args) => alert(`${SCRIPT_NAME}:\n\n${args.join(' ')}`);
    const baseLog = (type, shouldLog, ...args) => {
      logs.push(`[${type.toUpperCase()}] ${args}`);
      if (!shouldLog) return;
      console[type]?.(`[${loggingTag}]`, ...args);
    };

    return {
      logs,
      log: (...args) => baseLog('log', LOGGING_ENABLED, ...args),
      warn: (...args) => baseLog('warn', LOGGING_ENABLED, ...args),
      error: (...args) => baseLog('error', LOGGING_ENABLED, ...args),
      alert: (...args) => baseAlert(...args),
      alertAndLog: (...args) => {
        baseLog('log', LOGGING_ENABLED, ...args);
        baseAlert(...args);
      },
      force: {
        log: (...args) => baseLog('log', true, ...args),
        warn: (...args) => baseLog('warn', true, ...args),
        error: (...args) => baseLog('error', true, ...args),
        alert: (...args) => baseAlert(...args),
        alertAndLog: (...args) => {
          baseLog('log', true, ...args);
          baseAlert(...args);
        },
      }
    };
  }

  /** Appends the necessary styles to DOM */
  function injectStyles() {
    try {
      const styles = `
        include "styles.min.css"
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
