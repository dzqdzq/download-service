
const express = require('express');
const basicAuth = require('basic-auth');
const fs = require('fs');
const path = require('path');
const { env } = require('node:process');
const app = express();

// 设置基本认证的用户名和密码
const USERNAME = env.USER;
const PASSWORD = env.PASS;

const PORT = 3000;
const FILE_DIR = '/download';

if(!fs.existsSync(FILE_DIR)){
    fs.mkdirSync(FILE_DIR, {
        recursive: true
    })
}

function auth(req, res, next) {
    const user = basicAuth(req);
    if (!user || user.name !== USERNAME || user.pass !== PASSWORD) {
        return res.status(403).send('');
    }
    next();
}

app.get('/*', auth, (req, res) => {
    const filename = req.path;
    const filePath = path.join(FILE_DIR, filename);
    console.log('filePath::',filePath);
    // 检查文件是否存在
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            return res.status(404).send('File not found');
        }

        // 设置响应头，触发下载
        res.download(filePath, filename, (err) => {
            if (err) {
                return res.status(500).send('Error downloading the file');
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});