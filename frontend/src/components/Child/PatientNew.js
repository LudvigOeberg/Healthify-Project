import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper, Box } from '@material-ui/core'
import ChildCareIcon from '@material-ui/icons/ChildCare'
import Moment from 'moment'
import CustomPaginationActionsTable from '../TablePagination'
import CaregivingTeam from '../CaregivingTeam'
import agentEHR from '../../agentEHR'
import { UPDATE_BOOLEAN, 
  FIELD_CHANGE, 
  LOAD_PARTY, 
  LOAD_WEIGHT,
  SAVE_BLOODSUGAR,
  LOAD_BLOODSUGAR,
  SAVE_TIMER, } from '../../constants/actionTypes'
import TimeLineChart from '../TimeLineChart'
import Reformat from '../../reformatEHRData'
//import ehr from '../../reducers/ehr'
import normalAvatar from '../../Static/normal_avatar.png'
import happyAvatar from '../../Static/happy_avatar.png'
import sadAvatar from '../../Static/sad_avatar.png'
import Slider from '@material-ui/core/Slider'
import Input from '@material-ui/core/Input'
import agent from '../../agent'


const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
  currentUser: state.common.currentUser,
})

const mapDispatchToProps = (dispatch) => ({
  onChangeField: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onSubmit: (ehrId, bloodsugar, snackbar, timer) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    dispatch({
      type: SAVE_BLOODSUGAR,
      payload: agentEHR.Composition.saveBloodSugar(ehrId, bloodsugar)
        .then(() => {
          dispatch({
            type: LOAD_BLOODSUGAR,
            payload: agentEHR.Query.bloodsugar(ehrId, 0, 20),
          })
        })
        .then(() => {
          dispatch({
            type: SAVE_TIMER,
            payload: agent.Child.timer(timer),
          })
        }),
      snackbar,
    }),
  onOpenSnackbar: (value) => dispatch({ type: UPDATE_BOOLEAN, key: 'snackbarOpen', value }),
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) })
  },
  loadValues: (ehrId, offset, limit, disease) => {
    if (disease === 'DIABETES')
      dispatch({ type: LOAD_BLOODSUGAR, payload: agentEHR.Query.bloodsugar(ehrId, offset, limit) })
    else if (disease === 'OBESITY') dispatch({ type: LOAD_WEIGHT, payload: agentEHR.Query.weight(ehrId, limit) })
  },
})

// Checks if given bloodsugar levels are considered low, high or good.
// getIndication & reformat are dublicated in MonitorChildValue

