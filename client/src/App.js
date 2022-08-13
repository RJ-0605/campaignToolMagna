import './App.css';
import React, { useState, useEffect } from "react";
import axios from 'axios'

function App() {
    const [csvFile, setCsvFile] = useState();
    const [csvFileName, setCsvFileName] = useState();

    // <input type="file" name="file" onChange={SetCsvFile(e.target.files[0])}/>

    const [arrayCSV, setArrayCSV]= useState("")


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



    const getCSVArrayValues = () =>{


        var config = {
              method: 'get',
              url: 'http://localhost:8000/sendcsv',
              headers: { }
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





    const hitSendCSV = () => {

        const formData = new FormData();
        formData.append('FileName', csvFileName);
        formData.append('file', csvFile);

        const url = 'http://localhost:8000/EXPRESSENDPOINT';

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


    useEffect(() => {

    }, [arrayCSV]);


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
          <input type="file" name="file" onChange={(e) => {
                                                        setCsvFile(e.target.files[0]);
                                                        setCsvFileName(e.target.files[0].name)
                                                        }} />
            <button type="button"
                 onClick={() => {hitSendCSV()}}
                >
                Submit
            </button>

            <br/>
            <br/>
            <button
                onClick={() => {getCSVArrayValues()}}
                >
                Read CSV
            </button>
            <br />
            <br />
            <button
                onClick={() => {sendToMagna()}}
                >
                Proceed
            </button>
        </div>
      </header>
    </div>
  );
}

export default App;