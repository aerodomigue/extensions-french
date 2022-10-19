import { Chapter, ChapterDetails, HomeSection, LanguageCode, Manga, MangaStatus, MangaTile, MangaUpdates, PagedResults, SearchRequest, TagSection } from "paperback-extensions-common"
import { CDN_URL } from "./UrlMangaKawaii"
import * as cheerio from 'cheerio';

export const parseMangaDetails = ($: CheerioStatic, mangaId: string): Manga => { //work
    // const json = $('[type=application\\/ld\\+json]').last().html() ?? '' // next, get second json child  
    // const parsedJson = JSON.parse(json)
    // const entity = parsedJson['@graph']
    const desc = $("dd.text-justify.text-break").text().toString();
    const image = $("div.manga-view__header-image").find("img").attr("src") || "";
    const titles = [$($("span[itemprop*=name]").get(1)).text().toString() || ""];
    const author = $("a[href*=author]").text().toString();
    const rating = Number($("strong[id*=avgrating]").text())

    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: [] }),
    createTagSection({ id: '1', label: 'format', tags: [] })]
    tagSections[0].tags = $('a[itemprop="genre"]').toArray().map((elem) => createTag({ id: $(elem).text(), label: $(elem).text() }))

    let status = MangaStatus.ONGOING
    status = MangaStatus.ONGOING // OLD $('.row').text().includes('En Cours') ? MangaStatus.ONGOING : MangaStatus.COMPLETED // WIP not work
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

export const parseChapters = ($: CheerioStatic, mangaId: string, langFr: boolean): Chapter[] => {  //work
    const chaptersHTML = $('tr[class*=volume-]:has(td)').toArray().map((elem) => {return $(elem) })
    const chapters: Chapter[] = []

    // Check if is licenced
    const isLicenced = $("div[class*=ribbon__licensed]").text();

    if(isLicenced.length == 0) {
        let nbrline = chaptersHTML.length
        for (const elem of chaptersHTML) {
        const id = encodeURI(`${$('a[href*=manga]', elem).attr('href')}`.replace('/manga', ''))
        const name = '';// $("a span", elem).text().trim().replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g,''); // Convert `\nChap.      \n2      \n  \n` -> `Chap. 2`
        let nbrChap = $("a span", elem).text().trim().replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g,'').split(' ')[1]
        const chapNum = parseFloat(nbrChap)
        const timeStr = $("td.table__date", elem).first().text().trim().split('\n')[0].split('.');
        let time = new Date(Date.parse(timeStr[1] + '-' + timeStr[0] + '-' + timeStr[2]))
        let lang = LanguageCode.FRENCH

        chapters.push(createChapter({
            id,
            mangaId,
            name,
            chapNum,
            langCode: lang,
            time
        }))
        nbrline--
        }
    } else {
        chapters.push(createChapter({
            id: mangaId + '/fr/0',
            mangaId,
            name: "L'oeuvre est licencié, tous les chapitres ont été retirés.",
            chapNum: 0,
            langCode: LanguageCode.FRENCH,
            time: new Date()
        }))
    }


    return chapters;
}

export const parseChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => { //work
    const pages: string[] = []
    const chapterSlug = $.html().match(/var chapter_slug = "([^"]*)";/)![1];
    const mangaSlug = $.html().match(/var oeuvre_slug = "([^"]*)";/)![1];

    var page;
    var reg = RegExp('page_image":"([^"]*)"', 'g');
    while((page = reg.exec($.html())) !== null) {
        pages.push(CDN_URL + "/uploads/manga/" + mangaSlug + "/chapters_fr/" + chapterSlug + "/" + page[1])
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
    const titles = $('ul[class="pl-3"] li div h4 a[href*=manga]').toArray().map((elem) => {return $(elem) })

    for (const elem of titles) {
        const title = $(elem).text().replace(/&#039;/g, '\'')
        const url = `${$(elem).attr("href")}`
        // console.log("search: " + title) 
        // console.log("url: " + url) 
        // console.log("id: " + encodeURI(title.replace('/manga/', ''))) 
            mangaTiles.push(createMangaTile({
                id: `${encodeURI(url?.replace('/manga/', '')) ?? ''}`,
                title: createIconText({ text: title}),
                image: `${CDN_URL}/uploads${url}/cover/cover_thumb.jpg`,
            }))
    }
    // console.log("nbr search: " + titles.length)
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
            const image = encodeURI(`${CDN_URL}/uploads${elem.url}/cover/cover_thumb.jpg`)
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