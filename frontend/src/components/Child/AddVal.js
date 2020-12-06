import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Box, Paper, Tabs, Tab } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import {
  OPEN_SNACKBAR,
  FIELD_CHANGE,
  LOAD_PARTY,
  LOAD_BLOODSUGAR,
  SAVE_BLOODSUGAR,
  LOAD_WEIGHT,
  SAVE_WEIGHT,
  SAVE_TIMER,
} from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import agent from '../../agent'
import thinkingAvatar from '../../Static/thinking_avatar.png'
import selectSad from '../../Static/select_sad.png'
import selectGrumpy from '../../Static/select_grumpy.png'
import selectNormal from '../../Static/select_normal.png'
import selectHappy from '../../Static/select_happy.png'
import selectVeryHappy from '../../Static/select_very_happy.png'

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
  currentUser: state.common.currentUser,
})

const mapDispatchToProps = (dispatch) => ({
  onChangeAuth: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onChangeField: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onSubmit: (ehrId, measurement, snackbar, disease, timer) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    dispatch({
      type: disease === 'DIABETES' ? SAVE_BLOODSUGAR : SAVE_WEIGHT,
      payload:
        disease === 'DIABETES'
          ? agentEHR.Composition.saveBloodSugar(ehrId, measurement)
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
              })
          : agentEHR.Demograhics.newMeasurment(null, measurement, ehrId).then(() => {
              dispatch({
                type: LOAD_WEIGHT,
                payload: agentEHR.Query.weight(ehrId, 20),
              })
            }),

      snackbar,
    }),
  onOpenSnackbar: (message, color) => dispatch({ type: OPEN_SNACKBAR, message, color }),
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) })
  },
  loadValues: (ehrId, offset, limit, disease) => {
    if (disease === 'DIABETES')
      dispatch({
        type: LOAD_BLOODSUGAR,
        payload: agentEHR.Query.bloodsugar(ehrId, offset, limit),
      })
    else if (disease === 'OBESITY')
      dispatch({
        type: LOAD_WEIGHT,
        payload: agentEHR.Query.weight(ehrId, limit),
      })
  },
})

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

