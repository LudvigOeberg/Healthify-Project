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


//TODO:
//Försöka koppla detta med värdena från 'patient' (funktion till createData)
//Snygga till den lite(kolla så det är rätt tema, font osv)

function createData(date, bloodsugarLvl) {
  return { date, bloodsugarLvl };
}

function createRows() {
  var rows = [
    createData('2020-05-01 17:00', 5.0),
    createData('2020-05-01 17:00', 6.0),
    createData('2020-05-01 17:00', 7.0),
    createData('2020-05-01 17:00', 8.0),
    createData('2020-05-02 17:00', 4.3),
    createData('2020-05-03 17:00', 4.2),
    createData('2020-05-04 17:00', 4.1),
    createData('2020-05-05 17:00', 4.0),
  ]
  var keys = Object.keys(localStorage);
  var length = keys.length;
  var i;

  for(i = 0; i < length; i++){
    rows[i+8] = createData(keys[i],localStorage.getItem(keys[i]));
  }
  return (rows);
}



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
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Bloodsugar (mmol / L)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.date}>
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell align="right">{row.bloodsugarLvl}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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