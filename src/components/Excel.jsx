import React, { Component } from 'react';
import * as XLSX from 'xlsx'
import Tabla from "./Tabla";

export default class Excel2 extends Component {

    state = {
        excel: null,
        nombreHojas: [],
        columnas: [],
        filas: [],
        conversion: false,
        spinner: false
    }

    selectHoja = React.createRef();

    getColumnas = (num) => {
        var sheet_name_list = this.state.excel.SheetNames;
        let columnHeaders = [];
        let index = parseInt(num);
        
        var worksheet = this.state.excel.Sheets[sheet_name_list[index]];
        for (let key in worksheet) {
            let regEx = new RegExp("^\(\\w\)\(1\){1}$");
            if (regEx.test(key) == true) {                    
                columnHeaders.push(worksheet[key].v);
            }
        }
        columnHeaders.push("Eliminar");
        return columnHeaders;        
    }

    getRows = (num) =>{
        var rows = [];
        var dataRows = XLSX.utils.sheet_to_row_object_array(this.state.excel.Sheets[this.state.nombreHojas[num].nombre])
        console.log(this.state.nombreHojas[num].nombre)
        rows.push({
            data: dataRows,
        })
        return rows;
    }

    // eslint-disable-next-line no-unreachable
    convertirExcel = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        var excel = formData.get("excel");
        var nombreHojasRead = [];

        var reader = new FileReader()
        reader.readAsArrayBuffer(excel)
        reader.onloadend = (e) => {
            var data = new Uint8Array(e.target.result)
            var excelRead = XLSX.read(data, {type: 'array'})
            excelRead.SheetNames.forEach(function(sheetName, index) {
                nombreHojasRead.push({nombre:sheetName, indice: index})
            })
            this.state.excel = excelRead;
            this.state.nombreHojas = nombreHojasRead
            this.setState({
                excel: this.state.excel,
                nombreHojas: this.state.nombreHojas,
                conversion: true,               
            })

            this.setState({
                columnas: this.getColumnas(0),
                filas: this.getRows(0)
            })
        }
    }

    cambiarHoja = () => {
        this.setState({
            conversion:false,
            spinner: true
        })
        this.state.columnas = this.getColumnas(this.selectHoja.current.value)
        this.state.filas = this.getRows(this.selectHoja.current.value)
        this.setState({
            columnas: this.state.columnas,
            filas: this.state.filas,
            conversion: true,
            spinner: false
        });            
    }

    render() {
        return (
            <div className="container">
                <h1 className="my-5">Excel</h1>
                <form onSubmit={this.convertirExcel}>
                    <label className="form-label">Seleccion un archivo excel: </label>
                    <input type={"file"} className="form-control" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" name="excel"/>
                    <button className="btn btn-primary mt-3">Convertir</button>
                </form>
                <hr/>
                {
                    this.state.spinner &&
                    <div class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                }
                {
                    this.state.conversion &&
                    (
                    <>
                        <form>
                            <label className="form-label">Hojas </label>
                            <select className='form-select' ref={this.selectHoja} onChange={this.cambiarHoja}>
                            {
                                this.state.nombreHojas.map((hoja, index) => {
                                    return (<option key={index} value={hoja.indice}>{hoja.nombre}</option>)
                                })
                            }
                            </select>
                        </form>
                        <Tabla columnas={this.state.columnas} filas={this.state.filas}/>
                    </>                    
                    )
                }                
            </div>
        )
    }
}
