import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { Typography, ListItemIcon, Accordion, AccordionSummary, AccordionDetails, Grid } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete';
import Moment from 'moment'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
    minWidth: "100%",
    width: 'auto',
  },
  paper: {
    margin: theme.spacing(1),
    width: 'auto',
  },
  root: {
    maxWidth: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  accordion: {
    boxShadow: 'none',
    '&.MuiAccordion-root:before': {
      display: 'none',
    },
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
    if (newData.length) {
      dataObjects.push({
      section: i == 0 ? "Idag" : i == 1 ? "Igår" : Moment().subtract(i, 'day').format('DD/MM'),
      rows: newData,
    })
  }
  newData = [];
}
    return dataObjects
}

export default function CustomPaginationActionsTable({ loading = false, ...props }) {
  const classes = useStyles2()
  const { rows } = props
  const rowsdivided = rows ? reformat(rows) : null;
  const lrows = rows ? rowsdivided.length : null;
  
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
    
    <Grid container className={classes.root} spacing={2} height="100%">
      <Grid item xs={12}>
      <Table className={classes.table} >
        {rowsdivided.slice(0,lrows > 1 ? 2 : lrows).map((rowdiv) => (
            <>
            <p></p>
             <Typography component="h1" variant="h5"> {rowdiv.section} </Typography>
             {rowdiv.rows.map((row) => (
                <TableRow hover>
                    {props.columns.map((data) => (
                        <TableCell>{row[data]}</TableCell>
                    ))}
                        {/* <TableCell align="right">
                            <ListItemIcon>
                            <a href={`/edit-child/`}>
                            <EditIcon color = "primary"/>
                            </a>
                            <a href={`/edit-child/`}>
                            <DeleteIcon color = "primary"/>
                            </a>
                            </ListItemIcon>
                        </TableCell> */}
                    </TableRow>
                ))}
            </>
        ))}
        </Table>
        </Grid>
        <Grid item xs={12}>

        <Table className={classes.table} >
        <Accordion className={classes.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          //aria-controls="panel1a-content"
          //id="panel1a-header"
        >
          <Typography className={classes.heading}>Tidigare mätningar</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Table className={classes.table} >
        {(lrows > 1 ? rowsdivided.slice(2,lrows) : rowsdivided.slice(0,0)).map((rowdiv) => (
            <>
            <p></p>
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
        </AccordionDetails>
      </Accordion>
</Table>    
</Grid>
</Grid>
  )
}
