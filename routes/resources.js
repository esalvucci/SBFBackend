const express = require('express');
const path = require('path');
const router = express.Router();

const fs  = require('fs');

let shaltSetted = false;

// POST /api/users gets JSON bodies

router.post('/save', function (req, res) {
  //console.log(JSON.parse(req.body.toString()));
  shaltSetted = false;
  const json = JSON.parse(JSON.stringify(req.body));
  const keys = Object.keys(json);

  //writeElem
  let filePath_ = __dirname + '\\..\\input\\ElemDataset.csv';
  fs.writeFile(filePath_, json[keys[0]], function() { res.end();});

  //writeNonElem
  filePath_ = __dirname + '\\..\\input\\NonElemDataset.csv';
  fs.writeFile(filePath_, json[keys[1]], function() { res.end();});

  //writeHashSalt
  if(json[keys[3]]  !== "") {
    shaltSetted = true;
    filePath_ = __dirname + '\\..\\input\\HashSalt.txt';
    fs.writeFile(filePath_, json[keys[3]], function () {
      res.end();
    });
  }

 /* for (let i = 0; i < keys.length; i++) {
    console.log(json[keys[i]]);
  }*/


 // res.send('Ok');
  res.end();
});

/**************** OLD *************************************/

/* GET users listing. */
router.get('/calculateFilter', function(req, res, next) {
  const { exec } = require('child_process');

  let ex = '';

  if(shaltSetted === true){
    ex = '.\\solution_prova\\Debug\\TestSBF.exe .\\input\\ElemDataset.csv .\\input\\NonElemDataset.csv "" .\\input\\HashSalt.txt "" "" "" '
  } else {
    ex = '.\\solution_prova\\Debug\\TestSBF.exe .\\input\\ElemDataset.csv .\\input\\NonElemDataset.csv "" "" "" "" "" '
  }

  exec(ex, (error, stdout, stderr) => {
    if (error) {
      console.error('exec error: '+ error);
      res.end();
      return;
    }
    console.log(stdout);
    res.end();
  });

});

router.get('/stats', function(req, res, next) {
  let reqPath = path.join(__dirname, '../');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

  res.status(200).sendFile('.\\output\\stats.csv', { root: reqPath });
});

router.get('/fpr', function(req, res, next) {
  let reqPath = path.join(__dirname, '../');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

  res.status(200).sendFile('.\\output\\fp.csv', { root: reqPath });
});

router.get('/isepr', function(req, res, next) {
  let reqPath = path.join(__dirname, '../');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

  res.status(200).sendFile('.\\output\\ise.csv', { root: reqPath });
});

module.exports = router;
