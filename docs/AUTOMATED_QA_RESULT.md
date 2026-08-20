# Automated QA Result — Word Guardians

Result: FAIL
Tested Commit: `cc33a34b5a5765d254e676742a08e9e244361c3c`
Date: 2026-08-20T13:34:48Z
Live URL: https://o-some.github.io/word-guardians/
Build: success
Browser install: cancelled
Gameplay QA: skipped

Profiles attempted:
- Desktop Chromium 1440×900
- Desktop WebKit 1440×900
- Android-like Chromium 390×844
- iPhone-like WebKit 390×844

Assets/features checked:
- regular enemy PNGs and original boss PNGs
- premium guardians and Tula/UI assets
- glowing lane-bound boss overlay
- one free lane rescue rock per lane
- red Insel-Notruf in the header
- 3× pause in the action row
- mobile performance profile
- premium endscreen additions

Note: WebKit mobile emulation is not a physical iPhone Safari device test.

## Build log
```

> word-guardians@1.0.0-migrated build
> node scripts/build.mjs

Word Guardians build complete · v1.7.1 compact mobile flow + guardian drag/drop
```

## Browser install log (tail)
```
Get:40 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libxvidcore4 amd64 2:1.3.7-1build1 [219 kB]
Get:41 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libzvbi-common all 0.2.42-2 [42.4 kB]
Get:42 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libzvbi0t64 amd64 0.2.42-2 [261 kB]
Get:43 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libavcodec60 amd64 7:6.1.1-3ubuntu5 [5851 kB]
Get:44 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libunibreak5 amd64 5.1-2build1 [25.0 kB]
Get:45 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libass9 amd64 1:0.17.1-2build1 [104 kB]
Get:46 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libudfread0 amd64 1.1.2-1build1 [19.0 kB]
Get:47 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libbluray2 amd64 1:1.3.4-1build1 [159 kB]
Get:48 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libchromaprint1 amd64 1.5.1-5 [30.5 kB]
Get:49 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libgme0 amd64 0.6.3-7build1 [134 kB]
Get:50 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 libmpg123-0t64 amd64 1.32.5-1ubuntu1.1 [169 kB]
Get:51 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libopenmpt0t64 amd64 0.7.3-1.1build3 [647 kB]
Get:52 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libcjson1 amd64 1.7.17-1 [24.8 kB]
Get:53 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libmbedcrypto7t64 amd64 2.28.8-1 [209 kB]
Get:54 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 librist4 amd64 0.2.10+dfsg-2 [74.9 kB]
Get:55 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libsrt1.5-gnutls amd64 1.5.3-1build2 [316 kB]
Get:56 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 libssh-gcrypt-4 amd64 0.10.6-2ubuntu0.4 [225 kB]
Get:57 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libavformat60 amd64 7:6.1.1-3ubuntu5 [1153 kB]
Get:58 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libbs2b0 amd64 3.1.0+dfsg-7build1 [10.6 kB]
Get:59 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libflite1 amd64 2.2-6build3 [13.6 MB]
Get:60 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libserd-0-0 amd64 0.32.2-1 [43.6 kB]
Get:61 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libzix-0-0 amd64 0.4.2-2build1 [23.6 kB]
Get:62 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libsord-0-0 amd64 0.16.16-2build1 [15.8 kB]
Get:63 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libsratom-0-0 amd64 0.6.16-1build1 [17.3 kB]
Get:64 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 liblilv-0-0 amd64 0.24.22-1build1 [41.0 kB]
Get:65 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libmysofa1 amd64 1.3.2+dfsg-2ubuntu2 [1158 kB]
Get:66 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libplacebo338 amd64 6.338.2-2build1 [2654 kB]
Get:67 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 libblas3 amd64 3.12.0-3build1.1 [238 kB]
Get:68 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 liblapack3 amd64 3.12.0-3build1.1 [2646 kB]
Get:69 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libasyncns0 amd64 0.8-6build4 [11.3 kB]
Get:70 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libflac12t64 amd64 1.4.3+ds-2.1ubuntu2 [197 kB]
Get:71 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 libsndfile1 amd64 1.2.2-1ubuntu5.24.04.1 [209 kB]
Get:72 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 libpulse0 amd64 1:16.1+dfsg1-2ubuntu10.1 [292 kB]
Get:73 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libsphinxbase3t64 amd64 0.8+5prealpha+1-17build2 [126 kB]
Get:74 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libpocketsphinx3 amd64 0.8.0+real5prealpha+1-15ubuntu5 [133 kB]
Get:75 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libpostproc57 amd64 7:6.1.1-3ubuntu5 [49.9 kB]
Get:76 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libsamplerate0 amd64 0.2.2-4build1 [1344 kB]
Get:77 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 librubberband2 amd64 3.3.0+dfsg-2build1 [130 kB]
Get:78 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libswscale7 amd64 7:6.1.1-3ubuntu5 [193 kB]
Get:79 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libvidstab1.1 amd64 1.1.0-2build1 [38.5 kB]
Get:80 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libzimg2 amd64 3.0.5+ds1-1build1 [254 kB]
Get:81 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libavfilter9 amd64 7:6.1.1-3ubuntu5 [4235 kB]
Get:82 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 liborc-0.4-0t64 amd64 1:0.4.38-1ubuntu0.1 [207 kB]
Get:83 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 libgstreamer-plugins-base1.0-0 amd64 1.24.2-1ubuntu0.4 [862 kB]
Get:84 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 gstreamer1.0-libav amd64 1.24.1-1build1 [103 kB]
Get:85 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libcdparanoia0 amd64 3.10.2+debian-14build3 [48.5 kB]
Get:86 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libvisual-0.4-0 amd64 0.4.2-2build1 [115 kB]
Get:87 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 gstreamer1.0-plugins-base amd64 1.24.2-1ubuntu0.4 [721 kB]
Get:88 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libaa1 amd64 1.4p5-51.1 [49.9 kB]
Get:89 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libraw1394-11 amd64 2.1.2-2build3 [26.2 kB]
Get:90 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libavc1394-0 amd64 0.5.4-5build3 [15.4 kB]
Get:91 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 libcaca0 amd64 0.99.beta20-4ubuntu0.2 [209 kB]
Get:92 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libdv4t64 amd64 1.0.0-17.1build1 [63.2 kB]
Get:93 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 libgstreamer-plugins-good1.0-0 amd64 1.24.2-1ubuntu1.5 [33.5 kB]
Get:94 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libiec61883-0 amd64 1.2.0-6build1 [24.5 kB]
Get:95 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libshout3 amd64 2.4.6-1build2 [50.3 kB]
Get:96 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libtag1v5-vanilla amd64 1.13.1-1build1 [326 kB]
Get:97 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libtag1v5 amd64 1.13.1-1build1 [11.7 kB]
Get:98 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libv4lconvert0t64 amd64 1.26.1-4build3 [87.6 kB]
Get:99 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libv4l-0t64 amd64 1.26.1-4build3 [46.9 kB]
Get:100 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libwavpack1 amd64 5.6.0-1build1 [84.6 kB]
Get:101 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 libsoup-3.0-common all 3.4.4-5ubuntu0.7 [11.6 kB]
Get:102 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 libsoup-3.0-0 amd64 3.4.4-5ubuntu0.7 [292 kB]
Get:103 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 gstreamer1.0-plugins-good amd64 1.24.2-1ubuntu1.5 [2236 kB]
Get:104 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 libabsl20220623t64 amd64 20220623.1-3.1ubuntu3.2 [423 kB]
Get:105 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libgav1-1 amd64 0.18.0-1build3 [357 kB]
Get:106 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libyuv0 amd64 0.0~git202401110.af6ac82-1 [178 kB]
Get:107 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libavif16 amd64 1.0.4-1ubuntu3 [91.2 kB]
Get:108 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libavtp0 amd64 0.2.0-1build1 [6414 B]
Get:109 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libcairo-script-interpreter2 amd64 1.18.0-3build1 [60.3 kB]
Get:110 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libdc1394-25 amd64 2.2.6-4build1 [90.1 kB]
Get:111 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 libde265-0 amd64 1.0.15-1ubuntu0.1 [167 kB]
Get:112 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libdecor-0-0 amd64 0.2.2-1build2 [16.5 kB]
Get:113 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libgles2 amd64 1.7.0-1build1 [17.1 kB]
Get:114 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libdirectfb-1.7-7t64 amd64 1.7.7-11.1ubuntu2 [1035 kB]
Get:115 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libdvdread8t64 amd64 6.1.3-1.1build1 [54.7 kB]
Get:116 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libdvdnav4 amd64 6.1.1-3build1 [39.5 kB]
Get:117 http://azure.archive.ubuntu.com/ubuntu noble-updates/main amd64 libegl-mesa0 amd64 25.2.8-0ubuntu0.24.04.2 [117 kB]
Get:118 http://azure.archive.ubuntu.com/ubuntu noble/main amd64 libevent-2.1-7t64 amd64 2.1.12-stable-9ubuntu2 [145 kB]
Get:119 http://azure.archive.ubuntu.com/ubuntu noble/universe amd64 libfaad2 amd64 2.11.1-1build1 [207 kB]
```

## Gameplay QA log
```

```
