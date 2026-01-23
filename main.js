(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/runner/work/fhir-prom-formio/fhir-prom-formio/src/main.ts */"zUnb");


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "Pef/":
/*!*************************************************!*\
  !*** ./src/app/fhir/launch/launch.component.ts ***!
  \*************************************************/
/*! exports provided: LaunchComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LaunchComponent", function() { return LaunchComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var fhirclient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fhirclient */ "qdye");
/* harmony import */ var fhirclient__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fhirclient__WEBPACK_IMPORTED_MODULE_1__);



class LaunchComponent {
    constructor() { }
    ngOnInit() {
        // 檢查 URL 中是否存在 iss 參數（無論是在 # 之前還是之後）
        const urlParams = new URLSearchParams(window.location.search);
        const iss = urlParams.get("iss");
        const launch = urlParams.get("launch");
        if (iss && launch) {
            // 如果在網址列抓到了 iss，手動傳給 authorize
            fhirclient__WEBPACK_IMPORTED_MODULE_1__["oauth2"].authorize({
                clientId: 'my_web_app',
                scope: 'launch openid fhirUser patient/*.read',
                redirectUri: 'fhir-prom-formio/fhir',
                iss: iss,
                launch: launch
            });
        }
        else {
            // 如果沒抓到，嘗試讓套件自己抓（原本的邏輯）
            fhirclient__WEBPACK_IMPORTED_MODULE_1__["oauth2"].authorize({
                clientId: 'my_web_app',
                scope: 'launch openid fhirUser patient/*.read'
            }).catch(err => console.error(err));
        }
    }
}
LaunchComponent.ɵfac = function LaunchComponent_Factory(t) { return new (t || LaunchComponent)(); };
LaunchComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: LaunchComponent, selectors: [["app-launch"]], decls: 2, vars: 0, template: function LaunchComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "launch works!");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJsYXVuY2guY29tcG9uZW50LnNjc3MifQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LaunchComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-launch',
                templateUrl: './launch.component.html',
                styleUrls: ['./launch.component.scss']
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class AppComponent {
    constructor() {
        this.title = 'fhir-prom-formio';
        this.tmplNo = 20100;
        this.replyInfo = {
            replyNo: 1,
            tmplNo: 20100,
            replyUser: 'A123456789',
            replyDesc: {
                fillInDate: '2021-11-01T12:00:00+08:00',
                ptName: '郭彥志',
                idNo: 'A123456789',
                sex: 'female',
                firstBlock: { Q1: '1', Q2: '3', Q3: '4', Q4: '4', Q5: '4', Q6: '4' },
            },
            replyTime: '2022-03-02T09:14:23.220',
            tranUser: 30666,
            tranTime: '2022-03-02T09:14:23.220',
            tranStatus: 30,
            tranUserName: '楊名棟',
        };
        this.newReplyInfo = {
            tmplNo: -2126664499,
            subjectType: 10,
            subject: 'A123456789',
        };
        this.editReplyInfo = {
            branchNo: 1,
            replyNo: -90225782,
            tmplNo: -1621400951,
            subjectType: 10,
            subject: 'B222378038',
            tranUser: 34944,
            owner: 34944,
            tranTime: new Date('2022-08-26 07:47:50.237'),
            tranStatus: 20,
            systemUser: 33878,
            systemTime: new Date('2022-08-26 07:47:50.630'),
            subjectName: '卓曉霜',
        };
    }
    ngOnInit() {
        if (Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["isDevMode"])()) {
        }
    }
    showMsg(event) {
        console.log(event);
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 2, vars: 0, consts: [[2, "height", "100vh"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"]], styles: ["[_nghost-%COMP%]     .p-component {\n  font-size: 1em;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGNBQUE7QUFDRiIsImZpbGUiOiJhcHAuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCA6Om5nLWRlZXAgLnAtY29tcG9uZW50IHtcbiAgZm9udC1zaXplOiAxZW07XG59XG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-root',
                templateUrl: './app.component.html',
                styleUrls: ['./app.component.scss'],
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "Y17w":
/*!*************************************!*\
  !*** ./src/app/fhir/fhir.module.ts ***!
  \*************************************/
/*! exports provided: FhirModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FhirModule", function() { return FhirModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _fhir_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fhir.component */ "h+pX");
/* harmony import */ var _launch_launch_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./launch/launch.component */ "Pef/");





class FhirModule {
}
FhirModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: FhirModule });
FhirModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function FhirModule_Factory(t) { return new (t || FhirModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](FhirModule, { declarations: [_fhir_component__WEBPACK_IMPORTED_MODULE_2__["FhirComponent"], _launch_launch_component__WEBPACK_IMPORTED_MODULE_3__["LaunchComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]], exports: [_fhir_component__WEBPACK_IMPORTED_MODULE_2__["FhirComponent"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FhirModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [_fhir_component__WEBPACK_IMPORTED_MODULE_2__["FhirComponent"], _launch_launch_component__WEBPACK_IMPORTED_MODULE_3__["LaunchComponent"]],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]
                ],
                exports: [_fhir_component__WEBPACK_IMPORTED_MODULE_2__["FhirComponent"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser/animations */ "R1ws");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _fhir_fhir_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./fhir/fhir.module */ "Y17w");








class AppModule {
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(); }, providers: [], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"],
            _fhir_fhir_module__WEBPACK_IMPORTED_MODULE_6__["FhirModule"],
            _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_1__["BrowserAnimationsModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"],
        _fhir_fhir_module__WEBPACK_IMPORTED_MODULE_6__["FhirModule"],
        _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_1__["BrowserAnimationsModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](AppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"],
        args: [{
                declarations: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]],
                imports: [
                    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                    _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"],
                    _fhir_fhir_module__WEBPACK_IMPORTED_MODULE_6__["FhirModule"],
                    _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_1__["BrowserAnimationsModule"],
                    _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"]
                ],
                providers: [],
                bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]],
            }]
    }], null, null); })();


