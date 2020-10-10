import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ChildList from './ChildList';
import { PAGE_UNLOADED } from '../../constants/actionTypes';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {LineChart, XAxis, Tooltip, CartesianGrid, Line,
        YAxis } from 'recharts';
//npm install recharts

const mapStateToProps = state => { 
  return {
    ...state.common
}};

const mapDispatchToProps = dispatch => ({
  onUnload: () =>
    dispatch({ type: PAGE_UNLOADED }),
});

// for fake data - remove later
function createData(id, measurement, date, value, value2) {
  return { id, measurement, date, value, value2 };
}
const rows = [
  createData(1, 'Blood sugar', 1, 2, 3, 4),
  createData(2, 'Blood sugar', 2, 9.0, 37, 4.3),
  createData(3, 'Blood sugar', 3, 16.0, 24, 6.0),
  createData(4, 'Blood sugar', 4, 3.7, 67, 4.3),
];

//fake data for blood sugar readings
const chart_data = [
  { date: 'Jan 04 2016', value: 105.35 },
  { date: 'Jan 05 2016', value: 102.71 },
  { date: 'Jan 06 2016', value: 100.7 },
  { date: 'Jan 07 2016', value: 96.45 },
  { date: 'Jan 08 2016', value: 96.96 },
  { date: 'Jan 11 2016', value: 98.53 },
  { date: 'Jan 12 2016', value: 99.96 },
  { date: 'Jan 13 2016', value: 97.39 },
  { date: 'Jan 14 2016', value: 99.52 },
  { date: 'Jan 15 2016', value: 97.13 },
  { date: 'Jan 19 2016', value: 96.66 },
  { date: 'Jan 20 2016', value: 96.79 },
  { date: 'Jan 21 2016', value: 96.3 },
]


class Parent extends React.Component {
  
  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const { classes } = this.props;
    const children = this.props.currentUser ? this.props.currentUser.children : null;
    //changed children check for testing
    if (children) {
      return (
        <Container component="main" maxWidth="md">
          <div className={classes.paper}>
           <ChildList children={children} /> 
          </div>

          <LineChart
            width={600} height={400} data={chart_data}
            margin={{ top: 40, right: 40, bottom: 20, left: 20 }}  >
            <CartesianGrid vertical={false} />
            
            <XAxis dataKey="date" />
            <YAxis domain={['auto', 'auto']}/>
            <Tooltip
              wrapperStyle={{
                borderColor: 'white',
                boxShadow: '2px 2px 3px 0px rgb(204, 204, 204)',
              }}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              labelStyle={{ fontWeight: 'bold', color: '#666666' }}
            />
            <Line dataKey="value" stroke="#ff7300" dot={false} />
          </LineChart>

          <div className={classes.table}>
            <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell align="right">Measurement</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Value&nbsp;(?)</TableCell>
                    <TableCell align="right">Value&nbsp;(?)</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                        {row.id}
                    </TableCell>
                    <TableCell align="right">{row.measurement}</TableCell>
                    <TableCell align="right">{row.date}</TableCell>
                    <TableCell align="right">{row.value}</TableCell>
                    <TableCell align="right">{row.value2}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
            </div>


        </Container>
        
      );
    } else {
      /*
      NOTE:
      This is mostly for testing, if no children maybe should not display table
      */
      return (
      <Container component="main" maxWidth="md">
        <div className={classes.paper}>
          <Typography type="h5">Inga barn (showing plots for testing)</Typography>
          </div>

          <LineChart
            width={650} height={450} data={chart_data}
            margin={{ top: 40, right: 40, bottom: 20, left: 20 }}  >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip
              wrapperStyle={{
                borderColor: 'white',
                boxShadow: '2px 2px 3px 0px rgb(204, 204, 204)',
              }}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              labelStyle={{ fontWeight: 'bold', color: '#666666' }}
            />
            <Line dataKey="value" stroke="#ff7300" dot={false} />
          </LineChart>

          <div className={classes.table}>
            <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell align="right">Measurement</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Value&nbsp;(?)</TableCell>
                    <TableCell align="right">Value&nbsp;(?)</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                        {row.id}
                    </TableCell>
                    <TableCell align="right">{row.measurement}</TableCell>
                    <TableCell align="right">{row.date}</TableCell>
                    <TableCell align="right">{row.value}</TableCell>
                    <TableCell align="right">{row.value2}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
            </div>


      </Container>
      );
    }
  }
}


const styles = theme => {
  return ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '50%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    table: {
      marginTop: theme.spacing(10),
      marginLeft: theme.spacing(10),
      // marginRight: theme.spacing(10),
      width: '60%',
      alignItems: 'center',
    }
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Parent));


