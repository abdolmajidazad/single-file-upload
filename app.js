const express = require('express');
const app = express();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/fileUpload.html'));
});
app.get('/images/:name', function(req, res) {
    res.sendFile(path.join(__dirname + `/images/${req.params.name}`));
});

app.post('/fileUpload', function(req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        let iteratorData = (Object.keys(files))[Symbol.iterator]();
        function moveFile(){
            let nextItem = iteratorData.next();
            if(!nextItem.done){
                if(files &&  files[nextItem['value']] && files[nextItem['value']]['path']){
                    let oldpath = files[nextItem['value']]['path'];
                    let newpath = `${__dirname}/files/${new Date().getTime()}_${files[nextItem['value']]['name']}`;
                    fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err;
                        moveFile();
                    });
                }
            }else{
                res.end();
            }
        }
        moveFile();
    });
});
app.listen(3000, () => console.log('Example app listening on port 3000!'));



