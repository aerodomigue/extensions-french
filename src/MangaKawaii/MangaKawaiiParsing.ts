import { NONAME } from "dns"
import { Chapter, ChapterDetails, HomeSection, LanguageCode, Manga, MangaStatus, MangaTile, MangaUpdates, PagedResults, SearchRequest, TagSection } from "paperback-extensions-common"

export const CDN_URL = "https://cdn.mangakawaii.com"

export type RegexIdMatch = {
    [id: string]: RegExp
}
export const regex: RegexIdMatch = {
    'hot_update': /vm.HotUpdateJSON = (.*);/,
    'latest': /vm.LatestJSON = (.*);/,
    'recommended': /vm.RecommendationJSON = (.*);/,
    'new_titles': /vm.NewSeriesJSON = (.*);/,
    'chapters': /vm.Chapters = (.*);/,
    'directory': /vm.FullDirectory = (.*);/,
    'directory_image_host': /<img ng-src=\"(.*)\//
}

export const parseMangaDetails = ($: CheerioStatic, mangaId: string, url: string): Manga => {
    const json = $('[type=application\\/ld\\+json]').last().html() ?? '' // next, get second child  
    const parsedJson = JSON.parse(json)
    const entity = parsedJson['@graph']
    const desc = entity[1]['description']
    const image = entity[0]['url']
    const titles = [entity[1]['name']] ?? [""]
    const author = $('span[itemprop="author"]').text()
    const rating = Number($('strong[id="avgrating"]').text())

    //const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: [] }),
    //createTagSection({ id: '1', label: 'format', tags: [] })]
    //tagSections[0].tags = $('a[itemprop="genre"]').toArray().map((elem) => createTag({ id: $(elem).text(), label: $(elem).text() }))
    //const lastUpdate = $('td[class="table__date.small"]').text()

    let status = MangaStatus.ONGOING
    status = $('.row').text().includes('En Cours') ? MangaStatus.ONGOING : MangaStatus.COMPLETED

    return createManga({
        id: mangaId,
        titles ,
        image ,
        status ,
        author ,
        //tags: tagSections,
        desc ,
        hentai: false,
        rating,
        lastUpdate: ""
    })
}

export const parseChapters = ($: CheerioStatic, mangaId: string,  url: string): Chapter[] => {
    const chaptersHTML = $('tr[class*=volume-]:has(td)').toArray().map((elem) => {return $(elem) })
    const chapters: Chapter[] = []

    for (const elem of chaptersHTML) {
      //let nbrChap = $('td[class="table__chapter px-0 text-nowrap"]', elem).html()
      const id = `${$('a[href*=manga]', elem).attr('href')}`.replace('/manga', '')
      const nbrChap = id.split('/')
      const chapNum = Number( nbrChap ? nbrChap[2] : 0 )
      const name = $("td.table__chapter:has(span)", elem).text().trim()
      const timeStr = $("td.table__date.small", elem).text().split(' ')[1].split('.')
      let time = new Date(Date.parse(timeStr[2] + '-' + timeStr[1] + '-' + timeStr[0]))

      chapters.push(createChapter({
        id,
        mangaId,
        name,
        chapNum,
        langCode: LanguageCode.FRENCH,
        time
      }))
    }
    return chapters;
}

export const parseChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string, ML_DOMAIN: string): ChapterDetails => {
    const pages: string[] = []

    const chapterInfo = JSON.parse("{}")
    const charNumPage = $('select[id="page-list"]').text().replace(/\t*\n*/g, '').split("Page").length - 1
    const pageNum = Number(charNumPage)


    const nbrChap = chapterId.split('/')
    const chapter = Number( nbrChap ? nbrChap[2] : 0 )

    const urlPageArray =  $('div[id="all3"] img').map((i, x) => $(x).attr('data-src')).toArray()

    for (const page of urlPageArray) {
        pages.push(`${page}`.replace(/\s/g, ""))
    }
    const chapterDetails = createChapterDetails({
      id: chapterId,
      mangaId: mangaId,
      pages, longStrip: false
    })
    return chapterDetails
}

export const parseUpdatedManga = ({ data }: any, time: Date, ids: string[]): MangaUpdates => {
    const returnObject: MangaUpdates = {
        'ids': []
    }
    const updateManga = JSON.parse(data.match(regex['latest'])?.[1])
    for (const elem of updateManga) {
        if (ids.includes(elem.IndexName) && time < new Date(elem.Date)) returnObject.ids.push(elem.IndexName)
    }
    return returnObject;
}

export const searchMetadata = (query: SearchRequest) => {
    return {
        'query': query.title?.toLowerCase().split(' ').join('+'),
        'search_type': "manga",
    }
}

