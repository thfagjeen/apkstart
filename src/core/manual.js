'use strict';
/**
 * 内置手册的「故障 → 教程章节」映射（纯函数，不依赖 electron / fs）
 *
 * 0.6.2：手册随应用分发（src/ui/manual.html）。主进程打开手册时只接受
 * 这里给出的锚点，避免渲染层把任意 file:// 路径传进来。
 *
 * 同一个故障可能有多个入口：自动检测的问题 code、安装失败的原始报错、
 * 用户手点的「教程」按钮。三路都汇到 resolve()，保证落到同一节。
 */

/** 章节 id 与 src/ui/manual.html 的锚点一一对应（由 docs/build-manual-html.py 生成） */
const TOPICS = Object.freeze({
  overview: { id: 'overview', anchor: 'apkstart-产品使用手册与问题解决方案', title: '使用手册 · 目录' },
  accel: { id: 'accel', anchor: '6-1-提示-未启用硬件加速-开机很慢', title: '未启用硬件加速 / 开机很慢' },
  install: { id: 'install', anchor: '6-2-安装失败-install_failed_', title: '安装失败（INSTALL_FAILED_*）' },
  arm: { id: 'arm', anchor: '6-3-系统镜像没有-arm-转译层-arm-应用装不上或闪退', title: 'ARM 转译层 / ARM 应用装不上' },
  adb: { id: 'adb', anchor: '6-4-adb-未授权-允许-usb-调试', title: 'adb 未授权（允许 USB 调试）' },
  startup: { id: 'startup', anchor: '6-5-双击图标没反应-一直转圈-出现带旋转按钮的窗口', title: '打不开 / 带旋转按钮的窗口' },
  other: { id: 'other', anchor: '6-6-其它启动类问题速查表', title: '其它启动类问题速查表' },
  sound: { id: 'sound', anchor: '6-7-应用没有声音-声音很小', title: '应用没有声音 / 声音很小' },
  dll: { id: 'dll', anchor: '6-8-商店版启动失败-0xc0000135-dll-加载失败', title: '商店版启动失败 / 0xC0000135（DLL 加载失败）' },
  mic: { id: 'mic', anchor: '6-9-应用用不到麦克风-无法语音通话录音', title: '应用用不到麦克风 / 无法语音通话录音' },
  gpu: { id: 'gpu', anchor: '6-10-独显-核显渲染-显卡偏好', title: '独显 / 核显渲染（显卡偏好）' },
  diagnose: { id: 'diagnose', anchor: '5-4-内置使用手册与自动教程', title: '内置手册与自动教程' },
  settings: { id: 'settings', anchor: '3-6-设置页导航', title: '设置页导航' },
  storage: { id: 'storage', anchor: '8-数据与目录说明', title: '数据与目录说明' },
  network: { id: 'network', anchor: '5-2-自动检测-自动-debug', title: '自动检测与网络修复' },
});

// 反模拟 / 安全校验导致的启动退出也归到 6.3：该章节末尾已说明这类应用属于限制。
const ARM_RE = /NO_MATCHING_ABIS|DoBadTrampoline|libndk_translation|UnsatisfiedLinkError|arm64-v8a|armeabi-v7a|ARM 翻译层|ARM 转译层|反模拟|反仿真|反调试|anti[-_ ]?emulat|emulator.?detect|safetynet|play.?integrity/i;
const ADB_RE = /ADB_UNAUTHORIZED|unauthorized|允许 USB 调试|调试授权/i;
const SOUND_RE = /audio|AUDIO|sound|声音|音量|静音|Audiosrv/i;
// 0xC0000135 / DLL 加载失败： Decimal 3221225781 也要认，诊断里两种写法都出现
const DLL_RE = /0x0?c0000135|3221225781|STATUS_DLL_NOT_FOUND|DLL 加载失败|依赖 DLL|missing DLL|MSVCP140|VCRUNTIME|FaultingModuleName/i;

