const express = require('express');
require('dotenv').config()
const path = require('path');
const jwt = require('jsonwebtoken')
const fs = require('fs')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();


// storing public data images and stuff

// app.use(express.static("./public"))

app.use(express.static( path.join(__dirname, "./public") ));


// storing public data images and stuff

/*------------------------------------------
--------------------------------------------
parse application/json
--------------------------------------------
--------------------------------------------*/
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// ------cors------
app.use(cors())

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

const csvParser = require('csv-parser');

 var axios = require('axios');

 require('dotenv').config()

const multer = require('multer')


const port = process.env.PORT || 8000

const server_url = process.env.DEVELOPMENT_SERVER_URL || "https://"

//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/uploads/')
      // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, req.body.fileName)
    }
})

var upload = multer({
    storage: storage
});




//@type   POST
//route for post data
app.post("/upload", upload.single('file'), (req, res) => {
    if (!req.file ) {

        console.log("No file upload or file already exists ");
        return res.status(401).json({success: false, error: true, message: 'check request data for this kind of post and retry '})

    }else if( fs.existsSync('./public/uploads/' + req.body.fileName)) {

        console.log("file already exists ");
        return res.status(401).json({success: false, error: true, message: 'file already exists'})

    }else {
      console.log("port sending", port)

      // this is dev imagelink

      var imgsrc = req.body.fileName


      console.log("file_link", imgsrc, "and this is file name present", req.body.fileName)

      let data = {
            image_name: req.body.fileName,
            image_link: imgsrc
          };

      return res.status(200).json({success: true, error: 'null', data: data})
    }

});

app.get("/", (request, response) => {
    response.send("Hi there");
});










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

app.post('/readcsv', (req,res)=> {
    // console.log(" req here ")

    const filepath = './public/uploads/' + req.body.fileName
    let data = ""

    let uniquestring = getDateTimeUniqueString()

    console.log("filepath is present", req.body)

    var successStatus = ""

    let numberArray = []

    fs.createReadStream(filepath)
            .on('error', () => {
                // handle error
                 return res.status(401).json({success: true, error: 'null', data: data, message : "file path error"})
            })

            .pipe(csvParser())
            .on('data', (row) => {
                // use row data
                // console.log("row", row.MSISDN)

                // console.log("sending MSISDN", "0" + row.MSISDN.substring(3))
                // let numberMSISDN = "0" + row.MSISDN.substring(3)

                console.log("sending MSISDN", "0" + row.MSISDN)
                let numberMSISDN = "0" + row.MSISDN

                    // sendProcessFunc(numberMSISDN)
                // testFunc()

                numberArray.push(numberMSISDN)

            })

            .on('end', () => {
                // handle end of CSV

                console.log("number Array", numberArray)
                return res.status(200).json({success: true, error: 'null', data: numberArray, message : " Done"})

            })



})


app.post('/createProspectMagna', (req, res)=>{

    let arrayCSV = req.body.arrayCSV
    let count = 0

    let uniquestring = getDateTimeUniqueString()

    const sendProcessFunc = (numberMSISDN, count)=>{
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
                            count = count + 1

                            console.log("transaction complete", count, response.data);


                        })
                        .catch(function (error) {
                            console.log("error", error);
                        });


                }catch(exception){
                                      let status = 403
                                      let error = true
                                      let success= false
                                      // return res.status(401).json({error: 'invalid username or password'})
                       }

    }


     for (const elem of arrayCSV) {
         console.log("elem", elem)
         let numberMSISDN = elem

         sendProcessFunc(numberMSISDN, count)
         // setTimeout(()=>{sendProcessFunc(numberMSISDN, count)}, 12000)
     }


    return res.status(200).json({success: true, error: 'null', data: arrayCSV, success_count: count, message : " transaction complete"})
})


app.use(express.static(path.resolve(__dirname, 'client/build')));

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
});

// app.set('host', 'localhost');


app.listen(port,() =>{
  console.log(`Server started on port ${port}...`);
});