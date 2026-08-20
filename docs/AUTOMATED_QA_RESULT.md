# Automated QA Result — Word Guardians

Result: FAIL
Tested Commit: `916bbdecd95adc364a18fd888a79b6a236cebbf1`
Date: 2026-08-20T19:20:02Z
Live URL: https://o-some.github.io/word-guardians/
Build: success
Browser install: success
Gameplay QA: failure

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
- energy bar between answers and action buttons
- regular enemy sprites may paint outside their lane without changing lane logic
- larger onboarding and 3:00 healing milestone typography
- 3:00 answer-healing milestone popup and scaling heal percentages
- 2:00 answer-damage milestone and +1 percent per second up to +100 percent
- v1.9.0 start guide, start-to-info morph and 60-second Insel-Notruf

Note: WebKit mobile emulation is not a physical iPhone Safari device test.

## Build log
```

> word-guardians@1.9.0 build
> node scripts/build.mjs

Word Guardians build complete · v1.9.0 readable milestones + answer damage scaling
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
PASS desktop-chromium
PASS desktop-webkit
PASS android-like-chromium
PASS iphone-like-webkit
ALL_QA_PASS
file:///home/runner/work/word-guardians/word-guardians/tests/layout-regression-v176.mjs:51
  if(enemyMetrics.width<=0||enemyMetrics.height<=0)throw new Error(`${name}: regular enemy sprite has no visible box`);
                                                         ^

Error: desktop-chromium: regular enemy sprite has no visible box
    at run (file:///home/runner/work/word-guardians/word-guardians/tests/layout-regression-v176.mjs:51:58)
    at runNextTicks (node:internal/process/task_queues:64:5)
    at process.processImmediate (node:internal/timers:452:9)
    at process.callbackTrampoline (node:internal/async_hooks:130:17)
    at async file:///home/runner/work/word-guardians/word-guardians/tests/layout-regression-v176.mjs:73:1

Node.js v22.23.2
```
