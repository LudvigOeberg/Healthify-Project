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
import Input from '@material-ui/core/Input'

import MyDialog from '../MyDialog'
import { LOAD_BLOODSUGAR, LOAD_PARTY, LOAD_WEIGHT } from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'

/**
 * Page where the child may run a simulation of how long it will take to reach their goal weight if they do a certain amount of workouts per week.
 * Right now: Bases the simulation on
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
  input: {
    width: '48px',
    fontSize: '3em',
  },
  numberText: {
    color: theme.palette.text.disabled,
  },
}))

const ChildSimulationObesity = (props) => {
  const id = props.currentUser.ehrid
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  const { weight } = props

  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 1, disease)
  }, [id, disease]); // eslint-disable-line

  const date = getCurrentDate()

  const [workouts, setValue] = React.useState(2)
  const handleSliderChange = (event, newValue) => {
    props.onLoad(props.currentUser.ehrid)
    setValue(newValue)
  }

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value))
  }

  const handleBlur = () => {
    if (workouts < 0) {
      setValue(0)
    } else if (workouts > 100) {
      setValue(100)
    }
  }

  let info

  const goodDialogInfo = [
    'Simulera',
    'Simulation',
    'Fortsätter du så här kommer det att ta REPLACE att nå ditt mål!',
    '',
    'training avatar',
  ]

  const encouragingDialogInfo = [
    'Simulera',
    'Simulation',
    'Om du tränar så här lite kommer det ta lång tid att nu ditt mål, försök att träna mer så är inget omöjligt!',
    '',
    'running avatar',
  ]

  const classes = useStyles()

  function getCurrentDate() {
    const today = new Date()
    const todaysDate = `${String(today.getFullYear())}-${String(today.getMonth())}-${String(today.getDate())}`
    return todaysDate
  }

  // This is the function that calculates
  // the number of weeks it will take for the person
  // to reach their goal weight.
  function getWeeksNumber() {
    let currentWeight
    if (weight !== undefined) {
      currentWeight = weight[0].weight
    }
    const weightGoal = 0.7 * currentWeight

    const w = Math.floor((currentWeight - weightGoal) / workouts) * 2
    return w
  }

  function getWeeks() {
    const w = getWeeksNumber()
    return `${w} veckor`
  }

  function getDialogInfo() {
    if (getWeeksNumber() > 0) {
      return goodDialogInfo
    }
    return encouragingDialogInfo
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
            <Grid item xs={12}>
              <Typography variant="overline" display="block" gutterBottom>
                {date}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" className={classes.diet} gutterBottom>
                Träning
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" className={classes.eatText} gutterBottom>
                Antal träningspass per vecka
              </Typography>
            </Grid>
            <Grid container xs={12} spacing={5} alignItems="center">
              <Grid item xs={9}>
                <Slider value={workouts} defaultValue={2} step={1} min={1} max={7} onChange={handleSliderChange} />
              </Grid>
              <Grid item xs={3}>
                <Input
                  className={classes.input}
                  value={workouts}
                  margin="dense"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                <Typography variant="body2" className={classes.numberText} gutterBottom>
                  stycken
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Button
            id="obesitySimulationBackButton"
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
            weeks={getWeeks()}
          ></MyDialog>
        </Grid>
      </Grid>
    </Container>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ChildSimulationObesity)
