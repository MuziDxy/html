const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = 3000;

// 解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 提供静态文件
app.use(express.static(path.join(__dirname)));

// API代理端点
app.post('/api/userSoftList', async (req, res) => {
    try {
        const response = await fetch("http://yz.5yyz.com/manage/userSoftList", {
            method: "POST",
            headers: {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "proxy-connection": "keep-alive",
                "x-requested-with": "XMLHttpRequest",
                "cookie": "name=muzidxy; password=B28DC20381FC516462; SESSION=08926106-de78-4060-bfab-db87bcbe4db3",
                "Referer": "http://yz.5yyz.com/manage/ProductListPage",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: "destSoft=45387&destUser=1&userName=&dt1=&dt2=&agent=&data=&remark=&time=add&hourTime=1&pageNumber=1&pageSize=20"
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('API请求失败:', error);
        res.status(500).json({ error: '服务器错误', message: error.message });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});