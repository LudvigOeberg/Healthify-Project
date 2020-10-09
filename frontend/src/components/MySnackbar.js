

import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from 'react-redux';
import {
  UPDATE_BOOLEAN
} from '../constants/actionTypes';


/**
 * Displays a snackbar at the bottom
 * @param {const} props- a const with a message, open=true and a color.
 * Should look like below:
 * <Snackbar open={true} message={message} color={"success"} />
 * 
 *  Author: Martin Dagermo
 */

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2)
    }
  }
}));

const mapStateToProps = state => { 
  return {
    ...state.common
}};

const mapDispatchToProps = dispatch => ({
  onOpenSnackbar: (value) =>
    dispatch({ type: UPDATE_BOOLEAN, key: 'snackbarOpen', value })
});

const MySnackbar = (props) => {
  const classes = useStyles();
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
       return;
    }
    props.onOpenSnackbar(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={props.open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          elevation={6}
          severity={props.color}
          variant="filled"
          onClose={handleClose}
          color={props.color}
        >
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(MySnackbar);


