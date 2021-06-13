"use strict";
const ElectronMenusRemote = require("electron").remote;
const MainWindow = ElectronMenusRemote.getCurrentWindow();
const FSInMenus = require("fs");

//////////////////////////////////////////////////// Start Section Variables
let AppInMenu = document.querySelector("#app");
let EditorInMenu = document.querySelector("#editor");
let StatusBarInMenu = document.querySelector("#status_bar");
let FileNameInMenu = document.querySelector("#fileName");
let ModeFileInMenu = document.querySelector("#modeFile");
let LinesColumns = document.querySelector("#lineColumn");
let Terminal = document.querySelector("#terminal");
let ClickClose = document.querySelector("#click_close");
let TerminalClickOpen = document.querySelector(".div_terminal");
let StatusBarTerminal = document.querySelector("#status_bar_terminal");
let WindowGoogle;
let WindowFind;
let AboutWindow;
let stateStatusBar = true;
let stateSave = false;
let stateTerminal = true;
let stateAutoSave = false;
let FilePathSave = "";
let FilePathOpen = "";
//////////////////////////////////////////////////// End Section Variables


//////////////////////////////////////////////////// Start Section Functions
////////////////////////////////// Start Section Set Terminal
TerminalClickOpen.addEventListener("click", () => {
    if (stateTerminal === true) {
        Terminal.style.display = "block";
        StatusBarTerminal.style.display = "flex";
        stateTerminal = false;
    } else if (stateTerminal === false) {
        Terminal.style.display = "none";
        StatusBarTerminal.style.display = "none";
        stateTerminal = true;
    }
});

ClickClose.addEventListener("click", () => {
    if (stateTerminal === true) {
        Terminal.style.display = "block";
        StatusBarTerminal.style.display = "flex";
        stateTerminal = false;
    } else if (stateTerminal === false) {
        Terminal.style.display = "none";
        StatusBarTerminal.style.display = "none";
        stateTerminal = true;
    }
});

Terminal.addEventListener("keyup", () => {
    if (Terminal.value !== null && Terminal.value !== "") {
        Terminal.value = "The terminal is broken";
    }
});
////////////////////////////////// End Section Set Terminal


////////////////////////////////// Start Functions Get Line Number And Get Line Columns
AppInMenu.addEventListener("input", () => {
    GetLineColumnNumber();
});
AppInMenu.addEventListener("keyup", () => {
    GetLineColumnNumber();
});
AppInMenu.addEventListener("mousemove", () => {
    GetLineColumnNumber();
});
const GetLineColumnNumber = () => {
    let Line = EditorInMenu.value.substr(0, EditorInMenu.length).split("\n");
    let CurrentLineNumber = Line.length;
    let CurrentColumnIndex = Line[Line.length - 1].length;
    LinesColumns.innerHTML = `${CurrentLineNumber} : ${CurrentColumnIndex}`;
};
GetLineColumnNumber();
////////////////////////////////// End Functions Get Line Number And Get Line Columns


////////////////////////////////// Start Functions Set Status Bar
const FuncSetStatusBar = () => {
    let FileNameLength = FilePathOpen.split("\\").length - 1;
    let FileName = FilePathOpen.split("\\")[FileNameLength];
    let ModeFile = FileName.split(".")[1];
    FileNameInMenu.innerHTML = FileName.split(".")[0];
    ModeFileInMenu.innerHTML = ModeFile;
};
////////////////////////////////// End Functions Set Status Bar


////////////////////////////////// Start Functions Files
const FuncNewFile = () => {
    MainWindow.title = "Editor - Untitled.txt";
    EditorInMenu.value = "";
    FileNameInMenu.innerHTML = "Untitled";
    ModeFileInMenu.innerHTML = "txt";
    stateSave = false;
};
FuncNewFile();


const FuncOpen = () => {
    ElectronMenusRemote.dialog.showOpenDialog(MainWindow, {}).then((result) => {
        if (result.filePaths) {
            FilePathOpen = result.filePaths[0];
            FSInMenus.readFile(FilePathOpen, {}, (err, data) => {
                EditorInMenu.value = data.toString();
                let FileNameLength = FilePathOpen.split("\\").length - 1;
                let FileName = FilePathOpen.split("\\")[FileNameLength];
                MainWindow.title = `Editor - ${FileName}`;
                FuncSetStatusBar();
            });
        }
    }).catch(() => {

    });
};


