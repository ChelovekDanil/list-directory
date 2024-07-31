/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client/src/buttons.ts":
/*!*******************************!*\
  !*** ./client/src/buttons.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setRoot = exports.sortFlag = exports.root = exports.buttonSort = exports.buttonRoot = exports.setSort = exports.backRoot = void 0;
var refresh_1 = __webpack_require__(/*! ./refresh */ "./client/src/refresh.ts");
var buttonRoot = document.getElementById("button-root");
exports.buttonRoot = buttonRoot;
var buttonSort = document.getElementById("button-sort");
exports.buttonSort = buttonSort;
var sortFlag = "asc";
exports.sortFlag = sortFlag;
var root = "";
exports.root = root;
var ascSort = "asc";
var descSort = "desc";
// Возврат к предыдущему пути
var backRoot = function () {
    if (root === "/") {
        return;
    }
    var resultRoot = root.split('/').slice(0, -1).join('/');
    if (resultRoot === "") {
        exports.root = root = "/";
        refresh_1.currentRootElement.textContent = "/";
        (0, refresh_1.refreshTable)();
        return;
    }
    refresh_1.currentRootElement.textContent = resultRoot;
    exports.root = root = resultRoot;
    (0, refresh_1.refreshTable)();
};
exports.backRoot = backRoot;
// Изменение сортировки
var setSort = function () {
    if (sortFlag === descSort) {
        exports.sortFlag = sortFlag = ascSort;
        buttonSort.textContent = "по убыванию";
    }
    else if (sortFlag === ascSort) {
        exports.sortFlag = sortFlag = descSort;
        buttonSort.textContent = "по возрастанию";
    }
    (0, refresh_1.refreshTable)();
};
exports.setSort = setSort;
// Для изменения значение root
var setRoot = function (newRoot) {
    exports.root = root = newRoot;
};
exports.setRoot = setRoot;


/***/ }),

/***/ "./client/src/fileInfo.ts":
/*!********************************!*\
  !*** ./client/src/fileInfo.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileInfo = exports.getFilesInfo = void 0;
var buttons_1 = __webpack_require__(/*! ./buttons */ "./client/src/buttons.ts");
var Response = /** @class */ (function () {
    function Response(Error_code, Error_message, Data, Root) {
        this.error_code = Error_code;
        this.error_message = Error_message;
        this.data = Data;
        this.root = Root;
    }
    return Response;
}());
var FileInfo = /** @class */ (function () {
    function FileInfo(Type, Name, Size_in_unit, Size_in_bytes) {
        this.type = Type;
        this.name = Name;
        this.size_in_unit = Size_in_unit;
        this.size_in_bytes = Size_in_bytes;
    }
    return FileInfo;
}());
exports.FileInfo = FileInfo;
// Получение информации о файлах
var getFilesInfo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var urlRequest, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                urlRequest = "fs?root=".concat(buttons_1.root, "&sort=").concat(buttons_1.sortFlag);
                result = [];
                return [4 /*yield*/, fetch(urlRequest)
                        .then(function (response) {
                        return response.json();
                    })
                        .then(function (data) {
                        if (data.error_code === 1) {
                            alert(data.error_message);
                        }
                        if (buttons_1.root === "") {
                            (0, buttons_1.setRoot)(data.root);
                        }
                        result = data.data;
                        return result;
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
exports.getFilesInfo = getFilesInfo;


/***/ }),

/***/ "./client/src/refresh.ts":
/*!*******************************!*\
  !*** ./client/src/refresh.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.currentRootElement = exports.setRefreshing = exports.refreshing = exports.refreshTable = void 0;
var buttons_1 = __webpack_require__(/*! ./buttons */ "./client/src/buttons.ts");
var fileInfo_1 = __webpack_require__(/*! ./fileInfo */ "./client/src/fileInfo.ts");
var ui_1 = __webpack_require__(/*! ./ui */ "./client/src/ui.ts");
var currentRootElement = document.getElementById("current-root");
exports.currentRootElement = currentRootElement;
var table = document.getElementById("table");
var refreshing = false;
exports.refreshing = refreshing;
// Обновление таблицы
var refreshTable = function () { return __awaiter(void 0, void 0, void 0, function () {
    var filesInfo, tableBody, newTableBody;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, ui_1.freeze)(true);
                return [4 /*yield*/, (0, fileInfo_1.getFilesInfo)()];
            case 1:
                filesInfo = _a.sent();
                tableBody = table.querySelector("tbody");
                tableBody.remove();
                newTableBody = document.createElement("tbody");
                filesInfo.forEach(function (fileInfo) {
                    newTableBody.appendChild(createLine(fileInfo));
                });
                table.appendChild(newTableBody);
                (0, ui_1.freeze)(false);
                return [2 /*return*/];
        }
    });
}); };
exports.refreshTable = refreshTable;
// Создание строки таблицы
var createLine = function (fileInfo) {
    var line = document.createElement("tr");
    if (fileInfo.type === "Дир") {
        line.classList.add("directory");
        line.addEventListener('click', function () {
            if (refreshing) {
                return;
            }
            (0, buttons_1.setRoot)("".concat(buttons_1.root, "/").concat(fileInfo.name));
            currentRootElement.textContent = buttons_1.root;
            refreshTable();
        });
    }
    else {
        line.classList.add("file");
    }
    var columnType = document.createElement("th");
    var columnName = document.createElement("th");
    var columnSize = document.createElement("th");
    columnType.innerText = fileInfo.type;
    columnName.innerText = fileInfo.name;
    columnSize.innerText = fileInfo.size_in_unit;
    line.appendChild(columnType);
    line.appendChild(columnName);
    line.appendChild(columnSize);
    return line;
};
var setRefreshing = function (newRefreshing) {
    exports.refreshing = refreshing = newRefreshing;
};
exports.setRefreshing = setRefreshing;


