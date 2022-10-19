(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlEncodeObject = exports.convertTime = exports.Source = void 0;
class Source {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
    /**
     * @deprecated use {@link Source.getSearchResults getSearchResults} instead
     */
    searchRequest(query, metadata) {
        return this.getSearchResults(query, metadata);
    }
    /**
     * @deprecated use {@link Source.getSearchTags} instead
     */
    getTags() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            return (_a = this.getSearchTags) === null || _a === void 0 ? void 0 : _a.call(this);
        });
    }
}
exports.Source = Source;
// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
function convertTime(timeAgo) {
    var _a;
    let time;
    let trimmed = Number(((_a = /\d*/.exec(timeAgo)) !== null && _a !== void 0 ? _a : [])[0]);
    trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('minutes')) {
        time = new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('hours')) {
        time = new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('days')) {
        time = new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('year') || timeAgo.includes('years')) {
        time = new Date(Date.now() - trimmed * 31556952000);
    }
    else {
        time = new Date(Date.now());
    }
    return time;
}
exports.convertTime = convertTime;
/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj
 */
function urlEncodeObject(obj) {
    let ret = {};
    for (const entry of Object.entries(obj)) {
        ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
    }
    return ret;
}
exports.urlEncodeObject = urlEncodeObject;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracker = void 0;
class Tracker {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
}
exports.Tracker = Tracker;

},{}],4:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);
__exportStar(require("./Tracker"), exports);

},{"./Source":2,"./Tracker":3}],5:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./base"), exports);
__exportStar(require("./models"), exports);
__exportStar(require("./APIWrapper"), exports);

},{"./APIWrapper":1,"./base":4,"./models":47}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],7:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],8:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],9:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],10:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],11:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],12:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],13:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],14:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],15:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],16:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],17:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],18:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],19:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],20:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],21:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],22:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],23:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],24:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Button"), exports);
__exportStar(require("./Form"), exports);
__exportStar(require("./Header"), exports);
__exportStar(require("./InputField"), exports);
__exportStar(require("./Label"), exports);
__exportStar(require("./Link"), exports);
__exportStar(require("./MultilineLabel"), exports);
__exportStar(require("./NavigationButton"), exports);
__exportStar(require("./OAuthButton"), exports);
__exportStar(require("./Section"), exports);
__exportStar(require("./Select"), exports);
__exportStar(require("./Switch"), exports);
__exportStar(require("./WebViewButton"), exports);
__exportStar(require("./FormRow"), exports);
__exportStar(require("./Stepper"), exports);

},{"./Button":9,"./Form":10,"./FormRow":11,"./Header":12,"./InputField":13,"./Label":14,"./Link":15,"./MultilineLabel":16,"./NavigationButton":17,"./OAuthButton":18,"./Section":19,"./Select":20,"./Stepper":21,"./Switch":22,"./WebViewButton":23}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeSectionType = void 0;
var HomeSectionType;
(function (HomeSectionType) {
    HomeSectionType["singleRowNormal"] = "singleRowNormal";
    HomeSectionType["singleRowLarge"] = "singleRowLarge";
    HomeSectionType["doubleRow"] = "doubleRow";
    HomeSectionType["featured"] = "featured";
})(HomeSectionType = exports.HomeSectionType || (exports.HomeSectionType = {}));

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageCode = void 0;
var LanguageCode;
(function (LanguageCode) {
    LanguageCode["UNKNOWN"] = "_unknown";
    LanguageCode["BENGALI"] = "bd";
    LanguageCode["BULGARIAN"] = "bg";
    LanguageCode["BRAZILIAN"] = "br";
    LanguageCode["CHINEESE"] = "cn";
    LanguageCode["CZECH"] = "cz";
    LanguageCode["GERMAN"] = "de";
    LanguageCode["DANISH"] = "dk";
    LanguageCode["ENGLISH"] = "gb";
    LanguageCode["SPANISH"] = "es";
    LanguageCode["FINNISH"] = "fi";
    LanguageCode["FRENCH"] = "fr";
    LanguageCode["WELSH"] = "gb";
    LanguageCode["GREEK"] = "gr";
    LanguageCode["CHINEESE_HONGKONG"] = "hk";
    LanguageCode["HUNGARIAN"] = "hu";
    LanguageCode["INDONESIAN"] = "id";
    LanguageCode["ISRELI"] = "il";
    LanguageCode["INDIAN"] = "in";
    LanguageCode["IRAN"] = "ir";
    LanguageCode["ITALIAN"] = "it";
    LanguageCode["JAPANESE"] = "jp";
    LanguageCode["KOREAN"] = "kr";
    LanguageCode["LITHUANIAN"] = "lt";
    LanguageCode["MONGOLIAN"] = "mn";
    LanguageCode["MEXIAN"] = "mx";
    LanguageCode["MALAY"] = "my";
    LanguageCode["DUTCH"] = "nl";
    LanguageCode["NORWEGIAN"] = "no";
    LanguageCode["PHILIPPINE"] = "ph";
    LanguageCode["POLISH"] = "pl";
    LanguageCode["PORTUGUESE"] = "pt";
    LanguageCode["ROMANIAN"] = "ro";
    LanguageCode["RUSSIAN"] = "ru";
    LanguageCode["SANSKRIT"] = "sa";
    LanguageCode["SAMI"] = "si";
    LanguageCode["THAI"] = "th";
    LanguageCode["TURKISH"] = "tr";
    LanguageCode["UKRAINIAN"] = "ua";
    LanguageCode["VIETNAMESE"] = "vn";
})(LanguageCode = exports.LanguageCode || (exports.LanguageCode = {}));

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaStatus = void 0;
var MangaStatus;
(function (MangaStatus) {
    MangaStatus[MangaStatus["ONGOING"] = 1] = "ONGOING";
    MangaStatus[MangaStatus["COMPLETED"] = 0] = "COMPLETED";
    MangaStatus[MangaStatus["UNKNOWN"] = 2] = "UNKNOWN";
    MangaStatus[MangaStatus["ABANDONED"] = 3] = "ABANDONED";
    MangaStatus[MangaStatus["HIATUS"] = 4] = "HIATUS";
})(MangaStatus = exports.MangaStatus || (exports.MangaStatus = {}));

},{}],28:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],29:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],30:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],31:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],32:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],33:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],34:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],35:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],36:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],37:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchOperator = void 0;
var SearchOperator;
(function (SearchOperator) {
    SearchOperator["AND"] = "AND";
    SearchOperator["OR"] = "OR";
})(SearchOperator = exports.SearchOperator || (exports.SearchOperator = {}));

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRating = void 0;
/**
 * A content rating to be attributed to each source.
 */