const FuncSave = () => {
    if (stateSave === true) {
        FSInMenus.writeFile(FilePathSave, EditorInMenu.value, "utf8", () => {

        });
    } else {
        ElectronMenusRemote.dialog.showSaveDialog(MainWindow, {}).then((result) => {
            if (result.filePath) {
                FilePathSave = result.filePath;
                FSInMenus.writeFile(FilePathSave, EditorInMenu.value, "utf8", () => {
                    stateSave = true;
                });
            } else {
                stateSave = false;
            }
        }).catch((err) => {
            ElectronMenusRemote.dialog.showErrorBox("Error", `${err}`);
        });
    }
};


const FuncSaveAs = () => {
    ElectronMenusRemote.dialog.showSaveDialog(MainWindow, {}).then((result) => {
        if (result.filePath) {
            FilePathSave = result.filePath;
            FSInMenus.writeFile(FilePathSave, EditorInMenu.value, "utf8", () => {

            });
        }
    }).catch((err) => {
        ElectronMenusRemote.dialog.showErrorBox("Error", `${err}`);
    });
};


EditorInMenu.addEventListener("input", () => {
    if (stateAutoSave === true) {
        FuncSave();
    } else if (stateAutoSave === false) {
        return null;
    }
});


const FuncPrint = () => {
    MainWindow.webContents.print({}, () => {

    });
};
////////////////////////////////// End Functions Files


////////////////////////////////// Start Functions Edit
const FuncSearchWithGoogle = () => {
    WindowGoogle = new ElectronMenusRemote.BrowserWindow({
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegrationInWorker: true,
        },
    });
    WindowGoogle.loadURL("https://google.com").then(() => {

    });
    WindowGoogle.maximize();
    WindowGoogle.once("ready-to-show", () => {
        WindowGoogle.show();
    });
};


const FuncFind = () => {
    WindowFind = new ElectronMenusRemote.BrowserWindow({
        width: 300,
        height: 100,
        show: false,
        autoHideMenuBar: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegrationInWorker: true,
        },
    });
    WindowFind.loadFile("App/Menus/Find/index.html").then(() => {

    });
    WindowFind.once("ready-to-show", () => {
        WindowFind.show();
    });

    ElectronMenusRemote.ipcMain.on("Find", (event, args) => {
        if (args !== "" && args !== null && args !== undefined) {
            MainWindow.webContents.findInPage(args);
        } else {
            MainWindow.webContents.findInPage("ΔΓͶͷΈΏΘΪΫέ");
        }
    });
    WindowFind.on("closed", () => {
        MainWindow.webContents.findInPage("ΔΓ Ͷͷ ΈΏ ΘΪΫέ");
    });
};

const FuncTime = () => {
    EditorInMenu.value += `'${new Date()}'`;
};
////////////////////////////////// End Functions Edit


////////////////////////////////// Start Functions Templates
const FuncHTML = () => {
    MainWindow.title = "Editor - index.html";
    EditorInMenu.value =
        `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Title</title>
<link rel="stylesheet" href="">
</head>
<body>

</body>
<script src=""></script>
</html>`;

    FileNameInMenu.innerHTML = "index";
    ModeFileInMenu.innerHTML = "html";
    stateSave = false;
};


const FuncCss = () => {
    MainWindow.title = "Editor - style.css";
    EditorInMenu.value = "";

    FileNameInMenu.innerHTML = "style";
    ModeFileInMenu.innerHTML = "css";
    stateSave = false;
};


const FuncJavaScript = () => {
    MainWindow.title = "Editor - script.js";
    EditorInMenu.value = "";

    FileNameInMenu.innerHTML = "script";
    ModeFileInMenu.innerHTML = "js";
    stateSave = false;
};


const FuncSql = () => {
    MainWindow.title = "Editor - sql.sql";
    EditorInMenu.value = "";

    FileNameInMenu.innerHTML = "sql";
    ModeFileInMenu.innerHTML = "sql";
    stateSave = false;
};


