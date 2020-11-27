import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Moment from 'moment'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Typography, Grid, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'

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
    minWidth: '100%',
    width: 'auto',
  },
  paper: {
    margin: theme.spacing(1),
    width: 'auto',
  },
  root: {
    maxWidth: '100%',
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
  let newData = []
  let sameDay
  let loopLn = data.length > 6 ? 7 : data.length
  for (let i = 0; i < loopLn; i++) {
    sameDay = true
    while (sameDay && data.length > 0) {
      if (Moment().subtract(i, 'day').format('YYYY-MM-DD') === Moment(data[0].time).format('YYYY-MM-DD')) {
        newData.push({
          time: Moment(data[0].time).format('HH:mm'),
          value: data[0].value,
        })
        data.shift()
      } else {
        sameDay = false
      }
    }
    if (newData.length) {
      if (i < 2) {
        dataObjects.push({
          section: i === 0 ? 'Idag' : 'Igår',
          rows: newData,
        })
      } else {
        dataObjects.push({
          section: Moment().subtract(i, 'day').format('DD/MM'),
          rows: newData,
        })
      }
    }
    newData = []
  }
  return dataObjects
}

export default function CustomPaginationActionsTable({ loading = false, ...props }) {
  const classes = useStyles2()
  const { rows } = props
  const rowsdivided = rows ? reformat(rows) : null
  const lrows = rows ? rowsdivided.length : null

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
        <Table className={classes.table}>
          {rowsdivided.slice(0, lrows > 1 ? 2 : lrows).map((rowdiv) => (
            <>
              <p></p>
              <Typography component="h1" variant="h5">
                {' '}
                {rowdiv.section}{' '}
              </Typography>
              {rowdiv.rows.map((row) => (
                <TableRow hover>
                  {props.columns.map((data) => (
                    <TableCell>{row[data]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          ))}
        </Table>
      </Grid>
      <Grid item xs={12}>
        <Table className={classes.table}>
          <Accordion className={classes.accordion}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Tidigare mätningar</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Table className={classes.table}>
                {(lrows > 1 ? rowsdivided.slice(2, lrows) : rowsdivided.slice(0, 0)).map((rowdiv) => (
                  <>
                    <p></p>
                    <Typography component="h1" variant="h5">
                      {' '}
                      {rowdiv.section}{' '}
                    </Typography>
                    {rowdiv.rows.map((row) => (
                      <TableRow hover>
                        {props.columns.map((data) => (
                          <TableCell>{row[data]}</TableCell>
                        ))}
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
