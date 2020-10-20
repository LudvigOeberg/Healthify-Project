import React, { Component } from 'react'
import { TextField, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import InputAdornment from '@material-ui/core/InputAdornment'
import Container from '@material-ui/core/Container'
import { connect } from 'react-redux'
import {
  PATIENT_PAGE_UNLOADED,
  FIELD_CHANGE,
  UPDATE_BOOLEAN,
  LOAD_PARTY,
  SAVE_BLOODSUGAR,
  LOAD_BLOODSUGAR,
} from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import CustomPaginationActionsTable from '../TablePagination'
import Reformat from '../../reformatEHRData'

const mapStateToProps = (state) => ({
  ...state.ehr,
  currentUser: state.common.currentUser,
  bloodsugarValue: state.common.bloodsugar,
})

const mapDispatchToProps = (dispatch) => ({
  onChangeAuth: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onSubmit: (ehrId, bloodsugar, snackbar) =>
    dispatch({ type: SAVE_BLOODSUGAR, payload: agentEHR.Composition.saveBloodSugar(ehrId, bloodsugar), snackbar }),
  onUnload: () => dispatch({ type: PATIENT_PAGE_UNLOADED }),
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) })
    dispatch({ type: LOAD_BLOODSUGAR, payload: agentEHR.Query.bloodsugar(ehrId, 0, 20) })
  },
  onOpenSnackbar: (value) => dispatch({ type: UPDATE_BOOLEAN, key: 'snackbarOpen', value }),
})

class Patient extends Component {
  constructor() {
    super()
    this.changeAuth = (ev) => this.props.onChangeAuth(ev.target.id, ev.target.value)
    this.submitForm = (ev) => {
      ev.preventDefault()
      const bloodsugar = this.props.bloodsugarValue
      const snackbar = {
        open: true,
        message: `Du loggade värdet: ${bloodsugar} mmol/L`,
        color: 'success',
      }
      this.props.onSubmit(this.props.currentUser.ehrid, bloodsugar, snackbar)
    }
  }

  componentDidMount() {
    this.props.onLoad(this.props.currentUser.ehrid)
  }

  componentWillUnmount() {
    this.props.onUnload()
  }

  render() {
    const bloodsugar = this.props.bloodsugarValue
    const { classes } = this.props
    const bloodsugarData = this.props.bloodsugar
    return (
      <Container component="main" maxWidth="sm">
        <div className={classes.paper}>
          <h1>Patientvy</h1>
          <h2> Var vänlig skriv in ditt blodsockervärde</h2>
          <form className={classes.form} noValidate autoComplete="off" onSubmit={this.submitForm('bloodSugarJson')}>
            <TextField
              required
              id="bloodsugar"
              label="Blodsockervärde"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">mmol/L</InputAdornment>,
              }}
              onChange={this.changeAuth}
              value={bloodsugar}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              className={classes.submit}
              disabled={this.props.inProgress}
            >
              Skicka in
            </Button>
          </form>
          <CustomPaginationActionsTable
            paginate
            titles={['Datum', 'mmol/L']}
            columns={['x', 'y']}
            rows={bloodsugarData ? Reformat.bloodsugar(bloodsugarData, false) : null}
          />
        </div>
      </Container>
    )
  }
}

const styles = (theme) => ({
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
})

export function getCurrentDate() {
  const today = new Date()
  let month = String(today.getMonth())
  let day = String(today.getDate())
  let hours = String(today.getHours())
  let minutes = String(today.getMinutes())

  if (today.getMonth() < 10) {
    month = `0${String(today.getMonth())}`
  }
  if (today.getDate() < 10) {
    day = `0${String(today.getDate())}`
  }
  if (today.getHours() < 10) {
    hours = `0${String(today.getDate())}`
  }
  if (today.getMinutes() < 10) {
    minutes = `0${String(today.getDate())}`
  }

  const dateInfo = { year: String(today.getFullYear()), month, day, hours, minutes }
  return dateInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Patient))
