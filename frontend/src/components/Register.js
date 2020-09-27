import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  UPDATE_FIELD_AUTH,
  REGISTER,
  REGISTER_PAGE_UNLOADED
} from '../constants/actionTypes';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onChangeUsername: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'username', value }),
  onSubmit: (username, email, password) => {
    const payload = agent.Auth.register(username, email, password);
    dispatch({ type: REGISTER, payload })
  },
  onUnload: () =>
    dispatch({ type: REGISTER_PAGE_UNLOADED })
});

class Register extends React.Component {
  constructor() {
    super();
    this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
    this.changePassword = ev => this.props.onChangePassword(ev.target.value);
    this.changeUsername = ev => this.props.onChangeUsername(ev.target.value);
    this.submitForm = (username, email, password) => ev => {
      ev.preventDefault();
      this.props.onSubmit(username, email, password);
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const { classes } = this.props;
    const email = this.props.email;
    const password = this.props.password;
    const username = this.props.username;

    return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registrera dig
        </Typography>
        <form className={classes.form} noValidate onSubmit={this.submitForm(username, email, password)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="userx§name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Förnamn"
                autoFocus
                value={this.props.username}
                onChange={this.changeUsername}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Mailaddress"
                name="email"
                autoComplete="email"
                value={this.props.email}
                onChange={this.changeEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Lösenord"
                type="password"
                id="password"
                autoComplete="current-password"
                value={this.props.password}
                onChange={this.changePassword}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={this.props.inProgress}>
            Registrera
          </Button>
          <ListErrors errors={this.props.errors} />
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Har du redan ett konto? Logga in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    );
  }
}

const styles = theme => ({
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Register));
