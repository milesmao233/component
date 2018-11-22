const express = require('express');
const upload = require('multer')({ dest: 'uploads/' });
const path = require('path');
const fs = require('fs');
const log = console.log.bind(console)
const cors = require('cors')


let  app = express();

// index.html, index.js放在static文件夹中
app.use(express.static(path.join(__dirname, 'static')));
app.use(cors())


app.get('/', (req, res) => {
    res.redirect('index.html');
});

app.post('/upload', upload.single('test-upload'), (req, res) => {
    // 没有附带文件
    if (!req.file) {
        res.json({ ok: false });
        return;
    }

    // 输出文件信息
    console.log('====================================================');
    console.log('fieldname: ' + req.file.fieldname);
    console.log('originalname: ' + req.file.originalname);
    console.log('encoding: ' + req.file.encoding);
    console.log('mimetype: ' + req.file.mimetype);
    console.log('size: ' + (req.file.size / 1024).toFixed(2) + 'KB');
    console.log('destination: ' + req.file.destination);
    console.log('filename: ' + req.file.filename);
    console.log('path: ' + req.file.path);

    // 重命名文件
    let oldPath = path.join(__dirname, req.file.path);
    let newPath = path.join(__dirname, 'uploads/' + req.file.originalname);
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            res.json({ ok: false });
            console.log(err);
        } else {
            res.json({ ok: true });
        }
    });
});

const run = (port=3000, host='') => {
    const server = app.listen(port, host, () => {
        const address = server.address()
        log(`listening server at http://${address.address}:${address.port}`)
    })
}

if (require.main === module) {
    const port = 5000
    const host = '0.0.0.0'
    run(port, host)
}
