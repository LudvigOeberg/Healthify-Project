import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import { makeStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { CLOSE_SNACKBAR } from '../constants/actionTypes'

/**
 * Displays a snackbar at the bottom
 * Use dispatch({ type: OPEN_SNACKBAR, message: message, color: "success" })
 * to open snackbar with message.
 *  Author: Martin Dagermo
 */

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}))

const mapStateToProps = (state) => ({
  ...state.common.snackbar,
})

const mapDispatchToProps = (dispatch) => ({
  closeSnackbar: () => dispatch({ type: CLOSE_SNACKBAR }),
})

const MySnackbar = (props) => {
  const classes = useStyles()
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    props.closeSnackbar()
  }

  return (
    <div className={classes.root}>
      <Snackbar open={props.open} autoHideDuration={3000} onClose={handleClose}>
        <Alert elevation={6} severity={props.color} variant="filled" onClose={handleClose} color={props.color}>
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MySnackbar)
