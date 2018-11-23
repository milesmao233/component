const addPictureTemplate = (src) => {
    const len = src.length
    const slideContainer = e('.slide')
    slideContainer.dataset.imgs = JSON.stringify(len)
    slideContainer.dataset.active = '0'

    // 加入Button
    const buttonHtml = `
          <button class="slide-button left vertical-center" data-offset="-1">&lt;</button>
          <button class="slide-button right vertical-center" data-offset="1">&gt;</button>
    `
    appendHtmlBegin(slideContainer, buttonHtml)

    let html = ''
    // 加入images
    for (let i = 0; i < len; i++) {
        const pic = src[i]
        if (i === 0) {
            html = `
              <img id="id-image-${i}" class="slide-image active" alt="picture${i}" src="${pic}">
        `
        } else {
            html = `
            <img id="id-image-${i}" class="slide-image" alt="picture${i}" src="${pic}">
             `
        }
        appendHtmlBegin(slideContainer, html)
    }


    // 加入轮播图点
    const indicatorContainer = e('.slide-indicators')
    // 先加入白色的点
    // 再加入其他的点

    for (let i = 0; i < len; i++) {
        if (i === 0) {
            html = `
             <div id="id-indi-0" class="slide-indi white" data-index="0"></div>
        `
        } else {
            html = `
             <div id="id-indi-${i}" class="slide-indi" data-index="${i}"></div>
             `
        }
        appendHtml(indicatorContainer, html)
    }

}

const nextIndex = (slide, offset) => {
    const numberOfImgs = parseInt(slide.dataset.imgs)
    const activeIndex = parseInt(slide.dataset.active)
    const i = (numberOfImgs + activeIndex + offset) % numberOfImgs
    return i
}

const showImageAtIndex = (slide, index) => {
    slide.dataset.active = index
        removeClassAll('active')
        const imgContainer = e(`#id-image-${index}`)
        imgContainer.classList.add('active')

        removeClassAll('white')
        const indContainer = e(`#id-indi-${index}`)
        indContainer.classList.add('white')

}

const bindEventSlide = () => {
    const selector = '.slide-button'
    bindAll(selector, 'click', function (event) {
        // 找到按了后下一张是哪一张
        const button = event.target
        const offset = Number(button.dataset.offset)
        const slide = button.closest('.slide')
        const index = nextIndex(slide, offset)

        // 对父元素里的数据进行处理
        // showImageAtIndex(slide, index)

        setTimeout(function () {
            showImageAtIndex(slide, index)
        }, 400)
    })
}

const bindEventIndicator = () => {
    const selector = '.slide-indi'
    bindAll(selector, 'mouseover', function (event) {
        // 找到按的是第几张
        const ind = event.target
        const index = ind.dataset.index

        // 对父元素里的数据进行处理
        const slide = ind.closest('.slide')
        // showImageAtIndex(slide, index)
        setTimeout(function () {
            showImageAtIndex(slide, index)
        }, 400)
    })
}

const playNextImage = function() {
    const slide = e('.slide')
    const offset = 1
    const index = nextIndex(slide, offset)
    showImageAtIndex(slide,index)
}

const autoPlay = () => {
    const interval = 2000
    const clockId = setInterval(function() {
        // 每 2s 都会调用这个函数
        playNextImage()
    }, interval)

    return clockId
}

const play = () => {
    // 如果在slide的区域之内，就不会循环播放
    const element = e('.slide')
    let clockId = autoPlay()

    bindEvent(element, 'mouseover', function (event) {
        clearInterval(clockId)
    })

    bindEvent(element, 'mouseout', function (event) {
        clockId = autoPlay()
    })
}

const __main = () => {
    const src = ["slideimages/1.jpg", "slideimages/2.jpg", "slideimages/3.jpg"]
    addPictureTemplate(src)
    bindEventSlide()
    bindEventIndicator()
    play()
}

__main()
