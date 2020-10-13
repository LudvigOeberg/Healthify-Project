import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import CustomPaginationActionsTable from '../TablePagination';


//TODO:
//Försöka koppla detta med värdena från 'patient' (funktion till createData)
//Snygga till den lite(kolla så det är rätt tema, font osv)


function createRows() {
  var rows =[
    ['2020-05-01 17:00', 5.0],
    ['2020-05-02 17:00', 6.0],
    ['2020-05-03 17:00', 7.0],
    ['2020-05-04 17:00', 8.0],
    ['2020-05-05 17:00', 10.0],
    ['2020-05-06 17:00', 23.0]
  ];
 

  var keys = Object.keys(localStorage);
  var length = keys.length;
  var i;

  for (i = 0; i < length; i++) {
    rows[i + 5] = [keys[i], localStorage.getItem(keys[i])];
  }
  return (rows);
}
const titles = ['Registration Date', 'Value (mmol/L)'];



export default function Measurements(props,) {
  const classes = useStyles();
  var rows = createRows();
  return (
    <Container maxWidth="sm">
      <div className={classes.paper}>
        <Typography component="h1" variant="h3">
          Previous Measurements
                    </Typography>


        <TableContainer component={Paper}>
          <CustomPaginationActionsTable rows = {rows} titles = {titles} paginate = {true}>
          </CustomPaginationActionsTable>
        </TableContainer>
      </div>
    </Container>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));