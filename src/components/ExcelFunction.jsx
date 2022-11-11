import React, { useState } from "react";
import * as XLSX from 'xlsx'
import Tabla from "./Tabla";

export default function Excel(){

    const [convertido, setConvertido] = useState(false);
    const [actualizar, setActualizar] = useState(false);

    var workbook;
    var sheets = [];
    var sheetNames = []
    
    function enviarExcel(e){
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        var excel = formData.get("excel");

        var reader = new FileReader()
        reader.readAsArrayBuffer(excel)
        reader.onloadend = (e) => {
            var data = new Uint8Array(e.target.result)
            workbook = XLSX.read(data, {type: 'array'})
            workbook.SheetNames.forEach(function(sheetName) {
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
                sheets.push({
                    data: XL_row_object,
                    sheetName
                })
                sheetNames.push(sheetName)
            })
            for (var hoja of sheets[0].data) {
                console.log(hoja)
            }
            for (var nombre of sheetNames) {
                console.log(nombre)
            }
        }
    }

    return (
        <div className="container">
            <h1 className="my-5">Excel</h1>
            <form onSubmit={enviarExcel}>
                <label className="form-label">Seleccion un archivo excel: </label>
                <input type={"file"} className="form-control" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" name="excel"/>
                <button className="btn btn-primary mt-3">Convertir</button>
            </form>
            <hr/>
            <Tabla/>
        </div>
    )
}