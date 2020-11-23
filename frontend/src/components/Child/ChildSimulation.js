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
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Box from '@material-ui/core/Box'

import MyDialog from '../MyDialog'
import { LOAD_BLOODSUGAR, LOAD_PARTY, LOAD_WEIGHT } from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'

/**
 * Page where the child may run a simulation of how they will feel if they eat something.
 * Right now: Bases the simulation of the type of meal and the latest recorded bloodsugar value (not the meal size).
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

const ChildSimulation = (props) => {
  const id = props.currentUser.ehrid
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  let { bloodsugar } = props

  if (bloodsugar !== undefined) {
    bloodsugar = bloodsugar[0].value
  }

  // eslint-disable-next-line no-console
  console.log(bloodsugar)

  // eslint-disable-next-line no-console
  console.log(disease)

  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 1, disease)
  }, [id, disease]); // eslint-disable-line

  const date = getCurrentDate()

  const [Meal_type, setMeal] = React.useState('Måltid')
  const handleChange = (event) => {
    props.onLoad(props.currentUser.ehrid)
    setMeal(event.target.value)
  }

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
    // eslint-disable-next-line no-console
    console.log(`in getDialogInfo - bloodsugar: ${bloodsugar}`)
    if (bloodsugar < lowBloodsugarValue) {
      if (Meal_type === 'Snack') {
        return badDialogInfo
      }
      if (Meal_type === 'Mellanmål') {
        return goodDialogInfo
      }
      if (Meal_type === 'Måltid') {
        return goodDialogInfo
      }
    }
    if (bloodsugar > highBloodsugarValue) {
      if (Meal_type === 'Snack') {
        return neutralDialogInfo
      }
      return badDialogInfo
    }
    if (Meal_type === 'Snack') {
      return goodDialogInfo
    }
    if (Meal_type === 'Mellanmål') {
      return neutralDialogInfo
    }
    return badDialogInfo
  }

  return (
    <Container className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card className={classes.card}>
            <Grid item xs={8}>
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
                {Meal_type}
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
        <Grid item xs={12}>
          <Box textAlign="center">
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">Måltid</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={Meal_type}
                onChange={handleChange}
                label="Meal_size"
              >
                <MenuItem value="Måltid">Måltid</MenuItem>
                <MenuItem value="Snack">Snack</MenuItem>
                <MenuItem value="Mellanmål">Mellanmål</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Button component={Link} href="/child-laboration" variant="outlined" color="primary" fullWidth>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChildSimulation)
