const Electron = require("electron");
const ElectronStateKeeper = require("electron-window-state");
let MainWindow;

Electron.app.on("ready", () => {
    let ElectronStateKeep = ElectronStateKeeper({});
    MainWindow = new Electron.BrowserWindow({
        show: false,
        width: ElectronStateKeep.width,
        height: ElectronStateKeep.height,
        x: ElectronStateKeep.x,
        y: ElectronStateKeep.y,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegrationInWorker: true,
        },
    });
    MainWindow.on("closed", () => {
        MainWindow = null;
        Electron.app.quit();
    });

    MainWindow.maximize();
    MainWindow.loadFile("App/index.html").then(() => {

    });
    MainWindow.show();
});