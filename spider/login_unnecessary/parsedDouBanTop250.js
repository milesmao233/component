// 获取页面数据，因为没法用DOM，这里用到原生的方法，字符串截取
// 可以用第三方库cheerio，操作方法和DOM相似，效率会高很多
const {log, parsedResponse} = require('./utlis')

const findAll = (s, tag) => {
    const l = []
    let html = s
    const begin = `<${tag}`
    const end = `</${tag}>`

    let i = 0
    while (i < s.length) {
        const e = findBetween(html, begin, end)
        // 如果找不到 e 说明找完了
        if (e.length === 0) {
            break
        }
        l.push(e)
        html = html.slice(e.length)
        i += e.length
    }
    return l
}

const findBetween = (s, begin, end) => {
    const i1 = s.indexOf(begin)
    const i2 = s.indexOf(end, i1)
    const r = s.slice(i1, i2 + end.length)

    return r
}

const findInner = (s, begin, end) => {
    const i1 = s.indexOf(begin)
    const i2 = s.indexOf(end, i1)
    const r = s.slice(i1 + begin.length, i2)
    return r
}

class Movie {
    constructor() {
        this.name = ''
        this.ranking = 0
        this.score = 0
        this.quote = ''
    }
}


const movieFromDiv = (div) => {
    const m = new Movie()
    m.name = findInner(div, '<span class="title">', '</span>')

    const ranking = findInner(div, '<em class="">', '</em>')
    m.ranking = Number(ranking)

    const score = findInner(div, '<span class="rating_num" property="v:average">', '</span>')
    m.score = Number(score)

    m.quote = findInner(div, '<span class="inq">', '</span>')
    return m
}

const parsedHtml = (r) => {
    const {body} = parsedResponse(r)
    const grid = findBetween(body, '<ol class="grid_view">', '</ol>')
    const movies = findAll(grid, 'li')
    const ms = movies.map(e => movieFromDiv(e))
    return ms
}

module.exports = parsedHtml
