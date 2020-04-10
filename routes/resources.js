const express = require('express');
const path = require('path');
const router = express.Router();

const fs  = require('fs');

let isWin = false;

let elem_win = '\\..\\input\\ElemDataset.csv';
let nonelem_win = '\\..\\input\\NonElemDataset.csv';
let hashSalt_win = '\\..\\input\\HashSalt.txt';
let salt_param_win =  ' .\\input\\HashSalt.txt';
let ex_win = '.\\solution_prova\\Debug\\TestSBF.exe .\\input\\ElemDataset.csv .\\input\\NonElemDataset.csv';

let elem_unix = '/../solution_prova/Debug/test-app/input/ElemDataset.csv';
let nonelem_unix = '/../solution_prova/Debug/test-app/input/NonElemDataset.csv';
let hashSalt_unix = '/../solution_prova/Debug/test-app/input/HashSalt.txt';
let salt_param_unix = '/../solution_prova/Debug/test-app/input/HashSalt.txt';
let ex_unix = 'cd solution_prova/Debug/test-app/ && ./test-app ./input/ElemDataset.csv ./input/NonElemDataset.csv';

let elem = "";
let nonElem = "";
let saltFile = "";
let hash = "";
let salt = "";
let ex = '';
let hash_salt_par = "";
// POST /api/users gets JSON bodies

router.post('/save', function (req, res) {
  //console.log(JSON.parse(req.body.toString()));
  const json = JSON.parse(JSON.stringify(req.body));
  const keys = Object.keys(json);

  if (isWin) {
    console.log('is win' + isWin);

    ex = ex_win;
    elem = elem_win;
    nonElem = nonelem_win;
    saltFile = hashSalt_win;
    hash_salt_par = salt_param_win;
  } else {
    console.log('is unix' + isWin);
    ex = ex_unix;
    elem = elem_unix;
    nonElem = nonelem_unix;
    saltFile = hashSalt_unix;
    hash_salt_par = salt_param_unix;
  }

  //writeElem
  let filePath_ = __dirname + elem;
  console.log(filePath_);
//  fs.writeFile(filePath_, json[keys[0]], function() { res.end();});
  const elemFile = fs.createWriteStream(filePath_);
  elemFile.write(req.body.elem);
  elemFile.end();

  //writeNonElem
  filePath_ = __dirname + nonElem;
  fs.writeFile(filePath_, json[keys[1]], function() { res.end();});

  //hash type
  hash = json[keys[2]];
  ex = ex + ' '+ hash;

  //writeHashSalt
  if(json[keys[3]]  !== "") {

    filePath_ = __dirname + saltFile;
     fs.writeFile(filePath_, json[keys[3]], function () {
      res.end();
    });

    ex = ex + hash_salt_par;

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

  if (isWin) {
    res.status(200).sendFile('.\\output\\stats.csv', {root: reqPath});
  } else {
//    res.status(200).sendFile('./output/stats.csv', {root: reqPath});
    res.status(200).sendFile('./solution_prova/Debug/test-app/output/stats.csv', {root: reqPath});
  }
});

router.get('/fpr', function(req, res, _) {
  let reqPath = path.join(__dirname, '../');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

  if(isWin) {
    res.status(200).sendFile('.\\output\\fp.csv', { root: reqPath });
  } else {
    res.status(200).sendFile('./solution_prova/Debug/test-app/output/fp.csv', {root: reqPath});
  }
});

router.get('/isepr', function(req, res, _) {
  let reqPath = path.join(__dirname, '../');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

  if(isWin) {
    res.status(200).sendFile('.\\output\\ise.csv', { root: reqPath });
  } else {
    res.status(200).sendFile('./solution_prova/Debug/test-app/output/ise.csv', {root: reqPath});
  }
});

module.exports = router;
