const ElectronFind = require("electron");
let inputFind = document.querySelector("#inputFind");

inputFind.addEventListener("keyup", () => {
    ElectronFind.ipcRenderer.send("Find", inputFind.value);
});