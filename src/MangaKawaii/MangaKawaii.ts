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
  import { parseChapterDetails, parseChapters, parseHomeSections, parseMangaDetails, parseSearch, parseTags, parseUpdatedManga, searchMetadata } from "./MangaKawaiiParsing"
  import { ML_DOMAIN } from "./UrlMangaKawaii"

  const method = 'GET'
  const headers = { "content-type": "application/x-www-form-urlencoded" }
  
  export const MangaKawaiiInfo: SourceInfo = {
    version: 'Dev:1.0.4',
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
      },
      {
        text: "development in progress",
        type: TagType.YELLOW
      }
    ]
  }

  export class MangaKawaii extends Source {
    getMangaShareUrl(mangaId: string): string | null { return `${ML_DOMAIN}/manga/${mangaId}` }
    userAgent: string =  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' + 
                         `Chrome/8${Math.floor(Math.random() * 9)}.0.4${Math.floor(Math.random() * (999 - 100) + 100)}.1${Math.floor(Math.random() * (99 - 10) + 10)} Safari/537.36`
  
    async getMangaDetails(mangaId: string): Promise<Manga> {
      const request = createRequestObject({
        url: `${ML_DOMAIN}/manga/`,
        method,
        headers,
        param: mangaId
      })
      const response = await this.requestManager.schedule(request, 3)
      console.log(response.status)
      const $ = this.cheerio.load(response.data)
      return parseMangaDetails($, mangaId)
    }
  
    async getChapters(mangaId: string): Promise<Chapter[]> {
      const request = createRequestObject({
        url: `${ML_DOMAIN}/manga/`,
        method,
        headers,
        param: mangaId
      })
      let response = await this.requestManager.schedule(request, 3)
      
      const re = RegExp('[\'"](/arrilot/load-widget.*?)[\'"]')
      const chapterRequest = response.data.match(re)
      const requestChapter = createRequestObject({
        url: `${ML_DOMAIN}${chapterRequest? chapterRequest[1] : ''}`,
        method,
        headers,
        })
      request.url = `${ML_DOMAIN}${chapterRequest? chapterRequest[1] : ''}`
     if(chapterRequest)
      response = await this.requestManager.schedule(requestChapter, 1)

      const $ = this.cheerio.load(response.data)
      return parseChapters($, mangaId)
    }
  
    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
      const request = createRequestObject({
        url: `${ML_DOMAIN}/manga`,
        headers ,
        method,
        param: chapterId
      })
  
      const response = await this.requestManager.schedule(request, 3)
      const $ = this.cheerio.load(response.data)
      return parseChapterDetails($, mangaId, chapterId)
    }
  
    async filterUpdatedManga(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void> {
 
      const request = createRequestObject({
        url: `${ML_DOMAIN}/`,
        headers ,
        method,
      })
      let data = await this.requestManager.schedule(request, 3)
      let $ = this.cheerio.load(data.data)

      let updatedManga = parseUpdatedManga($, time, ids)

      if (updatedManga.updates.length > 0) {
          mangaUpdatesFoundCallback(createMangaUpdates({
              ids: updatedManga.updates
          }))
      }
    }
  
    async searchRequest(query: SearchRequest, _metadata: any): Promise<PagedResults> {
      const metadata = searchMetadata(query);
      const request = createRequestObject({
        url: `${ML_DOMAIN}/search`,
        headers ,
        method,
        param: `?query=${metadata.query}&search_type=${metadata.search_type}`
      })
      const response = await this.requestManager.schedule(request, 3)
      const $ = this.cheerio.load(response.data)
      return parseSearch($, metadata, ML_DOMAIN)
    }
  
    async getTags(): Promise<TagSection[] | null> {
      const request = createRequestObject({
        url: `${ML_DOMAIN}/search/`,
        method,
        headers ,
      })
  
      const response = await this.requestManager.schedule(request, 3)
      return parseTags(response.data);
    }
  
    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
      const request = createRequestObject({
        url: `${ML_DOMAIN}`,
        method,
      })

      const response = await this.requestManager.schedule(request, 3)

      const $ = this.cheerio.load(response.data)
      parseHomeSections($, response.data, sectionCallback);
    }

  globalRequestHeaders(): RequestHeaders {
    return {
      referer: ML_DOMAIN,
      userAgent: this.userAgent
    }
  }
  
    getCloudflareBypassRequest() {
      return createRequestObject({
          url: `${ML_DOMAIN}`,
          method: 'GET',
      })
  }
  }