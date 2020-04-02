const express = require('express');
const path = require('path');
const router = express.Router();

const fs  = require('fs');

let elem = '\\..\\input\\ElemDataset.csv';
let nonElem =  '\\..\\input\\NonElemDataset.csv';
let hash = "";
let salt = "";

let ex = '';
// POST /api/users gets JSON bodies


router.post('/save', function (req, res) {
  //console.log(JSON.parse(req.body.toString()));
  const json = JSON.parse(JSON.stringify(req.body));
  const keys = Object.keys(json);
  ex = '.\\solution_prova\\Debug\\TestSBF.exe .\\input\\ElemDataset.csv .\\input\\NonElemDataset.csv';

  //writeElem
  let filePath_ = __dirname + elem;
  fs.writeFile(filePath_, json[keys[0]], function() { res.end();});

  //writeNonElem
  filePath_ = __dirname + nonElem;
  fs.writeFile(filePath_, json[keys[1]], function() { res.end();});

  //hash type
  hash = json[keys[2]];
  ex = ex + ' '+ hash;

  //writeHashSalt
  if(json[keys[3]]  !== "") {
    filePath_ = __dirname + '\\..\\input\\HashSalt.txt';
    fs.writeFile(filePath_, json[keys[3]], function () {
      res.end();
    });
    ex = ex + ' .\\input\\HashSalt.txt'

  } else {
    salt = "";
    ex = ex + ' ""';
  }

  //p, m ,k
  let datasetStringArray = json[keys[0]].split('\n');
  let n = datasetStringArray.length-1;
  const commandParams = calculateParams( n, json[keys[4]], json[keys[5]], json[keys[6]]);
  if(commandParams === '') {
    ex = ex + ' "" "" ""';
  } else {
    ex = ex + commandParams;
  }

  console.log('calculated: '+ ex);
 // res.send('Ok');
  res.end();
});

function calculateParams(n, p, m, k) {

  if(p==='' && m==='' && k===''){
    return '';
  }
  else if(p!=='' && m==='' && k===''){
    return ' '+ p + ' "" "" ';  //" "+ p +" "+ m +" "+ k;
  }
  else if(p==='' && m!=='' && k!==''){
    return ' "" '+ m +' '+ k;
  }
  else {
    console.log("Error ("+ p +",  "+ m +",  "+ k+") filter parameters not valid!");
    return '';
  }
}

/**************** GET *************************************/


/* GET users listing. */
router.get('/calculateFilter', function(req, res, _) {
  const { exec } = require('child_process');

  //let ex = '.\\solution_prova\\Debug\\TestSBF.exe .\\input\\ElemDataset.csv .\\input\\NonElemDataset.csv "" .\\input\\HashSalt.txt "" "" "" ';

  exec(ex, (error, stdout, _) => {
    if (error) {
      console.error('exec error: '+ error);
      res.end();
      return;
    }
    console.log(stdout);
    res.end();
  });

});

router.get('/stats', function(req, res, _) {
  let reqPath = path.join(__dirname, '../');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

  res.status(200).sendFile('.\\output\\stats.csv', { root: reqPath });
});

router.get('/fpr', function(req, res, _) {
  let reqPath = path.join(__dirname, '../');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

  res.status(200).sendFile('.\\output\\fp.csv', { root: reqPath });
});

router.get('/isepr', function(req, res, _) {
  let reqPath = path.join(__dirname, '../');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

  res.status(200).sendFile('.\\output\\ise.csv', { root: reqPath });
});

module.exports = router;
