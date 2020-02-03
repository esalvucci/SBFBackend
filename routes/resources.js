var express = require('express');
var path = require('path');
var router = express.Router();


/* GET users listing. */
router.get('/calculateFilter', function(req, res, next) {

   const { exec } = require('child_process');
   //'.\hello.exe'
   //'.\solution_prova\Debug\TestSBFOld.exe'
    exec('.\\solution_prova\\Debug\\TestSBF.exe a.csv b.csv 4 \'\' 0 0 0', (error, stdout, stderr) => {
      if (error) {
        console.error('exec error: ${error}');
        return;
      }
      res.send('stdout: ${stdout}');
    });

});

router.get('/stats', function(req, res, next) {
  let reqPath = path.join(__dirname, '../');
  console.log(reqPath);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

  res.status(200).sendFile('solution_prova/TestSBF/stats19-01-2020-10_21_11.csv', { root: reqPath });
});

router.get('/fpr', function(req, res, next) {
  let reqPath = path.join(__dirname, '../');
  console.log(reqPath);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

  res.status(200).sendFile('solution_prova/TestSBF/fp19-01-2020-10_21_11.csv', { root: reqPath });
});

router.get('/isepr', function(req, res, next) {
  let reqPath = path.join(__dirname, '../');
  console.log(reqPath);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Pragma', 'no-cache');

  res.status(200).sendFile('solution_prova/TestSBF/ise19-01-2020-10_21_11.csv', { root: reqPath });
});

module.exports = router;
