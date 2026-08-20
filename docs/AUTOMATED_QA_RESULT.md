# Automated QA Result — Word Guardians

Result: FAIL
Tested Commit: `d45f52c4488079f8b70df52855d5e7952b301e7f`
Date: 2026-08-20T14:05:33Z
Live URL: https://o-some.github.io/word-guardians/
Build: success
Browser install: success
Gameplay QA: cancelled

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

Word Guardians build complete · v1.7.4 persistent boss idle slot · deploy
```

## Browser install log (tail)
```
Setting up libavfilter9:amd64 (7:6.1.1-3ubuntu5) ...
Setting up gstreamer1.0-libav:amd64 (1.24.1-1build1) ...
Processing triggers for fontconfig (2.15.0-1.1ubuntu2) ...
Processing triggers for libc-bin (2.39-0ubuntu8.8) ...
Processing triggers for man-db (2.12.0-4build2) ...
Not building database; man-db/auto-update is not 'true'.
Processing triggers for libglib2.0-0t64:amd64 (2.80.0-6ubuntu3.8) ...
Setting up libgtk-4-1:amd64 (4.14.5+ds-0ubuntu0.10) ...
Setting up glib-networking:amd64 (2.80.0-1build1) ...
Setting up libsoup-3.0-0:amd64 (3.4.4-5ubuntu0.7) ...
Setting up libgssdp-1.6-0:amd64 (1.6.3-1build3) ...
Setting up gstreamer1.0-plugins-good:amd64 (1.24.2-1ubuntu1.5) ...
Setting up libgupnp-1.6-0:amd64 (1.6.6-1build3) ...
Setting up libgupnp-igd-1.6-0:amd64 (1.6.0-3build3) ...
Setting up libnice10:amd64 (0.1.21-2build3) ...
Setting up libgstreamer-plugins-bad1.0-0:amd64 (1.24.2-1ubuntu4) ...
Setting up gstreamer1.0-plugins-bad:amd64 (1.24.2-1ubuntu4) ...
Processing triggers for libc-bin (2.39-0ubuntu8.8) ...

Running kernel seems to be up-to-date.

No services need to be restarted.

No containers need to be restarted.

No user sessions are running outdated binaries.

No VM guests are running outdated hypervisor (qemu) binaries on this host.
Downloading Chromium 140.0.7339.16 (playwright build v1187) from https://cdn.playwright.dev/dbazure/download/playwright/builds/chromium/1187/chromium-linux.zip
|                                                                                |   0% of 173.7 MiB
|■■■■■■■■                                                                        |  10% of 173.7 MiB
|■■■■■■■■■■■■■■■■                                                                |  20% of 173.7 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■                                                        |  30% of 173.7 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                                |  40% of 173.7 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                        |  50% of 173.7 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                |  60% of 173.7 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                        |  70% of 173.7 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                |  80% of 173.7 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■        |  90% of 173.7 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■| 100% of 173.7 MiB
Chromium 140.0.7339.16 (playwright build v1187) downloaded to /home/runner/.cache/ms-playwright/chromium-1187
Downloading FFMPEG playwright build v1011 from https://cdn.playwright.dev/dbazure/download/playwright/builds/ffmpeg/1011/ffmpeg-linux.zip
|                                                                                |   0% of 2.3 MiB
|■■■■■■■■                                                                        |  10% of 2.3 MiB
|■■■■■■■■■■■■■■■■                                                                |  20% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■                                                        |  30% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                                |  40% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                        |  50% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                |  60% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                        |  70% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                |  80% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■        |  90% of 2.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■| 100% of 2.3 MiB
FFMPEG playwright build v1011 downloaded to /home/runner/.cache/ms-playwright/ffmpeg-1011
Downloading Chromium Headless Shell 140.0.7339.16 (playwright build v1187) from https://cdn.playwright.dev/dbazure/download/playwright/builds/chromium/1187/chromium-headless-shell-linux.zip
|                                                                                |   0% of 104.3 MiB
|■■■■■■■■                                                                        |  10% of 104.3 MiB
|■■■■■■■■■■■■■■■■                                                                |  20% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■                                                        |  30% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                                |  40% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                        |  50% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                |  60% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                        |  70% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                |  80% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■        |  90% of 104.3 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■| 100% of 104.3 MiB
Chromium Headless Shell 140.0.7339.16 (playwright build v1187) downloaded to /home/runner/.cache/ms-playwright/chromium_headless_shell-1187
Downloading Webkit 26.0 (playwright build v2203) from https://cdn.playwright.dev/dbazure/download/playwright/builds/webkit/2203/webkit-ubuntu-24.04.zip
|                                                                                |   0% of 94.2 MiB
|■■■■■■■■                                                                        |  10% of 94.2 MiB
|■■■■■■■■■■■■■■■■                                                                |  20% of 94.2 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■                                                        |  30% of 94.2 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                                |  40% of 94.2 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                        |  50% of 94.2 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                                |  60% of 94.2 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                        |  70% of 94.2 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                |  80% of 94.2 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■        |  90% of 94.2 MiB
|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■| 100% of 94.2 MiB
Webkit 26.0 (playwright build v2203) downloaded to /home/runner/.cache/ms-playwright/webkit-2203
```

## Gameplay QA log
```

```
