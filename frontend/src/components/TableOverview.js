import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { Typography, ListItemIcon } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete';
import Moment from 'moment'

/**
 * Displays a table with a set of given values
 * @param {const} props- an array of objects with rows and cols, array with column titles and a
 * boolean stating if the table is paginated or not.
 * Should look like below:
 * <CustomPaginationActionsTable rows={data} titles={col_desc} paginate={true} loading={props.inProgress} columns={['x','y']} />
 *
 *  Author: Martin Dagermo
 */

const useStyles2 = makeStyles((theme) => ({
  table: {
    minWidth: 100,
  },
  paper: {
    margin: theme.spacing(1),
    width: 'auto',
  },
}))

const reformat = (data) => {
    const dataObjects = []
    var newData = []
    let sameDay;
    for (let i = 0; i < data.length > 6 ? 7 : data.length; i++) {
        sameDay = true
        while (sameDay & data.length > 0) {

            if (Moment().subtract(i, 'day').format('YYYY-MM-DD') == Moment(data[0].time).format('YYYY-MM-DD')) {
                newData.push({
                    time: Moment(data[0].time).format('HH:mm'),
                    value: data[0].value,
                })
                data.shift()
            } else {
                sameDay = false;
            }
        }
    dataObjects.push({
    section: i == 0 ? "Idag" : i == 1 ? "Igår" : Moment().subtract(i, 'day').format('DD/MM'),
    rows: newData,
    })
    newData = [];
    }
    return dataObjects
}

export default function CustomPaginationActionsTable({ loading = false, ...props }) {
  const classes = useStyles2()
  console.log(props)
  const { rows } = props
  const rowsdivided = rows ? reformat(rows) : "hej";
  
    if (loading) {
    return (
      <TableContainer className={classes.paper}>
        <Typography component="h4" variant="subtitle1">
          Laddar...
        </Typography>
      </TableContainer>
    )
  }
  if (!rows) {
    return (
      <TableContainer className={classes.paper}>
        <Typography component="h4" variant="subtitle1">
          Ingen data
        </Typography>
      </TableContainer>
    )
  }



  return (
    
      <Table className={classes.table} >
        {rowsdivided.map((rowdiv) => (
            <>
             <Typography component="h1" variant="h5"> {rowdiv.section} </Typography>
             {rowdiv.rows.map((row) => (
                <TableRow hover>
                    {props.columns.map((data) => (
                        <TableCell>{row[data]}</TableCell>
                    ))}
                        <TableCell align="right">
                            <ListItemIcon>
                            <a href={`/edit-child/`}>
                            <EditIcon color = "primary"/>
                            </a>
                            <a href={`/edit-child/`}>
                            <DeleteIcon color = "primary"/>
                            </a>
                            </ListItemIcon>
                        </TableCell>
                    </TableRow>
                ))}
            <p></p>
            </>
        ))}
    </Table>    
  )
}
