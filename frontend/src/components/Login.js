import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Container from '@material-ui/core/Container'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import agent from '../agent'
import { LOGIN, LOGIN_PAGE_UNLOADED, UPDATE_FIELD_AUTH } from '../constants/actionTypes'

const mapStateToProps = (state) => ({
  ...state.auth,
  rememberMe: false,
})

const mapDispatchToProps = (dispatch) => ({
  onChangeAuth: (key, value) => dispatch({ type: UPDATE_FIELD_AUTH, key, value }),
  onSubmitForm: (email, password) => dispatch({ type: LOGIN, payload: agent.Auth.login(email, password) }),
  onUnload: () => dispatch({ type: LOGIN_PAGE_UNLOADED }),
})

const Login = (props) => {
  const classes = styles()
  const errors = props.errors ? props.errors : null

  const submitForm = (name, surname, email, password, confirmPassword) => (ev) => {
    ev.preventDefault()
    props.onSubmitForm(name, surname, email, password, confirmPassword)
  }

  const changeAuth = (ev) => props.onChangeAuth(ev.target.id, ev.target.value)

  // Used to unload the props from this component. Should be used in views to unload
  // props, has to be used with the correct action.
  useEffect(
    () =>
      // eslint-disable-next-line implicit-arrow-linebreak
      function cleanUp() {
        props.onUnload()
      },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Logga in
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitForm(props.email, props.password)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            name="email"
            label="Mailadress"
            autoComplete="email"
            helperText={errors && (errors.email || errors.general)}
            error={errors && (errors.email ? true : !!(false || errors.general))}
            onChange={changeAuth}
            value={props.email}
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
            helperText={errors && (errors.password || errors.general)}
            error={errors && (errors.password ? true : !!(false || errors.general))}
            onChange={changeAuth}
            value={props.password}
          />
          <FormControlLabel
            control={<Checkbox onChange={props.changeRememberMe} color="primary" />}
            label="Kom ihåg mig"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={props.inProgress}
            className={classes.submit}
          >
            Logga In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgottenpassword" variant="body2">
                Glömt ditt lösenord?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                Har du inte ett konto? Registrera dig
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}

const styles = makeStyles((theme) => ({
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
}))

export default connect(mapStateToProps, mapDispatchToProps)(Login)