/***/ }),

/***/ "./client/src/ui.ts":
/*!**************************!*\
  !*** ./client/src/ui.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.freeze = void 0;
var buttons_1 = __webpack_require__(/*! ./buttons */ "./client/src/buttons.ts");
var refresh_1 = __webpack_require__(/*! ./refresh */ "./client/src/refresh.ts");
// Замараживает кнопки и выводит loader
var freeze = function (isBlock) {
    // разблокировка
    if (!isBlock) {
        document.getElementById("loader").remove();
        buttons_1.buttonRoot.disabled = false;
        buttons_1.buttonSort.disabled = false;
        (0, refresh_1.setRefreshing)(false);
        return;
    }
    // блокировка
    (0, refresh_1.setRefreshing)(true);
    buttons_1.buttonRoot.disabled = true;
    buttons_1.buttonSort.disabled = true;
    var rootBlock = document.getElementById("root");
    var currentRoot = document.getElementById("current-root");
    var loader = document.createElement("div");
    loader.id = "loader";
    rootBlock.insertBefore(loader, currentRoot);
};
exports.freeze = freeze;


/***/ }),

/***/ "./client/src/update.ts":
/*!******************************!*\
  !*** ./client/src/update.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updatePage = void 0;
var buttons_1 = __webpack_require__(/*! ./buttons */ "./client/src/buttons.ts");
var refresh_1 = __webpack_require__(/*! ./refresh */ "./client/src/refresh.ts");
// Обновление страницы
var updatePage = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, refresh_1.refreshTable)()];
            case 1:
                _a.sent();
                refresh_1.currentRootElement.textContent = buttons_1.root;
                return [2 /*return*/];
        }
    });
}); };
exports.updatePage = updatePage;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!****************************!*\
  !*** ./client/src/main.ts ***!
  \****************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var buttons_1 = __webpack_require__(/*! ./buttons */ "./client/src/buttons.ts");
