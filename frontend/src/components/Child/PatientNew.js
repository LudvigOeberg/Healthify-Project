import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Box, Container, Grid, Button} from '@material-ui/core'
import {
  PATIENT_PAGE_UNLOADED,
  FIELD_CHANGE,
  UPDATE_BOOLEAN,
  LOAD_PARTY,
  SAVE_BLOODSUGAR,
  LOAD_BLOODSUGAR,
  SAVE_TIMER,
} from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import agent from '../../agent'
import Slider from '@material-ui/core/Slider'
import Input from '@material-ui/core/Input'
import happyAvatar from '../../Static/happy_avatar.png'
import sadAvatar from '../../Static/sad_avatar.png'
//import normalAvatar from '../../Static/normal_avatar.png'

const mapStateToProps = (state) => ({
  ...state.ehr,
  currentUser: state.common.currentUser,
  bloodsugarValue: state.common.bloodsugar,
  historicalBloodSugar: state.ehr.bloodsugar,
})

const mapDispatchToProps = (dispatch) => ({
  onChangeAuth: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
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
  onUnload: () => dispatch({ type: PATIENT_PAGE_UNLOADED }),
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) })

    dispatch({ type: LOAD_BLOODSUGAR, payload: agentEHR.Query.bloodsugar(ehrId, 0, 20) })
  },
  onOpenSnackbar: (value) => dispatch({ type: UPDATE_BOOLEAN, key: 'snackbarOpen', value }),
})

class PatientNew extends Component {
  constructor() {
    super()
    this.changeAuth = (ev) => this.props.onChangeAuth(ev.target.id, ev.target.value)

    this.changeAuthSlider = (ev, value) => this.props.onChangeAuth(ev.target.id, value)
    this.submitForm = (ev) => {
      ev.preventDefault()

      const bloodsugar = this.props.bloodsugarValue
      let { timer } = this.props.currentUser

      // These are implemented as encouraging that depends on if it's a
      // measurement that's new or if it's taken after a bad one.
      let snackbar = {
        open: true,
        // message: `Du loggade värdet: ${bloodsugar} mmol/L.` Keeping it just in cause.
        message: `Ditt värde på ${bloodsugar} mmol/L ser jättebra ut! -Att hålla koll på ditt blodsockervärde är ett bra sätt att hålla en bra hälsa. `,
        color: 'success',
      }
      if (timer !== null) {
        snackbar = {
          open: true,
          message: `Bra jobbat! Hoppas att du mår bra!`,
          color: 'success',
        }
      }

      // IF'statements that gives a feedback on a bad value.
      if (bloodsugar > 8) {
        // Change the 8 to whatever the upper max-level should be. Same with the 4 below.
        if (timer === null) {
          timer = setTimer()
        } else {
          timer = this.props.currentUser.timer
        }
        snackbar = {
          open: true,
          message: `Du verkar ha loggat högt blodsockervärde! Ät något och gör en ny mätning inom en timme.`,
          color: 'error',
        }
      }
      if (bloodsugar < 4) {
        if (this.props.currentUser.timer === null) {
          // If and If else= The timer does not reset until a good value is entered. Can be removed.
          timer = setTimer()
        } else {
          timer = this.props.currentUser.timer
        }
        snackbar = {
          open: true,
          message: `Du verkar ha loggat lågt blodsockervärde, Kanske dags för lite insulin och gör en ny mätning inom en timme.`,
          color: 'error',
        }
      }
      if (bloodsugar >= 4 && bloodsugar <= 8) {
        timer = null
      }

      this.props.onSubmit(this.props.currentUser.ehrid, bloodsugar, snackbar, timer)
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
        value: 2,
        label: '5 mmol/L',
      },
      {
        value: 10,
        label: '10 mmol/L',
      },
    ]
    
    const bloodsugar = this.props.bloodsugarValue
    const { classes } = this.props
     
    let Avatar = happyAvatar //There is also a normal avatar to use, if anyone find a good statement when to use it. 

     if (this.props.historicalBloodSugar !== null && this.props.historicalBloodSugar !== undefined) {
       if (this.props.historicalBloodSugar[0].value < 4 || this.props.historicalBloodSugar[0].value > 8) {
         Avatar = sadAvatar
       } else {
         Avatar = happyAvatar
       }
     }

return (
    <Container maxWidth="" className={classes.backGround} >
        <Grid item xs={12}>
            <Box className={classes.avatar} textAlign="center"> 
                <img  src={Avatar} alt="mood avatar"></img>
            </Box>  
        </Grid>
          <Grid container spacing={5} alignItems="center">
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
                max={10}
                min={2}
              />
            </Grid>
            {/* Temporary input until the plus-button at the bottom is implemented. */}
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
                  min: 2,
                  max: 10,
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
                onClick={(ev) => this.submitForm(ev)}
                disabled={this.props.inProgress}
              >
                {' '}
                Submit
              </Button>
            </Grid>
          </Grid>
    </Container>
  )
}
}

const styles = (theme) => ({
paper: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
},
backGround: {
  position: 'absolute',
  padding: '45% 10% 28%',
  background: 'rgb(118,176,208)',
  background: 'linear-gradient(0deg, rgba(118,176,208,1) 35%, rgba(106,161,191,1) 36%, rgba(125,180,213,1) 86%)',
  marginTop: '-3%', //Removes a small white space at the top.
},
avatar: {
  position: 'relative',
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PatientNew))
  