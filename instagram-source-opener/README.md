Adds a button to open the original source of an IG story, post or profile picture. No jQuery.

### Features

-  Opening the source of a post on the post feed, page or profile pop-up (single image/video or carousel)
-  Opening the source of a story (image or video)
-  <sup>(1)</sup> Visualising full size profile pictures, even on private and not followed pages
   -  This is now achieved using the developer options, see more below
-  Saving a picture directly from the post with a right-click
-  Other features:
-  Key bindings to open the source
-  Ability to customise how to open (redirect and new tab with or without focus)
-  Posts show the full timestamp

#### Developer options

Options available on the script's settings menu (shown in the images below)

-  Session ID
   -  The session id determines your current login and it's used to get full size profile pictures using the instagram API. Without this, you will get low-res profile pictures. See <u>how to get your session id</u> on the **images below** and <u>News/Difficulties</u> for a detailed explanation.

### Key bindings

#### Defaults:

-  Alt + O - Opening single posts (pop-up) and stories
-  Alt + P - Opening the profile picture on a profile page

These key bindings can be changed on the menu shown by clicking on your extension icon, as shown on the Tampermonkey screenshot below.

If your script manager doesn't have the menu feature, you can use the on-page menu that can be opened using the button on the top bar of the IG page, as shown below.

### Compatibility

-  Chrome: Tampermonkey
-  Firefox: Tampermonkey, Greasemonkey & Violentmonkey
-  Opera: Tampermonkey

_Note: I cannot guarantee compatibility with IG viewers other than the actual website (common on Opera)_

### Notes

-  Pop-ups might be blocked on the first time opening **any picture**, you need to allow it (on the address bar)
-  Multiple pop-ups to allow Cross-Origin Requests might appear on the first time, accept those as well.

### News/Difficulties:

-  **<sup>(1)</sup> 2020-07-10** - The profile picture functionality was previously supported by an API that has since been close by Instagram. For the time being, this functionality uses third party websites that are still working and are able to get the full size image. Keep it mind that I can't control the availability of these services.
-  **2020-10-12** - Instagram changed post videos to use blobs instead of URLs, meaning that is no longer possible to open **newer videos** in a new tab.
   -  **EDIT (2020-11-22)** - This was solved by using an external API, so you might see a small delay when getting a (newer) video source.
-  **<sup>(1)</sup> 2020-11-22** - One of the third party websites that was being use to get profile pictures (izuum.com) has been shutdown. This was the one that was being used lately, so profile pictures may be done for a while until I figure out a way to solve it.
   -  **EDIT ([2020-12-26](#sessionid))** - The new version (1.1.14) discards all the 3rd party websites used to get a user's profile picture in favor of a simpler approach (that requires you to be logged in), but with some caveats. I decided to add a developer(ish) section to the settings, that allows you to specify your current <u>sessionid</u>. This id is crucial because it allows you to get most information (including an HD profile picture) from the <u>official IG user info API</u>. The issue is that it can't be accessed from the script, because it's protected, otherwise I wouldn't be writing this and you would be using it without any extra steps. I also considered developing a public API to make these requests with a sessionid of my own, but proper web hosting costs money and a free version (like AWS and GCP have) would probably be unreliable. That said, with the current solution, by following the <u>instruction image below</u>, even if you're not a developer, you should be able to get it working, just make sure you're logged in before getting the session id.
      You may encounter some issues, for example if you provide an invalid session id, the request is still executed and it may break you current session and you get logged out. This shouldn't be a big issue because as long as you provide a valid id and stay logged in, everything should work as expected.

<br/>

#### If you like the script and would like to share your appreciation:

[![donate button](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif "donate")](https://www.paypal.com/donate?hosted_button_id=5T87WS57LNLL4)

<hr/>

## Images

### Open source button locations:

![open source button locations](https://github.com/jomifepe/userscripts/blob/main/instagram-source-opener/instagram-source-opener.jpg?raw=true "open source button locations")

### Tampermonkey settings menu:

![tampermonkey settings menu](https://github.com/jomifepe/userscripts/blob/main/instagram-source-opener/settings-menu-tampermonkey.png?raw=true "tampermonkey settings menu")

### On-page settings menu:

![on-page settings menu](https://github.com/jomifepe/userscripts/blob/main/instagram-source-opener/settings-menu-page.png?raw=true "on-page settings menu")

### Getting the sessionid on chrome & opera:

![getting sessionid chrome & opera](https://github.com/jomifepe/userscripts/blob/main/instagram-source-opener/session-id-chrome-opera.png?raw=true "getting sessionid chrome & opera")

### Getting the sessionid on firefox:

![getting sessionid firefox](https://github.com/jomifepe/userscripts/blob/main/instagram-source-opener/session-id-firefox.png?raw=true "getting sessionid firefox")
