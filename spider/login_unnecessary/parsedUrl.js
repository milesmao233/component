class ParsedUrl {
    constructor() {
        this.protocol = ''
        this.host = ''
        this.port = ''
        this.path = ''
    }

    protocolOfUrl(url) {
        if (url.startsWith('https://')) {
            this.protocol = 'https'
        } else {
            this.protocol = 'http'
        }
    }



    hostOfUrl(url) {
        let host, u
        if (url.startsWith('https://') || url.startsWith('http://')) {
            u = url.split('://')[1]
        } else {
            u = url
        }

        const index = u.indexOf(':')
        if (index > -1) {
            host = u.slice(0, index)
        } else {
            host = u
            host = host.split('/')[0]
        }
        this.host = host
    }


    portOfUrl(url) {
        let protocol = 'http'
        let u = ''
        let port = 80
        if (url.startsWith('https://') || url.startsWith('http://')) {
            [protocol, u] = url.split('://')
        } else {
            u = url
        }

        const portMapper = {
            'http': 80,
            'https': 443,
        }

        const index = u.indexOf(':')
        if (index > -1) {
            u = u.slice(index + 1)
            const p = u.split('/')[0]
            port = Number(p)
        } else {
            port = portMapper[protocol]
        }

        this.port = port
    }

    pathOfUrl(url) {
        let u = ''
        if (url.startsWith('https://') || url.startsWith('http://')) {
            u = url.split('://')[1]
        } else {
            u = url
        }

        let path = '/'
        const index = u.indexOf('/')
        if (index > -1) {
            // 这里需要包含 /
            // 所以直接 index 就可以
            path = u.slice(index)
        }
        this.path = path
    }
}

module.exports = ParsedUrl
