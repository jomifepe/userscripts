Adds a button to open the original source of an IG story, post or profile picture. No jQuery.

### Features

-  Visualising the full size, original image or video of:
   -  **Posts** - On the feed, post page or quick view (single image/video or carousel)
   -  **Stories**
   -  <sup>(1)</sup> **Profile pictures** - Even on private and not followed pages (requires login)
      -  This is now achieved using the script's <u>developer options</u>, see more below on the settings section
-  Saving a post directly from the context menu (right-click)
   -  _Note: This is just convenience and it doesn't save the full size version_
-  Posts show the full timestamp instead of a relative and more generic time
-  Ability to customise your experience (key binding, default actions, ... see more settings below)

### Key bindings

#### Defaults:

-  Alt/⌥ + O - Opening single posts (pop-up) and stories
-  Alt/⌥ + P - Opening the profile picture on a profile page

These key bindings can be **changed on the script's settings**, see more below

### Settings:

-  Changing the key bindings - These always use the Alt/⌥ key in combination with a letter, this option allows you to change the default letter.
-  Open source button behavior - Redirect or open in a new tab with or without focus.
-  **<u>Developer options</u>**
   -  Options available on the script's settings menu (see images below). These are more developer-oriented, but by following the provided instructions, anyone can use them.
   -  **Session ID:**
      -  The session id determines your current login and it's used to get **full size profile pictures** using the instagram API. Without this, you will get low-res profile pictures. See <u>how to get your session id</u> on the **images below** and the <u>News/Difficulties</u> section for more a detailed explanation.

### Compatibility

-  **Chrome**: Tampermonkey, Violentmonkey & MeddleMonkey
-  **Firefox**: Tampermonkey, Greasemonkey & Violentmonkey
-  **Opera**: Tampermonkey & Violentmonkey ([Chrome extension support](https://addons.opera.com/en/extensions/details/install-chrome-extensions/))
-  **Edge (Chromium-based version)**: Tampermonkey & Violentmonkey
-  **Vivaldi**: Uses the chrome web store, so same as chrome

_Note: I cannot guarantee compatibility with third-party Instagram viewers/extensions (common on Opera), only with the actual website._

### Notes

-  Pop-ups might be blocked on the first time opening **any picture**, you need to allow it (on the address bar)
-  Multiple pop-ups to allow Cross-Origin Requests might appear on the first time, accept those as well.

### News/Difficulties:

-  **<sup>(1)</sup> 2020-07-10** - The profile picture functionality was previously supported by an API that has since been close by Instagram. For the time being, this functionality uses third party websites that are still working and are able to get the full size image. Keep it mind that I can't control the availability of these services.
-  **2020-10-12** - Instagram changed post videos to use blobs instead of URLs, meaning that is no longer possible to open **newer videos** in a new tab.
   -  **EDIT (2020-11-22)** - This was solved by using an external API, so you might see a small delay when getting a (newer) video source.
-  **<sup>(1)</sup> 2020-11-22** - One of the third party websites that was being use to get profile pictures (izuum.com) has been shutdown. This was the one that was being used lately, so profile pictures may be done for a while until I figure out a way to solve it.
   -  **EDIT ([2020-12-26](#sessionid))** - The new version (1.1.14) discards all the 3rd party websites used to get a user's profile picture in favor of a simpler approach (that requires you to be logged in), but with some caveats. I decided to add a developer(ish) section to the settings, that allows you to specify your current <u>sessionid</u>. This id is crucial because it allows you to get most information (including an HD profile picture) from the <u>official IG user info API</u>. The issue is that the id can't be accessed from the script, because it's protected, otherwise I wouldn't be writing this and you would be using it without any extra steps. I also considered developing a public API to make these requests with a sessionid of my own (keeping it hidden from the public), but proper web hosting costs money and a free version (like AWS and GCP have) would probably be unreliable. That said, with the current solution, by following the <u>instruction image below</u>, even if you're not a developer, you should be able to get it working, just make sure you're logged in before getting the session id. You may encounter some issues, for example if you provide an invalid session id, the request is still executed and it may break you current session and you get logged out. This shouldn't be a big issue because as long as you provide a valid id and stay logged in, everything should work as expected.

<br/>

#### If you like the script and would like to share your appreciation:

[![donate button](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif "donate")](https://www.paypal.com/donate?hosted_button_id=5T87WS57LNLL4)

<hr/>

## Images

### Open source button locations:

![open source button locations](https://raw.githubusercontent.com/jomifepe/userscripts/develop/instagram-source-opener/instagram-source-opener.png "open source button locations")

### Tampermonkey settings menu:

![tampermonkey settings menu](https://raw.githubusercontent.com/jomifepe/userscripts/develop/instagram-source-opener/settings-menu-tampermonkey.png "tampermonkey settings menu")

### On-page settings menu:

![on-page settings menu](https://raw.githubusercontent.com/jomifepe/userscripts/develop/instagram-source-opener/settings-menu-page.png "on-page settings menu")

### Getting the sessionid on chrome & opera:

![getting sessionid chrome & opera](https://raw.githubusercontent.com/jomifepe/userscripts/develop/instagram-source-opener/session-id-chrome-opera.png "getting sessionid chrome & opera")

### Getting the sessionid on firefox:

![getting sessionid firefox](https://raw.githubusercontent.com/jomifepe/userscripts/develop/instagram-source-opener/session-id-firefox.png "getting sessionid firefox")
