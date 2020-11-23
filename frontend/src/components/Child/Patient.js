 import React, { useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Box, Container, Grid, Button, Typography} from '@material-ui/core'
import {
  PATIENT_PAGE_UNLOADED,
  FIELD_CHANGE,
  UPDATE_BOOLEAN,
  LOAD_PARTY,
  SAVE_BLOODSUGAR,
  LOAD_BLOODSUGAR,
  SAVE_TIMER,
  LOAD_WEIGHT, 
} from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import agent from '../../agent'
//import Slider from '@material-ui/core/Slider'
//import Input from '@material-ui/core/Input'
//import happyAvatar from '../../Static/happy_avatar.png'
//import sadAvatar from '../../Static/sad_avatar.png'
import normalAvatar from '../../Static/normal_avatar.png'
import Moment from 'moment'
import Reformat from '../../reformatEHRData'
import { makeStyles } from '@material-ui/core/styles'


const mapStateToProps = (state) => ({
  ...state.common,
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

  loadValues: (ehrId, offset, limit, disease) => {
    if (disease === 'DIABETES')
      dispatch({ type: LOAD_BLOODSUGAR, payload: agentEHR.Query.bloodsugar(ehrId, offset, limit) })
    else if (disease === 'OBESITY') dispatch({ type: LOAD_WEIGHT, payload: agentEHR.Query.weight(ehrId, limit) })
  },
})

const getIndication = (data) => {
  if (data > 0 && data < 4) {
    return 'Lågt'
  }
  if (data > 9) {
    return 'Högt'
  }

  return 'Stabilt'
}



const Patient = (props) => {

  const { id } = props.match.params
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  const colDesc = [
    'Datum',
    `Värde ${disease === 'DIABETES' ? '(mmol/L)' : '(vikt i kg)'}`,
    `${disease === 'DIABETES' ? 'Blodsocker' : 'Viktklass'}`,
  ]
  const classes = styles()
  const { bloodsugar } = props
  const { weight } = props
  const loading = props.inProgress
  const age = props.party ? `${Moment().diff(props.party[id].dateOfBirth, 'years')} år` : null
  const name = props.party ? `${props.party[id].firstNames} ${props.party[id].lastNames}` : null
  const input = bloodsugar || weight
  
  
  const reformatForChart = (data) => {
    if (bloodsugar) return Reformat.bloodsugar(data, false, true)
    if (weight) return Reformat.weight(data, false, true)
    return null
  }

  const reformat = (data) => {
    const dataObjects = []
    for (let i = 0; i < data.length; i++) {
      dataObjects.push({
        time: new Date(data[i].time.substring(0, 16)).toLocaleString(),
        value: disease === 'DIABETES' ? data[i].value : data[i].weight,
        indicator: getIndication(disease === 'DIABETES' ? data[i].value : data[i].weight),
      })
    }
    return dataObjects
  }

  

  // componentWillUnmount() {
  //   this.props.onUnload()
  // }

  // componentDidMount() {
  //   this.props.onLoad(this.props.currentUser.ehrid)
  // }

  let Avatar = normalAvatar 

  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 3, disease)
    }, [id, disease]) // eslint-disable-line

return (
    <Container maxWidth="" className={classes.backGround} >
        <Grid item xs={12}>
            <Box className={classes.avatar} textAlign="center"> 
                <img  src={Avatar} alt="mood avatar"></img>
            </Box>  
        </Grid>
        <Typography variant="subtitle1">{disease === 'DIABETES' ? 'Diabetes' : 'Fetma'}</Typography>
    </Container>
  )
}


const styles = makeStyles((theme) => ({
paper: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
},
backGround: {
  position: 'absolute',
  padding: '45% 10% 28%',
  background: 'linear-gradient(0deg, rgba(118,176,208,1) 37%, rgba(106,161,191,1) 38%, rgba(125,180,213,1) 86%)',
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
}))


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
  
  export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Patient))
  