import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import Input from '@material-ui/core/Input'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import { Typography, Button } from '@material-ui/core'
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
    // eslint-disable-next-line implicit-arrow-linebreak
    dispatch({
      type: SAVE_BLOODSUGAR,
      payload: agentEHR.Composition.saveBloodSugar(ehrId, bloodsugar).then(() => {
        dispatch({
          type: LOAD_BLOODSUGAR,
          payload: agentEHR.Query.bloodsugar(ehrId, 0, 20),
        })
      }),
      snackbar,
    }),
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

    this.changeAuthSlider = (ev, value) => this.props.onChangeAuth(ev.target.id, value)
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

  componentWillUnmount() {
    this.props.onUnload()
  }

  componentDidMount() {
    this.props.onLoad(this.props.currentUser.ehrid)
  }

  valuetext(value) {
    return `${value} mmol/L`
  }

  render() {
    const marks = [
      {
        value: 5,
        label: '5° mmol/L',
      },
      {
        value: 15,
        label: '15 mmol/L',
      },
    ]
    const bloodsugar = this.props.bloodsugarValue
    const { classes } = this.props
    const bloodsugarData = this.props.bloodsugar
    return (
      <Container component="main" maxWidth="sm">
        <div className={classes.paper}>
          <h2> Var vänlig skriv in ditt blodsockervärde</h2>

          <Typography id="input-slider" gutterBottom>
            mmol/L
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Slider
                id="bloodsugar"
                value={typeof parseInt(bloodsugar, 10) === 'number' ? parseInt(bloodsugar, 10) : 0}
                onChange={(ev, value) => this.changeAuthSlider(ev, value)}
                aria-labelledby="input-slider"
                defaultValue={10}
                step={1}
                valueLabelDisplay="auto"
                marks={marks}
                max={15}
                min={5}
              />
            </Grid>
            <Grid item>
              <Input
                id="bloodsugar"
                className={classes.input}
                value={bloodsugar}
                margin="dense"
                onChange={this.changeAuth}
                onBlur={this.handleBlur}
                inputProps={{
                  step: 1,
                  min: 5,
                  max: 15,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
              />
              <h5> mmol/L </h5>
            </Grid>
          </Grid>
          <Button
            className={classes.button}
            startIcon={<CheckBoxIcon />}
            onClick={(ev) => this.submitForm(ev)}
            disabled={this.props.inProgress}
          ></Button>
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
