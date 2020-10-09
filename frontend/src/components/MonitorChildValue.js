import React from 'react';
import { connect } from 'react-redux';
import {
  UPDATE_BOOLEAN,
  FIELD_CHANGE
} from '../constants/actionTypes';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MySnackbar from './MySnackbar';

const mapStateToProps = state => { 
  return {
    ...state.common
}};

const mapDispatchToProps = dispatch => ({
  onChangeField: (key, value) => 
    dispatch({ type: FIELD_CHANGE, key: key, value }),
  onOpenSnackbar: (value) =>
    dispatch({ type: UPDATE_BOOLEAN, key: 'snackbarOpen', value })
});

class MonitorChildValue extends React.Component {
  constructor() {
    super();
    this.submitForm = ev => {
      ev.preventDefault();
      this.props.onOpenSnackbar(true);
    };
    this.changeField = ev => this.props.onChangeField(ev.target.id, ev.target.value);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }
  
  render() {
    const { classes } = this.props;
    const childValue = this.props.childValue;
    const errors = this.props.errors ? this.props.errors : null;
    const open = this.props.snackbarOpen;

    return (
      <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Logga nytt värde
        </Typography>
        <form className={classes.form} noValidate onSubmit={this.submitForm}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="childValue"
            name="childValue"
            label="Barnets värde"
            value={childValue}
            onChange={this.changeField}
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
          <MySnackbar open={open} color={"success"} message={"Du loggade värdet: " + childValue + " mmol/g"} />
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


