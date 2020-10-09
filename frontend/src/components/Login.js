import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  UPDATE_FIELD_AUTH,
  LOGIN,
  LOGIN_PAGE_UNLOADED,
  UPDATE_AUTH_BOOLEAN
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
  onChangeAuth: (key, value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: key, value }),
  onSubmit: (email, password) =>
    dispatch({ type: LOGIN, payload: agent.Auth.login(email, password) }),
  onUnload: () =>
    dispatch({ type: LOGIN_PAGE_UNLOADED }),
  onChangeRemberMe: value =>
    dispatch({ type: UPDATE_AUTH_BOOLEAN, key: 'rememberMe', value })
});

class Login extends React.Component {
  constructor() {
    super();
    this.changeAuth = ev => this.props.onChangeAuth(ev.target.id, ev.target.value);
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
    const errors = this.props.errors ? this.props.errors : null;

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
            name="email"
            label="Mailadress"
            autoComplete="email"
            helperText={errors && (errors.email || errors.general)}
            error={errors && (errors.email ? true : false || errors.general ? true : false)}
            onChange={this.changeAuth}
            value={email}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            name="password"
            label="Lösenord"
            type="password"
            autoComplete="current-password"
            helperText={errors && (errors.password || errors.general)}
            error={errors && (errors.password ? true : false || errors.general ? true : false)}
            onChange={this.changeAuth}
            value={password}
          />
          <FormControlLabel
            control={<Checkbox onChange={this.changeRememberMe} color="primary" />}
            label="Kom ihåg mig"
          />
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
