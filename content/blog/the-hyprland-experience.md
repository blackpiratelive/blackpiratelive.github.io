---
title: "The Hyprland Experience"
date: 2023-07-01T23:55:28+05:30
tags: [linux, rant]
---
I have been using [Arch Linux](https://archlinux.orh) with [Hyprland](https://hyprland.org/). Initially I started using because of the cool animation it has. And stayed with it since.  

## Look and Feel
Hyprland excels at it. Animations are super smooth and eyecatchy.I don't necessarily care for eye candy features, but this time made an exception. The default look is actually pretty good. I didn't have to do much ricing to get it look sexy. 


{{< figure src="/img/hyprland.jpg" title="A picture of my Hyprland setup, taken by phone, because I cannot figure out how to take screenshot." >}}
## Configuration
Configuration was not as easy as I expected. I haven't _really_ configured any tiling window manager previously, so it was bit hard for me.  But with few Google search I was easily able to pull it off. I didn't change much. Only changed DPI along with few keybindings. 

## Documentation
Documentation for Hyprland is okay. It's not bad, but also nowhere as good as Arch Linux documentation. Basic configuration was easy to understand, but for little bit advanced configuration I was having a tough time. It may be skill issue. I only read the surface level stuff so not totally sure how good the documentation is for more advanced stuff. Being fairly recent window manager, state of the documentation is justifiable. 

## Waybar
This is where I faced my biggest problem. Everything worked as you would expect, but it would not show the numbering of workspaces at first. Documentation for that feature was incomprehensible. Then I skimmed through some dotfiles for hyprland by some people and was able to make it show the workspace number. After that ricing it was easy. I still haven't added any new command. Just the default ones.

## Wallpaper
I used hyprpaper for wallpapers. It is minimal, as you need to change the config to change the wallpaper. I do not like it. Being someone who likes to change wallpaper quite often, I am used to see the wallpaper while applying them. I miss nitrogen. I should write shell script to fix this problem.

## Terminal
Right now I am using foot as my main terminal. I heard it can show images from [Bugswriter's](https://bugswriter.com) video, and installed it myself. I configured it to show previews and images in lf file manager. It wasn't easy, but I was able to do it. I am going to stick with this terminal, unless there is a reason to switch.

## Other things
I didn't have any problems with wayland. Although I had to relearn a few things. For example I cannot figure out how to change brightness of the monitor of my laptop. Using ``brill`` command now I can change brightness. Syntax for it is little bit too much complicated, need to make it into a keybinding. Also why is it that if I lower my brightness too much it would completely shut down the monitor backlight? And then I won't be able to see anything to even revert back.
Audio also gave me some pain which can be attributed to my skill (or the lack thereof), as I installed other DE which came with their own audio configuration, which supposedly messed with my configuration. But right now I have it working smoothly. Also keyboard buttons to change volume working flawlessly. 

## Conclusion
Hyprland is the very first window manager that I installed from scratch and configured it myself. Despite of that it was relatively easy to install and configure. Came for the animations, staying for total experience. 
