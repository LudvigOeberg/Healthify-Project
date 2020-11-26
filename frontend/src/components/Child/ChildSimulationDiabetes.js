/* eslint-disable camelcase */
/* eslint-disable no-return-assign */
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import Slider from '@material-ui/core/Slider'

import MyDialog from '../MyDialog'
import { LOAD_BLOODSUGAR, LOAD_PARTY, LOAD_WEIGHT } from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'

/**
 * Page where the child may run a simulation of how they will feel if they eat something.
 * Right now: Bases the simulation of the size of the meal and the latest recorded bloodsugar value.
 */

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
})

const mapDispatchToProps = (dispatch) => ({
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

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing(8),
    alignItems: 'top',
    padding: theme.spacing(2),
  },
  card: {
    minWidth: 328,
    padding: 30,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  diet: {
    textAlign: 'left',
  },
  buttons: {
    marginTop: theme.spacing(2),
  },
  eatText: {
    color: theme.palette.text.disabled,
  },
  title: {
    color: theme.palette.text.primary,
  },
}))

const ChildSimulationDiabetes = (props) => {
  const id = props.currentUser.ehrid
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  let { bloodsugar } = props

  if (bloodsugar !== undefined) {
    bloodsugar = bloodsugar[0].value
  }

  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 1, disease)
  }, [id, disease]); // eslint-disable-line

  const date = getCurrentDate()

  const [Meal_size, setValue] = React.useState(2)
  const handleSliderChange = (event, newValue) => {
    props.onLoad(props.currentUser.ehrid)
    setValue(newValue)
  }

  const marks = [
    {
      value: 1,
      label: 'Lite',
    },
    {
      value: 2,
      label: 'Mellan',
    },
    {
      value: 3,
      label: 'Mycket',
    },
  ]

  let info

  const badDialogInfo = [
    'Simulera',
    'Simulation',
    'Du kommer att må sämre om du äter detta.',
    '../Static/sad_avatar.png',
    'sad avatar',
  ]

  const goodDialogInfo = [
    'Simulera',
    'Simulation',
    'Du kommer att må bättre om du äter detta!',
    '../Static/happy_avatar.png',
    'happy avatar',
  ]

  const neutralDialogInfo = [
    'Simulera',
    'Simulation',
    'Ditt mående kommer inte att förändras om du äter detta!',
    '../Static/neutral_avatar.png',
    'neutral avatar',
  ]

  const lowBloodsugarValue = 4
  const highBloodsugarValue = 10

  const classes = useStyles()

  function getCurrentDate() {
    const today = new Date()
    const todaysDate = `${String(today.getFullYear())}-${String(today.getMonth())}-${String(today.getDate())}`
    return todaysDate
  }

  function getDialogInfo() {
    if (bloodsugar < lowBloodsugarValue) {
      if (Meal_size === 1) {
        return badDialogInfo
      }
      if (Meal_size === 2) {
        return goodDialogInfo
      }
      if (Meal_size === 3) {
        return goodDialogInfo
      }
    }
    if (bloodsugar > highBloodsugarValue) {
      if (Meal_size === 1) {
        return neutralDialogInfo
      }
      return badDialogInfo
    }
    if (Meal_size === 1) {
      return goodDialogInfo
    }
    if (Meal_size === 2) {
      return neutralDialogInfo
    }
    return badDialogInfo
  }

  return (
    <Container className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card className={classes.card}>
            <Grid item xs={12}>
              <Typography variant="h4" className={classes.title} color="textSecondary" gutterBottom>
                Ny simulering
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="overline" display="block" gutterBottom>
                {date}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body1" className={classes.diet} gutterBottom>
                Måltid
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="subtitle1" className={classes.eatText} gutterBottom>
                Hur mycket vill du äta?
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Slider
                value={Meal_size}
                defaultValue={2}
                step={1}
                marks={marks}
                min={1}
                max={3}
                onChange={handleSliderChange}
              />
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Button
            id="diabetesSimulationBackButton"
            component={Link}
            href="/child-laboration"
            variant="outlined"
            color="primary"
            fullWidth
          >
            {' '}
            Tillbaka
          </Button>{' '}
        </Grid>
        <Grid item xs={6}>
          <MyDialog
            {...(info = getDialogInfo())}
            buttonLabel={info[0]}
            title={info[1]}
            text={info[2]}
            pictureLocation={info[3]}
            alt={info[4]}
          ></MyDialog>
        </Grid>
      </Grid>
    </Container>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ChildSimulationDiabetes)
