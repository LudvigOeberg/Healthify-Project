import { Container, Grid, Avatar, TextField, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect } from 'react'

import { connect } from 'react-redux'
import ChildCareIcon from '@material-ui/icons/ChildCare'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { UPDATE_FIELD_AUTH, EDIT_CHILD, REGISTER_PAGE_UNLOADED, DELETE_CHILD } from '../../constants/actionTypes'
import agent from '../../agent'

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.auth,
})

const mapDispatchToProps = (dispatch) => ({
  onChangeField: (key, value) => dispatch({ type: UPDATE_FIELD_AUTH, key, value }),
  editPatient: (id, email, snackbar) => {
    const payload = agent.Parent.editChild(id, email)
    dispatch({ type: EDIT_CHILD, payload, snackbar })
  },
  onUnload: () => dispatch({ type: REGISTER_PAGE_UNLOADED }),
  deletePatient: (ehrid, snackbar) => {
    const payload = agent.Parent.deleteChild(ehrid)
    dispatch({ type: DELETE_CHILD, payload, snackbar })
  },
})

const PatientEdit = (props) => {
  const classes = styles()
  const errors = props.errors ? props.errors : null
  const ehrid = props.match.params.id
  const onChangeField = (ev) => props.onChangeField(ev.target.id, ev.target.value)
  const submitForm = (id, email) => (ev) => {
    ev.preventDefault()
    const snackbar = {
      message: `Du ändrade emailadress för ${name}`,
      color: 'success',
      open: true,
    }
    props.editPatient(id, email, snackbar)
  }
  const deletePatient = (id) => (ev) => {
    ev.preventDefault()
    const snackbar = {
      message: `Du tog bort kontot för ${name}`,
      color: 'success',
      open: true,
    }
    props.deletePatient(id, snackbar)
  }

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

  let oldemail
  let name

  props.currentUser.children.map((child) => {
    if (child.child.ehrid === ehrid) {
      oldemail = child.child.email
      name = child.child.name
    }
    return null
  })

  const email = props.email ? props.email : oldemail

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ChildCareIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Ändra uppgifter för {name}
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitForm(ehrid, email)}>
          <Grid container spacing={2}>
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
                value={email}
                onChange={onChangeField}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={props.inProgress}
              >
                Spara
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
                disabled={props.inProgress}
                onClick={deletePatient(ehrid)}
              >
                <DeleteForeverIcon />
                Ta bort {name}
              </Button>
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
    margin: theme.spacing(0, 0, 0),
  },
}))

export default connect(mapStateToProps, mapDispatchToProps)(PatientEdit)
