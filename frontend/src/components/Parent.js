import React, { Component } from 'react'
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/styles';


const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = dispatch => ({
    
});

function createData(id, measurement, date, value, value2) {
    return { id, measurement, date, value, value2 };
  }
  
  const rows = [
    createData(1, 'Blood sugar', 1, 2, 3, 4),
    createData(2, 'Blood sugar', 2, 9.0, 37, 4.3),
    createData(3, 'Blood sugar', 3, 16.0, 24, 6.0),
    createData(4, 'Blood sugar', 4, 3.7, 67, 4.3),
  ];


class ParentOverview extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const { classes } = this.props;

        return (
            <div id="parent">

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
            </div>
        )
    }
}

const styles = theme => ({
    table: {
      marginTop: theme.spacing(50),
      marginLeft: theme.spacing(10),
      marginRight: theme.spacing(10),
      width: '40%',
      alignItems: 'center',
    },
    chart: {

    }
  });

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ParentOverview));