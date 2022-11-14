import React, { Component } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import * as XLSX from 'xlsx'
/*Dialog*/
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default class Tabla extends Component {

  state = {
    columnas: [],
    filas: [],
    fila: null,
    status: false,
    open: false,
    openModify: false
  }

  setData = () => {
    this.state.columnas = this.getColumnas()
    this.state.filas = this.getRows()
    this.setState({
      columnas: this.state.columnas,
      filas: this.state.filas,
      status: true
    })
  }

  getColumnas = () => {
    var sheet_name_list = this.props.fichero.SheetNames;
    let columnHeaders = [];
    let index = parseInt(this.props.hoja.index);

    var worksheet = this.props.fichero.Sheets[sheet_name_list[index]];
    for (let key in worksheet) {
      let regEx = new RegExp("^\(\\w\)\(1\){1}$");
      if (regEx.test(key) == true) {
        columnHeaders.push(worksheet[key].v);
      }
    }
    columnHeaders.push("Eliminar");
    columnHeaders.push("Modificar");
    return columnHeaders;
  }

  getRows = () => {
    var rows = [];
    for (var fila of this.props.hoja.data) {
      rows.push(fila)
    }
    return rows;
  }

  añadirFila = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    var fila = {}
    for (var valor of this.state.columnas) {
      if(valor != "Eliminar" && valor != "Modificar"){
        fila[valor] = formData.get(valor);
      }
    }
    this.props.hoja.data.push(fila);
    this.state.filas =this.getRows()
    this.props.guardarHoja(this.props.hoja);
    this.setState({
      filas: this.state.filas,
      open: false,
    })
  }
  
  eliminarFila = (index) => {
    for (let i = 0; i < this.props.hoja.data.length; i++) {
      console.log(this.props.hoja.data[i].__rowNum__)
      if(this.props.hoja.data[i].__rowNum__ == index){
        this.state.filas.splice(i, 1)
      } 
    }
    this.props.hoja.data = this.state.filas;
    this.props.guardarHoja(this.props.hoja);
    this.setState({
      filas: this.state.filas
    })
  }

  modificarFila = (e) => {
    e.preventDefault();
    console.log(this.props.hoja.data)
    const formData = new FormData(e.currentTarget);
    var fila = {}
    for (var valor of this.state.columnas) {
      if(valor != "Eliminar" && valor != "Modificar"){
        fila[valor] = formData.get(valor);
      }
    }
    fila['__rowNum__'] = formData.get('__rowNum__');
    for (let i = 0; i < this.props.hoja.data.length; i++) {
      if(this.props.hoja.data[i].__rowNum__ == fila['__rowNum__']){
        this.props.hoja.data[i] = fila;
      } 
    }
    console.log(this.props.hoja.data)
    this.state.filas = this.getRows()
    this.props.guardarHoja(this.props.hoja);
    this.setState({
      filas: this.state.filas,
      openModify: false,
    })
  }

  getFila = (index) => {
    var fila = ""
    for (let i = 0; i < this.props.hoja.data.length; i++) {
      if(this.props.hoja.data[i].__rowNum__ == index){
        var fila = this.props.hoja.data[i];
      } 
    }
    return fila
  }

  cerrarDialog = () => {
    this.setState({
      open: false
    })
  }

  abrirDialog = () => {
    this.setState({
      open: true
    })
  }

  cerrarDialogModify = () => {
    this.setState({
      openModify: false
    })
  }

  abrirDialogModify = (index) => {
    var fila = this.getFila(index)
    this.state.fila = fila
    this.setState({
      openModify: true,
      fila: fila,
    })
  }

  componentDidMount = () => {
    this.setData();
  }

  componentDidUpdate = (newVal) => {
    if(newVal.actualizar != this.props.actualizar){
      this.setData();
    }
  }

  render() {
    return (
      <div className='container'>
        <TableContainer component={Paper} className='my-5'>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {
                  this.state.status > 0 &&
                  this.state.columnas.map((nombre, index) => {
                    return index == 0 ?
                      <StyledTableCell key={index}>{nombre}</StyledTableCell>
                      :
                      <StyledTableCell key={index} align='right'>{nombre}</StyledTableCell>
                  })
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.status &&
                this.state.filas.map((fila, index1) => {
                  return (
                    <StyledTableRow key={index1+'fila'}>
                      {
                        this.state.columnas.map((nombre, index2) => {
                          return index2 < this.state.columnas.length - 2 ? 
                          <StyledTableCell align="right">{fila[nombre]}</StyledTableCell> 
                          : index2 < this.state.columnas.length -1 ? 
                          <StyledTableCell align="right"><a className='btn btn-danger' onClick={() => this.eliminarFila(fila['__rowNum__'])}>Eliminar</a></StyledTableCell>
                          :
                          <StyledTableCell align="right"><Button variant="contained" color="primary" onClick={() => this.abrirDialogModify(fila['__rowNum__'])}>Modificar fila</Button></StyledTableCell>
                        })
                      }
                    </StyledTableRow>
                  )
                })
              }

            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog crear fila */}

        <Button variant="contained" color="success" onClick={this.abrirDialog}>
        Crear fila
        </Button>
        <Dialog open={this.state.open} onClose={this.cerrarDialog} className='w-100'>
          <DialogTitle>Añadir una fila</DialogTitle>
          <DialogContent>
            <DialogContentText>
            </DialogContentText>
            <form method='post' onSubmit={this.añadirFila}>
              {
                this.state.columnas.map((nombre, index) => {
                  
                  return (nombre != "Eliminar" && nombre != "Modificar")? (
                    <div className='mt-3'>
                      <label className='form-label'>{nombre}</label>
                      <input type={"text"} name={nombre} className='form-control'/>
                    </div>
                  ):<></>
                })
              }     
              <button className='btn btn-primary mt-3 me-3'>Añadir</button>   
              <button className='btn btn-danger mt-3' type='button' onClick={() => this.cerrarDialog()}>Atrás</button>        
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog modificar fila */}

        <Dialog open={this.state.openModify} onClose={this.cerrarDialogModify} className='w-100'>
          <DialogTitle>Modificar fila</DialogTitle>
          <DialogContent>
            <DialogContentText>
            </DialogContentText>
            <form method='post' onSubmit={this.modificarFila}>
              {
                this.state.fila != null &&
                this.state.columnas.map((nombre, index) => {
                  
                  return (nombre != "Eliminar" && nombre != "Modificar")? (
                    <div className='mt-3'>
                      <label className='form-label'>{nombre}</label>
                      <input type={"text"} name={nombre} className='form-control' defaultValue={this.state.fila[nombre]}/>
                    </div>
                  ):<input type={"hidden"} defaultValue={this.state.fila['__rowNum__']} name='__rowNum__'/>
                })
              }     
              <button className='btn btn-primary mt-3 me-3'>Añadir</button>   
              <button className='btn btn-danger mt-3' type='button' onClick={() => this.cerrarDialogModify()}>Atrás</button>        
            </form>
          </DialogContent>
        </Dialog>

      </div>
    )
  }
}
