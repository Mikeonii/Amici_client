"use strict";

import { app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
import { exec } from "child_process";

const isDevelopment = process.env.NODE_ENV !== "production";
let artisan; // keep Laravel process reference

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html");
    // Or load Laravel directly if you prefer:
    // win.loadURL("http://127.0.0.1:8000");
  }
}

function startLaravel() {
  // 👉 Use process.resourcesPath when packaged, __dirname during dev
  const basePath = process.resourcesPath;

  // Laravel root and PHP path inside resources/
  const laravelRoot = path.join(basePath, "amici_server");
  const phpPath = path.join(basePath, "php", "php.exe");

  artisan = exec(`${phpPath} artisan serve --host=127.0.0.1 --port=8000`, {
    cwd: laravelRoot,
  });

  artisan.stdout.on("data", (data) => {
    console.log(`[Laravel] ${data}`);
  });

  artisan.stderr.on("data", (data) => {
    console.error(`[Laravel ERROR] ${data}`);
  });

  artisan.on("close", (code) => {
    console.log(`[Laravel] process exited with code ${code}`);
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }

  startLaravel(); // 👈 start backend first
  createWindow();
});

// Kill Laravel when Electron quits
app.on("before-quit", () => {
  if (artisan) artisan.kill();
});

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
