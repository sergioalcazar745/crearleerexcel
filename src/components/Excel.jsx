import React, { Component } from 'react';
import * as XLSX from 'xlsx'
import Tabla from "./Tabla";

export default class Excel2 extends Component {

    state = {
        excel: null,
        hojas: [],
        hoja: null,
        nombre: null,
        conversion: false,
        actualizar: false
    }

    selectHoja = React.createRef();

    // eslint-disable-next-line no-unreachable
    convertirJson = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        var excel = formData.get("excel");
        var hojasRead = [];

        var reader = new FileReader()
        reader.readAsArrayBuffer(excel)
        reader.onloadend = (e) => {
            var data = new Uint8Array(e.target.result)
            var excelRead = XLSX.read(data, {type: 'array'})
            excelRead.SheetNames.forEach(function(sheetName, index) {
                var dataRows = XLSX.utils.sheet_to_row_object_array(excelRead.Sheets[sheetName])
                hojasRead.push({
                    data: dataRows,
                    name: sheetName,
                    index: index
                })
            })
            this.state.excel = excelRead;
            this.state.hojas = hojasRead;
            this.state.hoja = hojasRead[0];
            this.setState({
                excel: this.state.excel,
                hojas: this.state.hojas,
                hoja: this.state.hoja,
                nombre: excel.name,
                conversion: true,               
            })
        }
    }

    cambiarHoja = () => {
        this.state.hoja = this.state.hojas[this.selectHoja.current.value]
        this.setState({
            hoja: this.state.hoja,
            actualizar: !this.state.actualizar
        });            
    }

    guardarHoja = (hoja) => {
        this.state.hojas[hoja.index] = hoja
        this.setState({
            hojas: this.state.hojas
        })
    }

    convertirExcel = () => {        
        const workBook = XLSX.utils.book_new();
        for (var sheet of this.state.hojas) {
            var workSheet = XLSX.utils.json_to_sheet(sheet.data);
            XLSX.utils.book_append_sheet(workBook, workSheet, sheet.name);
        }      
        console.log(workBook) 
        XLSX.writeFile(workBook, this.state.nombre);
    }

    render() {
        return (
            <div className="container">
                <h1 className="my-5">Excel</h1>
                <form onSubmit={this.convertirJson}>
                    <label className="form-label">Seleccion un archivo excel: </label>
                    <input type={"file"} className="form-control" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" name="excel"/>
                    <button className="btn btn-primary mt-3">Convertir</button>
                </form>
                <hr/>
                {
                    this.state.conversion &&
                    (
                    <>
                        <form>
                            <label className="form-label">Hojas </label>
                            <select className='form-select' ref={this.selectHoja} onChange={this.cambiarHoja}>
                            {
                                this.state.hojas.map((hoja, index) => {
                                    return (<option key={index} value={index}>{hoja.name}</option>)
                                })
                            }
                            </select>
                        </form>
                        <Tabla fichero={this.state.excel} hoja={this.state.hoja} actualizar={this.state.actualizar} guardarHoja={this.guardarHoja}/>
                    </>                    
                    )
                }
                {
                    this.state.conversion &&
                    <div className='d-flex justify-content-center'>
                        <button className='btn btn-success' onClick={() => this.convertirExcel()}>Convertir a excel</button>
                    </div>
                }              
            </div>
        )
    }
}