var ContentRating;
(function (ContentRating) {
    ContentRating["EVERYONE"] = "EVERYONE";
    ContentRating["MATURE"] = "MATURE";
    ContentRating["ADULT"] = "ADULT";
})(ContentRating = exports.ContentRating || (exports.ContentRating = {}));

},{}],40:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],41:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagType = void 0;
/**
 * An enumerator which {@link SourceTags} uses to define the color of the tag rendered on the website.
 * Five types are available: blue, green, grey, yellow and red, the default one is blue.
 * Common colors are red for (Broken), yellow for (+18), grey for (Country-Proof)
 */
var TagType;
(function (TagType) {
    TagType["BLUE"] = "default";
    TagType["GREEN"] = "success";
    TagType["GREY"] = "info";
    TagType["YELLOW"] = "warning";
    TagType["RED"] = "danger";
})(TagType = exports.TagType || (exports.TagType = {}));

},{}],43:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],44:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],45:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],46:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],47:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Chapter"), exports);
__exportStar(require("./ChapterDetails"), exports);
__exportStar(require("./HomeSection"), exports);
__exportStar(require("./Manga"), exports);
__exportStar(require("./MangaTile"), exports);
__exportStar(require("./RequestObject"), exports);
__exportStar(require("./SearchRequest"), exports);
__exportStar(require("./TagSection"), exports);
__exportStar(require("./SourceTag"), exports);
__exportStar(require("./Languages"), exports);
__exportStar(require("./Constants"), exports);
__exportStar(require("./MangaUpdate"), exports);
__exportStar(require("./PagedResults"), exports);
__exportStar(require("./ResponseObject"), exports);
__exportStar(require("./RequestManager"), exports);
__exportStar(require("./RequestHeaders"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./SourceStateManager"), exports);
__exportStar(require("./RequestInterceptor"), exports);
__exportStar(require("./DynamicUI"), exports);
__exportStar(require("./TrackedManga"), exports);
__exportStar(require("./SourceManga"), exports);
__exportStar(require("./TrackedMangaChapterReadAction"), exports);
__exportStar(require("./TrackerActionQueue"), exports);
__exportStar(require("./SearchField"), exports);
__exportStar(require("./RawData"), exports);

},{"./Chapter":6,"./ChapterDetails":7,"./Constants":8,"./DynamicUI":24,"./HomeSection":25,"./Languages":26,"./Manga":27,"./MangaTile":28,"./MangaUpdate":29,"./PagedResults":30,"./RawData":31,"./RequestHeaders":32,"./RequestInterceptor":33,"./RequestManager":34,"./RequestObject":35,"./ResponseObject":36,"./SearchField":37,"./SearchRequest":38,"./SourceInfo":39,"./SourceManga":40,"./SourceStateManager":41,"./SourceTag":42,"./TagSection":43,"./TrackedManga":44,"./TrackedMangaChapterReadAction":45,"./TrackerActionQueue":46}],48:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaKawaii = exports.MangaKawaiiInfo = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const MangaKawaiiParsing_1 = require("./MangaKawaiiParsing");
const UrlMangaKawaii_1 = require("./UrlMangaKawaii");
const method = 'GET';
const headers = { "content-type": "application/x-www-form-urlencoded", "accept-language": "fr", 'referer': `${UrlMangaKawaii_1.ML_DOMAIN}/` };
exports.MangaKawaiiInfo = {
    version: 'Stable:1.0.56',
    name: 'MangaKawaii',
    icon: 'icon.png',
    author: 'aerodomigue',
    authorWebsite: 'https://github.com/aerodomigue',
    description: 'Extension that pulls manga from Mangakawaii, includes Search and Updated manga fetching',
    websiteBaseURL: UrlMangaKawaii_1.ML_DOMAIN,
    sourceTags: [
        {
            text: "Notifications",
            type: paperback_extensions_common_1.TagType.GREEN
        },
        {
            text: "Cloudflare",
            type: paperback_extensions_common_1.TagType.RED
        }
    ],
    contentRating: paperback_extensions_common_1.ContentRating.EVERYONE
};
class MangaKawaii extends paperback_extensions_common_1.Source {
    constructor() {
        super(...arguments);
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' + `Chrome/8${Math.floor(Math.random() * 9)}.0.4${Math.floor(Math.random() * (999 - 100) + 100)}.1${Math.floor(Math.random() * (99 - 10) + 10)} Safari/537.36`;
        this.requestManager = createRequestManager({
            requestsPerSecond: 3,
            requestTimeout: 15000,
            interceptor: {
                interceptRequest: (request) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    request.headers = Object.assign(Object.assign({}, ((_a = request.headers) !== null && _a !== void 0 ? _a : {})), Object.assign(Object.assign({}, (this.userAgent && { 'user-agent': this.userAgent })), { 'referer': `${UrlMangaKawaii_1.ML_DOMAIN}/` }));
                    return request;
                }),
                interceptResponse: (response) => __awaiter(this, void 0, void 0, function* () {
                    return response;
                })
            }
        });
    }
    getSearchResults(query, metadata) {
        throw new Error("Method not implemented.");
    }
    getMangaShareUrl(mangaId) { return `${UrlMangaKawaii_1.ML_DOMAIN}/manga/${mangaId}`; }
    getMangaDetails(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${UrlMangaKawaii_1.ML_DOMAIN}/manga/`,
                method,
                headers,
                param: mangaId
            });
            const response = yield this.requestManager.schedule(request, 3);
            console.log(response.status);
            const $ = this.cheerio.load(response.data);
            return (0, MangaKawaiiParsing_1.parseMangaDetails)($, mangaId);
        });
    }
    getChapters(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${UrlMangaKawaii_1.ML_DOMAIN}/manga/`,
                method,
                headers,
                param: mangaId
            });
            let response = yield this.requestManager.schedule(request, 3);
            //   var page = require('webpage').create();
            //   const re = RegExp('[\'"](/arrilot/load-widget.*?)[\'"]')
            //   const chapterRequest = response.data.match(re)
            //   const requestChapter = createRequestObject({
            //     url: `${ML_DOMAIN}${chapterRequest? chapterRequest[1] : ''}`,
            //     method,
            //     headers,
            //     })
            //  if(chapterRequest)
            //   response = await this.requestManager.schedule(requestChapter, 3)
            // const lang = requestChapter.url.includes('/fr/') ? true : false
            const $ = this.cheerio.load(response.data);
            if ($(".table__chapter > a").length > 0) {
                let someChapter = $($(".table__chapter > a").get(0)).attr('href');
                const requestChapter = createRequestObject({
                    url: `${UrlMangaKawaii_1.ML_DOMAIN}${someChapter}`,
                    method,
                    headers,
                });
                response = yield this.requestManager.schedule(requestChapter, 3);
                const $someChapter = this.cheerio.load(response.data);
                return (0, MangaKawaiiParsing_1.parseChapters)($, mangaId, true, $someChapter);
            }
            return (0, MangaKawaiiParsing_1.parseChapters)($, mangaId, true, undefined);
        });
    }
    getChapterDetails(mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${UrlMangaKawaii_1.ML_DOMAIN}/manga`,
                headers,
                method,
                param: chapterId
            });
            const response = yield this.requestManager.schedule(request, 3);
            const $ = this.cheerio.load(response.data);
            return (0, MangaKawaiiParsing_1.parseChapterDetails)($, mangaId, chapterId);
        });
    }
    filterUpdatedManga(mangaUpdatesFoundCallback, time, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${UrlMangaKawaii_1.ML_DOMAIN}`,
                headers,
                method,
            });
            let data = yield this.requestManager.schedule(request, 3);
            let $ = this.cheerio.load(data.data);
            let updatedManga = (0, MangaKawaiiParsing_1.parseUpdatedManga)($, time, ids);
            if (updatedManga.updates.length > 0) {
                mangaUpdatesFoundCallback(createMangaUpdates({
                    ids: updatedManga.updates
                }));
            }
        });
    }
    searchRequest(query, _metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadata = (0, MangaKawaiiParsing_1.searchMetadata)(query);
            const request = createRequestObject({
                url: `${UrlMangaKawaii_1.ML_DOMAIN}/search`,
                headers,
                method,
                param: `?query=${metadata.query}&search_type=${metadata.search_type}`
            });
            const response = yield this.requestManager.schedule(request, 3);
            const $ = this.cheerio.load(response.data);
            return (0, MangaKawaiiParsing_1.parseSearch)($, metadata, UrlMangaKawaii_1.ML_DOMAIN);
        });
    }
    /*
      async getTags(): Promise<TagSection[] | null> {
        const request = createRequestObject({
          url: `${ML_DOMAIN}/search/`,
          method,
          headers ,
        })
    
        const response = await this.requestManager.schedule(request, 3)
        return parseTags(response.data);
      }*/
    getHomePageSections(sectionCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${UrlMangaKawaii_1.ML_DOMAIN}`,
                method,
            });
            const response = yield this.requestManager.schedule(request, 3);
            const $ = this.cheerio.load(response.data);
            (0, MangaKawaiiParsing_1.parseHomeSections)($, response.data, sectionCallback);
        });
    }
    globalRequestHeaders() {
        return {
            referer: `${UrlMangaKawaii_1.ML_DOMAIN}`,
            userAgent: this.userAgent,
            Accept: '*/*'
        };
    }
    getCloudflareBypassRequest() {
        return createRequestObject({
            url: `${UrlMangaKawaii_1.ML_DOMAIN}`,
            method: 'GET',
        });
    }
}
exports.MangaKawaii = MangaKawaii;

},{"./MangaKawaiiParsing":49,"./UrlMangaKawaii":50,"paperback-extensions-common":5}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHomeSections = exports.parseTags = exports.parseSearch = exports.searchMetadata = exports.parseUpdatedManga = exports.parseChapterDetails = exports.parseChapters = exports.parseMangaDetails = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const UrlMangaKawaii_1 = require("./UrlMangaKawaii");
const parseMangaDetails = ($, mangaId) => {
    // const json = $('[type=application\\/ld\\+json]').last().html() ?? '' // next, get second json child  
    // const parsedJson = JSON.parse(json)
    // const entity = parsedJson['@graph']
    const desc = $("dd.text-justify.text-break").text().toString();
    const image = $("div.manga-view__header-image").find("img").attr("src") || "";
    const titles = [$($("span[itemprop*=name]").get(1)).text().toString() || ""];
    const author = $("a[href*=author]").text().toString();
    const rating = Number($("strong[id*=avgrating]").text());
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: [] }),
        createTagSection({ id: '1', label: 'format', tags: [] })];
    tagSections[0].tags = $('a[itemprop="genre"]').toArray().map((elem) => createTag({ id: $(elem).text(), label: $(elem).text() }));
    let status = paperback_extensions_common_1.MangaStatus.ONGOING;
    status = paperback_extensions_common_1.MangaStatus.ONGOING; // OLD $('.row').text().includes('En Cours') ? MangaStatus.ONGOING : MangaStatus.COMPLETED // WIP not work
    const manga = createManga({
        id: mangaId,
        titles,
        image,
        status,
        author,
        tags: tagSections,
        desc,
        hentai: false,
        rating, //4.19
    });
    return manga;
};
exports.parseMangaDetails = parseMangaDetails;
const parseChapters = ($, mangaId, langFr, $someChapter) => {
    const chaptersHTML = $('tr[class*=volume-]:has(td)').toArray().map((elem) => { return $(elem); });
    const chapters = [];
    // Check if is licenced
    const isLicenced = $("div[class*=ribbon__licensed]").text();
    if (isLicenced.length == 0) {
        let numberOfChap;
        if ($someChapter) {
            numberOfChap = $someChapter("#dropdownMenuOffset+ul li").length;
        }
        if (numberOfChap != undefined && chaptersHTML.length < numberOfChap) {
            let $chapters = $someChapter("#dropdownMenuOffset+ul li").toArray();
            $chapters.forEach(chapter => {
                let id = $someChapter("a", chapter).attr("href").split('/manga')[1];
                let urlSplited = $someChapter("a", chapter).attr("href").split('/');
                let chapNum = parseFloat(urlSplited[urlSplited.length - 1]);
                let time = new Date();
                let name = '';
                let lang = paperback_extensions_common_1.LanguageCode.FRENCH;
                chapters.push(createChapter({
                    id,
                    mangaId,
                    name,
                    chapNum,
                    langCode: lang,
                    time
                }));
            });
        }
        else {
            let nbrline = chaptersHTML.length;
            for (const elem of chaptersHTML) {
                const id = encodeURI(`${$('a[href*=manga]', elem).attr('href')}`.replace('/manga', ''));
                const name = ''; // $("a span", elem).text().trim().replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g,''); // Convert `\nChap.      \n2      \n  \n` -> `Chap. 2`
                let nbrChap = $("a span", elem).text().trim().replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g, '').split(' ')[1];
                const chapNum = parseFloat(nbrChap);
                const timeStr = $("td.table__date", elem).first().text().trim().split('\n')[0].split('.');
                let time = new Date(Date.parse(timeStr[1] + '-' + timeStr[0] + '-' + timeStr[2]));
                let lang = paperback_extensions_common_1.LanguageCode.FRENCH;
                chapters.push(createChapter({
                    id,
                    mangaId,
                    name,
                    chapNum,
                    langCode: lang,
                    time
                }));
                nbrline--;
            }
        }
    }
    else {
        chapters.push(createChapter({
            id: mangaId + '/fr/0',
            mangaId,
            name: "L'oeuvre est licencié, tous les chapitres ont été retirés.",
            chapNum: 0,
            langCode: paperback_extensions_common_1.LanguageCode.FRENCH,
            time: new Date()
        }));
    }
    return chapters;
};
exports.parseChapters = parseChapters;
const parseChapterDetails = ($, mangaId, chapterId) => {
    const pages = [];
    const chapterSlug = $.html().match(/var chapter_slug = "([^"]*)";/)[1];
    const mangaSlug = $.html().match(/var oeuvre_slug = "([^"]*)";/)[1];
    var page;
    var reg = RegExp('page_image":"([^"]*)"', 'g');
    while ((page = reg.exec($.html())) !== null) {
        pages.push(UrlMangaKawaii_1.CDN_URL + "/uploads/manga/" + mangaSlug + "/chapters_fr/" + chapterSlug + "/" + page[1]);
    }
    const chapterDetails = createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages,
        longStrip: false
    });
    return chapterDetails;
};
exports.parseChapterDetails = parseChapterDetails;
const parseUpdatedManga = ($, time, ids) => {
    var _a, _b;
    let foundIds = [];
    let passedReferenceTime = false;
    for (let item of $('div[id*="load_latest"] div[class="section__list-group-chapter"]').toArray()) {
        let id = ((_a = $('a', item).attr('href')) !== null && _a !== void 0 ? _a : '').replace('/manga/', '').split('/')[0];
        let date = ((_b = $('span[class="section__list-group-date"]', item).text()) !== null && _b !== void 0 ? _b : 0);
        let mangaTime = new Date(0);
        if (date == "Aujourd'hui")
            mangaTime = new Date();
        else if (date == "Hier") {
            let currentDate = new Date();
            mangaTime = new Date(currentDate.setDate(currentDate.getDate() - 1));
        }
        else {
            const timeStr = date.split(' ')[1].split('/');
            mangaTime = new Date(Date.parse(timeStr[2] + '-' + timeStr[1] + '-' + timeStr[0]));
        }
        passedReferenceTime = mangaTime <= time;
        if (!passedReferenceTime) {
            if (ids.includes(id)) {
                foundIds.push(id);
            }
        }
        else
            break;
    }
    if (!passedReferenceTime) {
        return { updates: foundIds, loadNextPage: true };
    }
    else {
        return { updates: foundIds, loadNextPage: false };
    }
};
exports.parseUpdatedManga = parseUpdatedManga;
const searchMetadata = (query) => {
    var _a;
    return {
        'query': (_a = query.title) === null || _a === void 0 ? void 0 : _a.toLowerCase().split(' ').join('+'),
        'search_type': "manga",
    };
};
exports.searchMetadata = searchMetadata;
const parseSearch = ($, metadata, ML_DOMAIN) => {
    var _a;
    const mangaTiles = [];
    const titles = $('ul[class="pl-3"] li div h4 a[href*=manga]').toArray().map((elem) => { return $(elem); });
    for (const elem of titles) {
        const title = $(elem).text().replace(/&#039;/g, '\'');
        const url = `${$(elem).attr("href")}`;
        // console.log("search: " + title) 
        // console.log("url: " + url) 
        // console.log("id: " + encodeURI(title.replace('/manga/', ''))) 
        mangaTiles.push(createMangaTile({
            id: `${(_a = encodeURI(url === null || url === void 0 ? void 0 : url.replace('/manga/', ''))) !== null && _a !== void 0 ? _a : ''}`,
            title: createIconText({ text: title }),
            image: `${UrlMangaKawaii_1.CDN_URL}/uploads${url}/cover/cover_thumb.jpg`,
        }));
    }
    // console.log("nbr search: " + titles.length)
    return createPagedResults({
        results: mangaTiles
    });
};
exports.parseSearch = parseSearch;
const parseTags = (data) => {
    var _a, _b, _c;
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: [] }),
        createTagSection({ id: '1', label: 'format', tags: [] })];
    const genres = JSON.parse((_a = data.match(/"Genre"\s*: (.*)/)) === null || _a === void 0 ? void 0 : _a[1].replace(/'/g, "\""));
    const typesHTML = (_b = data.match(/"Type"\s*: (.*),/g)) === null || _b === void 0 ? void 0 : _b[1];
    const types = JSON.parse((_c = typesHTML.match(/(\[.*\])/)) === null || _c === void 0 ? void 0 : _c[1].replace(/'/g, "\""));
    tagSections[0].tags = genres.map((e) => createTag({ id: e, label: e }));
    tagSections[1].tags = types.map((e) => createTag({ id: e, label: e }));
    return tagSections;
};
exports.parseTags = parseTags;
const parseHomeSections = ($, data, sectionCallback) => {
    var _a, _b;
    const latestSection = createHomeSection({ id: 'latest', title: 'LATEST UPDATES', view_more: false });
    const hotSection = createHomeSection({ id: 'hot_manga', title: 'TOP HITS', view_more: false });
    const topTenView = createHomeSection({ id: 'hot_ten_view', title: 'TOP 10', view_more: false });
    const titlesRecommanded = $('div[id*="load_latest"] h4').toArray().map((elem) => { return $(elem).text(); });
    const urlImagesRecommanded = $('div[id*="load_latest"] div h4 a').toArray().map((elem) => { var _a; return (_a = $(elem).attr('href')) !== null && _a !== void 0 ? _a : ""; });
    const titlesHot = $('div[class="hot-manga__item-name"]').toArray().map((elem) => { return $(elem).text(); });
    const urlImagesHot = $('a.hot-manga__item').toArray().map((elem) => { var _a; return (_a = $(elem).attr('href')) !== null && _a !== void 0 ? _a : ""; });
    const titleTopTenView = $('div[id="top_views"] a div[class="media-thumbnail__name"]').toArray().map((elem) => { return $(elem).text(); });
    const urlTopTenView = $('div[id="top_views"] a').toArray().map((elem) => { var _a; return (_a = $(elem).attr('href')) !== null && _a !== void 0 ? _a : ""; });
    const dictLaster = dictParser(titlesRecommanded, urlImagesRecommanded);
    const dictHot = dictParser(titlesHot, urlImagesHot);
    const dictTopTenView = dictParser(titleTopTenView, urlTopTenView);
    const sections = [latestSection, hotSection, topTenView];
    const sectionData = [dictLaster, dictHot, dictTopTenView];
    for (const [i, section] of sections.entries()) {
        sectionCallback(section);
        const manga = [];
        for (const elem of sectionData[i]) {
            const id = `${(_b = encodeURI((_a = elem.url) === null || _a === void 0 ? void 0 : _a.replace('/manga/', ''))) !== null && _b !== void 0 ? _b : ''}`;
            const title = `${elem.title}`.replace(/&#039;/g, '\'');
            const image = encodeURI(`${UrlMangaKawaii_1.CDN_URL}/uploads${elem.url}/cover/cover_thumb.jpg`);
            manga.push(createMangaTile({
                id,
                image,
                title: createIconText({ text: title })
            }));
        }
        section.items = manga;
        sectionCallback(section);
    }
};
exports.parseHomeSections = parseHomeSections;
function dictParser(titleArrat, urlArray) {
    let dict = [];
    for (let index = 0; index < titleArrat.length; index++) {
        dict.push({
            title: titleArrat[index],
            url: urlArray[index]
        });
    }
    return dict;
}

},{"./UrlMangaKawaii":50,"paperback-extensions-common":5}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CDN_URL = exports.ML_DOMAIN = void 0;
exports.ML_DOMAIN = 'https://www.mangakawaii.io';
exports.CDN_URL = "https://cdn.mangakawaii.pics";

},{}]},{},[48])(48)
});
