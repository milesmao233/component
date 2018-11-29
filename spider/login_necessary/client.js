const { cookie, user_agent } = require('./config')

const {
    log,
    parsedResponse,
    pathWithQuery,
    socketByProtocol,
    parsedUrl,
    saveData,
} = require('./utils')


const get = (url, query, callback) => {
    const {protocol, host, port, path} = parsedUrl(url)
    const client = socketByProtocol(protocol)

    let p = path
    if (Object.keys(query).length > 0) {
        // 拿到path和query结合
        p = pathWithQuery(path, query)
    }

    client.connect(port, host, () => {
        const request = `GET ${p} HTTP/1.1 \r\nHost: ${host}\r\nConnection: close\r\ncookie: ${cookie}\r\nuser-agent: ${user_agent}\r\n\r\n`
        client.write(request)
    })

    let s = ''
    client.on('data', (d) => {
        const r = d.toString()
        // log('r', r)
        const {code, headers} = parsedResponse(r)
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
        // client.destroy()
    })

    client.on('close', () => {
        // log('connection close')
    })
}

const __main = (url, filename, parsedFile) => {
    let l = []
    for (let i = 1; i < 3; i++) {
        const query = {
            page: i
        }
        get(url, query, (r) => {
            log(r)

            // const parsedHtml = require(parsedFile)
            // // 解析页面
            // const ms = parsedHtml(r)
            // l = [...l, ...ms]
            // if (l.length === 250) {
            //     log(l)
            //     // saveData(filename, l)
            // }
        })

    }
}

if (require.main === module) {
    const url = 'https://www.zhihu.com/people/lin-zi-you-52/answers'
    // const filename = 'linyou.json'
    // const parsedFile = './parsedlinyou'
    __main(url, filename, parsedFile)
}