const PatientNew= (props) => {
  const id = props.currentUser.ehrid
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  const colDesc = [
    'Datum',
    `Värde ${disease === 'DIABETES' ? '(mmol/L)' : '(vikt i kg)'}`,
    `${disease === 'DIABETES' ? 'Blodsocker' : 'Viktklass'}`,
  ]
  const classes = styles()
  const { bloodsugar } = props
  const { weight } = props
  const age = props.party ? `${Moment().diff(props.party[id].dateOfBirth, 'years')} år` : null
  const name = props.party ? `${props.party[id].firstNames} ${props.party[id].lastNames}` : null
  const loading = props.inProgress
  //----------------------------------------------

  const changeAuth = (ev) => props.onChangeAuth(ev.target.id, ev.target.value)

  const changeAuthSlider = (ev, value) => props.onChangeAuth(ev.target.id, value)
  
  const submitForm = (ev) => {
    ev.preventDefault()

    const bloodsugar = props.bloodsugarValue
    let { timer } = props.currentUser

    // These are implemented as encouraging that depends on if it's a
    // measurement that's new or if it's taken after a bad one.
    let snackbar = {
      open: true,
      // message: `Du loggade värdet: ${bloodsugar} mmol/L.` Keeping it just in cause.
      message: `Ditt värde på mmol/L ser jättebra ut! -Att hålla koll på ditt blodsockervärde är ett bra sätt att hålla en bra hälsa. `,
      color: 'success',
    }

    props.onSubmit(id, bloodsugar, snackbar, timer)
  }

  //---------------Avataren----------------------
  let Avatar = normalAvatar 

  if (props.historicalBloodSugar !== null && props.historicalBloodSugar !== undefined) {
    if (props.historicalBloodSugar[0].value < 4 || props.historicalBloodSugar[0].value > 8) {
      Avatar = sadAvatar
    } else {
      Avatar = happyAvatar
    }
    if (props.historicalBloodSugar[0].time < setTimer()) {
      Avatar = normalAvatar
    }
  }
  //-----------------------------------------------

   const marks = [
     {
       value: 0,
       label: '0 mmol/L',
     },
     {
       value: 15,
       label: '15 mmol/L',
     },
   ]


  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 3, disease)
    }, [id, disease]) // eslint-disable-line


  return (
    <div className={classes.main}>
      <Grid container className={classes.root} spacing={2} height="100%">
        <Grid item xs={12}>
            <Box textAlign="center"> 
                <Typography component="h1" variant="h6">
                  {name}
                </Typography>
                <Typography variant="subtitle1">{age}</Typography>
                <Typography variant="subtitle1">{disease === 'DIABETES' ? 'Diabetes' : 'Fetma'}</Typography>
                  <img src={Avatar} alt="mood avatar"></img>
              </Box>  
          </Grid>
          <Grid container spacing={5} alignItems="center">
         <Grid item xs>
        <Slider
          id="bloodsugar"
          value={typeof parseInt(bloodsugar, 10) === 'number' ? parseInt(bloodsugar, 10) : 0}
          onChange={(ev, value) => changeAuthSlider(ev, value)}
          aria-labelledby="input-slider"
          defaultValue={10}
          step={1}
          valueLabelDisplay="auto"
          marks={marks}
          max={15}
          min={0}
        />
      </Grid>
      {/* Temporary input until the plus-button at the bottom is implemented. */}
       <Grid item>
        <Input
          id="bloodsugar"
          className={classes.input}
          value={bloodsugar}
          margin="dense"
          onChange={changeAuth}
          //onBlur={handleBlur}
          inputProps={{
            step: 1,
            min: 0,
            max: 15,
            type: 'number',
            'aria-labelledby': 'input-slider',
          }}
        />
        <h5> mmol/L </h5>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={(ev) => submitForm(ev)}
          disabled={props.inProgress}
        >
          {' '}
          Submit
        </Button>
      </Grid>
        </Grid>  
      </Grid>
    </div>
  )
}

const styles = makeStyles((theme) => ({
  root: {
    margin: '0px !important',
    alignItems: 'top',
    display: 'flex',
    padding: theme.spacing(1),
    maxWidth: '100%',
  },
  paper: {
    marginTop: theme.spacing(4),
    height: '100%',
    padding: theme.spacing(1),
  },
  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(20),
    height: theme.spacing(20),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  main: {
    width: '100%',
  },
}))

export function getCurrentUTCDate() {
  const today = new Date()
  const year = String(today.getUTCFullYear())
  let month = String(today.getUTCMonth())
  let day = String(today.getUTCDate())
  let hours = String(today.getUTCHours())
  let minutes = String(today.getUTCMinutes())
  let seconds = String(today.getUTCSeconds())

  --hours // Handles the amount of time before the timer sets off.

  if (today.getUTCMonth() < 10) {
    month = `0${String(today.getUTCMonth())}`
  }
  if (today.getUTCDate() < 10) {
    day = `0${String(today.getUTCDate())}`
  }
  if (today.getUTCHours() < 10) {
    hours = `0${String(today.getUTCHours())}`
  }
  if (today.getUTCMinutes() < 10) {
    minutes = `0${String(today.getUTCMinutes())}`
  }
  if (today.getUTCSeconds() < 10) {
    seconds = `0${String(today.getUTCSeconds())}`
  }
  ++month // UTC uses month 0-11 in JS.

  const dateInfo = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
  return dateInfo
}

function setTimer() {
  const today = new Date()
  const year = String(today.getUTCFullYear())
  let month = String(today.getUTCMonth())
  let day = String(today.getUTCDate())
  let hours = String(today.getUTCHours())
  let minutes = String(today.getUTCMinutes())
  let seconds = String(today.getUTCSeconds())

  if (today.getUTCMonth() < 10) {
    month = `0${String(today.getUTCMonth())}`
  }
  if (today.getUTCDate() < 10) {
    day = `0${String(today.getUTCDate())}`
  }
  if (today.getUTCHours() < 10) {
    hours = `0${String(today.getUTCHours())}`
  }
  if (today.getUTCMinutes() < 10) {
    minutes = `0${String(today.getUTCMinutes())}`
  }
  if (today.getUTCSeconds() < 10) {
    seconds = `0${String(today.getUTCSeconds())}`
  }
  ++month // UTC uses month 0-11 in JS.

  const dateInfo = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
  return dateInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientNew)
