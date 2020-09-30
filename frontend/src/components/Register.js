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
  onChangeFieldAuth: (key, value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: key, value }),
  onSubmit: (name, surname, email, password, confirmPassword) => {
    const payload = agent.Auth.register(name, surname, email, password, confirmPassword);
    dispatch({ type: REGISTER, payload })
  },
  onUnload: () =>
    dispatch({ type: REGISTER_PAGE_UNLOADED })
});

class Register extends React.Component {
  constructor() {
    super();
    this.changeAuth = ev => this.props.onChangeFieldAuth(ev.target.id, ev.target.value);
    
    this.submitForm = (name, surname, email, password, confirmPassword) => ev => {
      ev.preventDefault();
      this.props.onSubmit(name, surname, email, password, confirmPassword);
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const { classes } = this.props;
    const email = this.props.email;
    const password = this.props.password;
    const confirmPassword = this.props.confirmPassword;
    const name = this.props.name;
    const surname = this.props.surname;
    const errors = this.props.errors ? this.props.errors : null;

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
        <form className={classes.form} noValidate onSubmit={this.submitForm(name, surname, email, password, confirmPassword)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                name="name"
                label="Förnamn"
                helperText={errors && errors.name}
                error={errors && errors.name ? true : false}
                autoFocus
                value={this.props.name}
                onChange={this.changeAuth}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="surname"
                variant="outlined"
                required
                fullWidth
                id="surname"
                name="surname"
                label="Efternamn"
                helperText={errors && errors.surname}
                error={errors && errors.surname ? true : false}
                value={this.props.surname}
                onChange={this.changeAuth}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                name="email"
                label="Mailaddress"
                autoComplete="email"
                helperText={errors && errors.email}
                error={errors && errors.email ? true : false}
                value={this.props.email}
                onChange={this.changeAuth}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                type="password"
                id="password"
                label="Lösenord"
                autoComplete="current-password"
                helperText={errors && errors.password}
                error={errors && errors.password ? true : false}
                value={this.props.password}
                onChange={this.changeAuth}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                label="Bekräfta lösenord"
                helperText={errors && errors.confirmPassword}
                error={errors && errors.confirmPassword ? true : false}
                value={this.props.confirmPassword}
                onChange={this.changeAuth}
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
