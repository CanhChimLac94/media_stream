const express = require('express');
const fs = require('fs');
const router = express.Router();

// const usersRouter = require('./users');
// const apiRouter = require('./api');
const mediaRouter = require('./media');
const appCtrl = require('../Controlers/AppCtrl');
const Youtube = require("../Controlers/YoutubeCtrl");
const TikTok = require("../Controlers/TikTokCtrl");

/**
 * Trace function can log in fo to debug
 * @param {object} obj 
 * @param {message} msg 
 */
function trace(obj, msg) {
    if (undefined == msg || null == msg || "" == msg) msg = "\ndebug log:";
    console.log(msg);
    console.log(obj);
}
//--------------Auto load controlser----------------------------
try {
    const pathCtrl = __dirname + "/../Controlers";
    const files = fs.readdirSync(pathCtrl);
    files.forEach(file => {
        const name = file.substr(0, file.length - 3);
        const pathName = "../Controlers/" + name;
        eval(name + "=" + "require('" + pathName + "')")
    });
} catch (exc) {
    trace(exc);
}
//==============================================================
/* GET home page. */
// router.get('/', function (req, res, next) {
//     // res.sendFile("./views/index.html");
//     const filePath = __dirname + '/../views/index.html';
//     res.sendFile(filePath);
//     // res.render('index', {
//     //     title: ''
//     // });
// });
router.get('/', appCtrl.index);
// router.get('/video/:file?', appCtrl.video);
// router.get('/media', appCtrl.index);

router.get('/media/youtube', Youtube.index);
router.get('/media/tikTok', TikTok.index);

router.post('/media/getLinkVideo', (req, res, next) => {
    const { channel } = req.body;
    switch (channel.key.toLowerCase()) {
        case 'tiktok':
            return TikTok.index(req, res, next);
        case 'youtube':
            return Youtube.index(req, res, next);
    }
    return res.json({
        channel
    });
});

router.post('/media/youtube/getAudioSource', Youtube.getAudioSource)

module.exports = {
    routers: [
        { path: '', router },
        { path: 'media', router: mediaRouter },
        { path: '/media', router: mediaRouter },

        // { path: 'api', router: apiRouter },
        // { path: 'user', router: usersRouter },
    ]
};