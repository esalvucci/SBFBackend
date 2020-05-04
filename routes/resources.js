const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();

let isWin = false;
let execArguments;
let uploadDestination;
if (isWin) {
    execArguments = ['.\\sbf_lib\\TestSBF.exe', '.\\..\\sbf_lib\\input\\ElemDataset.csv', '.\\..\\sbf_lib\\input\\NonElemDataset.csv'];
    uploadDestination = '..\\sbf_lib\\input\\';
} else {
    execArguments = ['cd sbf_lib/test-app && ./test-app', './input/ElemDataset.csv', './input/NonElemDataset.csv'];
    uploadDestination = 'sbf_lib/test-app/input';
}

// POST /api/users gets JSON bodies
const storage = multer.diskStorage({
  // destination
  destination: uploadDestination,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// this function save automatically the files presents in the body of the /save request
const upload = multer({ storage: storage }).array("uploads[]", 3);

/**
 * It saves the parameters sent from the client
 */
router.post('/save', upload, function (req, res) {
    const parameters = JSON.parse(req.body.parameters);

    if (parameters.hash !== undefined) {
      execArguments.push(''+ parameters.hash );
    } else {
      execArguments.push('4');
    }

    req.files.filter(f => f.originalname === 'HashSalt.txt').pop() !== undefined ?
        //  execArguments.push('./input/HashSalt.txt'); unix!!
        isWin ? execArguments.push('.\\..\\sbf_lib\\input\\HashSalt.txt') :
                execArguments.push('./input/HashSalt.txt') :
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


/**
 * It computes the SBF filter using the paramenter setting in the /save API
 */
router.get('/calculateFilter', function(req, res, _) {
  let command;
// let currentWorkingDirectory;

  execArguments = execArguments.join(' ');
  //cmd = '.\\TestSBF.exe .\\..\\sbf_lib\\input\\ElemDataset.csv\ .\\..\\sbf_lib\\input\\NonElemDataset.csv 4 "" "" "" "" ';
  const { exec } = require('child_process');
  console.log(execArguments);

  exec(execArguments, (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }

        console.log(`${stdout}`);

      if (isWin) {
          execArguments = ['.\\sbf_lib\\TestSBF.exe', '.\\..\\sbf_lib\\input\\ElemDataset.csv', '.\\..\\sbf_lib\\input\\NonElemDataset.csv'];
      } else {
          execArguments = ['cd sbf_lib/test-app && ./test-app', './input/ElemDataset.csv', './input/NonElemDataset.csv'];
      }
      res.status(200);
      res.end();
  });
});

/**
 * It sends the sbf_lib/output/stats.csv file to the client
 */
router.get('/stats', function(req, res, _) {
  let reqPath = path.join(__dirname, '../');
  let filePath = isWin ? '.\\sbf_lib\\output\\stats.csv' : 'sbf_lib/test-app/output/stats.csv';
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');
  res.status(200).sendFile(filePath, {root: reqPath});
});

/**
 * It sends the sbf_lib/output/fp.csv file to the client
 */
router.get('/fpr', function(req, res, _) {
  let reqPath = path.join(__dirname, '../');
  let filePath = isWin ? '.\\sbf_lib\\output\\fp.csv' : 'sbf_lib/test-app/output/fp.csv';
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');
  res.status(200).sendFile(filePath, {root: reqPath});
});

/**
 * It sends the sbf_lib/output/ise.csv file to the client
 */
router.get('/isepr', function(req, res, _) {
  let reqPath = path.join(__dirname, '../');
  let fileName = isWin ? '.\\sbf_lib\\output\\ise.csv' : 'sbf_lib/test-app/output/ise.csv';
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');
  res.status(200).sendFile(fileName, {root: reqPath});
});

module.exports = router;