export const parseSearch = ($: CheerioStatic, metadata: any, CDN_URL: string, ML_DOMAIN: string): PagedResults => {
    const mangaTiles: MangaTile[] = []
    const titles = $('h1 + ul a[href*=manga]').toArray().map((elem) => {return $(elem).attr('href') })

    for (const elem of titles) {
            mangaTiles.push(createMangaTile({
                id: `${elem}`.replace('/manga/', ''),
                title: createIconText({ text: $('h1 + ul a[href*="' + elem +'"]').text() }),
                image: `${CDN_URL}/uploads${elem}/cover/cover_250x350.jpg`,
            }))
    }
    // This source parses JSON and never requires additional pages
    return createPagedResults({
        results: mangaTiles
    })
}

export const parseTags = (data: any): TagSection[] => {
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: [] }),
        createTagSection({ id: '1', label: 'format', tags: [] })]
    const genres = JSON.parse(data.match(/"Genre"\s*: (.*)/)?.[1].replace(/'/g, "\""))
    const typesHTML = data.match(/"Type"\s*: (.*),/g)?.[1]
    const types = JSON.parse(typesHTML.match(/(\[.*\])/)?.[1].replace(/'/g, "\""))
    tagSections[0].tags = genres.map((e: any) => createTag({ id: e, label: e }))
    tagSections[1].tags = types.map((e: any) => createTag({ id: e, label: e }))
    return tagSections
}

export const parseHomeSections = ($: CheerioStatic, data: any, sectionCallback: (section: HomeSection) => void): void => {
    const hotSection = createHomeSection({ id: 'hot_manga', title: 'TOP HITS', view_more: true })
    const latestSection = createHomeSection({ id: 'latest', title: 'LATEST UPDATES', view_more: true })
    const newTitlesSection = createHomeSection({ id: 'new_titles', title: 'NEW TITLES', view_more: true })
    const recommendedSection = createHomeSection({ id: 'recommended', title: 'RECOMMENDATIONS', view_more: true })

    const titlesHot = $('div[class="hot-manga__item-name"]').toArray().map((elem) => {return $(elem).text()}).slice(0, 15)
    const urlImagesHot = $('a.hot-manga__item').toArray().map((elem) => {return $(elem).attr('href')}).slice(0, 15)

    const titlesRecommanded = $('div[id="load_latest"] h4').toArray().map((elem) => {return $(elem).text()}).slice(0, 15)
    const urlImagesRecommanded = $('div[id="load_latest"] h4 a').toArray().map((elem) => {return $(elem).attr('href')}).slice(0, 15)

    console.log(urlImagesRecommanded)

    let dictHot = [] 
    for (let index = 0; index < titlesHot.length; index++) {
        dictHot.push({
            title: titlesHot[index],
            url: urlImagesHot[index]
        });
    }

    let dictLaster = [] 
    for (let index = 0; index < titlesHot.length; index++) {
        dictLaster.push({
            title: titlesRecommanded[index],
            url: urlImagesRecommanded[index]
        });
    }

    //const latest = JSON.parse((data.match(regex[latestSection.id])?.[1])).slice(0, 15)
    //const newTitles = JSON.parse((data.match(regex[newTitlesSection.id]))?.[1]).slice(0, 15)
    //const recommended = JSON.parse((data.match(regex[recommendedSection.id])?.[1]))

    const sections = [hotSection, latestSection]//, latestSection, newTitlesSection]
    const sectionData = [dictHot, dictLaster]//, latest, newTitles]

    for (const [i, section] of sections.entries()) {
        sectionCallback(section)
        const manga: MangaTile[] = []
        for (const elem of sectionData[i]) {
            const id = `${elem.url?.replace('/manga/', '') ?? ''}`
            const title = elem.title
            const image = `${CDN_URL}/uploads${elem.url}/cover/cover_250x350.jpg`
            manga.push(createMangaTile({
                id,
                image,
                title: createIconText({ text: title })}))
        }
        section.items = manga
        sectionCallback(section)
    }
}

export const parseViewMore = (data: any, homepageSectionId: string): PagedResults | null => {
    const manga: MangaTile[] = []
    const mangaIds: Set<string> = new Set<string>()
    if (!regex[homepageSectionId]) return null
    const items = JSON.parse((data.match(regex[homepageSectionId]))?.[1])
    
    for (const item of items) {
        const id = item.IndexName
        if (!mangaIds.has(id)) {
            const title = item.SeriesName
            const image = `${CDN_URL}/${id}.jpg`
            let time = (new Date(item.Date)).toDateString()
            time = time.slice(0, time.length - 5)
            time = time.slice(4, time.length)

            manga.push(createMangaTile({
                id,
                image,
                title: createIconText({ text: title }),
                secondaryText: homepageSectionId !== 'new_titles' ? createIconText({ text: time, icon: 'clock.fill' }) : undefined
            }))
            mangaIds.add(id)
        }
    }

    // This source parses JSON and never requires additional pages
    return createPagedResults({
        results: manga
    })
}