/** 自动检测的问题 code → 章节 id */
const ISSUE_MAP = Object.freeze({
  'accel.softwareEmulation': 'accel',
  'device.unauthorized': 'adb',
  'device.offline': 'adb',
  'device.missing': 'adb',
  'settings.orientationConflict': 'startup',
  'settings.detachedFullscreen': 'startup',
  'settings.snapshotOffLowDisk': 'storage',
  'storage.sharedBroken': 'storage',
  'settings.audioDisabled': 'sound',
  'audio.disabled': 'sound',
  'audio.windowsServiceStopped': 'sound',
  'audio.microphoneDisabled': 'mic',
  'storage.diskCritical': 'storage',
  'storage.diskLow': 'storage',
  'storage.dataNeedsReset': 'storage',
  'storage.dataMismatch': 'storage',
  'network.guestDown': 'network',
  'network.sourcesDown': 'network',
  'runtime.staleLocks': 'startup',
  'runtime.orphanProcesses': 'startup',
  'runtime.staleSnapshot': 'startup',
  'runtime.stuckBoot': 'startup',
  // 诊断分类里 0xC0000135 归在 code='DLL'；缺 VC++ 实测项归 vcRedist
  DLL: 'dll',
  vcRedist: 'dll',
});

/** 兜底：用标题/详情里的关键字再判一次，覆盖 doctor:selfCheck 的旧 code */
function topicByText(text) {
  const s = String(text || '');
  if (ARM_RE.test(s)) return 'arm';
  if (ADB_RE.test(s)) return 'adb';
  if (SOUND_RE.test(s)) return 'sound';
  if (DLL_RE.test(s)) return 'dll';
  if (/INSTALL_FAILED|INSTALL_PARSE|签名|安装包|APK 损坏/i.test(s)) return 'install';
  if (/硬件加速|虚拟机监控程序|WHPX|AEHD|hypervisor|accel/i.test(s)) return 'accel';
  if (/attach failed|emu:0|旋转|嵌入|打不开|没反应|图标/i.test(s)) return 'startup';
  if (/磁盘|空间|disk|共享目录|数据分区/i.test(s)) return 'storage';
  if (/网络|联网|DNS|下载源/i.test(s)) return 'network';
  return 'overview';
}

/** 自动检测问题 → 教程章节 */
function topicForIssue(issue) {
  if (!issue) return TOPICS.overview;
  const code = String(issue.code || '');
  let id = ISSUE_MAP[code];
  // 启动失败要看真实原因：ARM 翻译层崩溃有专属章节，不能一律甩给「打不开」
  if (!id || code === 'runtime.bootFailed' || code === 'logs.errors') {
    id = topicByText(`${issue.title || ''} ${issue.detail || ''}`);
    if (id === 'overview' && code === 'runtime.bootFailed') id = 'startup';
    if (id === 'overview' && code === 'logs.errors') id = 'other';
  }
  return TOPICS[id] || TOPICS.overview;
}

/** 安装/运行原始报错 → 教程章节 */
function topicForError(text) {
  const s = String(text || '');
  if (!s.trim()) return TOPICS.overview;
  if (ARM_RE.test(s)) return TOPICS.arm;
  if (ADB_RE.test(s)) return TOPICS.adb;
  if (SOUND_RE.test(s)) return TOPICS.sound;
  if (DLL_RE.test(s)) return TOPICS.dll;
  if (/INSTALL_|PARSE_FAILED|安装失败|签名|安装包/.test(s)) return TOPICS.install;
  if (/attach failed|emu:0|device not found|旋转窗口/.test(s)) return TOPICS.startup;
  return topicByText(s) === 'overview' ? TOPICS.install : TOPICS[topicByText(s)];
}

/**
 * 统一入口：渲染层只传它手里有的东西（code / error / topic），
 * 主进程永远拿回一个受信任的章节锚点。
 */
function resolve(payload) {
  const p = typeof payload === 'string' ? { error: payload } : (payload || {});
  let topic = TOPICS.overview;
  if (p.topic && TOPICS[p.topic]) topic = TOPICS[p.topic];
  else if (p.issue || p.code) {
    const issue = typeof p.issue === 'string'
      ? { code: p.issue, title: p.title, detail: p.detail }
      : (p.issue || { code: p.code, title: p.title, detail: p.detail });
    topic = topicForIssue(issue);
  } else if (p.error || p.message || p.text) topic = topicForError(p.error || p.message || p.text);
  return {
    id: topic.id,
    anchor: topic.anchor,
    title: topic.title,
    reason: String(p.reason || ''),
  };
}