const FuncSass = () => {
    MainWindow.title = "Editor - style.scss";
    EditorInMenu.value = "";

    FileNameInMenu.innerHTML = "style";
    ModeFileInMenu.innerHTML = "scss";
    stateSave = false;
};


const FuncPhp = () => {
    MainWindow.title = "Editor - index.php";
    EditorInMenu.value = "<?php  ?>";

    FileNameInMenu.innerHTML = "index";
    ModeFileInMenu.innerHTML = "php";
    stateSave = false;
};


const FuncPython = () => {
    MainWindow.title = "Editor - main.py";
    EditorInMenu.value = "";

    FileNameInMenu.innerHTML = "main";
    ModeFileInMenu.innerHTML = "py";
    stateSave = false;
};


const FuncCpp = () => {
    MainWindow.title = "Editor - main.cpp";
    EditorInMenu.value =
        `#include <iostream>
using namespace std;

int main()
{

}`;

    FileNameInMenu.innerHTML = "main";
    ModeFileInMenu.innerHTML = "cpp";
    stateSave = false;
};


const FuncCSharp = () => {
    MainWindow.title = "Editor - main.cs";
    EditorInMenu.value =
        `#using System;
namespace HelloWorld;

{
  class Program
  {
    static void Main(string[] args);
    {
      Console.WriteLine("Hello World!");    
    }
  }
}`;

    FileNameInMenu.innerHTML = "main";
    ModeFileInMenu.innerHTML = "cs";
    stateSave = false;
};


const FuncKivy = () => {
    MainWindow.title = "Editor - style.kv";
    EditorInMenu.value = "";

    FileNameInMenu.innerHTML = "style";
    ModeFileInMenu.innerHTML = "ky";
    stateSave = false;
};


const FuncJava = () => {
    MainWindow.title = "Editor - script.jar";
    EditorInMenu.value =
        `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`;

    FileNameInMenu.innerHTML = "script";
    ModeFileInMenu.innerHTML = "jar";
    stateSave = false;
};


const FuncKotlin = () => {
    MainWindow.title = "Editor - script.kt";
    EditorInMenu.value =
        `fun main() {
  println("Hello World")
}`;

    FileNameInMenu.innerHTML = "script";
    ModeFileInMenu.innerHTML = "kt";
    stateSave = false;
};


const FuncXml = () => {
    MainWindow.title = "Editor - index.xml";
    EditorInMenu.value =
        `<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>`;

    FileNameInMenu.innerHTML = "index";
    ModeFileInMenu.innerHTML = "xml";
    stateSave = false;
};


const FuncTypeScript = () => {
    MainWindow.title = "Editor - script.ts";
    EditorInMenu.value = "";

    FileNameInMenu.innerHTML = "script";
    ModeFileInMenu.innerHTML = "ts";
    stateSave = false;
};


const FuncGo = () => {
    MainWindow.title = "Editor - script.go";
    EditorInMenu.value =
        `package main
import "fmt"
func main() {

}`;

    FileNameInMenu.innerHTML = "script";
    ModeFileInMenu.innerHTML = "go";
    stateSave = false;
};
////////////////////////////////// End Functions Templates


////////////////////////////////// Start Functions View
const FuncStatusBar = () => {
    if (stateStatusBar === true) {
        EditorInMenu.style.bottom = "0";
        StatusBarInMenu.style.bottom = "-35px";
        stateStatusBar = false;
    } else {
        EditorInMenu.style.bottom = "0";
        StatusBarInMenu.style.bottom = "0";
        stateStatusBar = true;
    }
};


const FuncSetPositionTerminal = () => {
    if (stateStatusBar === false) {
        Terminal.style.bottom = 0;
        StatusBarTerminal.style.bottom = "200px";
    } else if (stateStatusBar === true) {
        Terminal.style.bottom = "35px";
        StatusBarTerminal.style.bottom = "235px";
    }
}
////////////////////////////////// End Functions View


////////////////////////////////// Start Functions Theme
const FuncDracula = () => {
    EditorInMenu.style.backgroundColor = "#282a36";
    EditorInMenu.style.color = "#fff";
};


