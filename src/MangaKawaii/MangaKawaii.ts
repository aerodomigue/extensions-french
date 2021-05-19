import {
    Source,
    Manga,
    Chapter,
    ChapterDetails,
    HomeSection,
    SearchRequest,
    TagSection,
    PagedResults,
    SourceInfo,
    MangaUpdates,
    TagType,
    RequestHeaders
  } from "paperback-extensions-common"
  import { parseChapterDetails, parseChapters, parseHomeSections, parseMangaDetails, parseSearch, parseTags, parseUpdatedManga, parseViewMore, searchMetadata } from "./MangaKawaiiParsing"
  
  export const ML_DOMAIN = 'https://www.mangakawaii.com'
  export const CDN_URL = "https://cdn.mangakawaii.com"
  const method = 'GET'
  
  export const MangaKawaiiInfo: SourceInfo = {
    version: '0.1.11',
    name: 'MangaKawaii',
    icon: 'icon.png',
    author: 'aerodomigue',
    authorWebsite: 'https://github.com/aerodomigue',
    description: 'Extension that pulls manga from Mangakawaii, includes Search and Updated manga fetching',
    hentaiSource: false,
    websiteBaseURL: ML_DOMAIN,
    sourceTags: [
      {
        text: "Notifications",
        type: TagType.GREEN
      },
      {
        text: "Cloudflare",
        type: TagType.RED
      }
    ]
  }

  export class MangaKawaii extends Source {
    getMangaShareUrl(mangaId: string): string | null { return `${ML_DOMAIN}/manga/${mangaId}` }
    userAgent: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/8$userAgentRandomizer1.0.4$userAgentRandomizer3.1$userAgentRandomizer2 Safari/537.36"

    requestManager = createRequestManager({
      requestsPerSecond: 1,
      requestTimeout: 15000,
    })
  
    async getMangaDetails(mangaId: string): Promise<Manga> {
      const request = createRequestObject({
        url: `${ML_DOMAIN}/manga/`,
        method,
        param: mangaId
      })
      const response = await this.requestManager.schedule(request, 1)
      let $ = this.cheerio.load(response.data)
      return parseMangaDetails($, mangaId)
    }
  
    async getChapters(mangaId: string): Promise<Chapter[]> {
      const request = createRequestObject({
        url: `${ML_DOMAIN}/manga/`,
        method,
        headers : this.constructHeaders({}),
        param: mangaId
      })
  
      let response = await this.requestManager.schedule(request, 1)
      const re = RegExp('[\'"](/arrilot/load-widget.*?)[\'"]')
      const chapterRequest = response.data.match(re)
      let url = ""
      if(chapterRequest)
        {
          url = `${ML_DOMAIN}${chapterRequest[1]}`
          const request = createRequestObject({
            url: `${ML_DOMAIN}${chapterRequest[1]}`,
            method,
            headers : this.constructHeaders({}),
            })
          response = await this.requestManager.schedule(request, 1)
        }
      const $ = this.cheerio.load(response.data)
      return parseChapters($, mangaId, url)
    }
  
    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
      const request = createRequestObject({
        url: `${ML_DOMAIN}/read-online/`,
        headers : this.constructHeaders({}),
        method,
        param: chapterId
      })
  
      const response = await this.requestManager.schedule(request, 1)
      return parseChapterDetails(response.data, mangaId, chapterId);
    }
  
    async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
      const request = createRequestObject({
        url: `${ML_DOMAIN}/`,
        headers : this.constructHeaders({}),
        method,
      })
  
      const response = await this.requestManager.schedule(request, 1)
      const returnObject = parseUpdatedManga(response, time, ids);
      mangaUpdatesFoundCallback(createMangaUpdates(returnObject))
    }
  
    async searchRequest(query: SearchRequest, _metadata: any): Promise<PagedResults> {
      const metadata = searchMetadata(query);
      const request = createRequestObject({
        url: `${ML_DOMAIN}/search`,
        headers : this.constructHeaders({}),
        method,
        param: `?query=${metadata.query}&search_type=${metadata.search_type}`
      })
      const response = await this.requestManager.schedule(request, 1)
      const $ = this.cheerio.load(response.data)
      return parseSearch($, metadata, CDN_URL, ML_DOMAIN)
    }
  
    async getTags(): Promise<TagSection[] | null> {
      const request = createRequestObject({
        url: `${ML_DOMAIN}/search/`,
        method,
        headers : this.constructHeaders({}),
      })
  
      const response = await this.requestManager.schedule(request, 1)
      return parseTags(response.data);
    }
  
    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
      const request = createRequestObject({
        url: `${ML_DOMAIN}`,
        method,
      })
  
      const response = await this.requestManager.schedule(request, 1)
      const $ = this.cheerio.load(response.data)
      parseHomeSections($, response.data, sectionCallback);
    }
  
    async getViewMoreItems(homepageSectionId: string, _metadata: any): Promise<PagedResults | null> {
      const request = createRequestObject({
        url: ML_DOMAIN,
        method,
      })
  
      const response = await this.requestManager.schedule(request, 1)
      return parseViewMore(response.data, homepageSectionId);
    }

    constructHeaders(headers: any, refererPath?: string): any {
      if(this.userAgent !== '') {
          headers["user-agent"] = this.userAgent
      }
      headers["referer"] = `${ML_DOMAIN}${refererPath ?? ''}`
      headers["content-type"] = "application/x-www-form-urlencoded"
      return headers
  }
  
    globalRequestHeaders(): RequestHeaders {
      if(this.userAgent !== '') {
          return {
              "referer": ML_DOMAIN,
              "user-agent": this.userAgent,
          }
      }
      else {
          return {
              "referer": ML_DOMAIN,
          }
      }
  }

    CloudFlareError(status: any) {
      if(status == 503) {
          throw new Error('CLOUDFLARE BYPASS ERROR:\nPlease go to Settings > Sources > MangaKawaii and press Cloudflare Bypass')
      }
  }
  
    getCloudflareBypassRequest() {
      return createRequestObject({
          url: `${ML_DOMAIN}`,
          method: 'GET',
      })
  }
  }