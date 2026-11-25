# WORKLOG — บันทึกสถานะงาน (fork ภาษาไทย/อังกฤษของ ApkStart)

อัปเดตล่าสุด: 2026-11-25
อ่านไฟล์นี้ก่อนเริ่มงานทุกครั้ง และอัปเดตก่อนจบงาน อย่าทำซ้ำสิ่งที่ลงไว้ว่าเสร็จแล้ว

## ภาพรวม

fork ของ [`RoutineMiku/apkstart`](https://github.com/RoutineMiku/apkstart) (ตัวเปิดแอป Android บน Windows, Electron + QEMU, MIT)
เป้าหมายของ fork: ทำให้ใช้งานได้โดยไม่ต้องอ่านภาษาจีน — อังกฤษครบทั้งแอป และเพิ่มภาษาไทย

| รายการ | ค่า |
|---|---|
| Fork (origin) | https://github.com/thfagjeen/apkstart (สาธารณะ) |
| ต้นฉบับ (upstream) | https://github.com/RoutineMiku/apkstart |
| โฟลเดอร์ทำงานในเครื่อง | `C:\_Project_ProgramWindows\apkstart` |
| branch หลัก | `main` |
| ฐานเวอร์ชัน (ต้นฉบับ) | v0.6.4 |
| เวอร์ชันของ fork | 0.6.4.1 (เลขต้นฉบับ + ลำดับรุ่นของ fork; รุ่นถัดไป 0.6.4.2 …; รวมต้นฉบับ 0.6.5 แล้วใช้ 0.6.5.1) |
| สัญญาอนุญาต | MIT (ต้องเก็บ `LICENSE` และประกาศลิขสิทธิ์เดิมไว้) |
| ตัวตน git ใน repo นี้ | ชื่อ `thfagjeen` อีเมล noreply ของ GitHub (ตั้งเฉพาะ repo ไม่ใช่ global) |

## ทำเสร็จแล้ว

- [x] fork จากต้นฉบับ และ clone มาที่โฟลเดอร์ข้างต้น (เพิ่ม remote `upstream`)
- [x] รวม PR #142 (ระบบหลายภาษา + อังกฤษ) เข้า `main` ของ fork
- [x] แปลข้อความจีนที่เหลือเป็นอังกฤษ ทั้งหน้าตั้งค่า toast คำอธิบาย และรูปแบบประโยคที่มีตัวเลขแทรก
- [x] แปลกล่องยืนยันแบบ native ของ Windows (`confirmLocalized` + แก้ `app:confirm` + `runtime:cleanup`)
- [x] แก้ tooltip ของไอคอนถาดระบบให้ตามภาษา
- [x] แก้ข้อความ "Newserious" (แท็ก `<b>` แบ่งประโยค)
- [x] เพิ่มภาษาไทย 902 ข้อความ + 159 วลีย่อย + รูปแบบประโยคไทย + ตัวอย่างไดรเวอร์ในตัวภาษาไทย
- [x] เพิ่ม `README.th.md`, `build-exe.bat`, `CHANGELOG.md`, `WORKLOG.md`
- [x] เลือกเวอร์ชัน Android 14 / 16 (AVD แยกต่อเวอร์ชัน, อิมเมจ Android 16 ดาวน์โหลดแล้วบนเครื่องนี้, ทดสอบบูตจริงและติดตั้ง Bill-Reminder v2.2 ผ่าน) — ดูหัวข้อ "หลายเวอร์ชัน Android" ด้านล่าง
- [x] เมนูถาดระบบ กล่องอัปเดต/ยืนยัน และการแจ้งเตือนใน `main.js` เป็นภาษาไทย
- [x] คู่มือในตัวภาษาอังกฤษและไทย: `docs/USER-MANUAL.{en,th}.md` → `src/ui/manual.{en,th}.html` แอปเลือกไฟล์ตามภาษา (จีน → `manual.html`, ไทย → `manual.th.html`, อื่นๆ → `manual.en.html`) ทดสอบด้วย `test/manual-test.js` (26 รายการ) และเรนเดอร์จริงด้วย Electron (ไทยกระโดดไป 6.1, อังกฤษไป 6.4 ถูกต้อง)
- [x] ตรวจ build: `build-exe.bat` (โหมด portable) สร้าง `dist\ApkStart-win64-portable\ApkStart.exe` สำเร็จ ขนาดรวมประมาณ 228 MB และมีภาษาไทยอยู่ในแพ็กเกจ

ประวัติ commit ที่ push แล้ว: `bced21e` (รวม PR #142) → `cd2d5b8` (แปลที่เหลือ) → `33b1db7` (สถานะรันไทม์/กล่องยืนยัน) → `3dc7b91` (กล่องยืนยันใน main.js)
งานภาษาไทย / README.th / bat / เอกสารนี้ **ยังไม่ได้ commit** ณ เวลาที่เขียน (ดู `git status`)

## ค้างอยู่ / ยังไม่ได้ตรวจ

- [ ] commit และ push งานภาษาไทย, `README.th.md`, `build-exe.bat`, `CHANGELOG.md`, `WORKLOG.md` ขึ้น fork
- [ ] เปิดแอปเลือกภาษาไทยแล้วดูด้วยตาทุกหน้า (ตรวจแค่ผ่านสคริปต์) โดยเฉพาะข้อความที่โผล่ตอนใช้งานจริง
- [ ] ให้เจ้าของภาษาไทยตรวจคำแปล (แปลโดย AI) ศัพท์ที่อาจอยากปรับ: รันไทม์, อิมเมจ, สแนปช็อต, เครื่องเสมือน
- [ ] ข้อความอื่นใน `main.js` / `src/core/*.js` นอกเหนือจากที่แปลไปแล้ว (เมนูถาดระบบ กล่องอัปเดต/ยืนยัน การแจ้งเตือน) ยังไม่ได้ไล่ตรวจเมื่อเลือกไทย
- [ ] Android 16: ยังไม่ได้ทดสอบแอป ARM-only จริงบนอิมเมจ API 36 (มี `arm64-v8a` ใน abilist แต่ยังไม่ได้ลองรันแอป) และยังไม่ได้ลองสลับ 14 ↔ 16 ผ่านปุ่มในหน้าตั้งค่าด้วยมือ (ทดสอบผ่านสคริปต์ + เทสต์อัตโนมัติ)
- [ ] ภาษาอื่นนอกจากอังกฤษ/ไทย ยังมีคำแปลเฉพาะชุดหลักราว 90 รายการ ที่เหลือตกเป็นอังกฤษ
- [ ] แปลเอกสารอื่นใน `docs/` (`ARCHITECTURE.md`, `drivers.md`, `preflight.md` ฯลฯ) ส่วนคู่มือในตัวแปลเสร็จแล้ว
- [ ] ข้อความที่สร้างจาก `src/core/*.js` และ `src/main.js` แล้วส่งมาแสดงเป็นจีนตรงๆ ยังไม่ได้ไล่ตรวจทั้งหมด: แปลแล้วเฉพาะข้อผิดพลาดการติดตั้ง/เปิดแอปใน `adb.js` (`friendlyInstallError`, `friendlyLaunchError`) ที่เหลือ (เช่น ข้อความขั้นตอนใน `installer.js`, `updater.js`, `engine.js`, `provision.js`) ควรไล่ตรวจด้วยวิธี "ป้อนข้อความจริงเข้า `localizedText`" แบบเดียวกัน
- [ ] **ยังไม่เคยออกรีลีสที่ fork**: ตัวอัปเดตชี้มาที่ fork แล้ว (ดูหัวข้อ "ตัวอัปเดต" ด้านล่าง) แต่ fork ยังไม่มีรีลีสเลย จึงขึ้น "เป็นเวอร์ชันล่าสุดแล้ว" ตลอด ถ้าจะแจกเวอร์ชันอัปเดตให้ตัวเอง ต้องออกรีลีสที่ fork ตามขั้นตอนด้านล่าง (การสร้างรีลีสเป็นการเผยแพร่สู่สาธารณะ ต้องขออนุญาตผู้ใช้ก่อนทุกครั้ง)
- [ ] ยังไม่ได้เปิดคู่มือจากในแอปจริง (ปุ่ม `?` / ปุ่ม "คู่มือ") ตรวจผ่านเทสต์และการเรนเดอร์ไฟล์ HTML โดยตรงเท่านั้น
- [ ] ฉบับจีน `docs/USER-MANUAL.md` มีลิงก์ภายในเสียอยู่ 13 ลิงก์ตั้งแต่ต้นฉบับ (ไม่ได้แก้)
- [ ] ยังไม่ได้ทดลอง `build-exe.bat full` และ `setup` (ต้องมี `build/runtime` ประมาณ 1.4 GB จาก `npm run runtime`)
- [ ] ยังไม่ได้ลองรันตัวที่ build ออกมา (รุ่น packaged จะเขียนรายการเปิดพร้อม Windows ลงรีจิสทรี จึงยังไม่ได้เปิด)
- [ ] ตัดสินใจเรื่องการเปิด PR กลับไปต้นฉบับ (ภาษาไทย/อังกฤษ) หรือเก็บไว้เป็น fork ส่วนตัว

## ข้อห้าม / ข้อควรระวัง

- **อย่าแก้ `README.md` ต้นฉบับ**: ใช้ `README.th.md` แยก เพื่อไม่ชนตอน `git merge upstream/main`
- **อย่า commit** `dist/`, `node_modules/`, `test/out/`, ไฟล์ชั่วคราว (`.gitignore` กันไว้แล้ว ตรวจ `git status` ก่อน commit ทุกครั้ง)
- **อย่าลบข้อความลิขสิทธิ์และ `LICENSE`** (เงื่อนไขของ MIT)
- **อย่าเปิดแอปแบบ packaged** (`dist\...\ApkStart.exe`) เล่นๆ: จะเขียนรายการเปิดพร้อม Windows ลงรีจิสทรี (`applyAutoStart` ทำงานเฉพาะตอน `app.isPackaged`) ทดสอบด้วย `npm start` แทน
- ล้างตัวแปร `ELECTRON_RUN_AS_NODE` และ `NODE_OPTIONS` ก่อน build/ทดสอบ (`build-exe.bat` ล้างให้แล้ว) ไม่เช่นนั้น electron.exe จะรันเป็น node หรือ `pack.js` ถูกบล็อก
- อย่า `git push --force` ไปที่ `main` ของ fork และ **อย่า push ไปต้นฉบับ** (ไม่มีสิทธิ์ และไม่ใช่เป้าหมาย)
- ห้ามใส่ความลับ/โทเค็น (เช่นโทเค็น Gitee ในการตั้งค่า) ลงในไฟล์ใดๆ ของ repo

## ขั้นตอนที่ใช้ได้ผล

### ติดตั้งและรัน
```powershell
cd C:\_Project_ProgramWindows\apkstart
npm ci --no-audit --no-fund      # ติดตั้ง dependency (มี package-lock.json)
npm start                        # เปิดแอปจากซอร์ส (ไม่เขียนรีจิสทรี)
```

### ทดสอบ
```powershell
npm run test:ui                  # เทสต์หน้าตั้งค่าด้วยหน้าต่าง Electron จริง (ต้องผ่านครบ ตอนนี้ 42 รายการ)
node test/run-tests.js           # เทสต์ Node (12 รายการ)
node test/settings-categories-test.js   # 13 รายการ
node test/manual-test.js         # 22 รายการ
```

### Build exe
```powershell
.\build-exe.bat                  # รุ่นพกพา → dist\ApkStart-win64-portable\ApkStart.exe (ประมาณ 228 MB)
.\build-exe.bat full             # รุ่นพกพาพร้อมรันไทม์ (ต้องมี build\runtime จาก npm run runtime)
.\build-exe.bat setup            # ตัวติดตั้ง Setup.exe (ต้องมี build\runtime ประมาณ 1.4 GB)
```
ตั้ง `NOPAUSE=1` เพื่อข้ามการรอกดปุ่มตอนท้าย

### ซิงก์กับ GitHub
```powershell
git status
git add <ไฟล์ที่เกี่ยวข้อง>      # ระบุไฟล์ อย่า git add . เพราะอาจพา dist/ หรือไฟล์ชั่วคราวไป
git commit -m "ข้อความ"
git push origin main

# ดึงอัปเดตจากต้นฉบับ
git fetch upstream
git merge upstream/main          # ถ้าชนที่ app.js / i18n.js ให้ดูหัวข้อ "ระบบแปลภาษา" ด้านล่าง
```

### ระบบแปลภาษา (ต้องรู้ก่อนแก้)
- ข้อความในแอปเขียนเป็นภาษาจีนในโค้ด/HTML แล้วแปลตอนรันผ่าน `MutationObserver` ใน `src/ui/app.js` (`localizedText`)
- **คีย์ของคำแปลคือข้อความจีนที่ตัดช่องว่างหัวท้ายและยุบช่องว่างซ้ำแล้ว** (`key = source.trim().replace(/\s+/g, ' ')`)
- ลำดับค้นหา: `i18n.translate` (catalog ของภาษานั้น) → [ไทย: `thaiDynamicText`] → `UI_TEXT` (อังกฤษ) → รูปแบบประโยคมีตัวเลข → วลีย่อย (`UI_PHRASES` / `thaiPhrases`) → ถ้ายังมีตัวจีนเหลือจะคืนข้อความจีนเดิม
- ภาษาไทยอยู่ใน `src/ui/i18n.js` (`thaiCatalog` คีย์จีน → ไทย, `thaiPhrases`) ถ้าไม่มีคำแปลไทยจะตกเป็นอังกฤษจาก `UI_TEXT`
- ข้อความที่ประกอบจากหลายท่อนใน JS (`${}`) จะไม่เจอคีย์ ต้องเพิ่มเป็นรูปแบบประโยค (`dynamicPatterns` ฝั่งอังกฤษ, `thaiDynamicText` ฝั่งไทย) หรือวลีย่อย
- กล่องโต้ตอบ native ของ Windows ไม่ผ่าน DOM ต้องแปลก่อนส่ง: ใช้ `confirmLocalized` แทน `api.confirm`
- เพิ่มภาษาใหม่: เพิ่มใน `languages` และ `codes` ของ `i18n.js` เพิ่ม `<option>` ใน `index.html` เพิ่มคำของ `issueWords` ปรับเทสต์ใน `test/settings-ui-test.js` (ตรวจรายการภาษา)

### หลายเวอร์ชัน Android (14 / 16)
- ตั้งค่า `engine.androidApi` = `'34'` (ค่าเริ่มต้น) หรือ `'36'` (`src/core/store.js`) ค่าที่ไม่รู้จักถือเป็น `'34'`
- `provision.js`: ตาราง `PLAY_SYSIMGS`; `selectedApi()` = ค่าที่เลือก, `effectiveApi()` = ค่าที่เลือก **ถ้าอิมเมจดาวน์โหลดแล้ว** ไม่งั้น `'34'` (จำผลไว้ 1.5 วินาที); `paths(api?)` / `playImageInfo(api?)` / `installPlayImage(cb, api)` ใช้เวอร์ชันที่ระบุ (ค่าเริ่มต้นของสองตัวแรก = effective, ตัวหลัง = 34); `env().androidApi` ส่งสถานะให้ UI
- `emulator.js`: ชื่อ AVD ตามเวอร์ชัน — 34 (และอิมเมจเก่ากว่า) = `apkstart` **ห้ามเปลี่ยนชื่อนี้** เพราะเป็นข้อมูลจริงของผู้ใช้เดิม, 35+ = `apkstart<API>` (`avdNameFor`) ใช้ `this.avdName` แทนค่าคงที่เดิม ชื่อ AVD ผูกกับ **อิมเมจที่ใช้จริง** (`imageChoice().api`) ไม่ใช่ค่าที่ตั้งไว้ จึงไม่มีทางไปล้างข้อมูลข้ามเวอร์ชัน
- `layers.js` ต้องไม่ลบ `apkstart*.avd` ทุกชื่อ (regex `^apkstart\d*\.avd# WORKLOG — บันทึกสถานะงาน (fork ภาษาไทย/อังกฤษของ ApkStart)

อัปเดตล่าสุด: 2026-11-25
อ่านไฟล์นี้ก่อนเริ่มงานทุกครั้ง และอัปเดตก่อนจบงาน อย่าทำซ้ำสิ่งที่ลงไว้ว่าเสร็จแล้ว

## ภาพรวม

fork ของ [`RoutineMiku/apkstart`](https://github.com/RoutineMiku/apkstart) (ตัวเปิดแอป Android บน Windows, Electron + QEMU, MIT)
เป้าหมายของ fork: ทำให้ใช้งานได้โดยไม่ต้องอ่านภาษาจีน — อังกฤษครบทั้งแอป และเพิ่มภาษาไทย

| รายการ | ค่า |
|---|---|
| Fork (origin) | https://github.com/thfagjeen/apkstart (สาธารณะ) |
| ต้นฉบับ (upstream) | https://github.com/RoutineMiku/apkstart |
| โฟลเดอร์ทำงานในเครื่อง | `C:\_Project_ProgramWindows\apkstart` |
| branch หลัก | `main` |
| ฐานเวอร์ชัน (ต้นฉบับ) | v0.6.4 |
| เวอร์ชันของ fork | 0.6.4.1 (เลขต้นฉบับ + ลำดับรุ่นของ fork; รุ่นถัดไป 0.6.4.2 …; รวมต้นฉบับ 0.6.5 แล้วใช้ 0.6.5.1) |
| สัญญาอนุญาต | MIT (ต้องเก็บ `LICENSE` และประกาศลิขสิทธิ์เดิมไว้) |
| ตัวตน git ใน repo นี้ | ชื่อ `thfagjeen` อีเมล noreply ของ GitHub (ตั้งเฉพาะ repo ไม่ใช่ global) |

## ทำเสร็จแล้ว

- [x] fork จากต้นฉบับ และ clone มาที่โฟลเดอร์ข้างต้น (เพิ่ม remote `upstream`)
- [x] รวม PR #142 (ระบบหลายภาษา + อังกฤษ) เข้า `main` ของ fork
- [x] แปลข้อความจีนที่เหลือเป็นอังกฤษ ทั้งหน้าตั้งค่า toast คำอธิบาย และรูปแบบประโยคที่มีตัวเลขแทรก
- [x] แปลกล่องยืนยันแบบ native ของ Windows (`confirmLocalized` + แก้ `app:confirm` + `runtime:cleanup`)
- [x] แก้ tooltip ของไอคอนถาดระบบให้ตามภาษา
- [x] แก้ข้อความ "Newserious" (แท็ก `<b>` แบ่งประโยค)
- [x] เพิ่มภาษาไทย 902 ข้อความ + 159 วลีย่อย + รูปแบบประโยคไทย + ตัวอย่างไดรเวอร์ในตัวภาษาไทย
- [x] เพิ่ม `README.th.md`, `build-exe.bat`, `CHANGELOG.md`, `WORKLOG.md`
- [x] เลือกเวอร์ชัน Android 14 / 16 (AVD แยกต่อเวอร์ชัน, อิมเมจ Android 16 ดาวน์โหลดแล้วบนเครื่องนี้, ทดสอบบูตจริงและติดตั้ง Bill-Reminder v2.2 ผ่าน) — ดูหัวข้อ "หลายเวอร์ชัน Android" ด้านล่าง
- [x] เมนูถาดระบบ กล่องอัปเดต/ยืนยัน และการแจ้งเตือนใน `main.js` เป็นภาษาไทย
- [x] คู่มือในตัวภาษาอังกฤษและไทย: `docs/USER-MANUAL.{en,th}.md` → `src/ui/manual.{en,th}.html` แอปเลือกไฟล์ตามภาษา (จีน → `manual.html`, ไทย → `manual.th.html`, อื่นๆ → `manual.en.html`) ทดสอบด้วย `test/manual-test.js` (26 รายการ) และเรนเดอร์จริงด้วย Electron (ไทยกระโดดไป 6.1, อังกฤษไป 6.4 ถูกต้อง)
- [x] ตรวจ build: `build-exe.bat` (โหมด portable) สร้าง `dist\ApkStart-win64-portable\ApkStart.exe` สำเร็จ ขนาดรวมประมาณ 228 MB และมีภาษาไทยอยู่ในแพ็กเกจ

ประวัติ commit ที่ push แล้ว: `bced21e` (รวม PR #142) → `cd2d5b8` (แปลที่เหลือ) → `33b1db7` (สถานะรันไทม์/กล่องยืนยัน) → `3dc7b91` (กล่องยืนยันใน main.js)
งานภาษาไทย / README.th / bat / เอกสารนี้ **ยังไม่ได้ commit** ณ เวลาที่เขียน (ดู `git status`)

## ค้างอยู่ / ยังไม่ได้ตรวจ

- [ ] commit และ push งานภาษาไทย, `README.th.md`, `build-exe.bat`, `CHANGELOG.md`, `WORKLOG.md` ขึ้น fork
- [ ] เปิดแอปเลือกภาษาไทยแล้วดูด้วยตาทุกหน้า (ตรวจแค่ผ่านสคริปต์) โดยเฉพาะข้อความที่โผล่ตอนใช้งานจริง
- [ ] ให้เจ้าของภาษาไทยตรวจคำแปล (แปลโดย AI) ศัพท์ที่อาจอยากปรับ: รันไทม์, อิมเมจ, สแนปช็อต, เครื่องเสมือน
- [ ] ข้อความอื่นใน `main.js` / `src/core/*.js` นอกเหนือจากที่แปลไปแล้ว (เมนูถาดระบบ กล่องอัปเดต/ยืนยัน การแจ้งเตือน) ยังไม่ได้ไล่ตรวจเมื่อเลือกไทย
- [ ] Android 16: ยังไม่ได้ทดสอบแอป ARM-only จริงบนอิมเมจ API 36 (มี `arm64-v8a` ใน abilist แต่ยังไม่ได้ลองรันแอป) และยังไม่ได้ลองสลับ 14 ↔ 16 ผ่านปุ่มในหน้าตั้งค่าด้วยมือ (ทดสอบผ่านสคริปต์ + เทสต์อัตโนมัติ)
- [ ] ภาษาอื่นนอกจากอังกฤษ/ไทย ยังมีคำแปลเฉพาะชุดหลักราว 90 รายการ ที่เหลือตกเป็นอังกฤษ
- [ ] แปลเอกสารอื่นใน `docs/` (`ARCHITECTURE.md`, `drivers.md`, `preflight.md` ฯลฯ) ส่วนคู่มือในตัวแปลเสร็จแล้ว
- [ ] ข้อความที่สร้างจาก `src/core/*.js` และ `src/main.js` แล้วส่งมาแสดงเป็นจีนตรงๆ ยังไม่ได้ไล่ตรวจทั้งหมด: แปลแล้วเฉพาะข้อผิดพลาดการติดตั้ง/เปิดแอปใน `adb.js` (`friendlyInstallError`, `friendlyLaunchError`) ที่เหลือ (เช่น ข้อความขั้นตอนใน `installer.js`, `updater.js`, `engine.js`, `provision.js`) ควรไล่ตรวจด้วยวิธี "ป้อนข้อความจริงเข้า `localizedText`" แบบเดียวกัน
- [ ] **ยังไม่เคยออกรีลีสที่ fork**: ตัวอัปเดตชี้มาที่ fork แล้ว (ดูหัวข้อ "ตัวอัปเดต" ด้านล่าง) แต่ fork ยังไม่มีรีลีสเลย จึงขึ้น "เป็นเวอร์ชันล่าสุดแล้ว" ตลอด ถ้าจะแจกเวอร์ชันอัปเดตให้ตัวเอง ต้องออกรีลีสที่ fork ตามขั้นตอนด้านล่าง (การสร้างรีลีสเป็นการเผยแพร่สู่สาธารณะ ต้องขออนุญาตผู้ใช้ก่อนทุกครั้ง)
- [ ] ยังไม่ได้เปิดคู่มือจากในแอปจริง (ปุ่ม `?` / ปุ่ม "คู่มือ") ตรวจผ่านเทสต์และการเรนเดอร์ไฟล์ HTML โดยตรงเท่านั้น
- [ ] ฉบับจีน `docs/USER-MANUAL.md` มีลิงก์ภายในเสียอยู่ 13 ลิงก์ตั้งแต่ต้นฉบับ (ไม่ได้แก้)
- [ ] ยังไม่ได้ทดลอง `build-exe.bat full` และ `setup` (ต้องมี `build/runtime` ประมาณ 1.4 GB จาก `npm run runtime`)
- [ ] ยังไม่ได้ลองรันตัวที่ build ออกมา (รุ่น packaged จะเขียนรายการเปิดพร้อม Windows ลงรีจิสทรี จึงยังไม่ได้เปิด)
- [ ] ตัดสินใจเรื่องการเปิด PR กลับไปต้นฉบับ (ภาษาไทย/อังกฤษ) หรือเก็บไว้เป็น fork ส่วนตัว

## ข้อห้าม / ข้อควรระวัง

- **อย่าแก้ `README.md` ต้นฉบับ**: ใช้ `README.th.md` แยก เพื่อไม่ชนตอน `git merge upstream/main`
- **อย่า commit** `dist/`, `node_modules/`, `test/out/`, ไฟล์ชั่วคราว (`.gitignore` กันไว้แล้ว ตรวจ `git status` ก่อน commit ทุกครั้ง)
- **อย่าลบข้อความลิขสิทธิ์และ `LICENSE`** (เงื่อนไขของ MIT)
- **อย่าเปิดแอปแบบ packaged** (`dist\...\ApkStart.exe`) เล่นๆ: จะเขียนรายการเปิดพร้อม Windows ลงรีจิสทรี (`applyAutoStart` ทำงานเฉพาะตอน `app.isPackaged`) ทดสอบด้วย `npm start` แทน
- ล้างตัวแปร `ELECTRON_RUN_AS_NODE` และ `NODE_OPTIONS` ก่อน build/ทดสอบ (`build-exe.bat` ล้างให้แล้ว) ไม่เช่นนั้น electron.exe จะรันเป็น node หรือ `pack.js` ถูกบล็อก
- อย่า `git push --force` ไปที่ `main` ของ fork และ **อย่า push ไปต้นฉบับ** (ไม่มีสิทธิ์ และไม่ใช่เป้าหมาย)
- ห้ามใส่ความลับ/โทเค็น (เช่นโทเค็น Gitee ในการตั้งค่า) ลงในไฟล์ใดๆ ของ repo

## ขั้นตอนที่ใช้ได้ผล

### ติดตั้งและรัน
```powershell
cd C:\_Project_ProgramWindows\apkstart
npm ci --no-audit --no-fund      # ติดตั้ง dependency (มี package-lock.json)
npm start                        # เปิดแอปจากซอร์ส (ไม่เขียนรีจิสทรี)
```

### ทดสอบ
```powershell
npm run test:ui                  # เทสต์หน้าตั้งค่าด้วยหน้าต่าง Electron จริง (ต้องผ่านครบ ตอนนี้ 42 รายการ)
node test/run-tests.js           # เทสต์ Node (12 รายการ)
node test/settings-categories-test.js   # 13 รายการ
node test/manual-test.js         # 22 รายการ
```

### Build exe
```powershell
.\build-exe.bat                  # รุ่นพกพา → dist\ApkStart-win64-portable\ApkStart.exe (ประมาณ 228 MB)
.\build-exe.bat full             # รุ่นพกพาพร้อมรันไทม์ (ต้องมี build\runtime จาก npm run runtime)
.\build-exe.bat setup            # ตัวติดตั้ง Setup.exe (ต้องมี build\runtime ประมาณ 1.4 GB)
```
ตั้ง `NOPAUSE=1` เพื่อข้ามการรอกดปุ่มตอนท้าย

### ซิงก์กับ GitHub
```powershell
git status
git add <ไฟล์ที่เกี่ยวข้อง>      # ระบุไฟล์ อย่า git add . เพราะอาจพา dist/ หรือไฟล์ชั่วคราวไป
git commit -m "ข้อความ"
git push origin main

# ดึงอัปเดตจากต้นฉบับ
git fetch upstream
git merge upstream/main          # ถ้าชนที่ app.js / i18n.js ให้ดูหัวข้อ "ระบบแปลภาษา" ด้านล่าง
```

### ระบบแปลภาษา (ต้องรู้ก่อนแก้)
- ข้อความในแอปเขียนเป็นภาษาจีนในโค้ด/HTML แล้วแปลตอนรันผ่าน `MutationObserver` ใน `src/ui/app.js` (`localizedText`)
- **คีย์ของคำแปลคือข้อความจีนที่ตัดช่องว่างหัวท้ายและยุบช่องว่างซ้ำแล้ว** (`key = source.trim().replace(/\s+/g, ' ')`)
- ลำดับค้นหา: `i18n.translate` (catalog ของภาษานั้น) → [ไทย: `thaiDynamicText`] → `UI_TEXT` (อังกฤษ) → รูปแบบประโยคมีตัวเลข → วลีย่อย (`UI_PHRASES` / `thaiPhrases`) → ถ้ายังมีตัวจีนเหลือจะคืนข้อความจีนเดิม
- ภาษาไทยอยู่ใน `src/ui/i18n.js` (`thaiCatalog` คีย์จีน → ไทย, `thaiPhrases`) ถ้าไม่มีคำแปลไทยจะตกเป็นอังกฤษจาก `UI_TEXT`
- ข้อความที่ประกอบจากหลายท่อนใน JS (`${}`) จะไม่เจอคีย์ ต้องเพิ่มเป็นรูปแบบประโยค (`dynamicPatterns` ฝั่งอังกฤษ, `thaiDynamicText` ฝั่งไทย) หรือวลีย่อย
- กล่องโต้ตอบ native ของ Windows ไม่ผ่าน DOM ต้องแปลก่อนส่ง: ใช้ `confirmLocalized` แทน `api.confirm`
- เพิ่มภาษาใหม่: เพิ่มใน `languages` และ `codes` ของ `i18n.js` เพิ่ม `<option>` ใน `index.html` เพิ่มคำของ `issueWords` ปรับเทสต์ใน `test/settings-ui-test.js` (ตรวจรายการภาษา)

) มีเทสต์ใน `test/auto-test.js` กันไว้
- เพิ่มเวอร์ชันใหม่ (เช่น 37): เพิ่มรายการใน `PLAY_SYSIMGS` + `SOURCES.playImgFallbacks` + `<option>` ใน `index.html` + ปรับ `['34', '36']` ใน `main.js` (`provision:installPlayImage`) + ข้อความ/คำแปล
- ทดสอบบูตจริง: **ปิด ApkStart ให้หมดก่อน** (สองอินสแตนซ์ชนกันที่รันไทม์ พอร์ต และตัวล้างโปรเซสกำพร้า อาจฆ่าเซสชันที่ใช้อยู่) แล้วรัน `node tools/e2e-android-version.js --api 36 --apk <apk> --pkg <แพ็กเกจ> --out <โฟลเดอร์>` เครื่องมือตั้ง `androidApi` เฉพาะในโปรเซสนั้น ไม่เขียนทับไฟล์ตั้งค่า
- ผลทดสอบ 2026-11-25 บนเครื่องนี้ (emulator 37.4.1): Android 16 (`system-images;android-36;google_apis_playstore;x86_64` r07) บูตใน 32 วินาที, `sdk=36`, `abilist=x86_64,arm64-v8a`, ติดตั้งและเปิด `com.billsreminder` ได้, ปิดเครื่องแล้วมีสแนปช็อต; ไฟล์ของ `apkstart.avd` (Android 14) ไม่ถูกแก้ระหว่างทดสอบ

### ตัวอัปเดต (ชี้ไปที่ fork)
- ตัวอัปเดตดูเฉพาะ GitHub ของ fork: `OWNER`/`REPO` ใน `src/core/updater.js` และ `new Sources(settings, UPDATE_REPOS)` (`gitee: null` = ไม่ใช้ Gitee) **อย่าเปลี่ยนกลับเป็นต้นฉบับ** ไม่เช่นนั้นการกด "อัปเดตเลย" จะเขียนทับงานของ fork
- `src/core/provision.js` ใช้ `new Sources()` แบบค่าเริ่มต้น = ต้นฉบับ (`RoutineMiku/apkstart` + Gitee) เพราะไฟล์รันไทม์ (`ApkStart-runtime-*.zip`) มีเฉพาะที่ต้นฉบับ อย่าแก้ ไม่เช่นนั้นการติดตั้งครั้งแรกจะหาไฟล์รันไทม์ไม่เจอ
- ตัวอัปเดตเทียบเวอร์ชันจาก `tag_name` ของรีลีสล่าสุดกับ `version` ใน `package.json`
- ขั้นตอนออกรีลีสที่ fork (ทำเมื่อผู้ใช้อนุญาตเท่านั้น):
  1. เพิ่มเลขเวอร์ชันใน `package.json` (เช่น `0.6.4.2`) แล้ว commit (เลข 4 ส่วนเท่านั้น: เทสต์ `auto-test` ตรวจรูปแบบนี้)
  2. `.\build-exe.bat` ได้ `dist\ApkStart-win64-portable\`
  3. `node build/zip.js dist/ApkStart-win64-portable ApkStart-v0.6.4.2-win64-portable.zip` (ชื่อไฟล์ต้องขึ้นต้น `ApkStart` และมีคำว่า `portable` ตัวอัปเดตกรองตามชื่อ)
  4. สร้างรีลีสที่ GitHub ของ fork ด้วย tag `v0.6.4.2` แล้วแนบไฟล์ zip **รุ่นติดตั้ง (`Setup.exe`) สร้างไม่ได้กับเลข 4 ส่วน** เพราะ `electron-builder` ปฏิเสธ (ต้องเป็น semver 3 ส่วน) ถ้าจะแจกรุ่นติดตั้ง ต้องตัดสินใจเรื่องรูปแบบเลขเวอร์ชันใหม่
- เทสต์ `test/engine-test.js` ข้อ "未安装系统时 ensure 返回 needsSetup" ล้มเหลวบนเครื่องนี้ เพราะเครื่องมีรันไทม์ Android ติดตั้งอยู่จริง (ยืนยันแล้วว่าล้มเหลวบนคอมมิตก่อนหน้าด้วย ไม่เกี่ยวกับการแก้ของเรา) ทำให้ `npm test` หยุดที่ข้อนี้ ให้รันชุดที่เหลือแยกกัน (`manual-test`, `incremental-test`, `auto-test`)

### คู่มือในตัว (หลายภาษา)
- แก้เนื้อหาที่ `docs/USER-MANUAL.md` (จีน), `docs/USER-MANUAL.en.md`, `docs/USER-MANUAL.th.md` แล้วสร้าง HTML ใหม่: `python docs/build-manual-html.py` (หรือใส่ `zh` / `en` / `th`) ผลลัพธ์อยู่ที่ `src/ui/manual*.html` (ต้อง commit ด้วย เพราะแอปโหลดจากตรงนั้น)
- ฉบับจีนใช้ anchor จากข้อความหัวข้อ ส่วนฉบับแปลใช้ anchor ตามเลขหัวข้อ (`6.1` → `s6-1`, หัวข้อ `8` → `s8`, ชื่อเรื่อง → `overview`) ดังนั้นต้องมีเลขหัวข้อขึ้นต้นเสมอ และลิงก์ในสารบัญต้องเป็น `(#s6-1)`
- ตัวแปลง markdown ของโปรเจกต์ไม่รองรับรายการซ้อนในรายการ, โค้ดบล็อกที่เยื้อง และโค้ดบล็อกในบล็อกอ้างอิง (`>`) อย่าเขียนแบบนั้นในฉบับแปล ให้ใช้ย่อหน้าและรายการแบบไม่เยื้อง
- ตารางหัวข้อ → เลขหัวข้ออยู่ใน `src/core/manual.js` (`SECTIONS`, `TITLES`) ถ้าเพิ่มหัวข้อ/ย้ายเลขในคู่มือ ต้องแก้ตารางนี้ด้วย เทสต์ `test/manual-test.js` จะเตือนถ้า anchor ไม่ตรง
- ชื่อปุ่ม/เมนูที่อ้างในคู่มือต้องตรงกับที่แสดงในแอปภาษานั้น (ดูคำแปลใน `i18n.js`)

### วิธีหาข้อความที่ยังไม่ได้แปล
1. ทำสำเนาของ `test/settings-ui-test.js` ถึงบรรทัด `const evalJs` เพิ่มโค้ดเปิดหน้าตั้งค่า วนคลิกทุกหมวด (`#setNav .set-nav-item`) แล้วเก็บ text node ที่ยังมีตัวจีน (`/[\u3400-\u9fff]/`)
2. เปลี่ยนภาษาด้วย `applyUiLanguage('th')` และตั้ง `language: 'th'` ใน `SETTINGS` ของเทสต์ (ไม่เช่นนั้นการเปิดหน้าตั้งค่าจะรีเซ็ตกลับเป็นอังกฤษ)
3. เก็บข้อความที่ไม่มีตัวอักษรไทยแต่มีคำอังกฤษ เพื่อหาส่วนที่ตกเป็นอังกฤษ
4. ลบสคริปต์ชั่วคราวทิ้งก่อน commit

### ข้อควรระวังเวลาเขียนไฟล์ด้วยเชลล์
- เชลล์ที่ใช้ทำให้ backslash ใน heredoc หาย (`'C:\\x'` กลายเป็น `'C:\x'` แล้ว JavaScript error) เขียนไฟล์ที่มี regex หรือเส้นทางด้วยเครื่องมือเขียนไฟล์แทน
- ไฟล์ `.bat` ต้องเป็น CRLF (`sed -i 's/$/\r/'`) และไม่ควรมีอักขระที่ไม่ใช่ ASCII
