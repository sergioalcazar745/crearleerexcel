import React from "react";
import * as XLSX from 'xlsx'

export default function Excel(){
    
    function enviarExcel(e){
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        var excel = formData.get("excel");

        var hojas = [];
        var reader = new FileReader()
        reader.readAsArrayBuffer(excel)
        reader.onloadend = (e) => {
            var data = new Uint8Array(e.target.result)
            var workbook = XLSX.read(data, {type: 'array'})
            workbook.SheetNames.forEach(function(sheetName) {
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
                hojas.push({
                    data: XL_row_object,
                    sheetName
                })
            })
            // console.log(hojas[0].data)
            for (var hoja of hojas[0].data) {
                console.log(hoja)
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
        </div>
    )
}