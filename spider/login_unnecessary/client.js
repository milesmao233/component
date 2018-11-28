const log = console.log.bind(console)

const parsedUrl = (url) => {
    const ParsedUrl = require('./parsedUrl')
    const m = new ParsedUrl()
    m.protocolOfUrl(url)
    m.hostOfUrl(url)
    m.portOfUrl(url)
    m.pathOfUrl(url)

    return m
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

const pathWithQuery = (path, query) => {
    const s = Object.keys(query).map(k => `${k}=${query[k]}`).join('&')
    const r = path + '?' + s
    return r
}

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

const get = (url, query, callback) => {
    const { protocol, host, port, path } = parsedUrl(url)
    const client = socketByProtocol(protocol)

    let p = path
    if (Object.keys(query).length > 0) {
        // 拿到path和query结合
        p = pathWithQuery(path, query)
    }

    client.connect(port, host, () => {
        const request = `GET ${p} HTTP/1.1 \r\nHost: ${host}\r\nConnection: close\r\n\r\n`
        client.write(request)
    })

    let s = ''
    client.on('data', (d) => {
        const r = d.toString()
        const {code, headers, body} = parsedResponse(r)
        if (code === 301) {
            const redirectUrl = headers.Location
            get(redirectUrl, {}, callback)
        } else {
            s += r
        }
    })

    client.on('end', () => {
        if (s.length > 0) {
            callback(s)
        }
    })

    client.on('close', () => {
        // log('connection close')
    })
}

const __main = () => {
    let l = []
    for (let i = 0; i < 10; i++) {
        const url = 'http://movie.douban.com/top250'
        const query = {
            start: i * 25
        }
        get(url, query, (r) => {
            // 解析页面
            // const ms = parsedHtml(r)
            // l = [...l, ...ms]
            // if (l.length === 250) {
            //     log(l)
            // }
            log(r)
        })

    }
}

__main()