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
    status: false,
    open: false,
    guardar: false,
    openSave: false,
  }

  setData = () => {
    this.state.columnas = this.getColumnas(this.props.hoja.index)
    this.state.filas = this.getRows(this.props.hoja.index)
    this.setState({
      columnas: this.state.columnas,
      filas: this.state.filas,
      status: true
    })
  }

  getColumnas = (num) => {
    var sheet_name_list = this.props.fichero.SheetNames;
    let columnHeaders = [];
    let index = parseInt(num);

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

  getRows = (num) => {
    var rows = [];
    for (var fila of this.props.hoja.data) {
      rows.push(fila)
    }
    return rows;
  }

  selectFila = (index) => {
    console.log(index)
    for (let i = 0; i < this.props.hoja.data.length; i++) {
      console.log(this.props.hoja.data[i].__rowNum__)
      if(this.props.hoja.data[i].__rowNum__ == index){
        console.log("Joer")
        this.state.filas.splice(index, 1)
      } 
    }
    this.props.hoja.data = this.state.filas;
    this.props.guardarHoja(this.props.hoja);
    console.log(this.state.filas)
    this.setState({
      filas: this.state.filas
    })
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

  cerrarDialogSave = () => {
    this.setState({
      openSave: false
    })
  }

  abrirDialogSave = () => {
    this.setState({
      guardar:false,
      openSave: true
    })
  }

  guardarCambios = () => {
    this.props.guardarHoja(this.props.hoja);
    this.setState({
      openSave: false
    })
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
    this.state.filas.push(fila);
    this.setState({
      filas: this.state.filas,
      open: false,
      guardar: true
    })
  }

  componentDidMount = () => {
    this.setData();
  }

  componentDidUpdate = (newVal) => {
    if(newVal.actualizar != this.props.actualizar){
      for (const iterator of this.props.hoja.data) {
        console.log(iterator.__rowNum__)
      }
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
                          <StyledTableCell align="right"><a className='btn btn-danger' onClick={() => this.selectFila(fila['__rowNum__'])}>Eliminar</a></StyledTableCell>
                          :
                          <StyledTableCell align="right"><a className='btn btn-primary'>Modificar</a></StyledTableCell>
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
        </Dialog><br/>
        {
          this.state.guardar &&
          <Button variant="outlined" onClick={this.abrirDialogSave} color="primary">
          Guardar
          </Button>          
        }

        {/* Dialog guardar */}

        <Dialog
            open={this.state.openSave}
            onClose={this.cerrarDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Use Google's location service?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Let Google help apps determine location. This means sending anonymous
                location data to Google, even when no apps are running.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.cerrarDialogSave}>Cancelar</Button>
              <Button onClick={this.guardarCambios} autoFocus>
                Aceptar
              </Button>
            </DialogActions>
          </Dialog>        
      </div>
    )
  }
}