const FuncOneDark = () => {
    EditorInMenu.style.backgroundColor = "#282c34";
    EditorInMenu.style.color = "#fff";
};


const FuncNightOwl = () => {
    EditorInMenu.style.backgroundColor = "#d6deeb";
    EditorInMenu.style.color = "#000";
};


const FuncLiviuSchera = () => {
    EditorInMenu.style.backgroundColor = "#565869";
    EditorInMenu.style.color = "#fff";
};


const FuncLightTheme = () => {
    EditorInMenu.style.backgroundColor = "#fff";
    EditorInMenu.style.color = "#000";
};


const FuncDarkBlack = () => {
    EditorInMenu.style.backgroundColor = "#282822";
    EditorInMenu.style.color = "#fff";
};


const FuncAyu = () => {
    EditorInMenu.style.backgroundColor = "#273747";
    EditorInMenu.style.color = "#fff";
};


const FuncPalenight = () => {
    EditorInMenu.style.backgroundColor = "#292d3e";
    EditorInMenu.style.color = "#fff";
};
////////////////////////////////// End Functions Theme


////////////////////////////////// Start Functions Help
const FuncAbout = () => {
    AboutWindow = new ElectronMenusRemote.BrowserWindow({
        show: false,
        width: 500,
        height: 400,
        autoHideMenuBar: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegrationInWorker: true,
        },
    });
    AboutWindow.loadFile("App/Menus/About/index.html").then(() => {

    });
    AboutWindow.once("ready-to-show", () => {
        AboutWindow.show();
    });
};
////////////////////////////////// End Functions Help
//////////////////////////////////////////////////// End Section Functions


//////////////////////////////////////////////////// Start Section Menu File
let MenuFile = new ElectronMenusRemote.MenuItem({
    label: "File",
    submenu: [
        {
            label: "New",
            accelerator: "CmdOrCtrl+N",
            click() {
                FuncNewFile();
            },
        },
        {
            label: "Open...",
            accelerator: "CmdOrCtrl+O",
            click() {
                FuncOpen();
            },
        },
        {
            label: "Save",
            accelerator: "CmdOrCtrl+S",
            click() {
                FuncSave();
            },
        },
        {
            label: "Save As...",
            accelerator: "CmdOrCtrl+shift+S",
            click() {
                FuncSaveAs();
            },
        },
        {
            type: "separator",
        },
        {
            type: "checkbox",
            label: "Auto Save",
            click() {
                if (stateAutoSave === false) {
                    stateAutoSave = true;
                } else if (stateAutoSave === true) {
                    stateAutoSave = false;
                }
            },
        },
        {
            label: "Print...",
            accelerator: "CmdOrCtrl+P",
            click() {
                FuncPrint();
            },
        },
        {
            type: "separator",
        },
        {
            role: "quit",
        },
    ],
});
//////////////////////////////////////////////////// End Section Menu File


//////////////////////////////////////////////////// Start Section Menu Edit
let MenuEdit = new ElectronMenusRemote.MenuItem({
    label: "Edit",
    submenu: [
        {
            role: "undo",
        },
        {
            role: "redo",
        },
        {
            type: "separator",
        },
        {
            role: "cut",
        },
        {
            role: "copy",
        },
        {
            role: "paste",
        },
        {
            role: "delete",
        },
        {
            type: "separator",
        },
        {
            label: "Search With Google",
            accelerator: "CmdOrCtrl+G",
            click() {
                FuncSearchWithGoogle();
            },
        },
        {
            label: "Find...",
            accelerator: "CmdOrCtrl+N",
            click() {
                FuncFind();
            },
        },
        {
            type: "separator",
        },
        {
            role: "selectAll",
        },
        {
            label: "Time/Date",
            accelerator: "F5",
            click() {
                FuncTime();
            },
        },
    ],
});
//////////////////////////////////////////////////// End Section Menu Edit


