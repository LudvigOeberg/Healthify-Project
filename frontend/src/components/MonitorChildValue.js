import React from 'react';
import { connect } from 'react-redux';
import {
  UPDATE_FIELD_AUTH,
  UPDATE_BOOLEAN
} from '../constants/actionTypes';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MySnackbar from './MySnackbar';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

const mapStateToProps = state => { 
  return {
    ...state.auth,
    open: false
}};

const mapDispatchToProps = dispatch => ({
  onChangeAuth: (value) => {
    return dispatch({ type: UPDATE_FIELD_AUTH, key: 'message', value })
  },
  onOpenSnackbar: (value) =>
  {
    return dispatch({ type: UPDATE_BOOLEAN, key: 'open', value });
  }
});

class MonitorChildValue extends React.Component {
  constructor() {
    super();
    this.submitForm = (childValue) => ev => {
      ev.preventDefault();
      console.log(childValue)
      this.props.onChangeAuth(childValue);
      this.props.onOpenSnackbar(true);
      if (childValue > 100 || childValue < 0 || typeof(childValue) == 'undefined') {
        //Här vill vi trigga en error snackbar, försök igen
      } else {
        //Här kör vi en success snackbar
      }
      //this.props.onSubmit(email, password);
    };
  }

  componentWillUnmount() {
    this.props.onUnload();
  }
  
  render() {
    const { classes } = this.props;
    const childValue = this.props.childValue;
    const errors = this.props.errors ? this.props.errors : null;
    const open = this.props.open;

    return (
      <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Logga nytt värde
        </Typography>
        <form className={classes.form} noValidate onSubmit={this.submitForm(childValue)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="childValue"
            name="childValue"
            label="Barnets värde"
            value={childValue}
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary" 
            disabled={this.props.inProgress}
            className={classes.submit}
          >
            Logga värde
          </Button>
          </form>
          <MySnackbar open={open}/>
      </div>
    </Container>
    );
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
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MonitorChildValue));


