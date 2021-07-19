(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Source = void 0;
class Source {
    constructor(cheerio) {
        // <-----------        OPTIONAL METHODS        -----------> //
        /**
         * Manages the ratelimits and the number of requests that can be done per second
         * This is also used to fetch pages when a chapter is downloading
         */
        this.requestManager = createRequestManager({
            requestsPerSecond: 2.5,
            requestTimeout: 5000
        });
        this.cheerio = cheerio;
    }
    /**
     * (OPTIONAL METHOD) This function is called when ANY request is made by the Paperback Application out to the internet.
     * By modifying the parameter and returning it, the user can inject any additional headers, cookies, or anything else
     * a source may need to load correctly.
     * The most common use of this function is to add headers to image requests, since you cannot directly access these requests through
     * the source implementation itself.
     *
     * NOTE: This does **NOT** influence any requests defined in the source implementation. This function will only influence requests
     * which happen behind the scenes and are not defined in your source.
     */
    globalRequestHeaders() { return {}; }
    globalRequestCookies() { return []; }
    /**
     * A stateful source may require user input.
     * By supplying this value to the Source, the app will render your form to the user
     * in the application settings.
     */
    getAppStatefulForm() { return createUserForm({ formElements: [] }); }
    /**
     * When the Advanced Search is rendered to the user, this skeleton defines what
     * fields which will show up to the user, and returned back to the source
     * when the request is made.
     */
    getAdvancedSearchForm() { return createUserForm({ formElements: [] }); }
    /**
     * (OPTIONAL METHOD) Given a manga ID, return a URL which Safari can open in a browser to display.
     * @param mangaId
     */
    getMangaShareUrl(mangaId) { return null; }
    /**
     * If a source is secured by Cloudflare, this method should be filled out.
     * By returning a request to the website, this source will attempt to create a session
     * so that the source can load correctly.
     * Usually the {@link Request} url can simply be the base URL to the source.
     */
    getCloudflareBypassRequest() { return null; }
    /**
     * (OPTIONAL METHOD) A function which communicates with a given source, and returns a list of all possible tags which the source supports.
     * These tags are generic and depend on the source. They could be genres such as 'Isekai, Action, Drama', or they can be
     * listings such as 'Completed, Ongoing'
     * These tags must be tags which can be used in the {@link searchRequest} function to augment the searching capability of the application
     */
    getTags() { return Promise.resolve(null); }
    /**
     * (OPTIONAL METHOD) A function which should scan through the latest updates section of a website, and report back with a list of IDs which have been
     * updated BEFORE the supplied timeframe.
     * This function may have to scan through multiple pages in order to discover the full list of updated manga.
     * Because of this, each batch of IDs should be returned with the mangaUpdatesFoundCallback. The IDs which have been reported for
     * one page, should not be reported again on another page, unless the relevent ID has been detected again. You do not want to persist
     * this internal list between {@link Request} calls
     * @param mangaUpdatesFoundCallback A callback which is used to report a list of manga IDs back to the API
     * @param time This function should find all manga which has been updated between the current time, and this parameter's reported time.
     *             After this time has been passed, the system should stop parsing and return
     */
    filterUpdatedManga(mangaUpdatesFoundCallback, time, ids) { return Promise.resolve(); }
    /**
     * (OPTIONAL METHOD) A function which should readonly allf the available homepage sections for a given source, and return a {@link HomeSection} object.
     * The sectionCallback is to be used for each given section on the website. This may include a 'Latest Updates' section, or a 'Hot Manga' section.
     * It is recommended that before anything else in your source, you first use this sectionCallback and send it {@link HomeSection} objects
     * which are blank, and have not had any requests done on them just yet. This way, you provide the App with the sections to render on screen,
     * which then will be populated with each additional sectionCallback method called. This is optional, but recommended.
     * @param sectionCallback A callback which is run for each independant HomeSection.
     */
    getHomePageSections(sectionCallback) { return Promise.resolve(); }
    /**
     * (OPTIONAL METHOD) This function will take a given homepageSectionId and metadata value, and with this information, should return
     * all of the manga tiles supplied for the given state of parameters. Most commonly, the metadata value will contain some sort of page information,
     * and this request will target the given page. (Incrementing the page in the response so that the next call will return relevent data)
     * @param homepageSectionId The given ID to the homepage defined in {@link getHomePageSections} which this method is to readonly moreata about
     * @param metadata This is a metadata parameter which is filled our in the {@link getHomePageSections}'s return
     * function. Afterwards, if the metadata value returned in the {@link PagedResults} has been modified, the modified version
     * will be supplied to this function instead of the origional {@link getHomePageSections}'s version.
     * This is useful for keeping track of which page a user is on, pagnating to other pages as ViewMore is called multiple times.
     */
    getViewMoreItems(homepageSectionId, metadata) { return Promise.resolve(null); }
    /**
     * (OPTIONAL METHOD) This function is to return the entire library of a manga website, page by page.
     * If there is an additional page which needs to be called, the {@link PagedResults} value should have it's metadata filled out
     * with information needed to continue pulling information from this website.
     * Note that if the metadata value of {@link PagedResults} is undefined, this method will not continue to run when the user
     * attempts to readonly morenformation
     * @param metadata Identifying information as to what the source needs to call in order to readonly theext batch of data
     * of the directory. Usually this is a page counter.
     */
    getWebsiteMangaDirectory(metadata) { return Promise.resolve(null); }
    // <-----------        PROTECTED METHODS        -----------> //
    // Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
    convertTime(timeAgo) {
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
    /**
     * When a function requires a POST body, it always should be defined as a JsonObject
     * and then passed through this function to ensure that it's encoded properly.
     * @param obj
     */
    urlEncodeObject(obj) {
        let ret = {};
        for (const entry of Object.entries(obj)) {
            ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
        }
        return ret;
    }
}
exports.Source = Source;

},{}],3:[function(require,module,exports){
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

},{"./Source":2}],4:[function(require,module,exports){
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

},{"./APIWrapper":1,"./base":3,"./models":25}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],6:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],7:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],8:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaStatus = void 0;
var MangaStatus;
(function (MangaStatus) {
    MangaStatus[MangaStatus["ONGOING"] = 1] = "ONGOING";
    MangaStatus[MangaStatus["COMPLETED"] = 0] = "COMPLETED";
})(MangaStatus = exports.MangaStatus || (exports.MangaStatus = {}));

},{}],11:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],12:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],13:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],14:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],15:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],16:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],17:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],18:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],19:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],20:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],23:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],24:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],25:[function(require,module,exports){
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
__exportStar(require("./TrackObject"), exports);
__exportStar(require("./OAuth"), exports);
__exportStar(require("./UserForm"), exports);

},{"./Chapter":5,"./ChapterDetails":6,"./Constants":7,"./HomeSection":8,"./Languages":9,"./Manga":10,"./MangaTile":11,"./MangaUpdate":12,"./OAuth":13,"./PagedResults":14,"./RequestHeaders":15,"./RequestManager":16,"./RequestObject":17,"./ResponseObject":18,"./SearchRequest":19,"./SourceInfo":20,"./SourceTag":21,"./TagSection":22,"./TrackObject":23,"./UserForm":24}],26:[function(require,module,exports){
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
const headers = { "content-type": "application/x-www-form-urlencoded" };
exports.MangaKawaiiInfo = {
    version: 'Stable:1.0.15',
    name: 'MangaKawaii',
    icon: 'icon.png',
    author: 'aerodomigue',
    authorWebsite: 'https://github.com/aerodomigue',
    description: 'Extension that pulls manga from Mangakawaii, includes Search and Updated manga fetching',
    hentaiSource: false,
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
    ]
};
class MangaKawaii extends paperback_extensions_common_1.Source {
    constructor() {
        super(...arguments);
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
            `Chrome/8${Math.floor(Math.random() * 9)}.0.4${Math.floor(Math.random() * (999 - 100) + 100)}.1${Math.floor(Math.random() * (99 - 10) + 10)} Safari/537.36`;
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
            return MangaKawaiiParsing_1.parseMangaDetails($, mangaId);
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
            const re = RegExp('[\'"](/arrilot/load-widget.*?)[\'"]');
            const chapterRequest = response.data.match(re);
            const requestChapter = createRequestObject({
                url: `${UrlMangaKawaii_1.ML_DOMAIN}${chapterRequest ? chapterRequest[1] : ''}`,
                method,
                headers,
            });
            if (chapterRequest)
                response = yield this.requestManager.schedule(requestChapter, 3);
            const $ = this.cheerio.load(response.data);
            return MangaKawaiiParsing_1.parseChapters($, mangaId);
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
            return MangaKawaiiParsing_1.parseChapterDetails($, mangaId, chapterId);
        });
    }
    filterUpdatedManga(mangaUpdatesFoundCallback, time, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${UrlMangaKawaii_1.ML_DOMAIN}/`,
                headers,
                method,
            });
            let data = yield this.requestManager.schedule(request, 3);
            let $ = this.cheerio.load(data.data);
            let updatedManga = MangaKawaiiParsing_1.parseUpdatedManga($, time, ids);
            if (updatedManga.updates.length > 0) {
                mangaUpdatesFoundCallback(createMangaUpdates({
                    ids: updatedManga.updates
                }));
            }
        });
    }
    searchRequest(query, _metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadata = MangaKawaiiParsing_1.searchMetadata(query);
            const request = createRequestObject({
                url: `${UrlMangaKawaii_1.ML_DOMAIN}/search`,
                headers,
                method,
                param: `?query=${metadata.query}&search_type=${metadata.search_type}`
            });
            const response = yield this.requestManager.schedule(request, 3);
            const $ = this.cheerio.load(response.data);
            return MangaKawaiiParsing_1.parseSearch($, metadata, UrlMangaKawaii_1.ML_DOMAIN);
        });
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${UrlMangaKawaii_1.ML_DOMAIN}/search/`,
                method,
                headers,
            });
            const response = yield this.requestManager.schedule(request, 3);
            return MangaKawaiiParsing_1.parseTags(response.data);
        });
    }
    getHomePageSections(sectionCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = createRequestObject({
                url: `${UrlMangaKawaii_1.ML_DOMAIN}`,
                method,
            });
            const response = yield this.requestManager.schedule(request, 3);
            const $ = this.cheerio.load(response.data);
            MangaKawaiiParsing_1.parseHomeSections($, response.data, sectionCallback);
        });
    }
    globalRequestHeaders() {
        return {
            referer: UrlMangaKawaii_1.ML_DOMAIN,
            userAgent: this.userAgent
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

},{"./MangaKawaiiParsing":27,"./UrlMangaKawaii":28,"paperback-extensions-common":4}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHomeSections = exports.parseTags = exports.parseSearch = exports.searchMetadata = exports.parseUpdatedManga = exports.parseChapterDetails = exports.parseChapters = exports.parseMangaDetails = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const UrlMangaKawaii_1 = require("./UrlMangaKawaii");
exports.parseMangaDetails = ($, mangaId) => {
    var _a, _b, _c;
    const json = (_a = $('[type=application\\/ld\\+json]').last().html()) !== null && _a !== void 0 ? _a : ''; // next, get second json child  
    const parsedJson = JSON.parse(json);
    const entity = parsedJson['@graph'];
    const desc = `${entity[1]['description']}`;
    const image = encodeURI(((_b = entity[0]['url']) !== null && _b !== void 0 ? _b : ""));
    const titles = [`${(_c = entity[1]['name']) !== null && _c !== void 0 ? _c : [""]}`.replace(/&#039;/g, '\'')];
    const author = `${$('span[itemprop="author"]').text()}`;
    const rating = Number($('strong[id="avgrating"]').text());
    const tagSections = [createTagSection({ id: '0', label: 'genres', tags: [] }),
        createTagSection({ id: '1', label: 'format', tags: [] })];
    tagSections[0].tags = $('a[itemprop="genre"]').toArray().map((elem) => createTag({ id: $(elem).text(), label: $(elem).text() }));
    let status = paperback_extensions_common_1.MangaStatus.ONGOING;
    status = $('.row').text().includes('En Cours') ? paperback_extensions_common_1.MangaStatus.ONGOING : paperback_extensions_common_1.MangaStatus.COMPLETED;
    const manga = createManga({
        id: mangaId,
        titles,
        image,
        status,
        author,
        tags: tagSections,
        desc,
        hentai: false,
        rating,
    });
    return manga;
};
exports.parseChapters = ($, mangaId) => {
    const chaptersHTML = $('tr[class*=volume-]:has(td)').toArray().map((elem) => { return $(elem); });
    const chapters = [];
    let nbrline = 0;
    for (const elem of chaptersHTML) {
        //let nbrChap = $('td[class="table__chapter px-0 text-nowrap"]', elem).html()
        const id = `${$('a[href*=manga]', elem).attr('href')}`.replace('/manga', '');
        let nbrChap = $("td.table__chapter span", elem).text();
        let n = nbrChap.lastIndexOf('Chapitre');
        let result = parseFloat(nbrChap.substring(n + 1).replace(/[,-]/g, ".").trim());
        console.log(nbrChap);
        console.log(result);
        const chapNum = Number(nbrline++);
        const name = ($("td.table__chapter:has(span)", elem).text().trim() + ", team: " + $("td.table__user:has(a)", elem).text().trim());
        const timeStr = $("td.table__date.small", elem).text().split(' ')[1].split('.');
        let time = new Date(Date.parse(timeStr[2] + '-' + timeStr[1] + '-' + timeStr[0]));
        chapters.push(createChapter({
            id,
            mangaId,
            name,
            chapNum,
            langCode: paperback_extensions_common_1.LanguageCode.FRENCH,
            time
        }));
    }
    return chapters;
};
exports.parseChapterDetails = ($, mangaId, chapterId) => {
    const pages = [];
    const urlPageArray = $('div[id="all3"] img').map((i, x) => $(x).attr('src')).toArray();
    for (const page of urlPageArray) {
        pages.push(`${page}`.replace(/\s/g, ""));
    }
    const chapterDetails = createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages,
        longStrip: false
    });
    return chapterDetails;
};
exports.parseUpdatedManga = ($, time, ids) => {
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
exports.searchMetadata = (query) => {
    var _a;
    return {
        'query': (_a = query.title) === null || _a === void 0 ? void 0 : _a.toLowerCase().split(' ').join('+'),
        'search_type': "manga",
    };
};
exports.parseSearch = ($, metadata, ML_DOMAIN) => {
    const mangaTiles = [];
    const titles = $('h1 + ul a[href*=manga]').toArray().map((elem) => { return $(elem).attr('href'); });
    for (const elem of titles) {
        mangaTiles.push(createMangaTile({
            id: encodeURI(`${elem}`.replace('/manga/', '')),
            title: createIconText({ text: `${$('h1 + ul a[href*="' + elem + '"]').text()}`.replace(/&#039;/g, '\'') }),
            image: `${UrlMangaKawaii_1.CDN_URL}/uploads${elem}/cover/cover_250x350.jpg`,
        }));
    }
    console.log(mangaTiles);
    return createPagedResults({
        results: mangaTiles
    });
};
exports.parseTags = (data) => {
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
exports.parseHomeSections = ($, data, sectionCallback) => {
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
            const image = encodeURI(`${UrlMangaKawaii_1.CDN_URL}/uploads${elem.url}/cover/cover_250x350.jpg`);
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

},{"./UrlMangaKawaii":28,"paperback-extensions-common":4}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CDN_URL = exports.ML_DOMAIN = void 0;
exports.ML_DOMAIN = 'https://www.mangakawaii.net';
exports.CDN_URL = "https://cdn.mangakawaii.net";

},{}]},{},[26])(26)
});