/**
 * 多语言手册：docs/USER-MANUAL.{en,th}.md 由 docs/build-manual-html.py 生成 src/ui/manual.{en,th}.html。
 * 译文的章节锚点不用标题文字，而是按章节号生成（6.1 → s6-1，8 → s8，总标题 → overview），
 * 所以这里只需要「主题 → 章节号」一张表，不依赖译文怎么写标题。
 */
const SECTIONS = Object.freeze({
  overview: '', accel: '6-1', install: '6-2', arm: '6-3', adb: '6-4', startup: '6-5', other: '6-6',
  sound: '6-7', dll: '6-8', mic: '6-9', gpu: '6-10', diagnose: '5-4', settings: '3-6', storage: '8', network: '5-2',
});

const TITLES = Object.freeze({
  en: {
    overview: 'Contents', accel: 'Hardware acceleration disabled / slow startup', install: 'Installation failed (INSTALL_FAILED_*)',
    arm: 'ARM translation layer / ARM apps will not install', adb: 'adb not authorized (Allow USB debugging)',
    startup: 'Icon does nothing / window with a rotate button', other: 'Other startup problems', sound: 'No sound / sound is quiet',
    dll: 'Store edition fails to start / 0xC0000135', mic: 'Microphone unavailable / recording fails', gpu: 'Discrete / integrated GPU (GPU preference)',
    diagnose: 'Built-in guide and automatic tutorials', settings: 'Settings navigation', storage: 'Data and folder locations',
    network: 'Automatic checks and network repair',
  },
  th: {
    overview: 'สารบัญ', accel: 'ยังไม่ได้เปิดการเร่งความเร็วด้วยฮาร์ดแวร์ / เปิดเครื่องช้า', install: 'ติดตั้งไม่สำเร็จ (INSTALL_FAILED_*)',
    arm: 'เลเยอร์แปล ARM / แอป ARM ติดตั้งไม่ได้', adb: 'adb ยังไม่ได้รับอนุญาต (อนุญาตการดีบักผ่าน USB)',
    startup: 'ดับเบิลคลิกไอคอนแล้วไม่ตอบสนอง / หน้าต่างที่มีปุ่มหมุน', other: 'ปัญหาการเริ่มต้นอื่นๆ', sound: 'แอปไม่มีเสียง / เสียงเบา',
    dll: 'รุ่น Store เริ่มไม่ขึ้น / 0xC0000135', mic: 'ใช้ไมโครโฟนไม่ได้ / บันทึกเสียงไม่ได้', gpu: 'การ์ดจอแยก / ออนบอร์ด (การ์ดจอที่ใช้)',
    diagnose: 'คู่มือในตัวและบทช่วยสอนอัตโนมัติ', settings: 'การนำทางในหน้าตั้งค่า', storage: 'คำอธิบายข้อมูลและโฟลเดอร์',
    network: 'ตรวจสอบอัตโนมัติและซ่อมแซมเครือข่าย',
  },
});

/**
 * 按界面语言挑手册文件与锚点（纯函数）。中文用原来的 manual.html + 中文锚点；
 * 泰语用 manual.th.html；其它语言一律用英文版。文件名和锚点都来自这里的白名单，渲染层传不进来。
 */
function localize(topic, language) {
  const t = topic && TOPICS[topic.id] ? TOPICS[topic.id] : TOPICS.overview;
  if (language === 'zh-CN') {
    return { lang: 'zh-CN', file: 'manual.html', anchor: t.anchor, title: t.title, windowTitle: `ApkStart 使用手册 · ${t.title}` };
  }
  const lang = language === 'th' ? 'th' : 'en';
  const section = SECTIONS[t.id];
  const title = TITLES[lang][t.id];
  const prefix = lang === 'th' ? 'คู่มือ ApkStart' : 'ApkStart User Guide';
  return {
    lang,
    file: `manual.${lang}.html`,
    anchor: section ? `s${section}` : '',
    title,
    windowTitle: `${prefix} · ${title}`,
  };
}

module.exports = { TOPICS, SECTIONS, TITLES, ISSUE_MAP, topicForIssue, topicForError, topicByText, resolve, localize };
