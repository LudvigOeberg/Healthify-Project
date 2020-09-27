import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  UPDATE_FIELD_AUTH,
  LOGIN,
  LOGIN_PAGE_UNLOADED,
  UPDATE_BOOLEAN
} from '../constants/actionTypes';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const mapStateToProps = state => { 
  return {
    ...state.auth,
    rememberMe: false
}};

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onSubmit: (email, password) =>
    dispatch({ type: LOGIN, payload: agent.Auth.login(email, password) }),
  onUnload: () =>
    dispatch({ type: LOGIN_PAGE_UNLOADED }),
  onChangeRemberMe: value =>
    dispatch({ type: UPDATE_BOOLEAN, key: 'rememberMe', value })
});

class Login extends React.Component {
  constructor() {
    super();
    this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
    this.changePassword = ev => this.props.onChangePassword(ev.target.value);
    this.changeRememberMe = ev => {
      this.props.onChangeRemberMe(ev.target.checked);
    };
    this.submitForm = (email, password) => ev => {
      ev.preventDefault();
      this.props.onSubmit(email, password);
    };
  }

  componentWillUnmount() {
    this.props.onUnload();
  }
  
  render() {
    const { classes } = this.props;
    const email = this.props.email;
    const password = this.props.password;
    return (
      <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Logga in
        </Typography>
        <form className={classes.form} noValidate onSubmit={this.submitForm(email, password)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Mailadress"
            name="email"
            autoComplete="email"
            onChange={this.changeEmail}
            value={email}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Lösenord"
            type="password"
            id="password"
            onChange={this.changePassword}
            value={password}
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox onChange={this.changeRememberMe} color="primary" />}
            label="Kom ihåg mig"
          />
          <ListErrors errors={this.props.errors} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary" 
            disabled={this.props.inProgress}
            className={classes.submit}
          >
            Logga In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Glömt ditt lösenord?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Har du inte ett konto? Registrera dig"}
              </Link>
            </Grid>
          </Grid>
        </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));
