import React, { Component } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

  // setData = () => {
  //   // console.log(this.props.filas[0].data)
  //   // for (const iterator of this.props.filas.data) {
  //   //   console.log(iterator)
  //   // }
  // }

  componentDidMount = () => {
    console.log(this.props.filas)
    console.log(this.props.columnas)
  }

  componentDidUpdate = (newVal, oldVal) => {
    console.log(this.props.filas)
    console.log(this.props.columnas)
  }

  render() {
    return (
      <div className='container'>
        <TableContainer component={Paper} className='my-5'>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {/* <StyledTableCell>Dessert (100g serving)</StyledTableCell>
                <StyledTableCell align="right">Calories</StyledTableCell>
                <StyledTableCell align="right">Fat&nbsp;(g)</StyledTableCell>
                <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell>
                <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell> */}
                {
                  this.props.columnas.map((nombre, index) => {
                    return index == 0 ?
                    <StyledTableCell key={index}>{nombre}</StyledTableCell>
                    :
                    <StyledTableCell key={index} align='right'>{nombre}</StyledTableCell>
                  })
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {rows.map((row) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component="th" scope="row">
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.calories}</StyledTableCell>
                  <StyledTableCell align="right">{row.fat}</StyledTableCell>
                  <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                  <StyledTableCell align="right">{row.protein}</StyledTableCell>
                </StyledTableRow>
              ))} */}
                {
                this.props.filas[0].data.map((fila, index1) => {
                  return (
                    <StyledTableRow key={fila.Nombre}>
                      {
                        this.props.columnas.map((nombre, index2) => {                          
                          return <StyledTableCell align="right">{fila[nombre]}</StyledTableCell>
                        })
                      }
                    </StyledTableRow>
                  )
                })
                }  
               
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }
}