const AddVal = (props) => {
  const id = props.currentUser.ehrid
  const classes = styles()
  const { childValue } = props
  const open = props.snackbarOpen
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null

  const [value, setValue] = React.useState(2)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 20, disease)
  }, [id, disease]); // eslint-disable-line

  const validate = (val) => val < 100 && val > 0

  const submitForm = (ev) => {
    ev.preventDefault()

    let { timer } = props.currentUser
    function startTimer() {
      if (disease === 'DIABETES') {
        if (timer === null) {
          timer = setTimer()
        } else {
          timer = props.currentUser.timer
        }
      }
    }

    // const SU_LO = props.party ? `${props.party[id].additionalInfo.SU_LO}` : null
    // const SU_HI = props.party ? `${props.party[id].additionalInfo.SU_HI}` : null

    const measurementChild = props.childValue
    const HIGH_VAL = disease === 'DIABETES' ? measurementChild > 8 : measurementChild > 70
    const LOW_VAL = disease === 'DIABETES' ? measurementChild < 4 : measurementChild < 0

    let snackbar = {
      open: true,
      message: validate(props.childValue)
        ? `Ditt värde på ${props.childValue} ${
            disease === 'DIABETES' ? 'mmol/L' : 'kg'
          } ser jättebra ut! -Att hålla koll på ditt ${
            disease === 'DIABETES' ? 'blodsockervärde' : 'vikt'
          } är ett bra sätt att hålla en bra hälsa.`
        : 'Fel format!',
      color: validate(props.childValue) ? 'success' : 'error',
    }

    if (disease === 'DIABETES' && timer !== null) {
      timer = null
      snackbar = {
        open: true,
        message: `Bra jobbat, hoppas du mår toppen!`,
        color: 'success',
      }
    }

    if (HIGH_VAL) {
      startTimer()
      snackbar = {
        open: true,
        message: validate(props.childValue)
          ? `Åh nej, det ser ut som att ${
              disease === 'DIABETES'
                ? 'ditt blodsocker börjar bli högt. Se till att ta lite insulin snart så du inte börjar må dåligt.'
                : 'din vikt börjar gå upp. Försök röra på dig mer och äta hälsosammare.'
            } `
          : 'Fel format!',
        color: validate(props.childValue) ? 'error' : 'error',
      }
    }

    if (LOW_VAL) {
      startTimer()
      snackbar = {
        open: true,
        message: validate(props.childValue)
          ? `Åh nej, det ser ut som att ${
              disease === 'DIABETES'
                ? 'ditt blodsocker börjar bli lågt. Se till att äta något snart innan du börjar må dåligt och registrera ett nytt värde därefter.'
                : 'din vikt gått ner. Försök att äta mer.'
            } `
          : 'Fel format!',
        color: validate(props.childValue) ? 'error' : 'error',
      }
    }
    props.onSubmit(id, measurementChild, snackbar, disease, timer)
  }

  const changeField = (ev) => {
    props.onChangeField(ev.target.id, ev.target.value)
  }

  return (
    <div className={classes.backGround}>
      <Grid container justify="center" textAlign="right">
        {/* <Paper elevation={0} > */}
        <Grid>
          <img id="currentMood" className={classes.centerIcon} src={thinkingAvatar} alt="mood avatar"></img>
          <Typography className={classes.bubbleText} variant="h6">
            Hur mår du just nu?
          </Typography>
        </Grid>
      </Grid>

      <Paper elevation={0} className={classes.lowerBG}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid>
            <Tabs
              orientation="horizontal"
              variant="scrollable"
              indicatorColor="primary"
              value={value}
              onChange={handleChange}
            >
              <Tab
                {...a11yProps(0)}
                component={() => (
                  <Button id="childSelectSad" className={classes.circle} onClick={() => setValue(0)}>
                    <img className={classes.circleAvatar} src={selectSad} alt="Selected Sad"></img>
                  </Button>
                )}
              />
              <Tab
                {...a11yProps(1)}
                component={() => (
                  <Button id="childSelectGrumpy" className={classes.circle} onClick={() => setValue(1)}>
                    <img className={classes.circleAvatar} src={selectGrumpy} alt="Selected Grympy"></img>
                  </Button>
                )}
              />
              <Tab
                {...a11yProps(2)}
                component={() => (
                  <Button id="childSelectNormal" className={classes.circle} onClick={() => setValue(2)}>
                    <img className={classes.circleAvatar} src={selectNormal} alt="Selected Normal"></img>
                  </Button>
                )}
              />
              <Tab
                {...a11yProps(3)}
                component={() => (
                  <Button id="childSelectHappy" className={classes.circle} onClick={() => setValue(3)}>
                    <img className={classes.circleAvatar} src={selectHappy} alt="Selected Happy"></img>
                  </Button>
                )}
              />
              <Tab
                {...a11yProps(4)}
                component={() => (
                  <Button id="childSelectVeryHappy" className={classes.circle} onClick={() => setValue(4)}>
                    <img className={classes.circleAvatar} src={selectVeryHappy} alt="Selected very happy"></img>
                  </Button>
                )}
              />
            </Tabs>
          </Grid>
        </Grid>{' '}
        <Grid container alignItems="center" justify="center" direction="column">
          <Paper className={classes.bubble}>
            <Grid item xs>
              <Box textAlign="center">
                <Typography subtile1="h2" className={classes.inputText}>
                  {disease === 'DIABETES' ? 'Hur högt blodsocker har du?' : 'Hur mycket väger du?'}
                </Typography>
              </Box>

              <TextField
                variant="outlined"
                margin="normal"
                required
                id="childValue"
                name="childValue"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">{disease === 'DIABETES' ? 'mmol/L' : 'kg'}</InputAdornment>
                  ),
                }}
                value={childValue}
                disabled={open}
                onChange={changeField}
                className={classes.submit}
              />
            </Grid>
          </Paper>

          <Box justify="center">
            <Button
              id="addButton weight/bloodsugar"
              variant="contained"
              color="primary"
              onClick={(ev) => submitForm(ev)}
              disabled={props.inProgress || open}
              className={classes.submit}
            >
              {' '}
              Spara
            </Button>
          </Box>
        </Grid>
      </Paper>
    </div>
  )
}

const styles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#72AAC9',
  },
  form: {
    width: '50%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(4),
  },
  backGround: {
    marginTop: '-3%',
    background: '#72AAC9',
    height: '100%',
    width: '100%',
  },
  lowerBG: {
    background: 'rgb(250, 250, 250)',
    borderRadius: '3vmax 3vmax 0% 0%',
    marginTop: '-2%',
    position: 'relative',
    borderTop: '1px solid #c3bebe',
  },
  bubble: {
    border: '3px solid #64B4EA',
    margin: theme.spacing(3),
    borderRadius: '2vmin',
    zIndex: '0',
  },
  circle: {
    height: '60px',
    width: '50px',
    borderRadius: '50%',
    background: '#43A4E7',
    border: '3px solid #fff',
    margin: theme.spacing(0.5),
    boxShadow: theme.shadows[3],
  },
  circleAvatar: {
    width: '70%',
    height: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'absolute',
    bottom: '0',
  },
  inputText: {
    color: theme.palette.text.primary,
    marginTop: '3%',
  },
  bubbleText: {
    color: theme.palette.text.primary,
    position: 'absolute',
    top: '17vh',
    left: '48vw',
    fontSize: '130%',
  },
  centerIcon: {
    width: '100%',
    maxWidth: '70vh',
    minwidth: '40vh',
  },
}))

export function getCurrentDate() {
  const today = new Date()
  const todaysDate = `${String(today.getFullYear())}-${String(today.getMonth())}-${String(today.getDate())} ${String(
    today.getHours(),
  )}:${String(today.getMinutes())}`
  return todaysDate
}

export function setTimer() {
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

export default connect(mapStateToProps, mapDispatchToProps)(AddVal)
