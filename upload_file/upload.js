// 方法1
var file = document.querySelector('#file').files[0]
// new 一个 FormData 对象
var fd = new FormData()
// 将上传的 file 添加到 fd 对象中
// 其中 avatar 字段是和后端约定好的
fd.append('test-upload', file)


// 往 fd 里面添加 file 之后, 就可以在下面使用了

var upload = function(url, fd) {
    var request = {
        url: url,
        method: 'POST',
        data: fd,
        // 注意, 下面两行是上传文件的套路
        contentType: false,
        processData: false,
        success: function(r) {
            console.log('上传成功', r)
        },
        error: function(e) {
            console.log('上传失败', e)
        }
    }
    $.ajax(request)
}
// 上传文件的套路
// url 是上传的 api 路径
var button = document.querySelector('#upload')


button.addEventListener('click', function (event) {
    // var url = 'http://0.0.0.0:5000/upload' // 跨域使用
    var url = '/upload'
    upload(url, fd)
})


//方法2
//  (function () {
//     'use strict';
//
//     var file = document.querySelector('#file');
//     var upload = document.querySelector('#upload');
//     var progress = document.querySelector('#progress');
//     var image = document.querySelector('#image');
//     var xhr = new XMLHttpRequest();
//
//     upload.addEventListener('click', uploadFile, false);
//     file.addEventListener('change', previewImage, false);
//
//     // 点击上传
//     function uploadFile(event) {
//         var formData = new FormData();
//         formData.append('test-upload', file.files[0]);
//         console.log('formData', formData)
//         xhr.onload = uploadSuccess;
//         xhr.upload.onprogress = setProgress;
//         xhr.open('post', '/upload', true);
//         xhr.send(formData);
//     }
//
//     // 成功上传
//     function uploadSuccess(event) {
//         if (xhr.readyState === 4) {
//             console.log(xhr.responseText);
//         }
//     }
//
//     // 进度条
//     function setProgress(event) {
//         if (event.lengthComputable) {
//             var complete = Number.parseInt(event.loaded / event.total * 100);
//             progress.innerHTML = complete + '%';
//         }
//     }
//
//     // 图片预览
//     function previewImage(event) {
//         var reader = new FileReader();
//         reader.onload = function (event) {
//             image.src = event.target.result;
//         };
//         reader.readAsDataURL(event.target.files[0]);
//     }
// })();


