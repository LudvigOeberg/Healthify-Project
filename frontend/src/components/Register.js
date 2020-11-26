import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import agent from '../agent'
import { REGISTER, REGISTER_PAGE_UNLOADED, UPDATE_FIELD_AUTH } from '../constants/actionTypes'

const mapStateToProps = (state) => ({ ...state.auth })

const mapDispatchToProps = (dispatch) => ({
  onChangeFieldAuth: (key, value) => dispatch({ type: UPDATE_FIELD_AUTH, key, value }),
  onSubmit: (name, surname, email, password, confirmPassword) => {
    const payload = agent.Auth.register(name, surname, email, password, confirmPassword)
    dispatch({ type: REGISTER, payload })
  },
  onUnload: () => dispatch({ type: REGISTER_PAGE_UNLOADED }),
})

const Register = (props) => {
  const classes = styles()
  const { email } = props
  const { password } = props
  const { confirmPassword } = props
  const { name } = props
  const { surname } = props
  const errors = props.errors ? props.errors : null
  // eslint-disable-next-line no-shadow
  const submitForm = (name, surname, email, password, confirmPassword) => (ev) => {
    ev.preventDefault()
    props.onSubmit(name, surname, email, password, confirmPassword)
  }

  const changeAuth = (ev) => props.onChangeFieldAuth(ev.target.id, ev.target.value)

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
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registrera dig
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={submitForm(name, surname, email, password, confirmPassword)}
        >
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
                helperText={errors && (errors.name || errors.general)}
                error={errors && (errors.name ? true : !!(false || errors.general))}
                autoFocus
                value={props.name}
                onChange={changeAuth}
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
                helperText={errors && (errors.surname || errors.general)}
                error={errors && (errors.surname ? true : !!(false || errors.general))}
                value={props.surname}
                onChange={changeAuth}
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
                helperText={errors && (errors.email || errors.general)}
                error={errors && (errors.email ? true : !!(false || errors.general))}
                value={props.email}
                onChange={changeAuth}
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
                helperText={errors && (errors.password || errors.general)}
                error={errors && (errors.password ? true : !!(false || errors.general))}
                value={props.password}
                onChange={changeAuth}
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
                helperText={errors && (errors.confirmPassword || errors.general)}
                error={errors && (errors.confirmPassword ? true : !!(false || errors.general))}
                value={props.confirmPassword}
                onChange={changeAuth}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={props.inProgress}
            id="registerUserButton"
          >
            Registrera
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link id="registerLoginLink" href="/login" variant="body2">
                Har du redan ett konto? Logga in
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
    marginTop: theme.spacing(4),
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
}))

export default connect(mapStateToProps, mapDispatchToProps)(Register)
