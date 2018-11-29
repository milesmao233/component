const log = console.log.bind(console)

const parsedResponse = (r) => {
    let code = r.split(' ')[1]
    code = Number(code)

    let [header, body] = r.split('\r\n\r\n')
    header = header.split('\r\n').slice(1)

    let headers = {}
    header.forEach( h => {
        const [k, v] = h.split(': ')
        headers[k] = v
    })

    const o = {
        code,
        headers,
        body,
    }

    return o
}

const pathWithQuery = (path, query) => {
    const s = Object.keys(query).map(k => `${k}=${query[k]}`).join('&')
    const r = path + '?' + s
    return r
}

const socketByProtocol = (protocol) => {
    const net = require('net')
    const tls = require('tls')
    if (protocol === 'http') {
        const s = new net.Socket()
        return s
    } else {
        const s = new tls.TLSSocket()
        return s
    }
}

const parsedUrl = (url) => {
    const ParsedUrl = require('./parsedUrl')
    const m = new ParsedUrl()
    m.protocolOfUrl(url)
    m.hostOfUrl(url)
    m.portOfUrl(url)
    m.pathOfUrl(url)

    return m
}

const saveData = (path, data) => {
    const fs = require('fs')
    const s = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, s)
}

module.exports = {
    log,
    // 处理响应
    parsedResponse,
    // 处理地址栏
    pathWithQuery,
    // net或tls库
    socketByProtocol,
    // 处理url，返回host/port/path/protocol
    parsedUrl,
    // 保存数据
    saveData,
}