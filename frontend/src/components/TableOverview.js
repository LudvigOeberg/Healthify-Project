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
/**
 * Displays a table with a set of given values
 * @param {const} props- an array of objects with rows and cols, array with column titles and a
 * boolean stating if the table is paginated or not.
 * Should look like below:
 * <CustomPaginationActionsTable rows={data} titles={col_desc} paginate={true} loading={props.inProgress} columns={['x','y']} />
 *
 *  Author: Martin Dagermo
 */

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}))

const useStyles2 = makeStyles((theme) => ({
  table: {
    minWidth: 100,
  },
  paper: {
    margin: theme.spacing(1),
    width: 'auto',
  },
}))

export default function CustomPaginationActionsTable({ loading = false, ...props }) {
  const classes = useStyles2()
  const { paginate } = props
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(paginate ? 5 : -1)
  const { rows } = props
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

  const { titles } = props
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  return (
      <Table className={classes.table}>
        <Typography component="h1" variant="h5"> Idag </Typography>
          {rows.map((row) => (
            <TableRow>
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
        
      </Table>
  )
}
