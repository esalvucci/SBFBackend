const express = require('express');
const path = require('path');
const multer = require('multer');
const readline = require('readline');
const router = express.Router();

const fs  = require('fs');

let isWin = true;
//let execArguments = ['./input/ElemDataset.csv', './input/NonElemDataset.csv'];
let execArguments = ['.\\..\\sbf_lib\\input\\ElemDataset.csv', '.\\..\\sbf_lib\\input\\NonElemDataset.csv'];

let elem_win = '\\..\\sbf_lib\\input\\ElemDataset.csv';
let nonelem_win = '\\..\\sbf_lib\\input\\NonElemDataset.csv';
let hashSalt_win = '\\..\\sbf_lib\\input\\HashSalt.txt';
let salt_param_win =  ' .\\sbf_lib\\input\\HashSalt.txt ';
let ex_win = '.\\sbf_lib\\TestSBF.exe .\\sbf_lib\\input\\ElemDataset.csv .\\sbf_lib\\input\\NonElemDataset.csv ';

let elem_unix = '/../solution_prova/test-app/input/ElemDataset.csv';
let nonelem_unix = '/../solution_prova/test-app/input/NonElemDataset.csv';
let hashSalt_unix = '/../solution_prova/test-app/input/HashSalt.txt';
let salt_param_unix = './input/HashSalt.txt ';
let ex_unix = 'cd solution_prova/test-app/ && ./test-app ./input/ElemDataset.csv ./input/NonElemDataset.csv ';

let elem = "";
let nonElem = "";
let saltFile = "";
let hash = "";
let salt = "";
let ex = '';
let hash_salt_par = "";
// POST /api/users gets JSON bodies

const storage = multer.diskStorage({
  // destination
 // destination: './sbf_lib/input/',
  destination: '..\\sbf_lib\\input\\',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage }).array("uploads[]", 3);

router.post('/save', upload, function (req, res) {
  // console.log(JSON.parse(req.body.toString()));
 // const json = JSON.parse(JSON.stringify(req.body));
 // const keys = Object.keys(json);

 /* if (isWin) {
    console.log('is win');
    ex = ex_win;
    elem = elem_win;
    nonElem = nonelem_win;
    saltFile = hashSalt_win;
    hash_salt_par = salt_param_win;

  } else {
    console.log('is unix');
    ex = ex_unix;
    elem = elem_unix;
    nonElem = nonelem_unix;
    saltFile = hashSalt_unix;
    hash_salt_par = salt_param_unix;
  }
  */

/*
  //writeElem
  let filePath_ = __dirname + elem;
  console.log(filePath_);
  //fs.writeFile(filePath_, json[keys[0]], function() { res.end();});
  const elemFile = fs.createWriteStream(filePath_);
  elemFile.write(req.body.elem);
  elemFile.end();

  //writeNonElem
  filePath_ = __dirname + nonElem;
 // fs.writeFile(filePath_, json[keys[1]], function() { res.end();});
  const nonElemFile = fs.createWriteStream(filePath_);
  nonElemFile.write(req.body.non_elem);
  nonElemFile.end();

  //hash type
  hash = json[keys[2]];
  ex = ex + hash + ' ';

  //writeHashSalt
  if(json[keys[3]]  !== "") {

    filePath_ = __dirname + saltFile;
     fs.writeFile(filePath_, json[keys[3]], function () {
      res.end();
    });

    ex = ex + hash_salt_par;

  } else {
    salt = "";
    ex = ex + '"" ';
  }

  //p, m ,k
  let datasetStringArray = json[keys[0]].split('\n');

 */

// caluclate n getting Dataset.csv from filed files of the http request

/*
  const datasetStringArrayLength = req.files.filter(f => f.originalname === 'ElemDataset.csv').pop() !== undefined ?
      req.files.filter(f => f.originalname === 'ElemDataset.csv').pop().size : 0;
  let n = datasetStringArrayLength - 1;
*/


  const countLinesInFile = require('count-lines-in-file');
  const path = require('path');
  const targetFilePath = path.resolve(__dirname, '..\\sbf_lib\\input\\ElemDataset.csv');

  countLinesInFile(targetFilePath, (error, n) => {  // n = numberOfLines of ElemDataset.csv

    const parameters = JSON.parse(req.body.parameters);

    if (parameters.hash !== undefined) {
      execArguments.push('\'' + parameters.hash + '\'');
    } else {
      execArguments.push('\'' + 4 + '\'');
    }

    req.files.filter(f => f.originalname === 'HashSalt.txt').pop() !== undefined ?
        execArguments.push('.\\..\\sbf_lib\\input\\HashSalt.txt') :    //  execArguments.push('./input/HashSalt.txt'); unix!!
        execArguments.push(' "" ');

    if (parameters.p !== 0) {
      execArguments.push('\'' + parameters.p + '\'');
    } else {execArguments.push(' "" ');}
    if (parameters.m !== 0) {
      execArguments.push('\'' + parameters.m + '\'');
    } else {execArguments.push(' "" ');}
    if (parameters.k !== 0) {
      execArguments.push('\'' + parameters.k + '\'');
    } else {execArguments.push(' "" ');}

    res.end();

  });

});

