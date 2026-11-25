# ApkStart User Guide and Troubleshooting

> Version: v0.6.4 · Platform: Windows 10/11 x64 · Updated: 2026-11-22
>
> ApkStart is an Android app runner for Windows: **install Android apps like native Windows software, get a desktop icon, and launch with a double-click.**
> This guide first shows you how to use it, then gives step-by-step fixes organized by "symptom". Every step refers to buttons and menus that actually exist in the app.
>
> This is an English translation of the Chinese guide (`USER-MANUAL.md`). If they differ, the Chinese original takes precedence.

---

## Contents

1. [ApkStart in 30 seconds](#s1)
2. [Installation and first launch](#s2)
3. [Everyday use](#s3)
4. [Three core concepts (the key to reading error messages)](#s4)
5. [Do this first when something goes wrong: system check and automatic checks](#s5)
6. [Solutions to common problems](#s6)
   - [6.1 "Hardware acceleration is disabled" / very slow startup](#s6-1)
   - [6.2 Installation failed (INSTALL_FAILED_*)](#s6-2)
   - [6.3 System image has no ARM translation layer / ARM apps will not install or crash](#s6-3)
   - [6.4 adb is not authorized (Allow USB debugging)](#s6-4)
   - [6.5 Double-clicking the icon does nothing / endless spinner / a window with a rotate button appears](#s6-5)
   - [6.6 Quick reference for other startup problems](#s6-6)
   - [6.7 An app has no sound / sound is very quiet](#s6-7)
   - [6.8 Store edition fails to start / 0xC0000135 (DLL load failure)](#s6-8)
   - [6.9 An app cannot use the microphone / voice calls and recording fail](#s6-9)
   - [6.10 Discrete / integrated GPU rendering (GPU preference)](#s6-10)
7. [Command-line reference](#s7)
8. [Data and folder locations](#s8)
9. [Getting help and giving feedback](#s9)

---

## 1. ApkStart in 30 seconds

```
Desktop icon (real app icon, .lnk)
      │ double-click
      ▼
ApkStart.exe --launch <package name>
      │ Android runtime not running? → started automatically (Android 14 emulator, bundled or downloaded on first run)
      ▼
The app is opened through the launcher entry resolved by the system (not the main Activity hard-coded in the APK)
      ▼
Emulator window = app window (title changed, icon replaced, portrait ratio, fullscreen centered)
```

**Features**

- 🖱️ **Double-click an .apk to install**: after you register the file association, double-click an APK → it is parsed → installed → a desktop icon is created.
- 🧩 **One desktop icon per app**: the icon is extracted offline from inside the APK; double-clicking the icon opens the app directly.
- 🪟 **An app is just a window**: native rendering; fullscreen fills the screen height and is centered; in window mode you can drag to resize, and each app remembers its own size.
- 🔍 **Searchable in Windows**: two shortcuts, on the desktop and in the Start menu (`Programs\ApkStart\`).
- 📁 **File sharing**: `%USERPROFILE%\ApkStartShared` ↔ `/sdcard/ApkStartShared` inside Android, synced both ways.
- 🪶 **Bundled runtime**: does not depend on any emulator installed on your PC, such as MuMu, LDPlayer or WSA.

> Note: this is an early-stage project maintained in the author's spare time. It is free, open source and ad-free. Running into problems is normal, and this guide exists for that reason.

---

## 2. Installation and first launch

### 2.1 Choose the edition that suits you

Both sources have identical content. Users in China should prefer Gitee:

- GitHub: `github.com/RoutineMiku/apkstart/releases`
- Gitee: `gitee.com/daily-miku/apkstart/releases` (much faster to reach from China)

| Edition | File name | When to choose it |
|---|---|---|
| **Store edition** | `ApkStart_<four-part version>_x64.msix` | Install from the Microsoft Store. Includes the full runtime, needs no network after installation, updates are handled by the Store |
| **Full portable edition** | `ApkStart-v*-win64-full.zip` (about 830 MB, about 1.3 GB extracted) | You do not want to install or wait for downloads: extract and run, with the runtime included in the package |
| **Installer edition** | `ApkStart-v*-Setup.exe` (about 1.3 GB) | You want desktop / Start menu shortcuts and an uninstall entry |
| **Lightweight portable edition** | `ApkStart-v*-win64-portable.zip` (96 MiB, about 227 MB extracted) | You just want to try it first; the runtime is downloaded on first launch |

> ⚠️ **Always use the latest version (currently 0.6.4).** Older versions (0.5.x and earlier) either had no bundled runtime and searched for or downloaded a 1.5 GB runtime on every start, or used the embedded window by default. This is the typical source of "very slow, will not open, a window with a rotate button appears". If you upgraded from an older version, make sure your desktop icons point to the new program folder.

### 2.2 What happens on first launch

1. **(Lightweight edition only) Download the runtime**: adb, the Android Emulator and the Android 14 system image, measured at 10+ MB/s from official sources, using 8 connections with chunking and resume. The full and Store editions skip this step.
2. **Extract the image for the first time**: the xz image is extracted into `%APPDATA%\apkstart\system-images` (about 20 seconds, done once).
3. **Create `/data` for the first time**: ApkStart generates an ext4 user-data partition with encryption and SELinux labels (the official image only contains a 1 MB placeholder).
4. **Automatic boot**: from then on, opening an app only needs one `am start`. A cold start takes about 23 seconds, and a snapshot hit about 10 seconds.

> A slow first launch is normal; it is a "one-time cost". After that, apps open almost instantly.

---

## 3. Everyday use

### 3.1 Installing apps

Choose any of three ways:

- **Double-click an APK file** (register the association first: Settings → Integration & Files → System integration → Associate .apk files);
- Use "Install APK" on the main screen;
- Command line: `ApkStart.exe <path\to.apk>`.

Split packages in `.apks` / `.xapk` format are supported (installed automatically with `install-multiple`). After installation, desktop and Start menu shortcuts are created automatically.

### 3.2 Opening apps

Double-click the desktop icon. All apps share one runtime, so **the second app starts almost instantly**.

### 3.3 Windows and display

| Action | How |
|---|---|
| Switch fullscreen / window | `F11` or the tray menu (right-click). Fullscreen only enlarges the window and does not change the aspect ratio |
| Rotate landscape / portrait | `Ctrl+Alt+R` (global) or the rotate button in the title bar; the orientation is remembered for that app |
| Automatic fullscreen | Settings → Display & Windows → Automatically use fullscreen (works best with a forced orientation) |
| Force landscape / portrait | Settings → Display & Windows → Screen orientation |

> The runtime restarts only when the display orientation does not match the app orientation (about 40 seconds, and the title bar shows a notice). Apps with the same orientation open instantly afterwards.

### 3.4 Keyboard shortcuts

| Key | Action |
|---|---|
| `F11` | Switch between fullscreen and window mode |
| `Ctrl+Alt+R` | Rotate the current app between landscape and portrait |
| `Ctrl+R` | Rotate inside the shell window (use `Ctrl+Alt+R` in native window mode) |

### 3.5 File sharing (Windows ↔ Android)

`%USERPROFILE%\ApkStartShared` on your PC and `/sdcard/ApkStartShared` in Android sync in both directions within seconds.
Where: Settings → Integration & Files → File sharing (you can use "Sync now" or open the folder).

### 3.6 Settings navigation

Since 0.6.0 there are eight categories, plus a search box at the top (type "landscape", "memory", "proxy" and similar keywords; matches appear across categories):

| Category | Main contents |
|---|---|
| General & Installation | Runtime & environment, set up automatically, start with Windows, disk usage and cleanup |
| Display & Windows | Display mode, automatic fullscreen, screen orientation, tablet layout, window mode |
| Controls & Input | Mouse buttons, keyboard mapping |
| Performance & Resources | Resource profile, GPU preference (discrete / integrated), microphone, graphics quality, data partition, Android system language, snapshots, warm-up at startup |
| Network & Downloads | Update and download sources, download mirrors, number of download connections |
| Diagnostics & Repair | System check, drivers / compatibility patches, automatic checks |
| Integration & Files | Desktop & applications, file sharing, system integration |
| Updates & About | Software updates, about |
| Laboratory | Native Windows multi-window / multi-app mode (experimental), number of apps kept in the background |

> **Laboratory · multi-app mode (experimental)**: when enabled, opening a new app no longer closes the previous one. Several apps can stay in the background and be switched back to at any time with their sign-in state kept. Because the Android runtime has only one emulator window, only one app picture is shown in the foreground at a time, so this is not true side-by-side windows. Enabling it increases memory use. It is off by default; ignore it if you value stability.

### 3.7 Online updates

Settings → Updates & About → Check for updates, or tray right-click → Check for updates. The updater tests and picks the fastest source each time (GitHub / Gitee / mirrors), downloads in parallel chunks, and switches source automatically on failure. Updating does not lose the runtime, installed apps or snapshots.

The newer portable edition supports **incremental updates**: every release also publishes a "code manifest" and a small package containing only program code (a few MB, versus about 100 MB for the whole package). If your Electron shell version has not changed, the update downloads only this small package, verifies each file, and replaces the program code in a few seconds. If the shell version changed, the manifest is missing, or any check fails, it automatically falls back to downloading the full package, so an update cannot leave the program broken. The Store edition is still updated by the Microsoft Store.

> Note: only users who installed the portable edition from GitHub / Gitee through "Check for updates" get incremental updates; Store installs use the Store channel. Incremental updates do not affect installed apps, Android data, the runtime or snapshots.

---

## 4. Three core concepts (the key to reading error messages)

Most "strange problems" come from one of the three things below. Spend a minute understanding them and troubleshooting becomes much easier.

### 4.1 Runtime / system image

ApkStart does not emulate an "empty Android". It loads a **complete Android 14 system image** as the base.
Since 0.6.3 there is only **one universal image** (Google Play x86_64), and both x86 and ARM apps run on it. The old split into an "AOSP image / compatibility image" no longer exists.

- A missing or corrupt image, or one that is incompatible with old user data → boot failure, stuck at boot, repeated restarts.
- User data (`/data`) is a thin differential layer, while the system image is shared by the whole PC.

### 4.2 Hardware acceleration

To run fast, the emulator needs CPU virtualization acceleration. On Windows there are only two ways:

| Method | What it is | Who needs administrator rights | Restart needed after installing? |
|---|---|---|---|
| **WHPX** | The built-in Windows feature "Windows Hypervisor Platform" (HypervisorPlatform) | When turning this feature on | Yes |
| **AEHD** | Google's own kernel driver | When installing the driver | No |

**It also runs without acceleration** (pure software emulation, TCG), but startup takes several minutes and the picture may drop frames. That is "slow", not "failed to start". ApkStart falls back automatically and retries with up to 4 parameter sets in the order "renderer → acceleration method → memory / cold boot".

> Do not treat **VirtualMachinePlatform** (used by WSL2) as the acceleration switch. The emulator needs **HypervisorPlatform**. If you enable only the former, `emulator -accel-check` still reports it as unavailable.

### 4.3 ARM translation layer

Most Chinese Android apps provide only **ARM native libraries** (arm64-v8a / armeabi-v7a), while the system image is **x86_64**, so a "translation layer" is needed to convert ARM instructions for the x86 CPU. The universal image in 0.6.3 includes a newer `ndk_translation` layer, so installing ARM apps usually needs no setup.

- The first time an ARM app is encountered, if the translation components are not yet in place, ApkStart downloads the compatibility image automatically and restarts the runtime to retry (see 6.3).
- The old image (API 30) has compatibility problems with the newer translation layer (for example ByteDance apps trigger `DoBadTrampoline` SIGABRT); the Android 14 image fixes this.

---

## 5. Do this first when something goes wrong: system check and automatic checks

Before reading this guide, let the app check itself. It can fix most problems automatically.

### 5.1 System check · automatic configuration

Where: Settings → Diagnostics & Repair → **Run system check**

- What it checks: whether CPU virtualization (VT-x/SVM) is on, whether Hyper-V / Windows Hypervisor Platform is available, GPU / video memory / drivers, memory, Windows version, `emulator -accel-check`, and the AEHD driver.
- Click **Apply recommended settings** to automatically write the safe options: memory / CPU cores / render resolution / graphics quality / forced software emulation when there is no acceleration, and to save them as a local driver that is applied automatically from then on.
- Results are graded `ok` (fine) / `warn` (works but could be improved) / `bad` (will not run unless handled). Each item has a color and an explanation.

Only two things need to be done by you:
- **BIOS virtualization**: restart into the BIOS → enable Intel VT-x / AMD SVM → Enabled (the app cannot do this for you).
- **Windows features / acceleration driver**: see 6.1.

### 5.2 Automatic checks (auto debug)

Where: Settings → Diagnostics & Repair → "Automatic checks · Smart diagnostics"

In the background, every 10 minutes, it checks the PC and lists problems in categories. Each item can be **fixed in one click** (restart the runtime, clear locks, clear orphan processes, invalidate the snapshot, clean up disk, reset the Android network, and more), and it re-checks automatically after a fix:

| Category | Problems covered |
|---|---|
| Runtime | The real reason the last startup failed, stuck boot, leftover lock files, orphan emulator processes, empty-shell snapshots, no hardware acceleration |
| Device connection | adb not authorized, offline, runtime running but adb cannot see the device |
| Storage | Free disk space, data partition setting not matching the real size, shared folder not writable |
| Settings | Screen orientation policy conflicting with the physical display, automatic fullscreen not taking effect in standalone windows |
| Network / logs | No network on the Android side, download sources unreachable, errors in recent logs |

> Two principles: a failed probe is not treated as a problem (if the state cannot be read it reports "unknown" and never guesses), and the same old problem is not reported repeatedly.

### 5.3 Export a diagnostic report

Where: Settings → Diagnostics & Repair → **Export diagnostic report** (or the button of the same name on the System integration page)

The report is plain text and contains the PC configuration, the automatically selected startup parameters, logs and diagnostic conclusions. Attach it when reporting a problem to speed up troubleshooting a lot.

### 5.4 Built-in user guide and automatic tutorials

Since 0.6.3 this guide is **built into the app**: the "?" button in the main window title bar, and "Open user guide and troubleshooting" under Settings → About, both open it directly. It is searchable and scrollable, and can be printed or saved as PDF. When opened, it jumps to the section related to the current problem.

Automatic checks and repairs also bring tutorials to you:

- When an automatic check finds a problem, the item has a "Guide" button on the right that opens the matching section;
- For hardware acceleration, installation failures, the ARM translation layer, adb authorization, no sound and similar problems, **the matching tutorial opens automatically after an automatic repair fails**, so you do not need to look it up here;
- Each tutorial opens automatically only once per run, so it will not interrupt you repeatedly.

> To open it manually, use the `?` button in the title bar. To stop automatic pop-ups temporarily, turn off notifications in the automatic check settings; you can still open the tutorial from the "Guide" button on the problem item.

---

## 6. Solutions to common problems

### 6.1 "Hardware acceleration is disabled" / very slow startup

**Symptom**: Settings or diagnostics say "No hardware acceleration" or "Hardware acceleration is unavailable"; startup takes several minutes and the picture drops frames.

**First, be clear**: this is usually "slow", not "will not open". ApkStart has already fallen back to software emulation. You only need acceleration if you want smooth performance.

**By edition:**

- **Installer / portable edition**: Settings → Diagnostics & Repair → System check → find "Hardware acceleration is disabled" → click **Fix**. A UAC prompt appears once and WHPX is enabled automatically; if it cannot be enabled (the system does not support it or you clicked No), the AEHD driver is installed instead.
- **Microsoft Store (MSIX) edition**: Store apps **cannot elevate themselves**, so clicking Fix opens the "Turn Windows features on or off" dialog. Do the following:

1. Tick **"Windows Hypervisor Platform" (HypervisorPlatform)**;
2. Confirm, then **restart the PC** once.

You can also run this in **administrator PowerShell**:

```powershell
dism /online /enable-feature /featurename:HypervisorPlatform /all /norestart
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

> Two pitfalls: ① do not enable only VirtualMachinePlatform, which is not the acceleration the emulator needs; ② if VT-x/SVM is off in the BIOS, first enable it as described in 5.1, otherwise turning on the Windows features does nothing.
> If your graphics driver is more than 3 years old, update it from the vendor's website; ApkStart never installs drivers automatically (installing the wrong one is worse). Some older GPUs / integrated graphics need a compatibility patch; see Settings → Diagnostics & Repair → Drivers · Compatibility patches.

---

### 6.2 Installation failed (INSTALL_FAILED_*)

**Symptom**: an error appears when installing an app. The text usually starts with "Installation failed:" and ends with an `INSTALL_*` error code.

ApkStart translates the original English errors into plain language. Use the table below:

| Error code | Meaning | What to do |
|---|---|---|
| `INSTALL_FAILED_NO_MATCHING_ABIS` | The app provides only ARM libraries and the current image has no ARM translation layer | **Usually handled automatically**: ApkStart switches to the compatibility image and retries. See [6.3](#s6-3) |
| `INSTALL_FAILED_OLDER_SDK` | The app requires a newer Android version | The default image is Android 14 (API 34). Choose Android 16 (API 36) under Settings → Performance & Resources → Android version, download the image of about 1.9 GB, then restart the runtime. The two versions keep separate data |
| `INSTALL_PARSE_FAILED_NO_CERTIFICATES` | The APK has no valid signature | The APK is damaged or not an official package; get the installer again |
| `INSTALL_PARSE_FAILED_INCONSISTENT_CERTIFICATES` / `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | The signature differs from the installed version | Uninstall the old version first, then install |
| `INSTALL_FAILED_VERSION_DOWNGRADE` | A newer version is already installed on the device | A downgrade cannot overwrite it; install a newer version or uninstall first |
| `INSTALL_FAILED_INSUFFICIENT_STORAGE` | Not enough disk space for the runtime | Clean up the disk, or move the runtime data folder to a drive with enough space (Settings → Integration & Files → System integration) |
| `INSTALL_FAILED_INVALID_APK` | The APK is damaged or incomplete | The download may not have finished; download it again |
| `INSTALL_FAILED_INVALID_URI` | The APK path contains special characters or Chinese characters | Move the APK to a path with English characters only, then install |
| `INSTALL_FAILED_ALREADY_EXISTS` | An app with the same name but a different signature already exists | Uninstall it first |
| `INSTALL_FAILED_DEPRECATED_SDK_VERSION` | An app targeting a very old Android version | **Handled automatically**: ApkStart retries with the official bypass option |
| `INSTALL_FAILED_TEST_ONLY` | A test-only package | **Handled automatically**: the test-package option is added and it retries |
| `INSTALL_FAILED_MISSING_SHARED_LIBRARY` | A required device feature or vendor library does not exist | The app depends on a specific vendor environment that the emulator cannot provide |
| `INSTALL_FAILED_USER_RESTRICTION` | A system restriction blocks the installation | Restart the runtime and try again |
| `INSTALL_FAILED_CONFLICTING_PROVIDER` | Conflicts with the ContentProvider of an existing app | Uninstall the conflicting app |
| `INSTALL_FAILED_INTERNAL_ERROR` | Internal system error (mostly low space or boot not finished) | Restart the runtime, wait until boot finishes, then try again |

> If the error is a raw English message not listed above, export a diagnostic report as in 5.3 and send it with your feedback.

---

### 6.3 System image has no ARM translation layer / ARM apps will not install or crash

**Symptom**: installation reports `INSTALL_FAILED_NO_MATCHING_ABIS` with text saying the app provides only ARM native libraries and the current system image has no ARM translation layer; or the app installs but crashes immediately on launch, with `DoBadTrampoline`, `libndk_translation`, `UnsatisfiedLinkError` or `...so not found` in the log.

**Why**: 0.6.3 uses **one universal Android 14 image** that supports both x86 and ARM, with the translation layer built in. Older versions required switching images manually; the "Universal compatibility image (managed automatically)" switch is now **only for compatibility with old configurations and normally needs no manual change**.

**What ApkStart does automatically:**

1. If installation reports `NO_MATCHING_ABIS`, it switches to the compatibility image → restarts the runtime → restores the installed apps from the local APK backups → installs again (the log shows "Switching to the compatibility image and restarting the runtime…").
2. If an app crashes on launch and the log clearly points to the ARM translation layer (such as `DoBadTrampoline`), it automatically switches to the Android 14 compatibility image and retries (the log shows "ARM translation layer crash detected, switching the compatibility image automatically…").

**What you need to do:**

- **Be patient**: switching images restarts the runtime. It takes about 40 seconds to 1 minute each time, and you may see a notice window.
- **Confirm the image is in place**: Settings → General & Installation → Runtime & Environment, look at the status of "Universal compatibility image (managed automatically)". If it shows Not downloaded, click "Download compatibility image" (about 1.5 GB), then **restart the runtime** for it to take effect.
- **Still crashing**: a few apps include deeper anti-emulator checks (forcing verification of real sensors, baseband and so on) and cannot run in an emulator. For such apps, a message is shown; this is a limitation, not a fault.

**What if you see a red "Installation failed" but the message says "automatically switching the compatibility image and retrying"?**

This was a display bug in an older version: the image file was on disk, but it was reused with an old runtime that had no translation layer, the switch-and-retry was skipped and failure was reported directly, while the message still said "retrying". **You are not on the latest code. Please upgrade to the latest build of 0.6.4** (the version this guide describes has the fix: before installing, it probes the real translation capability of the current runtime instead of only checking whether the image file exists; `NO_MATCHING_ABIS` always triggers switch + restart + clearing the old snapshot + reinstall; and if it still fails the second time, it tells you honestly instead of claiming it is retrying). After upgrading, install again.

> Tested: a free short-drama app (com.phoenix.read, arm64-v8a-only) installs, enters the recommendations feed and plays video with the Android 14 image plus the newer translation layer. The current runtime reports `ro.product.cpu.abilist` = `x86_64,arm64-v8a`, so the translation layer is active.

---

### 6.4 adb is not authorized (Allow USB debugging)

**Symptom**: diagnostics report "adb is not authorized" or "Android debugging authorization not completed", `adb devices` shows `unauthorized`, and apps never start.

**The right way (in order):**

1. Look for an emulator window showing an **"Allow USB debugging?"** dialog. Go to that window and click **Allow**, and tick **"Always allow from this computer"** so it will not ask again.
2. If the window cannot be clicked or never appears: Settings → General & Installation → **Reset Android data**, then try again (this clears the installed apps; the APK files are kept and are reinstalled automatically; the system itself is not affected).

> ⚠️ **Never delete `%USERPROFILE%\.android\adbkey`.** Testing shows that is the opposite of what you want: Android writes a new public key only when the `adb_keys` file does not exist. If you replace the private key, the old public key stored in the system stays in effect and the two never match, so authorization can never succeed.

**Command-line troubleshooting**: ApkStart's adb server runs on **dedicated port 5044** (completely separate from your own 5037):

```powershell
$env:ANDROID_ADB_SERVER_PORT = 5044
adb devices    # you should see emulator-5554
```

> Do not run `adb connect` manually to port 5555. The Play image shows an "Allow USB debugging" dialog over the app, which looks like the program is broken.

---

### 6.5 Double-clicking the icon does nothing / endless spinner / a window with a rotate button appears

These problems almost always point to the **launch entry or window takeover**. Check in this order.

**① Confirm you are using the new program**

- Look at the start of the log `%APPDATA%\ApkStart\logs\app.log`: it should say `start v0.6.4`. If it shows `v0.5.x`, your desktop / Start menu icon points to an old folder.
- The old version (0.5.x) had no bundled runtime and used the embedded window by default, which gives "very slow + a shell window with a rotate button". Switch to 0.6.4 and point the shortcut to the new `ApkStart.exe`.

**② Have realistic expectations for startup time**

A cold start of about 23–48 seconds and about 50 seconds for a restart after changing orientation are normal. During this time clicking the icon seems to "do nothing", but it is booting in the background. **Do not click repeatedly**: repeated clicks let a second instance take over the emulator, and the cleanup of the first instance when it exits may shut the emulator down as well, causing a failure (0.6.3 added `owner.pid` protection, but the waiting queue can still look like nothing is happening). Click once and wait for it.

**③ Native window takeover failed → fell back to the embedded window with a rotate button**

If the log shows `attach failed` or `emu:0`, the window agent could not find the emulator window and the program fell back to embedded mode (the shell window with a title bar and rotate button that you see).
- This is easy to trigger when starting from a directory junction or a non-standard path; 0.6.3 makes the agent resolve the real path before matching. If it still happens, send the log with your feedback.

**④ Reset Android data (last resort)**

Settings → General & Installation → **Reset Android data** (with a second confirmation). It clears installed apps and data but keeps the system itself; the app list is kept and apps are reinstalled when opened. It applies when a damaged data partition or a `/data` that cannot be mounted causes all kinds of failures to open.

---

### 6.6 Quick reference for other startup problems

ApkStart has already **handled most of these runtime errors automatically**. The table explains what it did and what else you can do. If the automatic handling does not help, export a diagnostic report as in 5.3.

| Diagnostic title | Automatic handling | What else you can do |
|---|---|---|
| Hardware acceleration unavailable | Falls back to software emulation | Enable acceleration as in 6.1 |
| Memory allocation failed | Lowers memory and CPU cores | Close memory-hungry programs |
| Emulator port in use | Switches to a free port automatically | Quit other emulators (Nox / MuMu / BlueStacks) or restart |
| Leftover lock files / "Running multiple emulators with the same AVD" | Clears the AVD lock and retries | Make sure no other emulator is using the same runtime |
| System image missing / damaged / incompatible with old data | Boots again with clean user data | Settings → Runtime: delete the image and download it again |
| Quick-boot snapshot damaged | Discards the old snapshot and cold-boots | It is rebuilt on the next normal exit; or turn snapshots off |
| Runtime components deleted / VC++ runtime missing | — | Add ApkStart to your antivirus allowlist and extract again; install the Microsoft VC++ 2015-2022 runtime |
| Not enough disk space | — | Move the runtime folder to a drive with enough space; turn off snapshots / reduce the data partition |
| Path contains Chinese or special characters | Automatically uses a short path | Move ApkStart to a folder with an English-only path (for example `C:\ApkStart`) |
| CPU lacks an instruction set (AVX/SSE4) | — | Usually only a warning and it still boots; otherwise use a PC that supports VT-x/AVX or an older engine |
| The current runtime does not accept that GPU mode | Re-selects a usable GPU mode for the engine version | — |
| Graphics / unknown error | Retries automatically with several parameter sets | Update the graphics driver; or write a compatibility patch; if it still fails, export a diagnostic report |

**Desktop icon shows ApkStart's icon / a blank icon**: Settings → Integration & Files → System integration → **Rebuild shortcuts** (rewrites the desktop and Start menu shortcuts from the current app list, repairing icons and taskbar identity together). If a shortcut was moved and its path no longer works, rebuild it as well.

---

### 6.7 An app has no sound / sound is very quiet

**Symptom**: video and notification sounds in an Android app are completely silent; or other Windows programs have sound and only apps inside ApkStart do not.

**First, tell them apart**: if the system itself has no sound either, fix Windows audio first. Follow the steps below only if just the apps in ApkStart are silent.

1. **Windows volume and output device**: click the taskbar volume icon and confirm it is not muted and the volume is not 0, and that the output device is the headphones or speakers you are using. Open "Volume mixer" and check whether the ApkStart / Android runtime row is muted separately or set to 0.
2. **In-app volume**: some apps set the media volume to 0 the first time you open them. Turn it up in the app's own settings or with the Android volume keys. Apps such as Bilibili or TikTok may also have turned off autoplay sound inside the app.
3. **ApkStart's sound switch**: Settings → Performance & Resources → **Android audio** must be ticked. Automatic checks inspect this option; if it was turned off, it is reported under Settings → Diagnostics & Repair and a single click on "Fix" turns it back on. **After changing it you must restart the Android runtime once** (the runtime starts with `-no-audio` only when both sound and microphone are off, and a change while running does not produce sound immediately).
4. **Windows Audio service**: press `Win+R`, type `services.msc`, find **Windows Audio**, and confirm the status is "Running" and the startup type is "Automatic". If it was disabled, right-click and start it; the automatic checks in 0.6.3 also detect this and notify you. In administrator PowerShell you can run `net start Audiosrv`.
5. **Bluetooth headphones / multiple output devices**: after switching to Bluetooth headphones, Windows sometimes does not move already-running programs over. Disconnect and reconnect the headphones, or restart the Android runtime once.
6. **Still no sound**: export a diagnostic report under Settings → Diagnostics & Repair → Export diagnostic report and send it with your feedback. The report includes the sound switch and audio service state, which shows whether the cause is configuration, a system service or the app itself.

> When an automatic repair fails, the app opens this section automatically. If you turned off automatic check notifications, you can also get here from the "Guide" button on an automatic check item, or the `?` button in the title bar.

---

### 6.8 Store edition fails to start / 0xC0000135 (DLL load failure)

**Symptom**: after opening an app it spins forever or exits immediately, and the diagnostic report shows exit code `0xC0000135` (decimal `3221225781`). This is mostly seen in the version **installed from the Microsoft Store**.

**First, correct a common misjudgment**: `0xC0000135` only means "some DLL failed to load". It does **not** necessarily mean the VC++ runtime is missing, nor that antivirus deleted files. Behind the same exit code there are three possibilities, so do not keep reinstalling for the first one only:

1. **Path restrictions of the Store (MSIX) edition**: the Store edition is installed in the read-only `C:\Program Files\WindowsApps\...` folder. When the Android runtime starts child processes such as `qemu` from this folder, the child process looks for DLLs by relative path, and container path redirection / environment isolation may interrupt this; when the dependencies cannot be found it exits with `0xC0000135`. This is specific to the Store edition and cannot be fixed by reinstalling VC++.
2. **The VC++ runtime is really missing**: the Android runtime (Qt6 / qemu) depends on Microsoft VC++ 2015-2022 (x64). If Settings → Diagnostics & Repair clearly reports "VC++ runtime (x64) is missing", that is **a measured missing dll file**, and you can click "Fix" to install it in one click.
3. **Antivirus quarantined runtime files**: if dll files in the runtime folder were quarantined or deleted, this code is reported as well. Add ApkStart's install folder and the runtime data folder to the antivirus allowlist, then install again.

**Troubleshoot in order**:

**Step 1 — Check whether VC++ is really missing**: if Settings reports "VC++ runtime (x64) is missing", click its one-click fix. After installing, restart the PC and try again. **Do not** reinstall just because the exit code is `0xC0000135`; first confirm that this item was reported.

**Step 2 — No VC++ report but still failing → most likely the Store edition path issue**: this is currently the most likely cause. Try in order:

- quit ApkStart completely (tray icon → Quit) and open it again;
- check your antivirus "controlled folder access / ransomware protection", add ApkStart to the allowlist and restart;
- if it still fails, use the **portable edition** (`ApkStart-win64-portable` in the GitHub / Gitee Releases), placed in an English-only folder (for example `C:\ApkStart`). The portable edition is not installed under WindowsApps, so it bypasses this restriction directly.

**Step 3 — Getting the exact failing DLL name** (advanced): when reporting a problem, the most valuable thing is to tell the developer exactly which dll is missing. In Event Viewer → Windows Logs → Application, find the `Application Error` for ApkStart / emulator and read the `FaultingModuleName` field; or export a diagnostic report under Settings → Diagnostics & Repair → Export diagnostic report and send it along.

**Step 4 — What if adb also crashes**: if the event log also shows `adb.exe` reporting `0xC0000409`, that is a separate problem (abnormal device connection) and not the direct reason the emulator exited. Handle startup with steps 1–3 first and mention the adb problem separately in your feedback.

> This section opens automatically: when a startup failure or failed repair is judged to be a DLL problem, the app opens straight to it. You can also open it any time from the "Guide" button on an automatic check item or the `?` button in the title bar.

---

### 6.9 An app cannot use the microphone / voice calls and recording fail

**Symptom**: voice messages, calls, recording or voice scanning in an app stop working, with a message like "No microphone / recording device unavailable".

1. **ApkStart's microphone switch**: Settings → Performance & Resources → **Microphone input (recommended)** must be ticked. It is on by default; if it was turned off, the automatic check reports "Microphone input is turned off in settings" under Settings → Diagnostics & Repair, and clicking "Fix" turns it on and restarts the runtime. **After changing it you must restart the Android runtime once** (the switch decides whether the emulator exposes a recording device to Android).
2. **Windows microphone permission**: `Settings → Privacy & security → Microphone`. Confirm that both "Let apps access your microphone" and "Let desktop apps access your microphone" are on. Android runs inside a desktop app, so if this is off the system cannot provide the microphone at all.
3. **Confirm Windows can record**: record a clip with the built-in "Sound Recorder" and confirm the microphone and input device (headset microphone / webcam microphone / standalone microphone) work and are not muted.
4. **Pick the right input device**: if several microphones are plugged in, set the one you want as the default in Windows "Sound settings → Input". The emulator uses the system default input device.
5. **How sound and microphone relate**: the emulator turns off its audio subsystem completely to save CPU only when **both** "Android audio" and "Microphone input" are off; as long as one is on, the other works normally.

> When the microphone is off, the app simply "cannot find a recording device" without an obvious error. The automatic check reports this to you proactively; you can also open this section manually from the `?` button in the title bar.

---

### 6.10 Discrete / integrated GPU rendering (GPU preference)

**Symptom**: the PC clearly has a discrete graphics card, yet the app picture stutters or drops frames; or a laptop runs hot and drains the battery and you want to use the integrated GPU to save power.

ApkStart's Android picture uses `-gpu host` for hardware rendering, which really uses the PC's graphics card. Since 0.6.4 all GPUs (NVIDIA / AMD / Intel) prefer host by default, instead of dropping AMD/Intel to software rendering as old versions did, which meant deliberately giving up the GPU. If host crashes on this PC, it automatically falls back to the software backend and use is not affected.

**Choosing which GPU to use**: when a PC has both a discrete and an integrated GPU, Windows sometimes assigns the emulator to the integrated one. Settings → Performance & Resources → **GPU preference (discrete / integrated)** lets you choose explicitly:

| Option | Suitable for |
|---|---|
| System default (recommended) | Let Windows choose by power and load; the least hassle on most PCs |
| Prefer discrete GPU | Games, video, anything needing a high frame rate; more power and heat |
| Prefer integrated GPU | Light apps, background use, laptop power saving; somewhat weaker performance |

- This works through the Windows "Graphics performance preference" (UserGpuPreferences) for the emulator process, and **only on Windows 10 version 1803 or later**; older systems ignore it automatically and startup is not affected.
- It takes effect the **next time the Android runtime starts**; the settings page shows whether it is currently in effect.
- On older AMD drivers host occasionally crashes: update the graphics driver; if that does not help, enable the built-in AMD integrated GPU swangle example patch under Settings → Diagnostics & Repair → Drivers · Compatibility patches to pin rendering to a more stable backend.

---

## 7. Command-line reference

```
ApkStart.exe                          Open the main window
ApkStart.exe <path\to.apk>            Install an APK
ApkStart.exe --launch <package name>  Launch an app directly (this is what desktop shortcuts use)
```

---

## 8. Data and folder locations

| Purpose | Location |
|---|---|
| Runtime (adb / emulator / image) | Bundled in the package, or `%APPDATA%\apkstart\runtime` (lightweight edition) |
| Extracted system image | `%APPDATA%\apkstart\system-images` |
| AVD / installed apps / snapshots | `%APPDATA%\apkstart\avd` |
| App icons | `%APPDATA%\apkstart\icons\<package name>.ico` |
| Settings and app list | `%APPDATA%\ApkStart\settings.json` / `apps.json` |
| Run logs / diagnostic reports | `%APPDATA%\ApkStart\logs\` |
| Windows ↔ Android shared folder | `%USERPROFILE%\ApkStartShared` ↔ `/sdcard/ApkStartShared` |

> "Reset Android data" clears only the user-data layer; the system image and APK files are kept. Updating the app does not lose the runtime, installed apps or snapshots.
>
> Keep plenty of free space on drive C: the extracted image, data partition and snapshots together can take several GB. Low space causes installation and boot failures.

---

## 9. Getting help and giving feedback

When reporting a problem, please attach these three things to speed up troubleshooting a lot:

1. **Diagnostic report**: Settings → Diagnostics & Repair → Export diagnostic report;
2. **The last 20 lines of app.log**: `%APPDATA%\ApkStart\logs\app.log`;
3. **Your version and edition**: for example "Store edition 0.6.4" or "Full portable edition 0.6.4".

- GitHub: <https://github.com/RoutineMiku/apkstart> (Issues / Releases)
- Gitee: <https://gitee.com/daily-miku/apkstart>

---

This guide corresponds to v0.6.4 and is updated with releases. If the interface text differs slightly from what is written here, the text actually shown in the app takes precedence.