//////////////////////////////////////////////////// Start Section Menu Templates
let MenuTemplates = new ElectronMenusRemote.MenuItem({
    label: "Templates",
    submenu: [
        {
            label: "HTML",
            click() {
                FuncHTML();
            },
        },
        {
            label: "CSS",
            click() {
                FuncCss();
            },
        },
        {
            label: "JavaScript",
            click() {
                FuncJavaScript();
            },
        },
        {
            label: "Sql",
            click() {
                FuncSql();
            },
        },
        {
            label: "Sass",
            click() {
                FuncSass();
            },
        },
        {
            label: "Php",
            click() {
                FuncPhp();
            },
        },
        {
            label: "Python",
            click() {
                FuncPython();
            },
        },
        {
            label: "C++",
            click() {
                FuncCpp();
            },
        },
        {
            label: "C#",
            click() {
                FuncCSharp();
            },
        },
        {
            label: "Kivy",
            click() {
                FuncKivy();
            },
        },
        {
            label: "Java",
            click() {
                FuncJava();
            },
        },
        {
            label: "Kotlin",
            click() {
                FuncKotlin();
            },
        },
        {
            label: "XML",
            click() {
                FuncXml();
            },
        },
        {
            label: "TypeScript",
            click() {
                FuncTypeScript();
            },
        },
        {
            label: "Go",
            click() {
                FuncGo();
            },
        },
    ],
});
//////////////////////////////////////////////////// End Section Menu Templates


//////////////////////////////////////////////////// Start Section Menu View
let MenuView = new ElectronMenusRemote.MenuItem({
    label: "View",
    submenu: [
        {
            label: "Zoom",
            submenu: [
                {role: "zoomIn",},
                {role: "zoomOut",},
                {role: "resetZoom",},
            ],
        },
        {
            type: "checkbox",
            checked: true,
            label: "Status Bar",
            click() {
                FuncStatusBar();
                FuncSetPositionTerminal();
            },
        },
    ],
});
//////////////////////////////////////////////////// End Section Menu View


//////////////////////////////////////////////////// Start Section Menu Theme
let MenuTheme = new ElectronMenusRemote.MenuItem({
    label: "Theme",
    submenu: [
        {
            label: "Dracula",
            click() {
                FuncDracula();
            },
        },
        {
            label: "One Dark",
            click() {
                FuncOneDark();
            },
        },
        {
            label: "Night Owl",
            click() {
                FuncNightOwl();
            },
        },
        {
            label: "Liviu Schera",
            click() {
                FuncLiviuSchera();
            },
        },
        {
            label: "Light Theme",
            click() {
                FuncLightTheme();
            },
        },
        {
            label: "Dark Black",
            click() {
                FuncDarkBlack();
            },
        },
        {
            label: "Ayu",
            click() {
                FuncAyu();
            },
        },
        {
            label: "Palenight",
            click() {
                FuncPalenight();
            },
        },
    ],
});
//////////////////////////////////////////////////// End Section Menu Theme


//////////////////////////////////////////////////// Start Section Menu Help
let MenuHelp = new ElectronMenusRemote.MenuItem({
    label: "Help",
    submenu: [
        {
            label: "About",
            click() {
                FuncAbout();
            },
        },
        {
            role: "toggleDevTools",
        },
    ],
});
//////////////////////////////////////////////////// End Section Menu Help


//////////////////////////////////////////////////// Start Section Menu useFul
let ContextMenus = ElectronMenusRemote.Menu.buildFromTemplate([
    {
        role: "undo",
    },
    {
        role: "redo",
    },
    {
        type: "separator",
    },
    {
        role: "copy",
    },
    {
        role: "cut",
    },
    {
        role: "paste",
    },
    {
        role: "selectAll",
    },
    {
        type: "separator",
    },
    {
        label: "Open",
        click() {
            FuncOpen();
        },
    },
    {
        label: "Save",
        click() {
            FuncSave();
        },
    },
]);
//////////////////////////////////////////////////// End Section Menu useFul


let Menus = ElectronMenusRemote.Menu.buildFromTemplate([MenuFile, MenuEdit, MenuTemplates, MenuView, MenuTheme, MenuHelp]);
ElectronMenusRemote.Menu.setApplicationMenu(Menus);

window.addEventListener("contextmenu", (event) => {
    ContextMenus.popup({
        x: event.x,
        y: event.y,
        window: MainWindow,
    });
}, false);