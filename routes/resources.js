var express = require('express');
var path = require('path');
var router = express.Router();

const multer = require('multer');
const csv = require('fast-csv');
const upload = multer({ dest: 'tmp/csv/' });

const app = express();
// Express 4.0
//app.use(bodyParser.json({ limit: '10mb' }));
//app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' })); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

var fs = require('fs');
var busboy = require('connect-busboy');
app.use(busboy());

router.post('/saveElemDataset', function(req, res) {
  var body = '';
  filePath = __dirname + '\\..\\input\\ElemDataset.csv';
  req.on('data', function(data) {
    body += data;
  });

  req.on('end', function (){
    fs.writeFile(filePath, body, function() {
      res.end();
    });
  });
});


router.post('/loadDataset', upload.single('file'), function (req, res, next) {
  var fileRows = [], fileHeader;
  console.log("qui");
  // open uploaded file
  csv.fromPath(req.file.path)
      .on("data", function (data) {
        fileRows.push(data); // push each row
        console.log(fileRows);
      })
      .on("end", function () {
        fs.unlinkSync(req.file.path);   // remove temp file
        //process "fileRows"
      });
});

/* GET users listing. */
router.get('/calculateFilter', function(req, res, next) {

  const { exec } = require('child_process');
  exec('.\\solution_prova\\Debug\\TestSBF.exe .\\input\\area-element-lindec.csv .\\input\\b.csv "" "" "" "" "" ', (error, stdout, stderr) => {
    if (error) {
      console.error('exec error: '+ error);
      return;
    }
    console.log(stdout);
    res.send('calculate filter completed');
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
