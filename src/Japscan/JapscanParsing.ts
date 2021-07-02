import { Chapter, ChapterDetails, HomeSection, LanguageCode, Manga, MangaStatus, MangaTile, MangaUpdates, PagedResults, SearchRequest, TagSection } from "paperback-extensions-common"
import { ML_DOMAIN } from "./UrlJapscan"

export const parseMangaDetails = ($: CheerioStatic, mangaId: string): Manga => { //work

    const card = $('div[class="card"]').first()

    const desc = $('p[class="list-group-item list-group-item-primary text-justify"]', card).text()
    const image = encodeURI( ML_DOMAIN + $('div[class="d-flex"] div img').attr('src'))
    const titles = [$('h1', card).text()]
    const author = "None"
    const rating = 0

    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: [] }),
    createTagSection({ id: '1', label: 'format', tags: [] })]
    tagSections[0].tags = $('a[itemprop="genre"]').toArray().map((elem) => createTag({ id: $(elem).text(), label: $(elem).text() }))

    let status = MangaStatus.ONGOING
    $('p[class="mb-2"] span:contains("Statut:")').each(function(i, element){
        var $this = $(element);
        var parent = $this.parent();
        $this.remove();
        let body = parent.text();
        status = body.replace(/\s+/g,"").includes('EnCours') ? MangaStatus.ONGOING : MangaStatus.COMPLETED
      })

    const manga = createManga({
        id: mangaId, //kill-the-hero
        titles , //[ 'Kill the Hero' ]
        image , //'https://cdn.mangakawaii.net/uploads/manga/kill-the-hero/cover/cover_250x350.jpg',
        status , //1
        author , //'D-Dart',
        tags: tagSections,
        desc , //'Nous sommes dans un monde semblable à un jeu, où donjons, monstres et joueurs apparaissent. Dans un monde dans lequel je suis le seul à connaître la v...',
        hentai: false,
        rating, //4.19
    })
    return manga
}

