import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Box, Container, Typography, Icon, Paper } from '@material-ui/core'
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined'
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import TrendingDownIcon from '@material-ui/icons/TrendingDown'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
import agentEHR from '../../agentEHR'
import {
  FIELD_CHANGE,
  LOAD_PARTY,
  LOAD_WEIGHT,
  LOAD_BLOODSUGAR,
  PATIENT_PAGE_UNLOADED,
} from '../../constants/actionTypes'
import normalAvatar from '../../Static/normal_avatar.png'
import happyAvatar from '../../Static/happy_avatar.png'
import sadAvatar from '../../Static/sad_avatar.png'
import { setTimer } from './AddVal'

/**
 * The starting page for the child. Showing their avatar, whichs displays their current mood.
 * Displays an information-bubble showing their latest measurement value,
 * how long time ago that measure was taken and if that was a good, neutral or bad measurement.
 */

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
})

const mapDispatchToProps = (dispatch) => ({
  onChangeAuth: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onUnload: () => dispatch({ type: PATIENT_PAGE_UNLOADED }),
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) })

    dispatch({
      type: LOAD_BLOODSUGAR,
      payload: agentEHR.Query.bloodsugar(ehrId, 0, 20),
    })
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

const Patient = (props) => {
  const id = props.currentUser.ehrid
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  const SU_LO = props.party ? `${props.party[id].additionalInfo.SU_LO}` : null
  const SU_HI = props.party ? `${props.party[id].additionalInfo.SU_HI}` : null

  const weight = props.weight ? props.weight : null
  const bloodsugar = props.bloodsugar ? props.bloodsugar : null

  const badBloodsugar = !!(
    bloodsugar &&
    disease === 'DIABETES' &&
    bloodsugar &&
    (bloodsugar[0].value < SU_LO || bloodsugar[0].value > SU_HI)
  )
  const badWeight = !!(weight && disease === 'OBESITY' && weight && weight[1] && weight[1].weight < weight[0].weight)
  const oneOrSameWeight = !(
    weight &&
    disease === 'OBESITY' &&
    weight &&
    weight[1] &&
    weight[1].weight &&
    weight[1].weight !== weight[0].weight
  )

  const classes = styles()

  let Avatar = normalAvatar

  if (
    (disease === 'DIABETES' ? bloodsugar !== null : weight !== null) &&
    (disease === 'DIABETES' ? SU_LO !== undefined : weight !== undefined)
  ) {
    if (disease === 'DIABETES' ? bloodsugar[0] !== undefined : weight[0] !== undefined) {
      if (
        (disease === 'DIABETES' ? bloodsugar[0].value < SU_LO : weight[0].weight < 0) ||
        (disease === 'DIABETES' ? bloodsugar[0].value > SU_HI : weight[0].weight > 70)
      ) {
        Avatar = sadAvatar
      } else {
        Avatar = happyAvatar
      }
      if ((disease === 'DIABETES' ? bloodsugar[0].time : weight[0].time) < setTimer()) {
        // Might not work
        Avatar = normalAvatar
      }
    }
  }

  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 20, disease)
  }, [id, disease]); // eslint-disable-line

  function getMeasurementValue() {
    if (disease === 'DIABETES') {
      if (bloodsugar !== undefined) {
        if (bloodsugar !== null) {
          return bloodsugar[0].value
        }
      }
    }
    if (disease === 'OBESITY') {
      if (weight !== undefined) {
        if (weight !== null) {
          if (weight[0] !== undefined) {
            return weight[0].weight
          }
        }
      }
    }
    return `Ø`
  }

  function getMeasurementUnit() {
    if (disease === 'DIABETES') {
      return 'mmol/L'
    }
    return 'kg'
  }

  function getMeasurementTime() {
    const t = new Date()

    if (disease === 'DIABETES') {
      if (bloodsugar !== undefined) {
        if (bloodsugar !== null) {
          const n = new Date(bloodsugar[0].time)
          const difference = t.getTime() - n.getTime()
          const diffHours = Math.floor(difference / (1000 * 3600))

          return `${diffHours} timmar sedan`
        }
      }
    }
    if (disease === 'OBESITY') {
      if (weight !== undefined) {
        if (weight !== null) {
          if (weight[0] !== undefined) {
            const n = new Date(weight[0].time)
            const difference = t.getTime() - n.getTime()
            const diffDays = Math.floor(difference / (1000 * 3600 * 24))

            return `${diffDays} dagar sedan`
          }
        }
      }
    }
    return 'Inget mätvärde'
  }

  return (
    <Container maxWidth="" className={classes.backGround}>
      <Container maxWidht="sm">
        <Grid item xs={12}>
          <Box textAlign="center">
            <img id="currentMood" className={classes.avatar} src={Avatar} alt="mood avatar"></img>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.bubble}>
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid item xs={7}>
                <Grid container direction="row" justify="center" alignItems="center">
                  <Grid item xs={3}>
                    <Icon>
                      <Paper hidden={(disease === 'DIABETES' && badBloodsugar) || disease === 'OBESITY'} elevation={0}>
                        <ThumbUpAltOutlinedIcon style={{ color: 'green' }} />
                      </Paper>
                      <Paper hidden={(disease === 'DIABETES' && !badBloodsugar) || disease === 'OBESITY'} elevation={0}>
                        <ThumbDownAltOutlinedIcon style={{ color: 'red' }} />
                      </Paper>
                      <Paper
                        hidden={
                          (disease === 'OBESITY' && badWeight) ||
                          (disease === 'OBESITY' && oneOrSameWeight) ||
                          disease === 'DIABETES'
                        }
                        elevation={0}
                      >
                        <TrendingDownIcon style={{ color: 'green' }} />
                      </Paper>
                      <Paper
                        hidden={(disease === 'OBESITY' && !oneOrSameWeight) || disease === 'DIABETES'}
                        elevation={0}
                      >
                        <ArrowRightAltIcon style={{ color: 'gray' }} />
                      </Paper>
                      <Paper
                        hidden={
                          (disease === 'OBESITY' && !badWeight) ||
                          (disease === 'OBESITY' && oneOrSameWeight) ||
                          disease === 'DIABETES'
                        }
                        elevation={0}
                      >
                        <TrendingUpIcon style={{ color: 'red' }} />
                      </Paper>
                    </Icon>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6">{getMeasurementValue()}</Typography>
                  </Grid>
                  <Grid item xs={4.5}>
                    <Typography variant="body1">{getMeasurementUnit()}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={5}>
                <Typography className={classes.disabled} variant="body1">
                  {getMeasurementTime()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Container>
    </Container>
  )
}

const styles = makeStyles((theme) => ({
  backGround: {
    position: 'absolute',
    padding: '10% 5% 10%',
    background: 'linear-gradient(0deg, rgba(118,176,208,1) 40%, rgba(106,161,191,1) 41%, rgba(125,180,213,1) 86%)',
    marginTop: '-3%', // Removes a small white space at the top.
    minHeight: '100vh',
  },
  avatar: {
    position: 'relative',
  },
  bubble: {
    marginTop: '5vh',
    boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
    borderRadius: '10px',
    border: '2px solid #64B4EA',
  },
  disabled: {
    color: theme.palette.text.disabled,
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

export default connect(mapStateToProps, mapDispatchToProps)(Patient)
