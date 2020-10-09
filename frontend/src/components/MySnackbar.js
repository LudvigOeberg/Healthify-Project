

import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import {
  UPDATE_FIELD_AUTH,
  LOGIN,
  LOGIN_PAGE_UNLOADED,
  UPDATE_BOOLEAN
} from '../constants/actionTypes';

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2)
    }
  }
}));

const mapStateToProps = state => { 
    console.log(state.auth)
    return {
      ...state.auth,
    }
};

const MySnackbar = (props) => {
  const classes = useStyles();

  const handleClose = (event, reason) => {
    // if (reason === 'clickaway') {
    //   return;
    // }

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
          severity="success"
          variant="filled"
          onClose={handleClose}
          color="success"
        >
          {"Du loggade värdet: " + props.childValue + "mmol/L"}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default connect(mapStateToProps)(MySnackbar);