export const parseChapters = (responseArray: CheerioStatic[], mangaId: string): Chapter[] => {  //work
    const chapters: Chapter[] = []
    console.log("test")
    for (let $ of responseArray)
    {
        const chaptersHTML = $('tr[class*=volume-]:has(td)').toArray().map((elem) => {return $(elem) })
        console.log(chaptersHTML)

        for (const elem of chaptersHTML) {
            //let nbrChap = $('td[class="table__chapter px-0 text-nowrap"]', elem).html()
            const id = `${$('a[href*=manga]', elem).attr('href')}`.replace('/manga', '')
            const nbrChap = id.split('/')
            const chapNum = Number( nbrChap ? nbrChap[2] : 0 )
            const name = ($("td.table__chapter:has(span)", elem).text().trim() + ", team: " + $("td.table__user:has(a)", elem).text().trim())
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
    }
    return chapters;
}

export const parseChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => { //work
    const pages: string[] = []
    const urlPageArray =  $('div[id="all3"] img').map((i, x) => $(x).attr('src')).toArray()


    for (const page of urlPageArray) {
        pages.push(`${page}`.replace(/\s/g, ""))
    }
    const chapterDetails = createChapterDetails({
      id: chapterId,
      mangaId: mangaId,
      pages, 
      longStrip: false
    })
    return chapterDetails
}

export const parseUpdatedManga = ($: CheerioStatic, time: Date, ids: string[]): { updates: string[], loadNextPage: boolean } => { //i don't if it work x) ...
    let foundIds: string[] = []
        let passedReferenceTime = false
        for (let item of $('div[id*="load_latest"] div[class="section__list-group-chapter"]').toArray()) {
            let id = ($('a', item).attr('href') ?? '').replace('/manga/', '').split('/')[0]
            let date = ($('span[class="section__list-group-date"]',item).text() ?? 0);

            let mangaTime = new Date(0)

            if(date == "Aujourd'hui")
                mangaTime = new Date()
            else
                if(date == "Hier")
                {
                let currentDate = new Date()
                   mangaTime = new Date(currentDate.setDate(currentDate.getDate() - 1))
                }
                else
                {
                    const timeStr = date.split(' ')[1].split('/')
                    mangaTime = new Date(Date.parse(timeStr[2] + '-' + timeStr[1] + '-' + timeStr[0]))
                }



            passedReferenceTime = mangaTime <= time
            if (!passedReferenceTime) {
                if (ids.includes(id)) {
                    foundIds.push(id)
                }
            } else break
        }
        if (!passedReferenceTime) {
            return {updates: foundIds, loadNextPage: true}
        } else {
            return {updates: foundIds, loadNextPage: false}
        }
}

export const searchMetadata = (query: SearchRequest) => {//not work
    return {
        'query': query.title?.toLowerCase().split(' ').join('+'),
        'search_type': "manga",
    }
}

export const parseSearch = ($: CheerioStatic, metadata: any, ML_DOMAIN: string): PagedResults => {//work
    const mangaTiles: MangaTile[] = []
    const titles = $('h1 + ul a[href*=manga]').toArray().map((elem) => {return $(elem).attr('href') })

    for (const elem of titles) {
            mangaTiles.push(createMangaTile({
                id: encodeURI(`${elem}`.replace('/manga/', '')),
                title: createIconText({ text: `${$('h1 + ul a[href*="' + elem +'"]').text()}`.replace(/&#039;/g, '\'')}),
                image: `CDN_URL/uploads${elem}/cover/cover_250x350.jpg`,
            }))
    }
    console.log(mangaTiles)
    return createPagedResults({
        results: mangaTiles
    })
}

export const parseTags = (data: any): TagSection[] => {//not work
    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: [] }),
        createTagSection({ id: '1', label: 'format', tags: [] })]
    const genres = JSON.parse(data.match(/"Genre"\s*: (.*)/)?.[1].replace(/'/g, "\""))
    const typesHTML = data.match(/"Type"\s*: (.*),/g)?.[1]
    const types = JSON.parse(typesHTML.match(/(\[.*\])/)?.[1].replace(/'/g, "\""))
    tagSections[0].tags = genres.map((e: any) => createTag({ id: e, label: e }))
    tagSections[1].tags = types.map((e: any) => createTag({ id: e, label: e }))
    return tagSections
}

export const parseHomeSections = ($: CheerioStatic, data: any, sectionCallback: (section: HomeSection) => void): void => {//work
    const latestSection = createHomeSection({ id: 'latest', title: 'LATEST UPDATES', view_more: false })
    const hotSection = createHomeSection({ id: 'hot_manga', title: 'TOP HITS', view_more: false })
    const topTenView = createHomeSection({ id: 'hot_ten_view', title: 'TOP 10', view_more: false })

    const titlesRecommanded = $('div[id*="load_latest"] h4').toArray().map((elem) => {return $(elem).text()})
    const urlImagesRecommanded = $('div[id*="load_latest"] div h4 a').toArray().map((elem) => {return $(elem).attr('href') ?? ""})

    const titlesHot = $('div[class="hot-manga__item-name"]').toArray().map((elem) => {return $(elem).text()})
    const urlImagesHot = $('a.hot-manga__item').toArray().map((elem) => {return $(elem).attr('href') ?? ""})

    const titleTopTenView = $('div[id="top_views"] a div[class="media-thumbnail__name"]').toArray().map((elem) => {return $(elem).text()})
    const urlTopTenView = $('div[id="top_views"] a').toArray().map((elem) => {return $(elem).attr('href') ?? ""}) 

    const dictLaster = dictParser(titlesRecommanded, urlImagesRecommanded)
    const dictHot = dictParser(titlesHot, urlImagesHot)
    const dictTopTenView = dictParser(titleTopTenView, urlTopTenView)
    const sections = [latestSection, hotSection, topTenView]
    const sectionData = [dictLaster, dictHot, dictTopTenView]

    for (const [i, section] of sections.entries()) {
        sectionCallback(section)
        const manga: MangaTile[] = []
        for (const elem of sectionData[i]) {
            const id = `${encodeURI(elem.url?.replace('/manga/', '')) ?? ''}`
            const title = `${elem.title}`.replace(/&#039;/g, '\'')
            const image = encodeURI(`CDN_URL/uploads${elem.url}/cover/cover_250x350.jpg`)
            manga.push(createMangaTile({
                id,
                image,
                title: createIconText({ text: title })}))
        }
        section.items = manga
        sectionCallback(section)
    }
}

    function dictParser(titleArrat: string[], urlArray: string[])
    {
        let dict = [] 
        for (let index = 0; index < titleArrat.length; index++) {
            dict.push({
                title: titleArrat[index],
                url: urlArray[index]
            });
        }
        return dict
    }
