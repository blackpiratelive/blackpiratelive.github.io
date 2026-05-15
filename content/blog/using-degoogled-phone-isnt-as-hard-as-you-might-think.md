---
title: "Using Degoogled Phone Isn't as Hard as You Might Think"
date: 2022-05-17T10:27:24+05:30
tags: [software, privacy]
---
## What is a degoogled phone?
Vanilla Android is [FOSS](https://blog.blackpiratex.com/tags/FOSS/) (Free and OpenSource Software), but the android that you get preinstalled in most phones isn't completely FOSS. It has a blackbox, which is called Google Play Services. A lot of android apps and all google apps relies on this. Sure it provides features like instant notification, but privacy is a nightmare. Degoogling a phone means removing this blackbox, by installing a different flavour of Android which doesn't ship with Google Play Services by default.  LineageOs is a popular example. 

## Why I did it?
Privacy!! That's the major reason. But I get some extra advantages like better battery backup, zero notifications etc. (See below for all the advantages / disadvantages). 

## How I did it
I own two phones. The phone I used for degoogling is Redmi K20 pro, (indian version). 
I installed [Octavi Os](https://octavi-os.com/). It is very very feature rich and customisable. In my ecperience it is very stable. It has both gapps (with Google Play Services) and vanilla (without Google Play Servuces) version. I went with vahttps://calyxos.org/nilla version. 
(I didn't go with [E Os](https://e.foundation/e-os/) , [Graphene Os](https://grapheneos.org/) or [Calayx Os](https://calyxos.org/) simply because my device does not supports it.) After flashing vanilla version you have a choice to flash gapps or not, and becuase I am trying to degoogle my phone, I am not going to flash gapps. The vanilla version does not comes with any web browser out of the box. So connected my phone to my laptop through usb and transffered [Bromite](https://bromite.org). At this point my phone is very much ready to use. 

## Apps that I use
I try to stick with [FOSS](https://blog.blackpiratex.com/tags/FOSS/) (Free and OpenSource Software) apps as much as possible. My main source of apps is [F-Droid](https://f-droid.org/) along with [Aurora Store](https://auroraoss.com/) (For those apps which are not avilable on Fdroid). I have added few extra F-Droid repositories. 

Below is a list of all the apps that are currently installed on my device. 
* [Brave Browser](https://brave.com/) - My main browser
* [Bromite](https://bromite.org) - Secondary Browser
* [Firefox NIghtly](https://www.mozilla.org/en-US/firefox/new/) - I have it installed because I was using it previously, but do not use it now. Might uninstall later.
* [Bitwarden](https://bitwarden.com/) - Opensource Password Manager with cross device syncing. 
* [Simple Mpbile Tools](https://www.simplemobiletools.com/) - It's not a single app, but rather a collection of apps. I currently use their **Calculator, Clock, Contacts, Draw, Gallery, Keyboard, SMS Messenger, Thank You, Voice Recorder** apps. I would very much like to use their **Phone** app, but it doesn't let you turn of speaker while calling. The problem with their Music Player app is that it doesnt let to scrobble. 
* [Graphene Os Camera](https://github.com/GrapheneOS/Camera) - Because of no google play services support, normal gcam mod does not work. This camera app is very simple and gets the job done. _They even have QR reader built into it, yay!!!_ 
* [DAVx5](https://www.davx5.com/) - I use this app to sync my contacts using [Fruux](https://fruux.com/).
* [Download Navi](https://f-droid.org/en/packages/com.tachibana.downloader/) - It is my primary download manager. Although I use 1DM from time to time.
* [Element](https://element.io/get-started) - It is my Matrix client. I may change it later. 
* [FFUpdater](https://f-droid.org/en/packages/de.marmaro.krt.ffupdater/) - This app is used to update all my web browsers. 
* [Findroid](https://github.com/jarnedemeulemeester/findroid) - My Jellyfin client, Avilable on F-Droid through Izzydroid repo. 
* [Fluent Reader](https://github.com/yang991178/fluent-reader) - My RSS reader app. Probably the "best" looking RSS reader app for Android. I use it with [Inoreader](https://www.inoreader.com/). 
* [Infinity]() - This is a reddit client. It is opensource and has decent amount of features. 
* [Koler](https://f-droid.org/en/packages/com.chooloo.www.koler) - Opensource Dialer app with minimal features. 
* [LetterBoxD](https://letterboxd.com/) - I use it to track movies that I have watched and find new movies. 
* [Libretorrent](https://github.com/proninyaroslav/libretorrent) - I don't do torrenting much on my phone, but have it on my phone, just in case.
* [Adobe Lightroom](https://play.google.com/store/apps/details?id=com.adobe.lrmobile&hl=en_US&gl=US) - Wish there was a good opensource alternative for this. I like lightroom because you can download presets and apply it without having to do the hard work by yourself. 
* [Mastodon](https://joinmastodon.org/apps) - Mastodon official client.
* [Mixplorar](https://mixplorer.com/) - A file manager. It is probably the **best** file manager for android. Has built in tabs support, ability to add almost any cloud storage etc, (I should probably make a post about this app). It is not opensource. 
* [mpv](https://github.com/mpv-android/mpv-android) - It is my alternative video player. sometimes use it. 
* [Nekogram](https://nekogram.app/) - Opensource telegram app. I was previously using Plus messanger, but now starting to switch to nekogram. 
* [Plus Messanger](https://play.google.com/store/apps/details?id=org.telegram.plus&hl=en_US&gl=US) - Telegram features with extra features, closed source. 
* [NewPipe](https://github.com/TeamNewPipe/NewPipe) and [NewPipe x Sponsorblock](https://github.com/polymorphicshade/NewPipe/) - I was planning to move away from using official youtube app. Newpipe is a frontend for youtube. It has all the features that I need, but super buggy, non useable for primary youtube app. 
* [Noice](https://f-droid.org/en/packages/com.github.ashutoshgngwr.noice) - Opensource white noise app. Whenever I have trouble getting into sleep I put on my earphones, and try to sleep while listening. 
* [Pano Scrobbler](https://github.com/kawaiiDango/pScrobbler) - Last.fm and libre.fm scrobbler. Opensource. 
* [Plex](https://www.plex.tv/) - Jellyfin is good, but I have a hard time configuring it. So I have plex as alternative. Just wish that plex worked without internet connection. 
* [Pocket](https://getpocket.com/en/) - My read later app. 
* [Proton Apps](https://protonapps.com/) - I use [ProtonMail](https://protonmail.com), [ProtonVPN](https://protonvpn.com), and [Proton Calender](https://calendar.protonmail.com/).
* [Raindrop](https://raindrop.io) - Bookmark manager. Opensource.
* [Readwise](https://readwise.io) - A service that lets you organize all your highlights from different places. 
* [Readwise WIdget](https://play.google.com/store/apps/details?id=grape.k.readwiseapp&gl=US) - A simple app that lets you add an widget to your home screen which shows your readwise highlights. 
* [Magisk](https://github.com/topjohnwu/Magisk) - Rooting app for android. Opensource.
* [Showly](https://play.google.com/store/apps/details?id=com.michaldrabik.showly2) - It is a tv show tracker which syncs with trakt.tv.
* [SimpleLogin](https://simplelogin.io) - It is an email aliasing service that lets you create aliases for each and every website. I also use this service to host email on my domain. 
* [Simplenote](https://simplenote.com) - A note taking app focuused on simplicity. I use it to write something down quickly. 
* [Snapdrop](https://snapdrop.net) - Airdrop like app for android. Open Source. 
* [Spotify](https://spotify.com) - My music streaming app of choice. 
* [Swift Backup](https://play.google.com/store/apps/details?id=org.swiftapps.swiftbackup&hl=en_US&gl=US) - This is probably one of the first apps that I would install on any new device. It lets you to take backup of your apps with app data and sync it to the cloud. Since I change roms quiute often it is useful for me to be able to restore any app in its current state. Closed source. 
* [Tick Tick](https://ticktick.com/) - Todo list app. Closed Source
* [Tor Browser](https://torproject.org) - This doesn't require any description.
* [Tutanota](https://tutanota.com) - Email client for tutanota. 
* [Vinyl](https://github.com/AdrienPoupa/VinylMusicPlayer) - Offline music player to play my mp3s.
* [VLC](https://www.videolan.org/vlc/) - Open source feature rich video player. 
* [WhatsApp & WhatsApp Business](https://whatsapp.com) - Main text messaging app for my phone.
* [Youtube Vanced](https://vancedapp.com) - Even though vanced has been discontinued it still works so I would keep using it. 

## Advantages
There is few advantages of using a degoogled phone. The obvious one is privacy. While it is true that using a degoogled phone makes you more private from google, it has other advantages too. Your battery backup would be excellent. Around 9-10 hours in single charge for a 4000mAh battery. I have noticed less heating while using degoogled phone. Phone is also faster than it outherwise be with google apps.  

## Disadvantages 
Depending on how much you are into google ecosystem disadvantages can be almost none or very much. For me I only use google photos and youtube. Google photos does not work obviously, but you can youtube get working with youtube vanced. As for google photos I have decided to keep it locally and then take backup to my laptop every month or so. Google maps does not work at all. (even with microg I cannot get it working properly). Other than these few problems there is nothing that effects me. 
Now let's talk about all the other problems that you are likely to face if you are using android with Google Play Services. 
- Notifications might not work if its dependent on Google Play Services.
- No Google Play Store, that means all your purchases won't work. (You can get them working by using microg).
- Gcam does not work out of the box. There is an app that can fix this issue hopefully but I haven't tested it yet. 
- Banking apps won't work. You can get them work with microg and magisk. 
- Safety net won't pass. You can make them pass with magisk and microg. 
- If you are used to use 'Login with Google' you would either have to set a password for that app or create new account with email and password. 
- A lot of apps would even refuse to open if you don't have google play services installed. 

Despite its disadvantages you might want to try degoogling your phone, at least once and see if its going to work for you or not. If you are using propietory software most of the times, maybe you might wanna switch to FOSS alternatives. Most FOSS apps are not relient on Google Play Services.  

Most fundamental things like calling or texting works without any hiccups. It is very much possible to live with a degoogle phone and avoid big tech as much as possible. 

