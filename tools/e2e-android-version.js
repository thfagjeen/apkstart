'use strict';
/**
 * 真实引导指定 Android 版本，并（可选）装一个 APK 验证：
 *
 *   node tools/e2e-android-version.js --api 36 [--apk <路径> --pkg <包名>] [--out <截图目录>]
 *
 * - 只在本进程里临时指定 engine.androidApi，不会写入用户的设置文件。
 * - 该版本的系统镜像必须已经下载好（设置 → 性能与资源 → 安卓版本 → 下载；或
 *   `provisioner.installPlayImage(cb, '36')`），否则会退回 Android 14。
 * - 使用前必须先退出 ApkStart：同一台机器上两个实例会抢同一个运行时 / adb 端口 /
 *   孤儿进程清理，可能把正在用的安卓会话关掉。
 * - 测完会优雅关机（保存快照）。每个 Android 版本用自己的 AVD（apkstart / apkstart36），互不影响。
 */
const fs = require('fs');
const path = require('path');

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : '';
};
const API = arg('api') || '36';
const APK = arg('apk');
const PKG = arg('pkg');
const OUT = arg('out') || process.cwd();

const store = require('../src/core/store');
const realSettings = store.getSettings;
store.getSettings = () => {
  const s = realSettings();
  return { ...s, engine: { ...s.engine, androidApi: API } };
};

const { Runtime } = require('../src/core/engine');

(async () => {
  const t0 = Date.now();
  const mark = (m) => console.log(`[${((Date.now() - t0) / 1000).toFixed(0)}s] ${m}`);
  const rt = new Runtime(path.join(__dirname, '..'));
  const emu = rt.emulator;
  const effective = rt.provisioner.effectiveApi();
  mark(`选择 Android API ${API}，实际使用 ${effective}，AVD=${emu.avdName}`);
  if (effective !== API) { mark('该版本镜像还没下载，已退回默认版本；先下载再测'); process.exit(3); }

  const r = await rt.prewarm({ onLog: mark });
  mark(`开机 ok=${r && r.ok} bootMs=${r && r.bootMs} err=${(r && r.error) || ''}`);
  if (!(r && r.ok)) process.exit(2);

  const c = rt.client();
  const sh = (cmd) => c.shell(cmd, { timeout: 20000 }).then((x) => String(x).trim()).catch((e) => `ERR ${e.message}`);
  mark(`sdk=${await sh('getprop ro.build.version.sdk')} release=${await sh('getprop ro.build.version.release')} `
    + `abilist=${await sh('getprop ro.product.cpu.abilist')} boot=${await sh('getprop sys.boot_completed')}`);

  let failed = false;
  if (APK) {
    try { await c.install(APK); mark('安装 APK：成功'); } catch (e) { failed = true; mark(`安装 APK：失败 ${e.message}`); }
    if (PKG) {
      mark(`pm list: ${await sh(`pm list packages ${PKG}`)}`);
      await sh(`monkey -p ${PKG} -c android.intent.category.LAUNCHER 1`);
      await new Promise((res) => setTimeout(res, 6000));
      try {
        const file = path.join(OUT, `android${API}-${PKG}.png`);
        fs.writeFileSync(file, await c.screenshot());
        mark(`截图：${file}`);
      } catch (e) { mark(`截图失败 ${e.message}`); }
    }
  }

  mark('优雅关机（保存快照）');
  await rt.stop().catch((e) => mark(`stop 出错 ${e.message}`));
  mark(`hasSnapshot=${emu.hasSnapshot()}`);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