/***/ }),

/***/ "h+pX":
/*!****************************************!*\
  !*** ./src/app/fhir/fhir.component.ts ***!
  \****************************************/
/*! exports provided: FhirComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FhirComponent", function() { return FhirComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var fhirclient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fhirclient */ "qdye");
/* harmony import */ var fhirclient__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fhirclient__WEBPACK_IMPORTED_MODULE_1__);



class FhirComponent {
    constructor() { }
    ngOnInit() {
        fhirclient__WEBPACK_IMPORTED_MODULE_1__["oauth2"].ready()
            .then(client => {
            console.log('連線成功！', client.patient.id);
            // 現在你可以使用 client.request() 來抓取資料了
            client.patient.read().then((pt) => {
                // 找病人然後要顯示吧
                this.patient = JSON.stringify(pt, null, 4);
            }, (error) => {
                this.patient = error.stack;
            });
            client.request("/MedicationRequest?patient=" + client.patient.id, {
                resolveReferences: ["medicationReference"],
                graph: true
            })
                .then((data) => {
                if (!data.entry || !data.entry.length) {
                    throw new Error("No medications found for the selected patient");
                }
                return data.entry;
            })
                .then((meds) => {
                // 顯示吧不知道
                this.meds = JSON.stringify(meds, null, 4);
            }),
                (error) => {
                    this.meds = error.stack;
                };
        })
            .catch(console.error);
    }
}
FhirComponent.ɵfac = function FhirComponent_Factory(t) { return new (t || FhirComponent)(); };
FhirComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FhirComponent, selectors: [["app-fhir"]], decls: 10, vars: 2, template: function FhirComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "fhir works!");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "\u73FE\u5728\u75C5\u4EBA");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "\u85E5\u7269");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.patient);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.meds);
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJmaGlyLmNvbXBvbmVudC5zY3NzIn0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FhirComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-fhir',
                templateUrl: './fhir.component.html',
                styleUrls: ['./fhir.component.scss']
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _fhir_fhir_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fhir/fhir.component */ "h+pX");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _fhir_launch_launch_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fhir/launch/launch.component */ "Pef/");






const routes = [
    { path: 'launch', component: _fhir_launch_launch_component__WEBPACK_IMPORTED_MODULE_3__["LaunchComponent"] },
    // { path: 'index', component: AppComponent },      // 處理回調 (或你的主畫面)
    // { path: '', redirectTo: 'index', pathMatch: 'full' }
    { path: '', redirectTo: 'fhir', pathMatch: 'full' },
    {
        path: 'fhir',
        component: _fhir_fhir_component__WEBPACK_IMPORTED_MODULE_0__["FhirComponent"],
    },
];
class AppRoutingModule {
}
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); }, imports: [[
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes, {
                useHash: true,
                onSameUrlNavigation: 'reload'
            })
        ], _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](AppRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                imports: [
                    _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes, {
                        useHash: true,
                        onSameUrlNavigation: 'reload'
                    })
                ],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]],
            }]
    }], null, null); })();


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ "AytR");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map