var update_1 = __webpack_require__(/*! ./update */ "./client/src/update.ts");
// ждет когда страница полностью загрузится 
document.addEventListener('DOMContentLoaded', function () {
    // Запуск обновления страницы
    (0, update_1.updatePage)();
    // привязка обработчиков событий
    buttons_1.buttonRoot.addEventListener("click", buttons_1.backRoot);
    buttons_1.buttonSort.addEventListener("click", buttons_1.setSort);
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Iiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbGlzdC1kaXJlY3RvcnkvLi9jbGllbnQvc3JjL2J1dHRvbnMudHMiLCJ3ZWJwYWNrOi8vbGlzdC1kaXJlY3RvcnkvLi9jbGllbnQvc3JjL2ZpbGVJbmZvLnRzIiwid2VicGFjazovL2xpc3QtZGlyZWN0b3J5Ly4vY2xpZW50L3NyYy9yZWZyZXNoLnRzIiwid2VicGFjazovL2xpc3QtZGlyZWN0b3J5Ly4vY2xpZW50L3NyYy91aS50cyIsIndlYnBhY2s6Ly9saXN0LWRpcmVjdG9yeS8uL2NsaWVudC9zcmMvdXBkYXRlLnRzIiwid2VicGFjazovL2xpc3QtZGlyZWN0b3J5L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2xpc3QtZGlyZWN0b3J5Ly4vY2xpZW50L3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGN1cnJlbnRSb290RWxlbWVudCwgcmVmcmVzaFRhYmxlIH0gZnJvbSBcIi4vcmVmcmVzaFwiO1xuXG5jb25zdCBidXR0b25Sb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b24tcm9vdFwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbmNvbnN0IGJ1dHRvblNvcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbi1zb3J0XCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuXG5sZXQgc29ydEZsYWc6IHN0cmluZyA9IFwiYXNjXCI7XG5sZXQgcm9vdDogc3RyaW5nID0gXCJcIjtcblxuY29uc3QgYXNjU29ydDogc3RyaW5nID0gXCJhc2NcIjtcbmNvbnN0IGRlc2NTb3J0OiBzdHJpbmcgPSBcImRlc2NcIjtcblxuLy8g0JLQvtC30LLRgNCw0YIg0Log0L/RgNC10LTRi9C00YPRidC10LzRgyDQv9GD0YLQuFxuY29uc3QgYmFja1Jvb3QgPSAoKSA9PiB7XG4gICAgaWYgKHJvb3QgPT09IFwiL1wiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHRSb290OiBzdHJpbmcgPSByb290LnNwbGl0KCcvJykuc2xpY2UoMCwgLTEpLmpvaW4oJy8nKTtcblxuICAgIGlmIChyZXN1bHRSb290ID09PSBcIlwiKSB7XG4gICAgICAgIHJvb3QgPSBcIi9cIjtcblxuICAgICAgICBjdXJyZW50Um9vdEVsZW1lbnQhLnRleHRDb250ZW50ID0gXCIvXCI7XG4gICAgICAgIHJlZnJlc2hUYWJsZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY3VycmVudFJvb3RFbGVtZW50IS50ZXh0Q29udGVudCA9IHJlc3VsdFJvb3Q7XG4gICAgcm9vdCA9IHJlc3VsdFJvb3Q7XG4gICAgcmVmcmVzaFRhYmxlKCk7XG59XG5cbi8vINCY0LfQvNC10L3QtdC90LjQtSDRgdC+0YDRgtC40YDQvtCy0LrQuFxuY29uc3Qgc2V0U29ydCA9ICgpID0+IHtcbiAgICBpZiAoc29ydEZsYWcgPT09IGRlc2NTb3J0KSB7XG4gICAgICAgIHNvcnRGbGFnID0gYXNjU29ydDtcbiAgICAgICAgYnV0dG9uU29ydCEudGV4dENvbnRlbnQgPSBcItC/0L4g0YPQsdGL0LLQsNC90LjRjlwiO1xuICAgIH0gZWxzZSBpZiAoc29ydEZsYWcgPT09IGFzY1NvcnQpIHtcbiAgICAgICAgc29ydEZsYWcgPSBkZXNjU29ydDtcbiAgICAgICAgYnV0dG9uU29ydCEudGV4dENvbnRlbnQgPSBcItC/0L4g0LLQvtC30YDQsNGB0YLQsNC90LjRjlwiO1xuICAgIH1cblxuICAgIHJlZnJlc2hUYWJsZSgpO1xufVxuXG4vLyDQlNC70Y8g0LjQt9C80LXQvdC10L3QuNGPINC30L3QsNGH0LXQvdC40LUgcm9vdFxuY29uc3Qgc2V0Um9vdCA9IChuZXdSb290OiBzdHJpbmcpID0+IHtcbiAgICByb290ID0gbmV3Um9vdDtcbn1cblxuZXhwb3J0IHtiYWNrUm9vdCwgc2V0U29ydCwgYnV0dG9uUm9vdCwgYnV0dG9uU29ydCwgcm9vdCwgc29ydEZsYWcsIHNldFJvb3R9OyIsImltcG9ydCB7IHJvb3QsIHNldFJvb3QsIHNvcnRGbGFnIH0gZnJvbSBcIi4vYnV0dG9uc1wiO1xuXG5jbGFzcyBSZXNwb25zZSB7XG4gICAgZXJyb3JfY29kZTogbnVtYmVyO1xuICAgIGVycm9yX21lc3NhZ2U6IHN0cmluZztcbiAgICBkYXRhOiBGaWxlSW5mb1tdO1xuICAgIHJvb3Q6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKEVycm9yX2NvZGU6IG51bWJlciwgRXJyb3JfbWVzc2FnZTogc3RyaW5nLCBEYXRhOiBGaWxlSW5mb1tdLCBSb290OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5lcnJvcl9jb2RlID0gRXJyb3JfY29kZTtcbiAgICAgICAgdGhpcy5lcnJvcl9tZXNzYWdlID0gRXJyb3JfbWVzc2FnZTtcbiAgICAgICAgdGhpcy5kYXRhID0gRGF0YTtcbiAgICAgICAgdGhpcy5yb290ID0gUm9vdDtcbiAgICB9XG59XG5cbmNsYXNzIEZpbGVJbmZvIHtcbiAgICB0eXBlOiBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHNpemVfaW5fdW5pdDogc3RyaW5nO1xuICAgIHNpemVfaW5fYnl0ZXM6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKFR5cGU6IHN0cmluZywgTmFtZTogc3RyaW5nLCBTaXplX2luX3VuaXQ6IHN0cmluZywgU2l6ZV9pbl9ieXRlczogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudHlwZSA9IFR5cGU7XG4gICAgICAgIHRoaXMubmFtZSA9IE5hbWU7XG4gICAgICAgIHRoaXMuc2l6ZV9pbl91bml0ID0gU2l6ZV9pbl91bml0O1xuICAgICAgICB0aGlzLnNpemVfaW5fYnl0ZXMgPSBTaXplX2luX2J5dGVzO1xuICAgIH1cbn1cblxuLy8g0J/QvtC70YPRh9C10L3QuNC1INC40L3RhNC+0YDQvNCw0YbQuNC4INC+INGE0LDQudC70LDRhVxuY29uc3QgZ2V0RmlsZXNJbmZvID0gYXN5bmMgKCk6IFByb21pc2U8RmlsZUluZm9bXT4gPT4ge1xuICAgIGNvbnN0IHVybFJlcXVlc3Q6IHN0cmluZyA9IGBmcz9yb290PSR7cm9vdH0mc29ydD0ke3NvcnRGbGFnfWA7XG4gICAgbGV0IHJlc3VsdDogRmlsZUluZm9bXSA9IFtdO1xuXG4gICAgYXdhaXQgZmV0Y2godXJsUmVxdWVzdClcbiAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxuICAgIH0pXG4gICAgLnRoZW4oKGRhdGE6IFJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChkYXRhLmVycm9yX2NvZGUgPT09IDEpIHtcbiAgICAgICAgICAgIGFsZXJ0KGRhdGEuZXJyb3JfbWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJvb3QgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIHNldFJvb3QoZGF0YS5yb290KTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSBkYXRhLmRhdGE7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQge2dldEZpbGVzSW5mbywgRmlsZUluZm99OyIsImltcG9ydCB7IHJvb3QsIHNldFJvb3QgfSBmcm9tIFwiLi9idXR0b25zXCI7XG5pbXBvcnQgeyBGaWxlSW5mbywgZ2V0RmlsZXNJbmZvIH0gZnJvbSBcIi4vZmlsZUluZm9cIjtcbmltcG9ydCB7IGZyZWV6ZSB9IGZyb20gXCIuL3VpXCI7XG5cbmNvbnN0IGN1cnJlbnRSb290RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3VycmVudC1yb290XCIpIGFzIEhUTUxQYXJhZ3JhcGhFbGVtZW50O1xuY29uc3QgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRhYmxlXCIpIGFzIEhUTUxUYWJsZUVsZW1lbnQ7XG5cbmxldCByZWZyZXNoaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbi8vINCe0LHQvdC+0LLQu9C10L3QuNC1INGC0LDQsdC70LjRhtGLXG5jb25zdCByZWZyZXNoVGFibGUgPSBhc3luYyAoKSA9PiB7XG4gICAgZnJlZXplKHRydWUpO1xuXG4gICAgY29uc3QgZmlsZXNJbmZvOiBGaWxlSW5mb1tdID0gYXdhaXQgZ2V0RmlsZXNJbmZvKCk7XG4gICAgY29uc3QgdGFibGVCb2R5ID0gdGFibGUhLnF1ZXJ5U2VsZWN0b3IoXCJ0Ym9keVwiKSBhcyBIVE1MVGFibGVTZWN0aW9uRWxlbWVudDtcblxuICAgIHRhYmxlQm9keSEucmVtb3ZlKCk7XG5cbiAgICBjb25zdCBuZXdUYWJsZUJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGJvZHlcIikgYXMgSFRNTFRhYmxlU2VjdGlvbkVsZW1lbnQ7XG4gICAgZmlsZXNJbmZvIS5mb3JFYWNoKGZpbGVJbmZvID0+IHtcbiAgICAgICAgbmV3VGFibGVCb2R5LmFwcGVuZENoaWxkKGNyZWF0ZUxpbmUoZmlsZUluZm8pKTtcbiAgICAgIH0pO1xuXG4gICAgdGFibGUhLmFwcGVuZENoaWxkKG5ld1RhYmxlQm9keSk7XG5cbiAgICBmcmVlemUoZmFsc2UpO1xufVxuXG4vLyDQodC+0LfQtNCw0L3QuNC1INGB0YLRgNC+0LrQuCDRgtCw0LHQu9C40YbRi1xuY29uc3QgY3JlYXRlTGluZSA9IChmaWxlSW5mbzogRmlsZUluZm8pID0+IHtcbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpIGFzIEhUTUxUYWJsZVJvd0VsZW1lbnQ7XG5cbiAgICBpZiAoZmlsZUluZm8udHlwZSA9PT0gXCLQlNC40YBcIikge1xuICAgICAgICBsaW5lLmNsYXNzTGlzdC5hZGQoXCJkaXJlY3RvcnlcIik7XG4gICAgICAgIGxpbmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVmcmVzaGluZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0Um9vdChgJHtyb290fS8ke2ZpbGVJbmZvLm5hbWV9YCk7XG4gICAgICAgICAgICBjdXJyZW50Um9vdEVsZW1lbnQhLnRleHRDb250ZW50ID0gcm9vdDtcbiAgICAgICAgICAgIHJlZnJlc2hUYWJsZSgpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBsaW5lLmNsYXNzTGlzdC5hZGQoXCJmaWxlXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbHVtblR5cGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGhcIikgYXMgSFRNTFRhYmxlQ2VsbEVsZW1lbnQ7XG4gICAgY29uc3QgY29sdW1uTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiKSBhcyBIVE1MVGFibGVDZWxsRWxlbWVudDtcbiAgICBjb25zdCBjb2x1bW5TaXplID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRoXCIpIGFzIEhUTUxUYWJsZUNlbGxFbGVtZW50O1xuXG4gICAgY29sdW1uVHlwZS5pbm5lclRleHQgPSBmaWxlSW5mby50eXBlO1xuICAgIGNvbHVtbk5hbWUuaW5uZXJUZXh0ID0gZmlsZUluZm8ubmFtZTtcbiAgICBjb2x1bW5TaXplLmlubmVyVGV4dCA9IGZpbGVJbmZvLnNpemVfaW5fdW5pdDtcblxuICAgIGxpbmUuYXBwZW5kQ2hpbGQoY29sdW1uVHlwZSk7XG4gICAgbGluZS5hcHBlbmRDaGlsZChjb2x1bW5OYW1lKTtcbiAgICBsaW5lLmFwcGVuZENoaWxkKGNvbHVtblNpemUpO1xuXG4gICAgcmV0dXJuIGxpbmU7XG59XG5cbmNvbnN0IHNldFJlZnJlc2hpbmcgPSAobmV3UmVmcmVzaGluZzogYm9vbGVhbikgPT4ge1xuICAgIHJlZnJlc2hpbmcgPSBuZXdSZWZyZXNoaW5nO1xufVxuXG5leHBvcnQge3JlZnJlc2hUYWJsZSwgcmVmcmVzaGluZywgc2V0UmVmcmVzaGluZywgY3VycmVudFJvb3RFbGVtZW50fTsiLCJpbXBvcnQgeyBidXR0b25Sb290LCBidXR0b25Tb3J0IH0gZnJvbSBcIi4vYnV0dG9uc1wiO1xuaW1wb3J0IHsgc2V0UmVmcmVzaGluZyB9IGZyb20gXCIuL3JlZnJlc2hcIjtcblxuLy8g0JfQsNC80LDRgNCw0LbQuNCy0LDQtdGCINC60L3QvtC/0LrQuCDQuCDQstGL0LLQvtC00LjRgiBsb2FkZXJcbmNvbnN0IGZyZWV6ZSA9IChpc0Jsb2NrOiBib29sZWFuKSA9PiB7XG4gICAgLy8g0YDQsNC30LHQu9C+0LrQuNGA0L7QstC60LBcbiAgICBpZiAoIWlzQmxvY2spIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkZXJcIikhLnJlbW92ZSgpO1xuICAgICAgICBcbiAgICAgICAgYnV0dG9uUm9vdCEuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgYnV0dG9uU29ydCEuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIHNldFJlZnJlc2hpbmcoZmFsc2UpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIC8vINCx0LvQvtC60LjRgNC+0LLQutCwXG4gICAgc2V0UmVmcmVzaGluZyh0cnVlKTtcblxuICAgIGJ1dHRvblJvb3QuZGlzYWJsZWQgPSB0cnVlO1xuICAgIGJ1dHRvblNvcnQuZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgY29uc3Qgcm9vdEJsb2NrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpIGFzIEhUTUxEaXZFbGVtZW50O1xuICAgIGNvbnN0IGN1cnJlbnRSb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXJyZW50LXJvb3RcIikgYXMgSFRNTFBhcmFncmFwaEVsZW1lbnQ7XG4gICAgY29uc3QgbG9hZGVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICBsb2FkZXIuaWQgPSBcImxvYWRlclwiO1xuICAgIHJvb3RCbG9jayEuaW5zZXJ0QmVmb3JlKGxvYWRlciwgY3VycmVudFJvb3QpO1xufVxuXG5leHBvcnQge2ZyZWV6ZX07IiwiaW1wb3J0IHsgcm9vdCB9IGZyb20gXCIuL2J1dHRvbnNcIjtcbmltcG9ydCB7IGN1cnJlbnRSb290RWxlbWVudCwgcmVmcmVzaFRhYmxlIH0gZnJvbSBcIi4vcmVmcmVzaFwiO1xuXG4vLyDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdGC0YDQsNC90LjRhtGLXG5jb25zdCB1cGRhdGVQYWdlID0gYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHJlZnJlc2hUYWJsZSgpO1xuICAgIGN1cnJlbnRSb290RWxlbWVudCEudGV4dENvbnRlbnQgPSByb290O1xufVxuXG5leHBvcnQge3VwZGF0ZVBhZ2V9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQge2JhY2tSb290LCBzZXRTb3J0LCBidXR0b25Sb290LCBidXR0b25Tb3J0fSBmcm9tICcuL2J1dHRvbnMnO1xuaW1wb3J0IHsgdXBkYXRlUGFnZSB9IGZyb20gJy4vdXBkYXRlJztcblxuLy8g0LbQtNC10YIg0LrQvtCz0LTQsCDRgdGC0YDQsNC90LjRhtCwINC/0L7Qu9C90L7RgdGC0YzRjiDQt9Cw0LPRgNGD0LfQuNGC0YHRjyBcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8g0JfQsNC/0YPRgdC6INC+0LHQvdC+0LLQu9C10L3QuNGPINGB0YLRgNCw0L3QuNGG0YtcbiAgICB1cGRhdGVQYWdlKCk7XG5cbiAgICAvLyDQv9GA0LjQstGP0LfQutCwINC+0LHRgNCw0LHQvtGC0YfQuNC60L7QsiDRgdC+0LHRi9GC0LjQuVxuICAgIGJ1dHRvblJvb3QhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBiYWNrUm9vdCk7XG4gICAgYnV0dG9uU29ydCEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNldFNvcnQpOyAgXG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=