const express = require('express');
// const fs = require('fs');
// const db = require("../database/mongo");
//----controlers add manual-----------
const TikTokCtrl = require('../Controlers/TikTokCtrl');

//---------------------------------------------
const router = express.Router();

function trace(obj, msg) {
    if (undefined == msg || null == msg || "" == msg) msg = "\ndebug log:";
    console.log(msg);
    console.log(obj);
}

router.get('/', TikTokCtrl.index);

router.post('/getInfo', TikTokCtrl.getInfo);
router.post('/getUser', TikTokCtrl.getUser);

router.post('/getEmbed', TikTokCtrl.getEmbed);
router.post('/validateURL', TikTokCtrl.validateURL);

//=======================

module.exports = router;