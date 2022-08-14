import '../../App.css';
import React, { useState, useEffect } from "react";
import axios from 'axios'
import { useForm } from "react-hook-form";

function HomePage() {
    const [csvFile, setCsvFile] = useState();
    const [csvFileName, setCsvFileName] = useState("");
    const [proceedToMagna, setProceedToMagna]= useState(false);

    const { register, handleSubmit } = useForm();

    const [reading, setReading]= useState()

    // <input type="file" name="file" onChange={SetCsvFile(e.target.files[0])}/>

    const [arrayCSV, setArrayCSV]= useState([])

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

    const sendToMagna = () =>{


        var data = {"arrayCSV": arrayCSV}

        var config = {
              method: 'post',
              url: 'http://localhost:8000/createProspectMagna',
              headers: { },
              data: data
            };

            axios(config)
            .then(function (response) {
              console.log("send to magna", response.data);

            })
            .catch(function (error) {
              console.log(error);
            });

    }



    const readCSVIntoArray = () =>{

        let tempFileName = csvFileName

        var sendData = {
          "fileName": tempFileName
        };

        var config = {
              method: 'post',
              url: 'http://localhost:8000/readcsv',
              headers: {
                  ContentType: 'application/json'
              },
              data: sendData
            };

            axios(config)
            .then(function (response) {
              console.log("read csv ", response.data);
              setArrayCSV(response.data.data)
            })
            .catch(function (error) {
              console.log(error);
            });

    }




    const sendProcessFunc = (numberMSISDN)=>{


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
                            console.log("transaction complete", response.data);
                            return true



                        })
                        .catch(function (error) {
                            console.log("error", error);
                            return false
                        });


                }catch(exception){
                                      let status = 403
                                      let error = true
                                      let success= false
                                      // return res.status(401).json({error: 'invalid username or password'})
                       }

    }

    let uniquestring = getDateTimeUniqueString()





    useEffect(() => {

        console.log("arrayCSV", arrayCSV)

        if (arrayCSV.length == 100000 && proceedToMagna){
            let count = 0
            for (const elem of arrayCSV) {
                console.log("elem", elem)
                let numberMSISDN = elem

                let processSuccess = sendProcessFunc(numberMSISDN)

                if(processSuccess) {
                    count = count + 1
                    console.log("count", count)
                }
                // setTimeout(()=>{sendProcessFunc(numberMSISDN, count)}, 12000)
            }
            console.log("final count", count)
        }else{console.log("arrayCSV waiting to proceed or read ", arrayCSV)}

    }, [arrayCSV, proceedToMagna]);


    const uploadCSV = async() => {

        const formData = new FormData();
        formData.append('fileName', csvFileName);
        formData.append('file', csvFile);

        const url = 'http://localhost:8000/upload';

        axios({
            method: 'POST',
            url: url,
            headers: {
                ContentType: 'multipart/form-data'
            },
            data: formData
        })
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }


  return (
    <div className="App">
      <header className="App-header">
          <div style={{color: "white"}}>
              Prospect App Magna Quest
          </div>
          <br/>
          <br/>
        <div>
          Select file

          <input type="file"
                 multiple accept="text/plain, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                 name="file"
                 onChange={(e) => {
                                                        setCsvFile(e.target.files[0]);
                                                        setCsvFileName(e.target.files[0].name)
                                                        }} />
            <button
                type="button"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                 onClick={() => {uploadCSV()}}
                >
                Submit
            </button>

            <br/>
            <br/>
            <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {readCSVIntoArray()}}
                >
                Read CSV
            </button>
            <br />
            <br />
            <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {setProceedToMagna(!proceedToMagna)}}
                >
                Proceed
            </button>
        </div>
      </header>
    </div>
  );
}

export default HomePage;