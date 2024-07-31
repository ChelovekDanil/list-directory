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
                if (filesInfo.length < 1) {
                    (0, ui_1.freeze)(false);
                    (0, buttons_1.backRoot)();
                    return [2 /*return*/];
                }
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
// Изменяет значение у refreshing
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBZ0M7SUFDaEMsb0JBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsa0JBQVEsQ0FBQyxDQUFDO0lBQ2hELG9CQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGlCQUFPLENBQUMsQ0FBQztBQUNuRCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2xpc3QtZGlyZWN0b3J5Ly4vY2xpZW50L3NyYy9idXR0b25zLnRzIiwid2VicGFjazovL2xpc3QtZGlyZWN0b3J5Ly4vY2xpZW50L3NyYy9maWxlSW5mby50cyIsIndlYnBhY2s6Ly9saXN0LWRpcmVjdG9yeS8uL2NsaWVudC9zcmMvcmVmcmVzaC50cyIsIndlYnBhY2s6Ly9saXN0LWRpcmVjdG9yeS8uL2NsaWVudC9zcmMvdWkudHMiLCJ3ZWJwYWNrOi8vbGlzdC1kaXJlY3RvcnkvLi9jbGllbnQvc3JjL3VwZGF0ZS50cyIsIndlYnBhY2s6Ly9saXN0LWRpcmVjdG9yeS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9saXN0LWRpcmVjdG9yeS8uL2NsaWVudC9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjdXJyZW50Um9vdEVsZW1lbnQsIHJlZnJlc2hUYWJsZSB9IGZyb20gXCIuL3JlZnJlc2hcIjtcblxuY29uc3QgYnV0dG9uUm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uLXJvb3RcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG5jb25zdCBidXR0b25Tb3J0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b24tc29ydFwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcblxubGV0IHNvcnRGbGFnOiBzdHJpbmcgPSBcImFzY1wiO1xubGV0IHJvb3Q6IHN0cmluZyA9IFwiXCI7XG5cbmNvbnN0IGFzY1NvcnQ6IHN0cmluZyA9IFwiYXNjXCI7XG5jb25zdCBkZXNjU29ydDogc3RyaW5nID0gXCJkZXNjXCI7XG5cbi8vINCS0L7Qt9Cy0YDQsNGCINC6INC/0YDQtdC00YvQtNGD0YnQtdC80YMg0L/Rg9GC0LhcbmNvbnN0IGJhY2tSb290ID0gKCkgPT4ge1xuICAgIGlmIChyb290ID09PSBcIi9cIikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0Um9vdDogc3RyaW5nID0gcm9vdC5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5qb2luKCcvJyk7XG5cbiAgICBpZiAocmVzdWx0Um9vdCA9PT0gXCJcIikge1xuICAgICAgICByb290ID0gXCIvXCI7XG5cbiAgICAgICAgY3VycmVudFJvb3RFbGVtZW50IS50ZXh0Q29udGVudCA9IFwiL1wiO1xuICAgICAgICByZWZyZXNoVGFibGUoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGN1cnJlbnRSb290RWxlbWVudCEudGV4dENvbnRlbnQgPSByZXN1bHRSb290O1xuICAgIHJvb3QgPSByZXN1bHRSb290O1xuICAgIHJlZnJlc2hUYWJsZSgpO1xufVxuXG4vLyDQmNC30LzQtdC90LXQvdC40LUg0YHQvtGA0YLQuNGA0L7QstC60LhcbmNvbnN0IHNldFNvcnQgPSAoKSA9PiB7XG4gICAgaWYgKHNvcnRGbGFnID09PSBkZXNjU29ydCkge1xuICAgICAgICBzb3J0RmxhZyA9IGFzY1NvcnQ7XG4gICAgICAgIGJ1dHRvblNvcnQhLnRleHRDb250ZW50ID0gXCLQv9C+INGD0LHRi9Cy0LDQvdC40Y5cIjtcbiAgICB9IGVsc2UgaWYgKHNvcnRGbGFnID09PSBhc2NTb3J0KSB7XG4gICAgICAgIHNvcnRGbGFnID0gZGVzY1NvcnQ7XG4gICAgICAgIGJ1dHRvblNvcnQhLnRleHRDb250ZW50ID0gXCLQv9C+INCy0L7Qt9GA0LDRgdGC0LDQvdC40Y5cIjtcbiAgICB9XG5cbiAgICByZWZyZXNoVGFibGUoKTtcbn1cblxuLy8g0JTQu9GPINC40LfQvNC10L3QtdC90LjRjyDQt9C90LDRh9C10L3QuNC1IHJvb3RcbmNvbnN0IHNldFJvb3QgPSAobmV3Um9vdDogc3RyaW5nKSA9PiB7XG4gICAgcm9vdCA9IG5ld1Jvb3Q7XG59XG5cbmV4cG9ydCB7YmFja1Jvb3QsIHNldFNvcnQsIGJ1dHRvblJvb3QsIGJ1dHRvblNvcnQsIHJvb3QsIHNvcnRGbGFnLCBzZXRSb290fTsiLCJpbXBvcnQgeyByb290LCBzZXRSb290LCBzb3J0RmxhZyB9IGZyb20gXCIuL2J1dHRvbnNcIjtcblxuY2xhc3MgUmVzcG9uc2Uge1xuICAgIGVycm9yX2NvZGU6IG51bWJlcjtcbiAgICBlcnJvcl9tZXNzYWdlOiBzdHJpbmc7XG4gICAgZGF0YTogRmlsZUluZm9bXTtcbiAgICByb290OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihFcnJvcl9jb2RlOiBudW1iZXIsIEVycm9yX21lc3NhZ2U6IHN0cmluZywgRGF0YTogRmlsZUluZm9bXSwgUm9vdDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZXJyb3JfY29kZSA9IEVycm9yX2NvZGU7XG4gICAgICAgIHRoaXMuZXJyb3JfbWVzc2FnZSA9IEVycm9yX21lc3NhZ2U7XG4gICAgICAgIHRoaXMuZGF0YSA9IERhdGE7XG4gICAgICAgIHRoaXMucm9vdCA9IFJvb3Q7XG4gICAgfVxufVxuXG5jbGFzcyBGaWxlSW5mbyB7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBzaXplX2luX3VuaXQ6IHN0cmluZztcbiAgICBzaXplX2luX2J5dGVzOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihUeXBlOiBzdHJpbmcsIE5hbWU6IHN0cmluZywgU2l6ZV9pbl91bml0OiBzdHJpbmcsIFNpemVfaW5fYnl0ZXM6IG51bWJlcikge1xuICAgICAgICB0aGlzLnR5cGUgPSBUeXBlO1xuICAgICAgICB0aGlzLm5hbWUgPSBOYW1lO1xuICAgICAgICB0aGlzLnNpemVfaW5fdW5pdCA9IFNpemVfaW5fdW5pdDtcbiAgICAgICAgdGhpcy5zaXplX2luX2J5dGVzID0gU2l6ZV9pbl9ieXRlcztcbiAgICB9XG59XG5cbi8vINCf0L7Qu9GD0YfQtdC90LjQtSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDRhNCw0LnQu9Cw0YVcbmNvbnN0IGdldEZpbGVzSW5mbyA9IGFzeW5jICgpOiBQcm9taXNlPEZpbGVJbmZvW10+ID0+IHtcbiAgICBjb25zdCB1cmxSZXF1ZXN0OiBzdHJpbmcgPSBgZnM/cm9vdD0ke3Jvb3R9JnNvcnQ9JHtzb3J0RmxhZ31gO1xuICAgIGxldCByZXN1bHQ6IEZpbGVJbmZvW10gPSBbXTtcblxuICAgIGF3YWl0IGZldGNoKHVybFJlcXVlc3QpXG4gICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcbiAgICB9KVxuICAgIC50aGVuKChkYXRhOiBSZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAoZGF0YS5lcnJvcl9jb2RlID09PSAxKSB7XG4gICAgICAgICAgICBhbGVydChkYXRhLmVycm9yX21lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyb290ID09PSBcIlwiKSB7XG4gICAgICAgICAgICBzZXRSb290KGRhdGEucm9vdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gZGF0YS5kYXRhO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IHtnZXRGaWxlc0luZm8sIEZpbGVJbmZvfTsiLCJpbXBvcnQgeyBiYWNrUm9vdCwgcm9vdCwgc2V0Um9vdCB9IGZyb20gXCIuL2J1dHRvbnNcIjtcbmltcG9ydCB7IEZpbGVJbmZvLCBnZXRGaWxlc0luZm8gfSBmcm9tIFwiLi9maWxlSW5mb1wiO1xuaW1wb3J0IHsgZnJlZXplIH0gZnJvbSBcIi4vdWlcIjtcblxuY29uc3QgY3VycmVudFJvb3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXJyZW50LXJvb3RcIikgYXMgSFRNTFBhcmFncmFwaEVsZW1lbnQ7XG5jb25zdCB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFibGVcIikgYXMgSFRNTFRhYmxlRWxlbWVudDtcblxubGV0IHJlZnJlc2hpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuLy8g0J7QsdC90L7QstC70LXQvdC40LUg0YLQsNCx0LvQuNGG0YtcbmNvbnN0IHJlZnJlc2hUYWJsZSA9IGFzeW5jICgpID0+IHtcbiAgICBmcmVlemUodHJ1ZSk7XG5cbiAgICBjb25zdCBmaWxlc0luZm86IEZpbGVJbmZvW10gPSBhd2FpdCBnZXRGaWxlc0luZm8oKTtcbiAgICBpZiAoZmlsZXNJbmZvLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgZnJlZXplKGZhbHNlKTtcbiAgICAgICAgYmFja1Jvb3QoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRhYmxlQm9keSA9IHRhYmxlIS5xdWVyeVNlbGVjdG9yKFwidGJvZHlcIikgYXMgSFRNTFRhYmxlU2VjdGlvbkVsZW1lbnQ7XG5cbiAgICB0YWJsZUJvZHkhLnJlbW92ZSgpO1xuXG4gICAgY29uc3QgbmV3VGFibGVCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRib2R5XCIpIGFzIEhUTUxUYWJsZVNlY3Rpb25FbGVtZW50O1xuICAgIGZpbGVzSW5mbyEuZm9yRWFjaChmaWxlSW5mbyA9PiB7XG4gICAgICAgIG5ld1RhYmxlQm9keS5hcHBlbmRDaGlsZChjcmVhdGVMaW5lKGZpbGVJbmZvKSk7XG4gICAgICB9KTtcblxuICAgIHRhYmxlIS5hcHBlbmRDaGlsZChuZXdUYWJsZUJvZHkpO1xuXG4gICAgZnJlZXplKGZhbHNlKTtcbn1cblxuLy8g0KHQvtC30LTQsNC90LjQtSDRgdGC0YDQvtC60Lgg0YLQsNCx0LvQuNGG0YtcbmNvbnN0IGNyZWF0ZUxpbmUgPSAoZmlsZUluZm86IEZpbGVJbmZvKSA9PiB7XG4gICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKSBhcyBIVE1MVGFibGVSb3dFbGVtZW50O1xuXG4gICAgaWYgKGZpbGVJbmZvLnR5cGUgPT09IFwi0JTQuNGAXCIpIHtcbiAgICAgICAgbGluZS5jbGFzc0xpc3QuYWRkKFwiZGlyZWN0b3J5XCIpO1xuICAgICAgICBsaW5lLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlZnJlc2hpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFJvb3QoYCR7cm9vdH0vJHtmaWxlSW5mby5uYW1lfWApO1xuICAgICAgICAgICAgY3VycmVudFJvb3RFbGVtZW50IS50ZXh0Q29udGVudCA9IHJvb3Q7XG4gICAgICAgICAgICByZWZyZXNoVGFibGUoKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGluZS5jbGFzc0xpc3QuYWRkKFwiZmlsZVwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb2x1bW5UeXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRoXCIpIGFzIEhUTUxUYWJsZUNlbGxFbGVtZW50O1xuICAgIGNvbnN0IGNvbHVtbk5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGhcIikgYXMgSFRNTFRhYmxlQ2VsbEVsZW1lbnQ7XG4gICAgY29uc3QgY29sdW1uU2l6ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0aFwiKSBhcyBIVE1MVGFibGVDZWxsRWxlbWVudDtcblxuICAgIGNvbHVtblR5cGUuaW5uZXJUZXh0ID0gZmlsZUluZm8udHlwZTtcbiAgICBjb2x1bW5OYW1lLmlubmVyVGV4dCA9IGZpbGVJbmZvLm5hbWU7XG4gICAgY29sdW1uU2l6ZS5pbm5lclRleHQgPSBmaWxlSW5mby5zaXplX2luX3VuaXQ7XG5cbiAgICBsaW5lLmFwcGVuZENoaWxkKGNvbHVtblR5cGUpO1xuICAgIGxpbmUuYXBwZW5kQ2hpbGQoY29sdW1uTmFtZSk7XG4gICAgbGluZS5hcHBlbmRDaGlsZChjb2x1bW5TaXplKTtcblxuICAgIHJldHVybiBsaW5lO1xufVxuXG4vLyDQmNC30LzQtdC90Y/QtdGCINC30L3QsNGH0LXQvdC40LUg0YMgcmVmcmVzaGluZ1xuY29uc3Qgc2V0UmVmcmVzaGluZyA9IChuZXdSZWZyZXNoaW5nOiBib29sZWFuKSA9PiB7XG4gICAgcmVmcmVzaGluZyA9IG5ld1JlZnJlc2hpbmc7XG59XG5cbmV4cG9ydCB7cmVmcmVzaFRhYmxlLCByZWZyZXNoaW5nLCBzZXRSZWZyZXNoaW5nLCBjdXJyZW50Um9vdEVsZW1lbnR9OyIsImltcG9ydCB7IGJ1dHRvblJvb3QsIGJ1dHRvblNvcnQgfSBmcm9tIFwiLi9idXR0b25zXCI7XG5pbXBvcnQgeyBzZXRSZWZyZXNoaW5nIH0gZnJvbSBcIi4vcmVmcmVzaFwiO1xuXG4vLyDQl9Cw0LzQsNGA0LDQttC40LLQsNC10YIg0LrQvdC+0L/QutC4INC4INCy0YvQstC+0LTQuNGCIGxvYWRlclxuY29uc3QgZnJlZXplID0gKGlzQmxvY2s6IGJvb2xlYW4pID0+IHtcbiAgICAvLyDRgNCw0LfQsdC70L7QutC40YDQvtCy0LrQsFxuICAgIGlmICghaXNCbG9jaykge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRlclwiKSEucmVtb3ZlKCk7XG4gICAgICAgIFxuICAgICAgICBidXR0b25Sb290IS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBidXR0b25Tb3J0IS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgc2V0UmVmcmVzaGluZyhmYWxzZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8g0LHQu9C+0LrQuNGA0L7QstC60LBcbiAgICBzZXRSZWZyZXNoaW5nKHRydWUpO1xuXG4gICAgYnV0dG9uUm9vdC5kaXNhYmxlZCA9IHRydWU7XG4gICAgYnV0dG9uU29ydC5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICBjb25zdCByb290QmxvY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIikgYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgY29uc3QgY3VycmVudFJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnQtcm9vdFwiKSBhcyBIVE1MUGFyYWdyYXBoRWxlbWVudDtcbiAgICBjb25zdCBsb2FkZXI6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgIGxvYWRlci5pZCA9IFwibG9hZGVyXCI7XG4gICAgcm9vdEJsb2NrIS5pbnNlcnRCZWZvcmUobG9hZGVyLCBjdXJyZW50Um9vdCk7XG59XG5cbmV4cG9ydCB7ZnJlZXplfTsiLCJpbXBvcnQgeyByb290IH0gZnJvbSBcIi4vYnV0dG9uc1wiO1xuaW1wb3J0IHsgY3VycmVudFJvb3RFbGVtZW50LCByZWZyZXNoVGFibGUgfSBmcm9tIFwiLi9yZWZyZXNoXCI7XG5cbi8vINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0YLRgNCw0L3QuNGG0YtcbmNvbnN0IHVwZGF0ZVBhZ2UgPSBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgcmVmcmVzaFRhYmxlKCk7XG4gICAgY3VycmVudFJvb3RFbGVtZW50IS50ZXh0Q29udGVudCA9IHJvb3Q7XG59XG5cbmV4cG9ydCB7dXBkYXRlUGFnZX07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7YmFja1Jvb3QsIHNldFNvcnQsIGJ1dHRvblJvb3QsIGJ1dHRvblNvcnR9IGZyb20gJy4vYnV0dG9ucyc7XG5pbXBvcnQgeyB1cGRhdGVQYWdlIH0gZnJvbSAnLi91cGRhdGUnO1xuXG4vLyDQttC00LXRgiDQutC+0LPQtNCwINGB0YLRgNCw0L3QuNGG0LAg0L/QvtC70L3QvtGB0YLRjNGOINC30LDQs9GA0YPQt9C40YLRgdGPIFxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyDQl9Cw0L/Rg9GB0Log0L7QsdC90L7QstC70LXQvdC40Y8g0YHRgtGA0LDQvdC40YbRi1xuICAgIHVwZGF0ZVBhZ2UoKTtcblxuICAgIC8vINC/0YDQuNCy0Y/Qt9C60LAg0L7QsdGA0LDQsdC+0YLRh9C40LrQvtCyINGB0L7QsdGL0YLQuNC5XG4gICAgYnV0dG9uUm9vdCEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJhY2tSb290KTtcbiAgICBidXR0b25Tb3J0IS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2V0U29ydCk7ICBcbn0pOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==