/*
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
*/

/**************** GET *************************************/


/* GET users listing. */
router.get('/calculateFilter', function(req, res, _) {
 /* const { exec } = require('child_process');

 // let ex = '.\\..\\sbf_lib\\TestSBF.exe .\\..\\sbf_lib\\input\\ElemDataset.csv .\\..\\sbf_lib\\input\\NonElemDataset.csv "" .\\..\\sbf_lib\\input\\HashSalt.txt "" "" "" ';

  //ex = '..\\sbf_lib\\Hello.exe';
  //ex = "dir";

  exec(ex, (error, stdout, _) => {
    if (error) {
      console.error('exec error: '+ error);
      res.end();
      return;
    }
    console.log(stdout);
    res.end();
  });
*/

  cmd = './test-app';
 // cmd = '.\\..\\sbf_lib\\TestSBF.exe';
  cmd = '.\\TestSBF.exe';
  const { spawn } = require('child_process');
  console.log(execArguments);
  const testapp = spawn(cmd, execArguments,
      {cwd: '..\\sbf_lib', shell: true}).on('error', function( err ){ console.log(err); throw err });

  //execArguments = ['./input/ElemDataset.csv', './input/NonElemDataset.csv'];
  execArguments = ['.\\..\\sbf_lib\\input\\ElemDataset.csv', '.\\..\\sbf_lib\\input\\NonElemDataset.csv'];

  testapp.stdout.on('data', (data) => {
    console.log(`${data}`);  // SBF output
  });

  testapp.on('error', function(err) {
    console.log('Failed to start child process.');
    console.log(err);
  });

  testapp.on('exit', (code) => {
    console.log(`Child process exited with exit code ${code}`);
    res.status(200);
    res.end();
  });

});

router.get('/stats', function(req, res, _) {
  let reqPath = path.join(__dirname, '../');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

//  if (isWin) {
//    res.status(200).sendFile('.\\output\\stats.csv', {root: reqPath});
//  } else {
//    res.status(200).sendFile('./output/stats.csv', {root: reqPath});
    res.status(200).sendFile('./sbf_lib/output/stats.csv', {root: reqPath});
  //}
});

router.get('/fpr', function(req, res, _) {
  let reqPath = path.join(__dirname, '../');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

 // if(isWin) {
 //   res.status(200).sendFile('.\\output\\fp.csv', { root: reqPath });
 // } else {
    res.status(200).sendFile('./sbf_lib/output/fp.csv', {root: reqPath});
 // }
});

router.get('/isepr', function(req, res, _) {
  let reqPath = path.join(__dirname, '../');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

  // if(isWin) {
  //  res.status(200).sendFile('.\\output\\ise.csv', { root: reqPath });
  // } else {
    res.status(200).sendFile('./sbf_lib/output/ise.csv', {root: reqPath});
  //}
});

module.exports = router;
