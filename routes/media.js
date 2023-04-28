const express = require('express');
// const fs = require('fs');
// const db = require("../database/mongo");
//----controlers add manual-----------
// const Book = require("../Controlers/BookCtrl")(db);
const MediaCtrl = require('../Controlers/MediaCtrl');
// const AppCtrl = require('../Controlers/AppCtrl');

//---------------------------------------------
const router = express.Router();

function trace(obj, msg) {
    if (undefined == msg || null == msg || "" == msg) msg = "\ndebug log:";
    console.log(msg);
    console.log(obj);
}

router.get('/', MediaCtrl.index);
router.get('/test', MediaCtrl.test);
// router.get('/playlist/', MediaCtrl.playlist);


router.get('/video/:f?', MediaCtrl.video);
router.post('/playlist/', MediaCtrl.playlist);
router.post('/playlist/items', MediaCtrl.playlistItems);

router.post('/playlist/save', MediaCtrl.savePlaylistInfo);
router.post('/playlist/update', MediaCtrl.updatePlaylist);

//=======================

module.exports = router;