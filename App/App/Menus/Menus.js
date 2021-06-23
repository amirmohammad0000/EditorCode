"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const ElectronMenusRemote = require("electron").remote;
    const MainWindow = ElectronMenusRemote.getCurrentWindow();
    const FSInMenus = require("fs");
    const powershell = require("node-powershell");
    const ps = new powershell({
        executionPolicy: "Bypass",
        noProfile: true,
        verbose: true,
        pwsh: true,
    });


    ///////////////////////////////////////////////////////////// Start Section Variables
    let DivEditor = document.querySelector("#editor")
    let StatusBarInMenu = document.querySelector("#status_bar");
    let FileNameInMenu = document.querySelector("#fileName");
    let ModeFileInMenu = document.querySelector("#modeFile");
    let LinesColumns = document.querySelector("#lineColumn");
    let Terminal = document.querySelector("#terminal");
    let ClickClose = document.querySelector("#click_close");
    let TerminalClickOpen = document.querySelector(".div_terminal");
    let StatusBarTerminal = document.querySelector("#status_bar_terminal");
    let SearchBox = document.querySelector("#search-box");
    let InputSearch = document.querySelector(".input-search");
    let InputReplace = document.querySelector(".input-replace");
    let InputSearchClick = document.querySelector(".input-search-click");
    let Close = document.querySelector("#close");
    let Replace = document.querySelector(".icon-replace");
    let ReplaceAll = document.querySelector(".icon-replace-all");
    let project = document.querySelector("#sect-project");
    let OpenDialog = document.querySelector("#sect-open-dialog");
    let project_click = document.querySelector(".div-container-icon");
    let CloseSectProject = document.querySelector("#close-sect-project");
    let Lock_Lock = document.querySelector(".lock-status-bar-lock");
    let Lock_Open = document.querySelector(".lock-status-bar-open");
    let SectionBodyFolder = document.querySelector(".sect-body-project ul");
    let HeaderEditor = document.querySelector("#section-header-editor");
    let SelectModeFile = document.querySelector("#select-mode-file");
    let EditorCodeMirror;
    let WindowGoogle;
    let AboutWindow;
    let DonateWindow;
    let stateSectProject = true;
    let stateStatusBar = true;
    let stateSave = false;
    let stateTerminal = true;
    let stateAutoSave = false;
    let stateLineWrapping = true;
    let FilePathSave = "";
    let FilePathOpen = "";
    let DirectoryTerminal = "";
    ///////////////////////////////////////////////////////////// End Section Variables


    ///////////////////////////////////////////////////////////// Start Section Code Mirror;
    EditorCodeMirror = CodeMirror(DivEditor, {
        theme: "darcula",
        lineNumbers: true,
        smartIndent: true,
        tabSize: 4,
        matchBrackets: true,
        indentWithTabs: true,
        debug: true,
        tabindex: 4,
        keyMaps: "sublime",
        autofocus: true,
        addModeClass: true,
        showTrailingSpace: true,
        search: true,
        searchArgs: true,
        searchOverlay: true,
        comment: true,
        indentUnit: 4,
        scrollPastEnd: true,
        autoCloseTags: true,
        enableSearchTools: true,
        enableCodeFolding: true,
        foldGutter: true,
        autoFormatOnModeChange: true,
        enableCodeFormatting: true,
        autoFormatOnStart: true,
        autoCloseBrackets: true,
        showSearchButton: true,
        autoFormatOnUncomment: true,
        showFormatButton: true,
        showCommentButton: true,
        showUncommentButton: true,
        showAutoCompleteButton: true,
        highlightMatches: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        showCursorWhenSelecting: true,
        spellcheck: true,
        extraKeys: {
            "Ctrl-Space": "autocomplete",
        },
    });
    let EditorInMenu = document.querySelector("#editor .CodeMirror textarea");
    let CodeMirrorInMenu = document.querySelector(".CodeMirror");
    ///////////////////////////////////////////////////////////// End Section Code Mirror


    ///////////////////////////////////////////////////////////// Start Section DataBase
    const knex = require("knex")({
        client: "sqlite3",
        connection: {
            filename: "./DbEditor.sqlite",
        },
        useNullAsDefault: true,
    });

    knex.schema.createTableIfNotExists("Editor", (TableBuilder) => {
        TableBuilder.increments("id");
        TableBuilder.string("AutoSave");
        TableBuilder.string("Theme");
        TableBuilder.string("keyMap");
    }).then();

    // const InsertedData = () => {
    //     knex("Editor").insert({
    //         AutoSave: "false",
    //         Theme: "Dracula",
    //         keyMap: "sublime",
    //     }).then(() => {
    //
    //     });
    // };

    // setInterval(() => {
    //     InsertedData();
    // }, 5000);

    knex("Editor").select("*").then((val) => {
        if (val[0]["AutoSave"] === "false") {
            stateAutoSave = false;
        } else if (val[0]["AutoSave"] === "true") {
            stateAutoSave = true;
        }

        EditorCodeMirror.setOption("theme", val[0]["Theme"]);

        EditorCodeMirror.setOption("keyMaps", val[0]["keyMap"]);
    });
    ///////////////////////////////////////////////////////////// End Section DataBase


    ///////////////////////////////////////////////////////////// Start Section Set Theme From Database
    const FuncSetThemeFromDB = () => {
        let OptionTheme = EditorCodeMirror.getOption("theme");
        knex("Editor").update("Theme", OptionTheme, () => {

        }).then();
    };
    ///////////////////////////////////////////////////////////// End Section Set Theme From Database


    ///////////////////////////////////////////////////////////// Start Section Set KeyMap From Database
    const FuncSetKeyMapFromDB = () => {
        let OptionKeyMap = EditorCodeMirror.getOption("keyMaps");
        knex("Editor").update("keyMap", OptionKeyMap, () => {

        }).then();
    };
    ///////////////////////////////////////////////////////////// End Section Set KeyMap From Database


    ///////////////////////////////////////////////////////////// Start Section Functions
    ////////////////////////////////// Start Section Set Select Mode Files
    SelectModeFile.addEventListener("change", () => {
        FuncSetModeFiles("E:\\project\\project\\script." + SelectModeFile.value);
    });
    ////////////////////////////////// End Section Set Select Mode Files


    ////////////////////////////////// Start Section Set Mode Files
    const FuncSetModeFiles = (FilePathOpen) => {
        let FileNameLength = FilePathOpen.split("\\").length - 1;
        let FileName = FilePathOpen.split("\\")[FileNameLength];
        let ModeFile = FileName.split(".")[1];
        switch (ModeFile) {
            case "apl": {
                EditorCodeMirror.setOption("mode", "text/apl");
                break;
            }
            case "asn1": {
                EditorCodeMirror.setOption("mode", "text/x-ttcn-asn");
                break;
            }
            case "ael": {
                EditorCodeMirror.setOption("mode", "text/x-asterisk");
                break;
            }
            case "bf": {
                EditorCodeMirror.setOption("mode", "text/x-brainfuck");
                break;
            }
            case "c": {
                EditorCodeMirror.setOption("mode", "text/x-csrc");
                break;
            }
            case "cpp": {
                EditorCodeMirror.setOption("mode", "text/x-c++src");
                break;
            }
            case "cxx": {
                EditorCodeMirror.setOption("mode", "text/x-c++src");
                break;
            }
            case "CXX": {
                EditorCodeMirror.setOption("mode", "text/x-c++src");
                break;
            }
            case "java": {
                EditorCodeMirror.setOption("mode", "text/x-java");
                break;
            }
            case "jar": {
                EditorCodeMirror.setOption("mode", "text/x-java");
                break;
            }
            case "jsp": {
                EditorCodeMirror.setOption("mode", "text/x-java");
                break;
            }
            case "cs": {
                EditorCodeMirror.setOption("mode", "text/x-csharp");
                break;
            }
            case "h": {
                EditorCodeMirror.setOption("mode", "text/x-objectivec");
                break;
            }
            case "m": {
                EditorCodeMirror.setOption("mode", "text/x-objectivec");
                break;
            }
            case "mm": {
                EditorCodeMirror.setOption("mode", "text/x-objectivec");
                break;
            }
            case "M": {
                EditorCodeMirror.setOption("mode", "text/x-objectivec");
                break;
            }
            case "scala": {
                EditorCodeMirror.setOption("mode", "text/x-scala");
                break;
            }
            case "vert": {
                EditorCodeMirror.setOption("mode", "text/x-vertex");
                break;
            }
            case "frag": {
                EditorCodeMirror.setOption("mode", "x-shader/x-fragment");
                break;
            }
            case "squirrel": {
                EditorCodeMirror.setOption("mode", "text/x-squirrel");
                break;
            }
            case "ceylon": {
                EditorCodeMirror.setOption("mode", "text/x-ceylon");
                break;
            }
            case "clj": {
                EditorCodeMirror.setOption("mode", "text/x-clojure");
                break;
            }
            case "edn": {
                EditorCodeMirror.setOption("mode", "text/x-gss");
                break;
            }
            case "cmake": {
                EditorCodeMirror.setOption("mode", "text/x-cmake");
                break;
            }
            case "coffee": {
                EditorCodeMirror.setOption("mode", "application/vnd.coffeescript");
                break;
            }
            case "coffee": {
                EditorCodeMirror.setOption("mode", "text/coffeescript");
                break;
            }
            case "coffee": {
                EditorCodeMirror.setOption("mode", "text/x-coffeescript");
                break;
            }
            case "lisp": {
                EditorCodeMirror.setOption("mode", "text/x-common-lisp");
                break;
            }
            case "lsp": {
                EditorCodeMirror.setOption("mode", "text/x-common-lisp");
                break;
            }
            case "rpt": {
                EditorCodeMirror.setOption("mode", "text/x-crystal");
                break;
            }
            case "css": {
                EditorCodeMirror.setOption("mode", "text/css");
                break;
            }
            case "scss": {
                EditorCodeMirror.setOption("mode", "text/x-scss");
                break;
            }
            case "less": {
                EditorCodeMirror.setOption("mode", "text/x-less");
                break;
            }
            case "cypher": {
                EditorCodeMirror.setOption("mode", "application/x-cypher-query");
                break;
            }
            case "py": {
                EditorCodeMirror.setOption("mode", "text/x-python");
                break;
            }
            case "pyx": {
                EditorCodeMirror.setOption("mode", "text/x-cython");
                break;
            }
            case "d": {
                EditorCodeMirror.setOption("mode", "text/x-d");
                break;
            }
            case "djt": {
                EditorCodeMirror.setOption("mode", "text/x-django");
                break;
            }
            case "dockerfile ": {
                EditorCodeMirror.setOption("mode", "text/x-dockerfile");
                break;
            }
            case "diff": {
                EditorCodeMirror.setOption("mode", "text/x-diff");
                break;
            }
            case "dtd": {
                EditorCodeMirror.setOption("mode", "application/xml-dtd");
                break;
            }
            case "lid": {
                EditorCodeMirror.setOption("mode", "text/x-dylan");
                break;
            }
            case "js": {
                EditorCodeMirror.setOption("mode", "application/ecmascript");
                break;
            }
            case "ecl": {
                EditorCodeMirror.setOption("mode", "text/x-ecl");
                break;
            }
            case "e": {
                EditorCodeMirror.setOption("mode", "text/x-eiffel");
                break;
            }
            case "elm": {
                EditorCodeMirror.setOption("mode", "text/x-elm");
                break;
            }
            case "erl": {
                EditorCodeMirror.setOption("mode", "text/x-erlang");
                break;
            }
            case "yaws": {
                EditorCodeMirror.setOption("mode", "text/x-erlang");
                break;
            }
            case "factor": {
                EditorCodeMirror.setOption("mode", "text/x-factor");
                break;
            }
            case "fcl": {
                EditorCodeMirror.setOption("mode", "text/x-fcl");
                break;
            }
            case "f": {
                EditorCodeMirror.setOption("mode", "text/x-forth");
                break;
            }
            case "for": {
                EditorCodeMirror.setOption("mode", "text/x-forth");
                break;
            }
            case "4th": {
                EditorCodeMirror.setOption("mode", "text/x-fortran");
                break;
            }
            case "cmi": {
                EditorCodeMirror.setOption("mode", "text/x-ocaml");
                break;
            }
            case "fs": {
                EditorCodeMirror.setOption("mode", "text/x-fsharp");
                break;
            }
            case "s": {
                EditorCodeMirror.setOption("mode", "text/x-gas");
                break;
            }
            case "feature": {
                EditorCodeMirror.setOption("mode", "text/x-feature");
                break;
            }
            case "go": {
                EditorCodeMirror.setOption("mode", "text/x-go");
                break;
            }
            case "groovy": {
                EditorCodeMirror.setOption("mode", "text/x-groovy");
                break;
            }
            case "haml": {
                EditorCodeMirror.setOption("mode", "text/x-haml");
                break;
            }
            case "hbs": {
                EditorCodeMirror.setOption("mode", "text/x-handlebars-template");
                break;
            }
            case "hs": {
                EditorCodeMirror.setOption("mode", "text/x-haskell");
                break;
            }
            case "lhs": {
                EditorCodeMirror.setOption("mode", "text/x-literate-haskell");
                break;
            }
            case "hx": {
                EditorCodeMirror.setOption("mode", "text/x-haxe");
                break;
            }
            case "hxml": {
                EditorCodeMirror.setOption("mode", "text/x-hxml");
                break;
            }
            case "cs": {
                EditorCodeMirror.setOption("mode", "application/x-aspx");
                break;
            }
            case "asp": {
                EditorCodeMirror.setOption("mode", "application/x-aspx");
                break;
            }
            case "aspx": {
                EditorCodeMirror.setOption("mode", "application/x-aspx");
                break;
            }
            case "ejs": {
                EditorCodeMirror.setOption("mode", "application/x-ejs");
                break;
            }
            case "jsp": {
                EditorCodeMirror.setOption("mode", "application/x-jsp");
                break;
            }
            case "erb": {
                EditorCodeMirror.setOption("mode", "application/x-erb");
                break;
            }
            case "http": {
                EditorCodeMirror.setOption("mode", "message/http");
                break;
            }
            case "idl": {
                EditorCodeMirror.setOption("mode", "text/x-idl");
                break;
            }
            case "js": {
                EditorCodeMirror.setOption("mode", "text/javascript");
                break;
            }
            case "js": {
                EditorCodeMirror.setOption("mode", "application/javascript");
                break;
            }
            case "js": {
                EditorCodeMirror.setOption("mode", "application/x-javascript");
                break;
            }
            case "js": {
                EditorCodeMirror.setOption("mode", "text/ecmascript");
                break;
            }
            case "js": {
                EditorCodeMirror.setOption("mode", "application/ecmascript");
                break;
            }
            case "json": {
                EditorCodeMirror.setOption("mode", "application/jsonapplication/x-json");
                break;
            }
            case "json": {
                EditorCodeMirror.setOption("mode", "application/manifest+json");
                break;
            }
            case "json": {
                EditorCodeMirror.setOption("mode", "application/ld+json");
                break;
            }
            case "ts": {
                EditorCodeMirror.setOption("mode", "text/typescript");
                break;
            }
            case "ts": {
                EditorCodeMirror.setOption("mode", "application/typescript");
                break;
            }
            case "jl": {
                EditorCodeMirror.setOption("mode", "text/x-julia");
                break;
            }
            case "ls": {
                EditorCodeMirror.setOption("mode", "text/x-livescript");
                break;
            }
            case "lua": {
                EditorCodeMirror.setOption("mode", "text/x-lua");
                break;
            }
            case "md": {
                EditorCodeMirror.setOption("mode", "text/x-markdown");
                break;
            }
            case "m": {
                EditorCodeMirror.setOption("mode", "text/x-mathematica");
                break;
            }
            case "mbox": {
                EditorCodeMirror.setOption("mode", "application/mbox");
                break;
            }
            case "mrc": {
                EditorCodeMirror.setOption("mode", "text/mirc");
                break;
            }
            case "ini": {
                EditorCodeMirror.setOption("mode", "text/mirc");
                break;
            }
            case "mo": {
                EditorCodeMirror.setOption("mode", "text/x-modelica");
                break;
            }
            case "mscgen": {
                EditorCodeMirror.setOption("mode", "text/x-mscgen");
                break;
            }
            case "msc": {
                EditorCodeMirror.setOption("mode", "text/x-mscgen");
                break;
            }
            case "xu": {
                EditorCodeMirror.setOption("mode", "text/x-xu");
                break;
            }
            case "mscgen": {
                EditorCodeMirror.setOption("mode", "text/x-msgenny");
                break;
            }
            case "msc": {
                EditorCodeMirror.setOption("mode", "text/x-msgenny");
                break;
            }
            case "nginx": {
                EditorCodeMirror.setOption("mode", "text/x-nginx-conf");
                break;
            }
            case "nsi": {
                EditorCodeMirror.setOption("mode", "text/x-nsis");
                break;
            }
            case "pl": {
                EditorCodeMirror.setOption("mode", "application/n-quads");
                break;
            }
            case "f#": {
                EditorCodeMirror.setOption("mode", "text/x-fsharp");
                break;
            }
            case "m": {
                EditorCodeMirror.setOption("mode", "text/x-octave");
                break;
            }
            case "oz": {
                EditorCodeMirror.setOption("mode", "text/x-oz");
                break;
            }
            case "p": {
                EditorCodeMirror.setOption("mode", "text/x-pascal");
                break;
            }
            case "pas": {
                EditorCodeMirror.setOption("mode", "text/x-pascal");
                break;
            }
            case "pascal": {
                EditorCodeMirror.setOption("mode", "text/x-pascal");
                break;
            }
            case "perl": {
                EditorCodeMirror.setOption("mode", "text/x-perl");
                break;
            }
            case "asc": {
                EditorCodeMirror.setOption("mode", "application/pgp");
                break;
            }
            case "asc": {
                EditorCodeMirror.setOption("mode", "application/pgp-encrypted");
                break;
            }
            case "asc": {
                EditorCodeMirror.setOption("mode", "application/pgp-keys");
                break;
            }
            case "asc": {
                EditorCodeMirror.setOption("mode", "application/pgp-signature");
                break;
            }
            case "php": {
                EditorCodeMirror.setOption("mode", "application/x-httpd-php");
                break;
            }
            case "php": {
                EditorCodeMirror.setOption("mode", "text/x-php");
                break;
            }
            case "pig": {
                EditorCodeMirror.setOption("mode", "text/x-pig");
                break;
            }
            case "ps1": {
                EditorCodeMirror.setOption("mode", "application/x-powershell");
                break;
            }
            case "ps2": {
                EditorCodeMirror.setOption("mode", "application/x-powershell");
                break;
            }
            case "ps3": {
                EditorCodeMirror.setOption("mode", "application/x-powershell");
                break;
            }
            case "properties": {
                EditorCodeMirror.setOption("mode", "text/x-properties");
                break;
            }
            case "properties": {
                EditorCodeMirror.setOption("mode", "text/x-ini");
                break;
            }
            case "proto": {
                EditorCodeMirror.setOption("mode", "text/x-protobuf");
                break;
            }
            case "pug": {
                EditorCodeMirror.setOption("mode", "text/x-pug");
                break;
            }
            case "jade": {
                EditorCodeMirror.setOption("mode", "text/x-jade");
                break;
            }
            case "puppet": {
                EditorCodeMirror.setOption("mode", "text/x-puppet");
                break;
            }
            case "q": {
                EditorCodeMirror.setOption("mode", "text/x-q");
                break;
            }
            case "r": {
                EditorCodeMirror.setOption("mode", "text/x-rsrc");
                break;
            }
            case "spec": {
                EditorCodeMirror.setOption("mode", "text/x-rpm-spec");
                break;
            }
            case "spec": {
                EditorCodeMirror.setOption("mode", "text/x-rpm-changes");
                break;
            }
            case "rst": {
                EditorCodeMirror.setOption("mode", "text/x-rst");
                break;
            }
            case "rb": {
                EditorCodeMirror.setOption("mode", "text/x-ruby");
                break;
            }
            case "rs": {
                EditorCodeMirror.setOption("mode", "text/x-rustsrc");
                break;
            }
            case "rlib": {
                EditorCodeMirror.setOption("mode", "text/x-rustsrc");
                break;
            }
            case "sas": {
                EditorCodeMirror.setOption("mode", "text/x-sas");
                break;
            }
            case "sass": {
                EditorCodeMirror.setOption("mode", "text/x-sass");
                break;
            }
            case "xlsm": {
                EditorCodeMirror.setOption("mode", "text/x-spreadsheet");
                break;
            }
            case "xls": {
                EditorCodeMirror.setOption("mode", "text/x-spreadsheet");
                break;
            }
            case "xlsx": {
                EditorCodeMirror.setOption("mode", "text/x-spreadsheet");
                break;
            }
            case "scm": {
                EditorCodeMirror.setOption("mode", "text/x-scheme");
                break;
            }
            case "sh": {
                EditorCodeMirror.setOption("mode", "text/x-sh");
                break;
            }
            case "sh": {
                EditorCodeMirror.setOption("mode", "application/x-sh");
                break;
            }
            case "sieve": {
                EditorCodeMirror.setOption("mode", "application/sieve");
                break;
            }
            case "slim": {
                EditorCodeMirror.setOption("mode", "application/x-slim");
                break;
            }
            case "smalltalk": {
                EditorCodeMirror.setOption("mode", "text/x-stsrc");
                break;
            }
            case "stsrc": {
                EditorCodeMirror.setOption("mode", "text/x-stsrc");
                break;
            }
            case "tpl": {
                EditorCodeMirror.setOption("mode", "text/x-smarty");
                break;
            }
            case "solr": {
                EditorCodeMirror.setOption("mode", "text/x-solr");
                break;
            }
            case "soy": {
                EditorCodeMirror.setOption("mode", "text/x-soy");
                break;
            }
            case "styl": {
                EditorCodeMirror.setOption("mode", "text/x-styl");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-sql");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-mysql");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-mariadb");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-cassandra");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-plsql");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-mssql");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-hive");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-pgsql");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-gql");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-gpsql");
                break;
            }
            case "sql": {
                EditorCodeMirror.setOption("mode", "text/x-esper");
                break;
            }
            case "sparql": {
                EditorCodeMirror.setOption("mode", "application/sparql-query");
                break;
            }
            case "swift": {
                EditorCodeMirror.setOption("mode", "text/x-swift");
                break;
            }
            case "stex": {
                EditorCodeMirror.setOption("mode", "text/x-stex");
                break;
            }
            case "tcl": {
                EditorCodeMirror.setOption("mode", "text/x-tcl");
                break;
            }
            case "textile": {
                EditorCodeMirror.setOption("mode", "text/x-textile");
                break;
            }
            case "tid": {
                EditorCodeMirror.setOption("mode", "text/x-tiddlywiki");
                break;
            }
            case "toml": {
                EditorCodeMirror.setOption("mode", "text/x-toml");
                break;
            }
            case "tornado": {
                EditorCodeMirror.setOption("mode", "text/x-tornado");
                break;
            }
            case "troff": {
                EditorCodeMirror.setOption("mode", "troff");
                break;
            }
            case "ttcn": {
                EditorCodeMirror.setOption("mode", "text/x-ttcn");
                break;
            }
            case "ttcn3": {
                EditorCodeMirror.setOption("mode", "text/x-ttcn3");
                break;
            }
            case "ttcnpp": {
                EditorCodeMirror.setOption("mode", "text/x-ttcnpp");
                break;
            }
            case "cfg": {
                EditorCodeMirror.setOption("mode", "text/x-ttcn-cfg");
                break;
            }
            case "turtle": {
                EditorCodeMirror.setOption("mode", "text/turtle");
                break;
            }
            case "vb": {
                EditorCodeMirror.setOption("mode", "text/x-vb");
                break;
            }
            case "vbs": {
                EditorCodeMirror.setOption("mode", "text/vbscript");
                break;
            }
            case "vm": {
                EditorCodeMirror.setOption("mode", "text/velocity");
                break;
            }
            case "vm": {
                EditorCodeMirror.setOption("mode", "text/x-verilog");
                break;
            }
            case "sv": {
                EditorCodeMirror.setOption("mode", "text/x-systemverilog");
                break;
            }
            case "vhd": {
                EditorCodeMirror.setOption("mode", "text/x-vhdl");
                break;
            }
            case "vue": {
                EditorCodeMirror.setOption("mode", "text/x-vue");
                break;
            }
            case "webidl": {
                EditorCodeMirror.setOption("mode", "text/x-webidl");
                break;
            }
            case "wasm": {
                EditorCodeMirror.setOption("mode", "text/webassembly");
                break;
            }
            case "xml": {
                EditorCodeMirror.setOption("mode", "application/xml");
                break;
            }
            case "html": {
                EditorCodeMirror.setOption("mode", "text/html");
                break;
            }
            case "htm": {
                EditorCodeMirror.setOption("mode", "text/html");
                break;
            }
            case "xquery": {
                EditorCodeMirror.setOption("mode", "application/xquery");
                break;
            }
            case "yacas": {
                EditorCodeMirror.setOption("mode", "text/x-yacas");
                break;
            }
            case "yaml": {
                EditorCodeMirror.setOption("mode", "text/x-yaml");
                break;
            }
            case "z80": {
                EditorCodeMirror.setOption("mode", "text/x-z80");
                break;
            }
            case "ez80": {
                EditorCodeMirror.setOption("mode", "text/x-ez80");
                break;
            }
            default : {
                break;
            }
        }
    };
    ////////////////////////////////// End Section Set Mode Files


    ////////////////////////////////// Start Section Folder
    OpenDialog.addEventListener("click", () => {
        FuncOpenFolder();
    });

    const FuncOpenFolder = () => {
        SectionBodyFolder.innerHTML = "";
        ElectronMenusRemote.dialog.showOpenDialog(MainWindow, {
            properties: ["openDirectory"],
            title: "Open Folder",
        }).then((val) => {
            FSInMenus.readdir(val.filePaths[0], "utf8", (err, files) => {
                if (files !== undefined) {
                    files.forEach((files) => {
                        let Li = document.createElement("li");
                        let iconArrow = document.createElement("i");
                        let Img = document.createElement("img");
                        let text = document.createTextNode(`${files}`);

                        let filePathsOpenDir = val.filePaths[0] + files;
                        let FileNameLength = filePathsOpenDir.split("\\").length - 1;
                        let FileName = filePathsOpenDir.split("\\")[FileNameLength];
                        let ModeFile = FileName.split(".")[1];

                        let FilePathFormat = filePathsOpenDir.replace(files, "\\") + files;

                        if (ModeFile === undefined) {
                            Li.appendChild(iconArrow);
                        }

                        Li.appendChild(Img);
                        Li.appendChild(text);
                        SectionBodyFolder.appendChild(Li);
                        if (ModeFile !== undefined) {
                            Img.style.width = "18px";
                            Img.style.height = "18px";
                            Img.style.position = "relative";
                            Img.style.top = "3px";
                            FuncSetIconFiles(ModeFile, Img);
                            Li.addEventListener("dblclick", () => {
                                FSInMenus.readFile(FilePathFormat, "utf8", (err, data) => {
                                    FuncSetStatusBar(FilePathFormat);
                                    FuncSetModeFiles(FilePathFormat);
                                    FuncSetTitle(FilePathFormat);
                                    FuncSetHeaderEditor(FilePathFormat);
                                    EditorCodeMirror.setValue(data);
                                });
                            });
                        }
                    });
                }
            });
        });
    };
    ////////////////////////////////// End Section Folder


    ////////////////////////////////// Start Section Lock
    Lock_Lock.addEventListener("click", () => {
        Lock_Lock.style.display = "none";

        Lock_Open.style.display = "block";
        EditorCodeMirror.setOption("readOnly", false);
    });

    Lock_Open.addEventListener("click", () => {
        Lock_Lock.style.display = "block";
        Lock_Open.style.display = "none";
        EditorCodeMirror.setOption("readOnly", true);
    });
    ////////////////////////////////// End Section Lock


    ////////////////////////////////// Start Section Set Icon Files
    const FuncSetIconFiles = (ModeFile, TagImg) => {
        switch (ModeFile) {
            case "txt": {
                TagImg.src = "./assets/Icons/text.png";
                break;
            }
            case "apl": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "asn1": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "ael": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "bf": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "c": {
                TagImg.src = "./assets/Icons/c.png";
                break;
            }
            case "cpp": {
                TagImg.src = "./assets/Icons/cpp.svg";
                break;
            }
            case "cxx": {
                TagImg.src = "./assets/Icons/cpp.svg";
                break;
            }
            case "CXX": {
                TagImg.src = "./assets/Icons/cpp.svg";
                break;
            }
            case "java": {
                TagImg.src = "./assets/Icons/java.svg";
                break;
            }
            case "jar": {
                TagImg.src = "./assets/Icons/java.svg";
                break;
            }
            case "jsp": {
                TagImg.src = "./assets/Icons/java-alt.svg";
                break;
            }
            case "cs": {
                TagImg.src = "./assets/Icons/csharp.svg";
                break;
            }
            case "h": {
                TagImg.src = "./assets/Icons/c-h.png";
                break;
            }
            case "m": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "mm": {
                TagImg.src = "./assets/Icons/mm.png";
                break;
            }
            case "M": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "scala": {
                TagImg.src = "./assets/Icons/scala.svg";
                break;
            }
            case "vert": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "frag": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "squirrel": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "ceylon": {
                TagImg.src = "./assets/Icons/ceylon.png";
                break;
            }
            case "clj": {
                TagImg.src = "./assets/Icons/clojure.svg";
                break;
            }
            case "edn": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "cmake": {
                TagImg.src = "./assets/Icons/cmake.svg";
                break;
            }
            case "coffee": {
                TagImg.src = "./assets/Icons/coffeescript.svg";
                break;
            }
            case "coffee": {
                TagImg.src = "./assets/Icons/coffeescript.svg";
                break;
            }
            case "coffee": {
                TagImg.src = "./assets/Icons/coffeescript.svg";
                break;
            }
            case "lisp": {
                TagImg.src = "./assets/Icons/lisp.png";
                break;
            }
            case "lsp": {
                TagImg.src = "./assets/Icons/lisp.png";
                break;
            }
            case "rpt": {
                TagImg.src = "./assets/Icons/crystal.svg";
                break;
            }
            case "css": {
                TagImg.src = "./assets/Icons/css.svg";
                break;
            }
            case "scss": {
                TagImg.src = "./assets/Icons/sass.svg";
                break;
            }
            case "less": {
                TagImg.src = "./assets/Icons/less.svg";
                break;
            }
            case "cypher": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "py": {
                TagImg.src = "./assets/Icons/python.svg";
                break;
            }
            case "pyx": {
                TagImg.src = "./assets/Icons/cython.png";
                break;
            }
            case "d": {
                TagImg.src = "./assets/Icons/d.png";
                break;
            }
            case "djt": {
                TagImg.src = "./assets/Icons/Django.png";
                break;
            }
            case "dockerfile ": {
                TagImg.src = "./assets/Icons/docker.svg";
                break;
            }
            case "diff": {
                TagImg.src = "./assets/Icons/diff.png";
                break;
            }
            case "dtd": {
                TagImg.src = "./assets/Icons/dtd.png";
                break;
            }
            case "lid": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "ecl": {
                TagImg.src = "./assets/Icons/ecl.png";
                break;
            }
            case "e": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "elm": {
                TagImg.src = "./assets/Icons/elm.svg";
                break;
            }
            case "erl": {
                TagImg.src = "./assets/Icons/erlang.png";
                break;
            }
            case "yaws": {
                TagImg.src = "./assets/Icons/erlang.png";
                break;
            }
            case "factor": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "fcl": {
                TagImg.src = "./assets/Icons/fcl.png";
                break;
            }
            case "f": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "for": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "4th": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "cmi": {
                TagImg.src = "./assets/Icons/cmi.png";
                break;
            }
            case "fs": {
                TagImg.src = "./assets/Icons/fsharp.png";
                break;
            }
            case "s": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "feature": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "go": {
                TagImg.src = "./assets/Icons/go.svg";
                break;
            }
            case "groovy": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "haml": {
                TagImg.src = "./assets/Icons/haml.png";
                break;
            }
            case "hbs": {
                TagImg.src = "./assets/Icons/hbs.png";
                break;
            }
            case "hs": {
                TagImg.src = "./assets/Icons/haskell.png";
                break;
            }
            case "lhs": {
                TagImg.src = "./assets/Icons/haskell.png";
                break;
            }
            case "hx": {
                TagImg.src = "./assets/Icons/haxe.png";
                break;
            }
            case "hxml": {
                TagImg.src = "../assets/Icons/notFound.png";
                break;
            }
            case "cs": {
                TagImg.src = "./assets/Icons/cs.png";
                break;
            }
            case "asp": {
                TagImg.src = "./assets/Icons/asp.png";
                break;
            }
            case "aspx": {
                TagImg.src = "./assets/Icons/aspx.png";
                break;
            }
            case "ejs": {
                TagImg.src = "./assets/Icons/ejs.png";
                break;
            }
            case "jsp": {
                TagImg.src = "./assets/Icons/jsp.png";
                break;
            }
            case "erb": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "http": {
                TagImg.src = "./assets/Icons/http.png";
                break;
            }
            case "idl": {
                TagImg.src = "./assets/Icons/idl.png";
                break;
            }
            case "js": {
                TagImg.src = "./assets/Icons/javascript.svg";
                break;
            }
            case "json": {
                TagImg.src = "./assets/Icons/json.png";
                break;
            }
            case "ts": {
                TagImg.src = "./assets/Icons/typescript.svg";
                break;
            }
            case "jl": {
                TagImg.src = "./assets/Icons/julia.svg";
                break;
            }
            case "ls": {
                TagImg.src = "./assets/Icons/livescript.svg";
                break;
            }
            case "lua": {
                TagImg.src = "./assets/Icons/lua.svg";
                break;
            }
            case "md": {
                TagImg.src = "./assets/Icons/md.png";
                break;
            }
            case "m": {
                TagImg.src = "./assets/Icons/m.png";
                break;
            }
            case "mbox": {
                TagImg.src = "./assets/Icons/mbox.png";
                break;
            }
            case "mrc": {
                TagImg.src = "./assets/Icons/mirc.png";
                break;
            }
            case "ini": {
                TagImg.src = "./assets/Icons/mirc.png";
                break;
            }
            case "mo": {
                TagImg.src = "./assets/Icons/mo.png";
                break;
            }
            case "msc": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "xu": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "mscgen": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "msc": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "nginx": {
                TagImg.src = "./assets/Icons/nginx.png";
                break;
            }
            case "nsi": {
                TagImg.src = "./assets/Icons/nsi.png";
                break;
            }
            case "pl": {
                TagImg.src = "./assets/Icons/pl.png";
                break;
            }
            case "f#": {
                TagImg.src = "./assets/Icons/fsharp.png";
                break;
            }
            case "oz": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "p": {
                TagImg.src = "./assets/Icons/pascal.png";
                break;
            }
            case "pas": {
                TagImg.src = "./assets/Icons/pascal.png";
                break;
            }
            case "pascal": {
                TagImg.src = "./assets/Icons/pascal-project.svg";
                break;
            }
            case "perl": {
                TagImg.src = "./assets/Icons/perl.png";
                break;
            }
            case "asc": {
                TagImg.src = "./assets/Icons/asc.png";
                break;
            }
            case "php": {
                TagImg.src = "./assets/Icons/php.svg";
                break;
            }
            case "pig": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "ps1": {
                TagImg.src = "./assets/Icons/powerpoint.svg";
                break;
            }
            case "ps2": {
                TagImg.src = "./assets/Icons/powerpoint.svg";
                break;
            }
            case "ps3": {
                TagImg.src = "./assets/Icons/powerpoint.svg";
                break;
            }
            case "properties": {
                TagImg.src = "./assets/Icons/properties.png";
                break;
            }
            case "proto": {
                TagImg.src = "./assets/Icons/proto.png";
                break;
            }
            case "pug": {
                TagImg.src = "./assets/Icons/pug.png";
                break;
            }
            case "jade": {
                TagImg.src = "./assets/Icons/jade.svg";
                break;
            }
            case "puppet": {
                TagImg.src = "./assets/Icons/puppet.svg";
                break;
            }
            case "q": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "r": {
                TagImg.src = "./assets/Icons/r.png";
                break;
            }
            case "spec": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "rst": {
                TagImg.src = "./assets/Icons/rst.png";
                break;
            }
            case "rb": {
                TagImg.src = "./assets/Icons/ruby.svg";
                break;
            }
            case "rs": {
                TagImg.src = "./assets/Icons/rs.png";
                break;
            }
            case "rlib": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "sas": {
                TagImg.src = "./assets/Icons/sas.png";
                break;
            }
            case "sass": {
                TagImg.src = "./assets/Icons/sass.svg";
                break;
            }
            case "xlsm": {
                TagImg.src = "./assets/Icons/sp.png";
                break;
            }
            case "xls": {
                TagImg.src = "./assets/Icons/sp.png";
                break;
            }
            case "xlsx": {
                TagImg.src = "./assets/Icons/sp.png";
                break;
            }
            case "scm": {
                TagImg.src = "./assets/Icons/scheme.svg";
                break;
            }
            case "sh": {
                TagImg.src = "./assets/Icons/shell.png";
                break;
            }
            case "sieve": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "slim": {
                TagImg.src = "./assets/Icons/slim.svg";
                break;
            }
            case "smalltalk": {
                TagImg.src = "./assets/Icons/smalltalk.png";
                break;
            }
            case "stsrc": {
                TagImg.src = "./assets/Icons/smarty.png";
                break;
            }
            case "tpl": {
                TagImg.src = "./assets/Icons/tpl.png";
                break;
            }
            case "solr": {
                TagImg.src = "./assets/Icons/solr.png";
                break;
            }
            case "soy": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "styl": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "sql": {
                TagImg.src = "./assets/Icons/sql.png";
                break;
            }
            case "sparql": {
                TagImg.src = "./assets/Icons/sparql.png";
                break;
            }
            case "swift": {
                TagImg.src = "./assets/Icons/swift.svg";
                break;
            }
            case "stex": {
                TagImg.src = "./assets/Icons/stex.png";
                break;
            }
            case "tcl": {
                TagImg.src = "./assets/Icons/tcl.png";
                break;
            }
            case "textile": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "tid": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "toml": {
                TagImg.src = "./assets/Icons/toml.png";
                break;
            }
            case "tornado": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "troff": {
                TagImg.src = "./assets/Icons/troff.png";
                break;
            }
            case "ttcn": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "ttcn3": {
                TagImg.src = "./assets/Icons/ttcn3.png";
                break;
            }
            case "ttcnpp": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "cfg": {
                TagImg.src = "./assets/Icons/config.png";
                break;
            }
            case "turtle": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "vb": {
                TagImg.src = "./assets/Icons/vb.png";
                break;
            }
            case "vbs": {
                TagImg.src = "./assets/Icons/vbs.png";
                break;
            }
            case "vm": {
                TagImg.src = "./assets/Icons/vm.png";
                break;
            }
            case "sv": {
                TagImg.src = "./assets/Icons/sv.png";
                break;
            }
            case "sqlite": {
                TagImg.src = "./assets/Icons/sqlite.png";
                break;
            }
            case "vhd": {
                TagImg.src = "./assets/Icons/vhd.png";
                break;
            }
            case "vue": {
                TagImg.src = "./assets/Icons/vue.svg";
                break;
            }
            case "webidl": {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
            case "wasm": {
                TagImg.src = "./assets/Icons/wasm.png";
                break;
            }
            case "xml": {
                TagImg.src = "./assets/Icons/xml.png";
                break;
            }
            case "html": {
                TagImg.src = "./assets/Icons/html.png";
                break;
            }
            case "htm": {
                TagImg.src = "./assets/Icons/html.png";
                break;
            }
            case "xquery": {
                TagImg.src = "./assets/Icons/xquery.png";
                break;
            }
            case "yacas": {
                TagImg.src = "./assets/Icons/yacas.png";
                break;
            }
            case "yaml": {
                TagImg.src = "./assets/Icons/yaml.png";
                break;
            }
            case "z80": {
                TagImg.src = "./assets/Icons/z80.png";
                break;
            }
            case "ez80": {
                TagImg.src = "./assets/Icons/z80.png";
                break;
            }
            case "zip": {
                TagImg.src = "./assets/Icons/zip.svg";
                break;
            }
            case "word": {
                TagImg.src = "./assets/Icons/word.svg";
                break;
            }
            case "ps": {
                TagImg.src = "./assets/Icons/photoshop.svg";
                break;
            }
            case "pdf": {
                TagImg.src = "./assets/Icons/pdf.svg";
                break;
            }
            case "gitignore": {
                TagImg.src = "./assets/Icons/git.svg";
                break;
            }
            case "gitattributes": {
                TagImg.src = "./assets/Icons/git.svg";
                break;
            }
            case "exe": {
                TagImg.src = "./assets/Icons/exe.png";
                break;
            }
            case ".babelrc": {
                TagImg.src = "./assets/Icons/babel.svg";
                break;
            }
            case ".babel": {
                TagImg.src = "./assets/Icons/babel.svg";
                break;
            }
            case "babel.config.json": {
                TagImg.src = "./assets/Icons/babel.svg";
                break;
            }
            case "wma": {
                TagImg.src = "./assets/Icons/audio.png";
                break;
            }
            case "ogg": {
                TagImg.src = "./assets/Icons/audio.png";
                break;
            }
            case "aac": {
                TagImg.src = "./assets/Icons/audio.png";
                break;
            }
            case "mp3": {
                TagImg.src = "./assets/Icons/audio.png";
                break;
            }
            case "pcm": {
                TagImg.src = "./assets/Icons/audio.png";
                break;
            }
            case "wav": {
                TagImg.src = "./assets/Icons/audio.png";
                break;
            }
            default : {
                TagImg.src = "./assets/Icons/notFound.png";
                break;
            }
        }
    };
    ////////////////////////////////// End Section Set Icon Files


    ////////////////////////////////// Start Section Set Header Editor
    const FuncSetHeaderEditor = (FilePathOpen) => {
        let FileNameLength = FilePathOpen.split("\\").length - 1;
        let FileName = FilePathOpen.split("\\")[FileNameLength];
        let ModeFile = FileName.split(".")[1];

        let TagDiv = document.createElement("div");
        let TagImg = document.createElement("img");
        let TagSpan = document.createElement("span");
        let TagI = document.createElement("i");
        let text = document.createTextNode(`${FileName}`);

        TagDiv.appendChild(TagImg);
        TagDiv.appendChild(TagSpan);
        TagSpan.appendChild(text);
        TagDiv.appendChild(TagI);
        FuncSetIconFiles(ModeFile, TagImg);
        HeaderEditor.appendChild(TagDiv);

        TagDiv.addEventListener("click", () => {
            FSInMenus.readFile(FilePathOpen, "utf8", (err, data) => {
                EditorCodeMirror.setValue(data);
                FuncSetTitle(FilePathOpen);
                FuncSetStatusBar(FilePathOpen);
                FuncSetModeFiles(FilePathOpen);
                if (HeaderEditor.innerHTML === "") {
                    EditorCodeMirror.setValue("");
                    MainWindow.title = "Editor Code";
                    FileNameInMenu.innerHTML = "";
                    ModeFileInMenu.innerHTML = "";
                }
            });
        });

        TagI.addEventListener("click", () => {
            HeaderEditor.removeChild(TagDiv);
        });
    };
    ////////////////////////////////// End Section Set Header Editor


    ////////////////////////////////// Start Section Set Star Save
    EditorInMenu.addEventListener("keyup", () => {
        MainWindow.title = MainWindow.title + "*";
        MainWindow.title = MainWindow.title.replace("**", "*");
    });
    ////////////////////////////////// End Section Set Star Save


    ////////////////////////////////// Start Section Project
    project_click.addEventListener("click", () => {
        if (stateSectProject === true) {
            project.style.left = "25px";
            HeaderEditor.style.left = "275px";
            CodeMirrorInMenu.style.left = "275px";
            stateSectProject = false;
        } else {
            project.style.left = "-300px";
            CodeMirrorInMenu.style.left = "25px";
            HeaderEditor.style.left = "25px";
            stateSectProject = true;
        }

        CloseSectProject.addEventListener("click", () => {
            project.style.left = "-300px";
            CodeMirrorInMenu.style.left = "25px";
            HeaderEditor.style.left = "25px";
        })
    });
    ////////////////////////////////// End Section Project


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

    const FuncGetDirectory = () => {
        ps.addCommand("dir").then();

        ps.invoke().then((output) => {
            DirectoryTerminal = output.split("Directory: ")[1].split("Mode")[0].trim();
            Terminal.value = `PS ${DirectoryTerminal}> `;
        });
    };

    const FuncTerminal = () => {
        Terminal.addEventListener("keyup", (e) => {
            let LengthValueTerminal = Terminal.value.split(">").length - 1;
            let ValueTerminal = Terminal.value.split(">")[LengthValueTerminal].trim();

            if (e.keyCode === 13) {
                ps.addCommand(ValueTerminal, {}).then();

                ps.invoke().then((output) => {
                    Terminal.value += `${output} PS ${DirectoryTerminal}> `;
                    if (ValueTerminal.search("cd") === 0) {
                        FuncGetDirectory();
                    } else if (ValueTerminal === "clear" || ValueTerminal === "cls") {
                        FuncGetDirectory();
                    }
                }).catch((err) => {
                    Terminal.value += `${err} PS ${DirectoryTerminal}> `;
                });
            }
        });
    };
    FuncGetDirectory();
    FuncTerminal();
    ////////////////////////////////// End Section Set Terminal


    ////////////////////////////////// Start Functions Get Line Number And Get Line Columns
    CodeMirrorInMenu.addEventListener("input", () => {
        GetLineColumnNumber();
    });
    CodeMirrorInMenu.addEventListener("keyup", () => {
        GetLineColumnNumber();
    });
    CodeMirrorInMenu.addEventListener("mousedown", () => {
        GetLineColumnNumber();
    });
    const GetLineColumnNumber = () => {
        let LineCol = EditorCodeMirror.doc.getCursor();
        LinesColumns.innerHTML = `${LineCol.line} : ${LineCol.ch}`;
    };
    GetLineColumnNumber();
    ////////////////////////////////// End Functions Get Line Number And Get Line Columns


    ////////////////////////////////// Start Functions Set Status Bar
    const FuncSetStatusBar = (FilePathOpen) => {
        let FileNameLength = FilePathOpen.split("\\").length - 1;
        let FileName = FilePathOpen.split("\\")[FileNameLength];
        let ModeFile = FileName.split(".")[1];
        FileNameInMenu.innerHTML = FileName.split(".")[0];
        ModeFileInMenu.innerHTML = ModeFile;
    };
    ////////////////////////////////// End Functions Set Status Bar


    ////////////////////////////////// Start Functions Set Title
    const FuncSetTitle = (FilePathOpen) => {
        let FileNameLength = FilePathOpen.split("\\").length - 1;
        let FileName = FilePathOpen.split("\\")[FileNameLength];
        MainWindow.title = `Editor Code - ${FileName}`;
    };
    ////////////////////////////////// End Functions Set Title


    ////////////////////////////////// Start Functions Files
    const FuncNewFile = () => {
        MainWindow.title = "Editor Code - Untitled.txt";
        EditorCodeMirror.setValue("");
        FileNameInMenu.innerHTML = "Untitled";
        ModeFileInMenu.innerHTML = "txt";
        stateSave = false;
    };

    const FuncOpen = () => {
        ElectronMenusRemote.dialog.showOpenDialog(MainWindow, {}).then((result) => {
            if (result.filePaths) {
                FilePathOpen = result.filePaths[0];
                FSInMenus.readFile(FilePathOpen, {}, (err, data) => {
                    EditorCodeMirror.setValue(data.toString());
                    stateSave = false;
                    FuncSetTitle(FilePathOpen);
                    FuncSetHeaderEditor(FilePathOpen);
                    FuncSetStatusBar(FilePathOpen);
                    FuncSetModeFiles(FilePathOpen);
                });
            }
        }).catch(() => {

        });
    };

    const FuncSave = () => {
        if (stateSave === true) {
            FSInMenus.writeFile(FilePathSave, EditorCodeMirror.getValue(), "utf8", () => {
                MainWindow.title = MainWindow.title.replace("*", "");
            });
        } else {
            ElectronMenusRemote.dialog.showSaveDialog(MainWindow, {
                title: "Save File",
            }).then((result) => {
                if (result.filePath) {
                    FilePathSave = result.filePath;
                    FSInMenus.writeFile(FilePathSave, EditorCodeMirror.getValue(), "utf8", () => {
                        stateSave = true;
                        MainWindow.title = MainWindow.title.replace("*", "");
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
                FSInMenus.writeFile(FilePathSave, EditorCodeMirror.getValue(), "utf8", () => {

                });
            }
        }).catch((err) => {
            ElectronMenusRemote.dialog.showErrorBox("Error", `${err}`);
        });
    };

    EditorInMenu.addEventListener("keyup", () => {
        if (stateAutoSave === true) {
            FuncSave();
            knex("Editor").update("AutoSave", "true", () => {

            }).then();
        } else if (stateAutoSave === false) {
            knex("Editor").update("AutoSave", "false", () => {

            }).then();
            return null;
        }
    });

    const FuncPrint = () => {
        MainWindow.webContents.print({}, () => {

        });
    };
    ////////////////////////////////// End Functions Files


    ////////////////////////////////// Start Functions Edit
    const FuncUndo = () => {
        EditorCodeMirror.undo();
    };

    const FuncRedo = () => {
        EditorCodeMirror.redo();
    };

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
        let valueInputSearch = "";
        let valueInputReplace = "";
        CodeMirrorInMenu.style.top = "70px";
        HeaderEditor.style.top = "40px";
        SearchBox.style.top = "0";

        InputSearch.addEventListener("input", () => {
            valueInputSearch = InputSearch.value;
        });

        InputSearchClick.addEventListener("click", () => {
            MainWindow.webContents.findInPage(valueInputSearch, {
                forward: true,
                findNext: true,
            });
        });

        InputReplace.addEventListener("input", () => {
            valueInputReplace = InputReplace.value;
        });

        Replace.addEventListener("click", () => {
            let valueReplaced = EditorCodeMirror.getValue().replace(valueInputSearch, valueInputReplace);
            EditorCodeMirror.setValue(valueReplaced);
        });

        ReplaceAll.addEventListener("click", () => {
            let valueReplaced = EditorCodeMirror.getValue().replaceAll(valueInputSearch, valueInputReplace);
            EditorCodeMirror.setValue(valueReplaced);
        });

        Close.addEventListener("click", () => {
            CodeMirrorInMenu.style.top = "30px";
            HeaderEditor.style.top = "0";
            SearchBox.style.top = "-100px";
            MainWindow.webContents.stopFindInPage("keepSelection");
        });
    };
    ////////////////////////////////// End Functions Edit


    ////////////////////////////////// Start Functions Templates
    const FuncHTML = () => {
        MainWindow.title = "Editor Code - index.html";
        EditorCodeMirror.setValue(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Title</title>
<link rel="stylesheet" href="">
</head>
<body>

</body>
<script src=""></script>
</html>`);

        FileNameInMenu.innerHTML = "index";
        ModeFileInMenu.innerHTML = "html";
        EditorCodeMirror.setOption("mode", "text/html");
        stateSave = false;
    };

    const FuncCss = () => {
        MainWindow.title = "Editor Code - style.css";
        EditorCodeMirror.setValue(`* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}`);

        FileNameInMenu.innerHTML = "style";
        ModeFileInMenu.innerHTML = "css";
        EditorCodeMirror.setOption("mode", "text/css");
        stateSave = false;
    };

    const FuncJavaScript = () => {
        MainWindow.title = "Editor Code - script.js";
        EditorCodeMirror.setValue("use strict;");

        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "js";
        EditorCodeMirror.setOption("mode", "text/javascript");
        stateSave = false;
    };

    const FuncSql = () => {
        MainWindow.title = "Editor Code - main.sql";
        EditorCodeMirror.setValue("");

        FileNameInMenu.innerHTML = "main";
        ModeFileInMenu.innerHTML = "sql";
        EditorCodeMirror.setOption("mode", "text/x-sql");
        stateSave = false;
    };

    const FuncSass = () => {
        MainWindow.title = "Editor Code - style.scss";
        EditorCodeMirror.setValue(`* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "JetBrains Mono", serif;
    font-size: 16px;
}`);

        FileNameInMenu.innerHTML = "style";
        ModeFileInMenu.innerHTML = "scss";
        EditorCodeMirror.setOption("mode", "text/x-scss");
        stateSave = false;
    };

    const FuncPhp = () => {
        MainWindow.title = "Editor Code - index.php";
        EditorCodeMirror.setValue("<?php  ?>");

        FileNameInMenu.innerHTML = "index";
        ModeFileInMenu.innerHTML = "php";
        EditorCodeMirror.setOption("mode", "application/x-httpd-php");
        stateSave = false;
    };

    const FuncPython = () => {
        MainWindow.title = "Editor Code - main.py";
        EditorCodeMirror.setValue("");

        FileNameInMenu.innerHTML = "main";
        ModeFileInMenu.innerHTML = "py";
        EditorCodeMirror.setOption("mode", "text/x-python");
        stateSave = false;
    };

    const FuncCpp = () => {
        MainWindow.title = "Editor Code - main.cpp";
        EditorCodeMirror.setValue(`#include <iostream>
using namespace std;

int main()
{

}`);

        FileNameInMenu.innerHTML = "main";
        ModeFileInMenu.innerHTML = "cpp";
        EditorCodeMirror.setOption("mode", "text/x-c++src");
        stateSave = false;
    };

    const FuncCSharp = () => {
        MainWindow.title = "Editor Code - main.cs";
        EditorCodeMirror.setValue(`#using System;
namespace HelloWorld;

{
  class Program
  {
    static void Main(string[] args);
    {
      Console.WriteLine("Hello World!");
    }
  }
}`);

        FileNameInMenu.innerHTML = "main";
        ModeFileInMenu.innerHTML = "cs";
        EditorCodeMirror.setOption("mode", "text/x-csharp");
        stateSave = false;
    };

    const FuncKivy = () => {
        MainWindow.title = "Editor Code - style.kv";
        EditorCodeMirror.setValue("");

        FileNameInMenu.innerHTML = "style";
        ModeFileInMenu.innerHTML = "ky";
        stateSave = false;
    };

    const FuncJava = () => {
        MainWindow.title = "Editor Code - script.jar";
        EditorCodeMirror.setValue(`public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`);

        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "jar";
        EditorCodeMirror.setOption("mode", "text/x-java");
        stateSave = false;
    };

    const FuncKotlin = () => {
        MainWindow.title = "Editor Code - script.kt";
        EditorCodeMirror.setValue(`fun main() {
  println("Hello World")
}`);

        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "kt";
        EditorCodeMirror.setOption("mode", "text/x-squirrel");
        stateSave = false;
    };

    const FuncXml = () => {
        MainWindow.title = "Editor Code - index.xml";
        EditorCodeMirror.setValue(`<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>`);

        FileNameInMenu.innerHTML = "index";
        ModeFileInMenu.innerHTML = "xml";
        EditorCodeMirror.setOption("mode", "application/xml");
        stateSave = false;
    };

    const FuncTypeScript = () => {
        MainWindow.title = "Editor Code - script.ts";
        EditorCodeMirror.setValue("");

        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "ts";
        EditorCodeMirror.setOption("mode", "text/typescript");
        stateSave = false;
    };

    const FuncGo = () => {
        MainWindow.title = "Editor Code - script.go";
        EditorCodeMirror.setValue(`package main
import "fmt"
func main() {

}`);

        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "go";
        EditorCodeMirror.setOption("mode", "text/x-go");
        stateSave = false;
    };

    const FuncCython = () => {
        MainWindow.title = "Editor Code - script.pyx";
        EditorCodeMirror.setValue("");

        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "pyx";
        EditorCodeMirror.setOption("mode", "text/x-cython");
        stateSave = false;
    };

    const FuncD = () => {
        MainWindow.title = "Editor Code - script.d";
        EditorCodeMirror.setValue(`import std.stdio, std.array, std.algorithm;
        
void main()
{
    stdin ;
}`);

        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "d";
        EditorCodeMirror.setOption("mode", "text/x-d");
        stateSave = false;
    };

    const FuncDiff = () => {
        MainWindow.title = "Editor Code - script.diff";
        EditorCodeMirror.setValue("");

        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "diff";
        EditorCodeMirror.setOption("mode", "text/x-diff");
        stateSave = false;
    };

    const FuncLiveScript = () => {
        MainWindow.title = "Editor Code - script.ls";
        EditorCodeMirror.setValue("");

        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "ls";
        EditorCodeMirror.setOption("mode", "text/x-livescript");
        stateSave = false;
    };

    const FuncLua = () => {
        MainWindow.title = "Editor Code - script.lua";
        EditorCodeMirror.setValue("");

        FileNameInMenu.innerHTML = "script";
        ModeFileInMenu.innerHTML = "lua";
        EditorCodeMirror.setOption("mode", "text/x-lua");
        stateSave = false;
    };
    ////////////////////////////////// End Functions Templates


    ////////////////////////////////// Start Functions View
    const FuncStatusBar = () => {
        if (stateStatusBar === true) {
            CodeMirrorInMenu.style.height = "100%";
            StatusBarInMenu.style.bottom = "-35px";
            project.style.bottom = "0";
            stateStatusBar = false;
        } else {
            CodeMirrorInMenu.style.height = "calc(100% - 35px)";
            StatusBarInMenu.style.bottom = "0";
            project.style.bottom = "35px";
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

    const FuncLineWrapping = () => {
        if (stateLineWrapping === true) {
            EditorCodeMirror.setOption("lineWrapping", true);
            stateLineWrapping = false;
        } else {
            EditorCodeMirror.setOption("lineWrapping", false);
            stateLineWrapping = true;
        }
    };
    ////////////////////////////////// End Functions View


    ////////////////////////////////// Start Functions Code
    const autoFormatAllCode = () => {
        let totalLines = EditorCodeMirror.lineCount();
        let totalChars = EditorCodeMirror.getValue().length;
        EditorCodeMirror.autoFormatRange({line: 0, ch: 0}, {line: totalLines, ch: totalChars});
    };

    const FuncToggleComment = () => {
        EditorCodeMirror.toggleComment(getSelection());
    };
    ////////////////////////////////// End Functions Code


    ////////////////////////////////// Start Functions KeyMaps
    const FuncEmacs = () => {
        EditorCodeMirror.setOption("keyMaps", "emacs");
    };

    const FuncSublime = () => {
        EditorCodeMirror.setOption("keyMaps", "sublime");
    };

    const FuncVim = () => {
        EditorCodeMirror.setOption("keyMaps", "vim");
    };
    ////////////////////////////////// Start Functions KeyMaps


    ////////////////////////////////// Start Functions Theme
    const FuncDay = () => {
        EditorCodeMirror.setOption("theme", "3024-day");
        FuncSetThemeFromDB();
    };

    const Func3024Night = () => {
        EditorCodeMirror.setOption("theme", "3024-night");
        FuncSetThemeFromDB();
    };

    const FuncAbbott = () => {
        EditorCodeMirror.setOption("theme", "abbott");
        FuncSetThemeFromDB();
    };

    const FuncABCDef = () => {
        EditorCodeMirror.setOption("theme", "abcdef");
        FuncSetThemeFromDB();
    };

    const FuncAmbiance = () => {
        EditorCodeMirror.setOption("theme", "ambiance");
        FuncSetThemeFromDB();
    };

    const FuncAmbianceMobile = () => {
        EditorCodeMirror.setOption("theme", "ambiance-mobile");
        FuncSetThemeFromDB();
    };

    const FuncAyuDark = () => {
        EditorCodeMirror.setOption("theme", "ayu-dark");
        FuncSetThemeFromDB();
    };

    const FuncAyuMirage = () => {
        EditorCodeMirror.setOption("theme", "ayu-mirage");
        FuncSetThemeFromDB();
    };

    const FuncBaseDark = () => {
        EditorCodeMirror.setOption("theme", "base16-dark");
        FuncSetThemeFromDB();
    };

    const FuncBaseLight = () => {
        EditorCodeMirror.setOption("theme", "base16-light");
        FuncSetThemeFromDB();
    };

    const FuncBespin = () => {
        EditorCodeMirror.setOption("theme", "bespin");
        FuncSetThemeFromDB();
    };

    const FuncBlackBoard = () => {
        EditorCodeMirror.setOption("theme", "blackboard");
        FuncSetThemeFromDB();
    };

    const FuncCobalt = () => {
        EditorCodeMirror.setOption("theme", "cobalt");
        FuncSetThemeFromDB();
    };

    const FuncColorForth = () => {
        EditorCodeMirror.setOption("theme", "colorforth");
        FuncSetThemeFromDB();
    };

    const FuncDarcula = () => {
        EditorCodeMirror.setOption("theme", "darcula");
        FuncSetThemeFromDB();
    };

    const FuncDracula = () => {
        EditorCodeMirror.setOption("theme", "dracula");
        FuncSetThemeFromDB();
    };

    const FuncDuotoneDark = () => {
        EditorCodeMirror.setOption("theme", "duotone-dark");
        FuncSetThemeFromDB();
    };

    const FuncDuotoneLight = () => {
        EditorCodeMirror.setOption("theme", "duotone-light");
        FuncSetThemeFromDB();
    };

    const FuncEclipse = () => {
        EditorCodeMirror.setOption("theme", "eclipse");
        FuncSetThemeFromDB();
    };

    const FuncElegant = () => {
        EditorCodeMirror.setOption("theme", "elegant");
        FuncSetThemeFromDB();
    };

    const FuncErlangDark = () => {
        EditorCodeMirror.setOption("theme", "erlang-dark");
        FuncSetThemeFromDB();
    };

    const FuncGruvboxDark = () => {
        EditorCodeMirror.setOption("theme", "gruvbox-dark");
        FuncSetThemeFromDB();
    };

    const FuncHopscotch = () => {
        EditorCodeMirror.setOption("theme", "hopscotch");
        FuncSetThemeFromDB();
    };

    const FuncIcecoder = () => {
        EditorCodeMirror.setOption("theme", "icecoder");
        FuncSetThemeFromDB();
    };

    const FuncIdea = () => {
        EditorCodeMirror.setOption("theme", "idea");
        FuncSetThemeFromDB();
    };

    const FuncIsotope = () => {
        EditorCodeMirror.setOption("theme", "isotope");
        FuncSetThemeFromDB();
    };

    const FuncLesserDark = () => {
        EditorCodeMirror.setOption("theme", "lesser-dark");
        FuncSetThemeFromDB();
    };

    const FuncLiquiByte = () => {
        EditorCodeMirror.setOption("theme", "liquibyte");
        FuncSetThemeFromDB();
    };

    const FuncLucario = () => {
        EditorCodeMirror.setOption("theme", "lucario");
        FuncSetThemeFromDB();
    };

    const FuncMaterial = () => {
        EditorCodeMirror.setOption("theme", "material");
        FuncSetThemeFromDB();
    };

    const FuncMaterialDarker = () => {
        EditorCodeMirror.setOption("theme", "material-darker");
        FuncSetThemeFromDB();
    };

    const FuncMaterialOcean = () => {
        EditorCodeMirror.setOption("theme", "material-ocean");
        FuncSetThemeFromDB();
    };

    const FuncMaterialPalenight = () => {
        EditorCodeMirror.setOption("theme", "material-palenight");
        FuncSetThemeFromDB();
    };

    const FuncMbo = () => {
        EditorCodeMirror.setOption("theme", "mbo");
        FuncSetThemeFromDB();
    };

    const FuncMdnLike = () => {
        EditorCodeMirror.setOption("theme", "mdn-like");
        FuncSetThemeFromDB();
    };

    const FuncMidnight = () => {
        EditorCodeMirror.setOption("theme", "midnight");
        FuncSetThemeFromDB();
    };

    const FuncMonokai = () => {
        EditorCodeMirror.setOption("theme", "monokai");
        FuncSetThemeFromDB();
    };

    const FuncMoxer = () => {
        EditorCodeMirror.setOption("theme", "moxer");
        FuncSetThemeFromDB();
    };

    const FuncNeat = () => {
        EditorCodeMirror.setOption("theme", "neat");
        FuncSetThemeFromDB();
    };

    const FuncNeo = () => {
        EditorCodeMirror.setOption("theme", "neo");
        FuncSetThemeFromDB();
    };

    const FuncNight = () => {
        EditorCodeMirror.setOption("theme", "night");
        FuncSetThemeFromDB();
    };

    const FuncNord = () => {
        EditorCodeMirror.setOption("theme", "nord");
        FuncSetThemeFromDB();
    };

    const FuncPandaSyntax = () => {
        EditorCodeMirror.setOption("theme", "panda-syntax");
        FuncSetThemeFromDB();
    };

    const FuncParaisoDark = () => {
        EditorCodeMirror.setOption("theme", "paraiso-dark");
        FuncSetThemeFromDB();
    };

    const FuncParaisoLight = () => {
        EditorCodeMirror.setOption("theme", "paraiso-light");
        FuncSetThemeFromDB();
    };

    const FuncPastelOnDark = () => {
        EditorCodeMirror.setOption("theme", "pastel-on-dark");
        FuncSetThemeFromDB();
    };

    const FuncRailscasts = () => {
        EditorCodeMirror.setOption("theme", "railscasts");
        FuncSetThemeFromDB();
    };

    const FuncRubyblue = () => {
        EditorCodeMirror.setOption("theme", "rubyblue");
        FuncSetThemeFromDB();
    };

    const FuncSeti = () => {
        EditorCodeMirror.setOption("theme", "seti");
        FuncSetThemeFromDB();
    };

    const FuncShadowFox = () => {
        EditorCodeMirror.setOption("theme", "shadowfox");
        FuncSetThemeFromDB();
    };

    const FuncSolarized = () => {
        EditorCodeMirror.setOption("theme", "solarized");
        FuncSetThemeFromDB();
    };

    const FuncSsms = () => {
        EditorCodeMirror.setOption("theme", "ssms");
        FuncSetThemeFromDB();
    };

    const FuncMatrix = () => {
        EditorCodeMirror.setOption("theme", "the-matrix");
        FuncSetThemeFromDB();
    };

    const FuncTomorrowNightBright = () => {
        EditorCodeMirror.setOption("theme", "tomorrow-night-bright");
        FuncSetThemeFromDB();
    };

    const FuncTomorrowNightEighties = () => {
        EditorCodeMirror.setOption("theme", "tomorrow-night-eighties");
        FuncSetThemeFromDB();
    };

    const FuncTtcn = () => {
        EditorCodeMirror.setOption("theme", "ttcn");
        FuncSetThemeFromDB();
    };

    const FuncTwilight = () => {
        EditorCodeMirror.setOption("theme", "twilight");
        FuncSetThemeFromDB();
    };

    const FuncVibrantInk = () => {
        EditorCodeMirror.setOption("theme", "vibrant-ink");
        FuncSetThemeFromDB();
    };

    const FuncXqDark = () => {
        EditorCodeMirror.setOption("theme", "xq-dark");
        FuncSetThemeFromDB();
    };

    const FuncXqLight = () => {
        EditorCodeMirror.setOption("theme", "xq-light");
        FuncSetThemeFromDB();
    };

    const FuncYeti = () => {
        EditorCodeMirror.setOption("theme", "yeti");
        FuncSetThemeFromDB();
    };

    const FuncYonce = () => {
        EditorCodeMirror.setOption("theme", "yonce");
        FuncSetThemeFromDB();
    };

    const FuncZenburn = () => {
        EditorCodeMirror.setOption("theme", "zenburn");
        FuncSetThemeFromDB();
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

    const FuncDonate = () => {
        DonateWindow = new ElectronMenusRemote.BrowserWindow({
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
        DonateWindow.loadFile("App/Menus/Donate/index.html").then(() => {

        });
        DonateWindow.once("ready-to-show", () => {
            DonateWindow.show();
        });
    };
    ////////////////////////////////// End Functions Help
    ///////////////////////////////////////////////////////////// End Section Functions


    ///////////////////////////////////////////////////////////// Start Section Menu File
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
                label: "Open Project",
                accelerator: "CmdOrCtrl+O",
                click() {
                    FuncOpenFolder();
                },
            },
            {
                label: "Open File",
                accelerator: "CmdOrCtrl+shift+O",
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
    ///////////////////////////////////////////////////////////// End Section Menu File


    ///////////////////////////////////////////////////////////// Start Section Menu Edit
    let MenuEdit = new ElectronMenusRemote.MenuItem({
        label: "Edit",
        submenu: [
            {
                label: "Undo",
                click() {
                    FuncUndo();
                },
                accelerator: "CmdOrCtrl+Z",
            },
            {
                label: "Redo",
                click() {
                    FuncRedo();
                },
                accelerator: "CmdOrCtrl+shift+Z",
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
                accelerator: "CmdOrCtrl+F",
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
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu Edit


    ///////////////////////////////////////////////////////////// Start Section Menu Templates
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
                label: "Java Script",
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
                label: "Type Script",
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
            {
                label: "Cython",
                click() {
                    FuncCython();
                },
            },
            {
                label: "D",
                click() {
                    FuncD();
                },
            },
            {
                label: "Diff",
                click() {
                    FuncDiff();
                },
            },
            {
                label: "Live Script",
                click() {
                    FuncLiveScript();
                },
            },
            {
                label: "Lua",
                click() {
                    FuncLua();
                },
            },
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu Templates


    ///////////////////////////////////////////////////////////// Start Section Menu View
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
            {
                type: "checkbox",
                label: "lineWrapping",
                click() {
                    FuncLineWrapping();
                },
            },
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu View


    ///////////////////////////////////////////////////////////// Start Section Menu Code
    let MenuCode = new ElectronMenusRemote.MenuItem({
        label: "Code",
        submenu: [
            {
                label: "Format All Code",
                click() {
                    autoFormatAllCode();
                },
                accelerator: "CmdOrCtrl+alt+L",
            },
            {
                label: "Comment",
                click() {
                    FuncToggleComment();
                },
                accelerator: "CmdOrCtrl+/",
            },
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu Code


    ///////////////////////////////////////////////////////////// Start Section Menu Key Maps
    let MenuKeyMaps = new ElectronMenusRemote.MenuItem({
        label: "keyMaps",
        submenu: [
            {
                label: "emacs",
                click() {
                    FuncEmacs();
                    FuncSetKeyMapFromDB();
                },
            },
            {
                label: "sublime",
                click() {
                    FuncSublime();
                    FuncSetKeyMapFromDB();
                },
            },
            {
                label: "vim",
                click() {
                    FuncVim();
                    FuncSetKeyMapFromDB();
                },
            },
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu Key Maps


    ///////////////////////////////////////////////////////////// Start Section Menu Theme
    let MenuTheme = new ElectronMenusRemote.MenuItem({
        label: "Theme",
        submenu: [
            {
                label: "Day",
                click() {
                    FuncDay();
                },
            },
            {
                label: "Night",
                click() {
                    Func3024Night();
                },
            },
            {
                label: "Abbott",
                click() {
                    FuncAbbott();
                },
            },
            {
                label: "ABCDef",
                click() {
                    FuncABCDef();
                },
            },
            {
                label: "Ambiance",
                click() {
                    FuncAmbiance();
                },
            },
            {
                label: "Ambiance Mobile",
                click() {
                    FuncAmbianceMobile();
                },
            },
            {
                label: "Ayu Dark",
                click() {
                    FuncAyuDark();
                },
            },
            {
                label: "Ayu Mirage",
                click() {
                    FuncAyuMirage();
                },
            },
            {
                label: "Base Dark",
                click() {
                    FuncBaseDark();
                },
            },
            {
                label: "Base Light",
                click() {
                    FuncBaseLight();
                },
            },
            {
                label: "Bespin",
                click() {
                    FuncBespin();
                },
            },
            {
                label: "Black Board",
                click() {
                    FuncBlackBoard();
                },
            },
            {
                label: "Cobalt",
                click() {
                    FuncCobalt();
                },
            },
            {
                label: "Color Forth",
                click() {
                    FuncColorForth();
                },
            },
            {
                label: "Darcula",
                click() {
                    FuncDarcula();
                },
            },
            {
                label: "Dracula",
                click() {
                    FuncDracula();
                },
            },
            {
                label: "Duotone Dark",
                click() {
                    FuncDuotoneDark();
                },
            },
            {
                label: "Duotone Light",
                click() {
                    FuncDuotoneLight();
                },
            },
            {
                label: "Eclipse",
                click() {
                    FuncEclipse();
                },
            },
            {
                label: "Elegant",
                click() {
                    FuncElegant();
                },
            },
            {
                label: "Erlang Dark",
                click() {
                    FuncErlangDark();
                },
            },
            {
                label: "Gruvbox Dark",
                click() {
                    FuncGruvboxDark();
                },
            },
            {
                label: "Hopscotch",
                click() {
                    FuncHopscotch();
                },
            },
            {
                label: "Icecoder",
                click() {
                    FuncIcecoder();
                },
            },
            {
                label: "Idea",
                click() {
                    FuncIdea();
                },
            },
            {
                label: "Isotope",
                click() {
                    FuncIsotope();
                },
            },
            {
                label: "Lesser Dark",
                click() {
                    FuncLesserDark();
                },
            },
            {
                label: "Liqui Byte",
                click() {
                    FuncLiquiByte();
                },
            },
            {
                label: "Lucario",
                click() {
                    FuncLucario();
                },
            },
            {
                label: "Material",
                click() {
                    FuncMaterial();
                },
            },
            {
                label: "Material Darker",
                click() {
                    FuncMaterialDarker();
                },
            },
            {
                label: "Material Ocean",
                click() {
                    FuncMaterialOcean();
                },
            },
            {
                label: "Material Palenight",
                click() {
                    FuncMaterialPalenight();
                },
            },
            {
                label: "Mbo",
                click() {
                    FuncMbo();
                },
            },
            {
                label: "Mdn Like",
                click() {
                    FuncMdnLike();
                },
            },
            {
                label: "Midnight",
                click() {
                    FuncMidnight();
                },
            },
            {
                label: "Monokai",
                click() {
                    FuncMonokai();
                },
            },
            {
                label: "Moxer",
                click() {
                    FuncMoxer();
                },
            },
            {
                label: "Neat",
                click() {
                    FuncNeat();
                },
            },
            {
                label: "Neo",
                click() {
                    FuncNeo();
                },
            },
            {
                label: "Night",
                click() {
                    FuncNight();
                },
            },
            {
                label: "Nord",
                click() {
                    FuncNord();
                },
            },
            {
                label: "Panda Syntax",
                click() {
                    FuncPandaSyntax();
                },
            },
            {
                label: "Paraiso Dark",
                click() {
                    FuncParaisoDark();
                },
            },
            {
                label: "Paraiso Light",
                click() {
                    FuncParaisoLight();
                },
            },
            {
                label: "Pastel On Dark",
                click() {
                    FuncPastelOnDark();
                },
            },
            {
                label: "Railscasts",
                click() {
                    FuncRailscasts();
                },
            },
            {
                label: "Rubyblue",
                click() {
                    FuncRubyblue();
                },
            },
            {
                label: "Seti",
                click() {
                    FuncSeti();
                },
            },
            {
                label: "Shadow Fox",
                click() {
                    FuncShadowFox();
                },
            },
            {
                label: "Solarized",
                click() {
                    FuncSolarized();
                },
            },
            {
                label: "Ssms",
                click() {
                    FuncSsms();
                },
            },
            {
                label: "Matrix",
                click() {
                    FuncMatrix();
                },
            },
            {
                label: "Tomorrow Night Bright",
                click() {
                    FuncTomorrowNightBright();
                },
            },
            {
                label: "Tomorrow Night Eighties",
                click() {
                    FuncTomorrowNightEighties();
                },
            },
            {
                label: "Ttcn",
                click() {
                    FuncTtcn();
                },
            },
            {
                label: "Twilight",
                click() {
                    FuncTwilight();
                },
            },
            {
                label: "Vibrant Ink",
                click() {
                    FuncVibrantInk();
                },
            },
            {
                label: "Xq Dark",
                click() {
                    FuncXqDark();
                },
            },
            {
                label: "Xq Light",
                click() {
                    FuncXqLight();
                },
            },
            {
                label: "Yeti",
                click() {
                    FuncYeti();
                },
            },
            {
                label: "Yonce",
                click() {
                    FuncYonce();
                },
            },
            {
                label: "Zenburn",
                click() {
                    FuncZenburn();
                },
            },
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu Theme


    ///////////////////////////////////////////////////////////// Start Section Menu Help
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
                label: "Donate",
                click() {
                    FuncDonate();
                },
            },
            {
                role: "toggleDevTools",
            },
        ],
    });
    ///////////////////////////////////////////////////////////// End Section Menu Help


    ///////////////////////////////////////////////////////////// Start Section Context Menus Window
    let ContextMenusWindow = ElectronMenusRemote.Menu.buildFromTemplate([
        {
            label: "Undo",
            click() {
                FuncUndo();
            },
        },
        {
            label: "Redo",
            click() {
                FuncRedo();
            },
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
    ///////////////////////////////////////////////////////////// End Section Context Menus Window


    ///////////////////////////////////////////////////////////// Start Section Set Menus And Context Menu
    let Menus = ElectronMenusRemote.Menu.buildFromTemplate([MenuFile, MenuEdit, MenuTemplates, MenuView, MenuCode, MenuKeyMaps, MenuTheme, MenuHelp]);
    ElectronMenusRemote.Menu.setApplicationMenu(Menus);

    window.addEventListener("contextmenu", (event) => {
        ContextMenusWindow.popup({
            x: event.x,
            y: event.y,
            window: MainWindow,
        });
    }, false);
    ///////////////////////////////////////////////////////////// End Section Set Menus And Context Menu
});