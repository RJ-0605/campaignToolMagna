const express = require("express");
const app = express();
const cors = require('cors');

const bodyParser = require("body-parser");
const CsvUpload = require("express-fileupload");

app.use(CsvUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const csvParser = require('csv-parser');
const fs = require('fs');

 var axios = require('axios');

app.use(cors(corsOptions));

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // For legacy browser support
}


require('dotenv').config()

const multer = require('multer')
const path = require('path')

app.use(express.static( 'public') );
// const port = process.env.PORT || 8000



//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/')
      // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});


// var uploads = multer({ dest: './public/' })


app.get("/", (request, response) => {
    response.send("Hi there");
});




app.use('/EXPRESSENDPOINT', upload.single('file'), (req, res, next) => {
    console.log(req.body.FileName)
    console.log(req.body.file)

    if (!req.body.FileName) {
        console.log("No file upload");
        return res.status(401).json({success: false, error: 'check request data for this kind of post and retry '})
    } else {
        // console.log("port sending", port)


        var csvSrc =  req.body.FileName

        console.log("csvSrc", csvSrc, "and this is file name", req.body.FileName)

        let data = {
            FileName: csvSrc
        };

        return res.status(200).json({success: true, error: 'null', data: data, message : "upload complete"})
    }

    // return res.status(200).json({message: "success"})


});




const filepath = './public/61_100K.csv'

const getDateTimeUniqueString = () => {
          var now     = new Date();
          var year    = now.getFullYear();
          var month   = now.getMonth()+1;
          var day     = now.getDate();
          var hour    = now.getHours();
          var minute  = now.getMinutes();
          var second  = now.getSeconds();
          if(month.toString().length == 1) {
              month = '0'+month;
          }
          if(day.toString().length == 1) {
              day = '0'+day;
          }
          if(hour.toString().length == 1) {
              hour = '0'+hour;
          }
          if(minute.toString().length == 1) {
              minute = '0'+minute;
          }
          if(second.toString().length == 1) {
              second = '0'+second;
          }
          var dateTime = year+month+day+hour+minute+second;
          let  uniquestring= String(dateTime)

          return uniquestring;
      }

app.get('/sendcsv', async(req,res)=> {
    // console.log(" req here ")
    let data = ""

    let uniquestring = getDateTimeUniqueString()

    var count = 0
    var successStatus = ""

    fs.createReadStream(filepath)
    .on('error', () => {
        // handle error
         return res.status(401).json({success: true, error: 'null', data: data, message : "Not Done"})
    })

    .pipe(csvParser())
    .on('data', (row) => {
        // use row data
        // console.log("row", row.MSISDN)

        console.log("sending MSISDN", "0" + row.MSISDN.substring(3))


        let numberMSISDN = "0" + row.MSISDN.substring(3)

        try {


            var data = JSON.stringify({
                "PROSPECTINFO": {
                    "PROSPECTNO": "",
                    "PARTYTYPE": "I",
                    "FIRSTNAME": "Test",
                    "MIDDLENAME": "",
                    "LASTNAME": "Prospect2",
                    "OPENTITY": "GLOTV"
                },
                "CONTACTINFO": {
                    "CONTACTNAME": numberMSISDN,
                    "EMAIL": "prospectstyt@test.com",
                    "MOBILEPHONE": numberMSISDN
                },
                "TRAILPLANINFO": {
                    "HASTRAILPLAN": ""
                },
                "ADDRESSINFO": {
                    "ADDRESSTYPECODE": "PRI",
                    "COUNTRY": "Nigeria"
                }
            });

            var config = {
                method: 'post',
                url: `https://tvanywhere-support.magnaquest.com/webapi/Restapi/CreateProspect?ReferenceNo=prosp1xxxx${uniquestring}123`,
                headers: {
                    'Password': 'Gloweb@1234',
                    'Username': 'GLOTVWEBAPI',
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios(config)
                .then(function (response) {
                    console.log("done", response.data);
                    count = count + 1
                    res.status(200).json({success: true, error: 'null', data: data, message: "csv here"})

                })
                .catch(function (error) {
                    console.log("error");
                    successStatus = false

                    return res.status(401).json({success: true, error: 'null', data: data, message: "Not Done"})
                });


        }catch(exception){
                              let status = 403
                              let error = true
                              success= false
    ``
                              return res.status(401).json({error: 'invalid username or password'})
               }

    })

    .on('end', () => {
        // handle end of CSV
        if(successStatus === false){
            console.log(count, "transactions failed")

        }else{

            console.log(count, "transactions done")

        }


    })


})




app.listen(8000, () => {
    console.log("Listen on the port 8000...");
});