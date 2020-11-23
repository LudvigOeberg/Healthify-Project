/* eslint-disable camelcase */
/* eslint-disable no-return-assign */
// import React, { useState, useEffect } from 'react'
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
 * Page where the child may run a simulation of how they will feel if they eat something
 * Right now: Eating something of the portion size "Mellan" will show a good result,
 * other portion sizes will show a bad result.
 */

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
})

const mapDispatchToProps = (dispatch) => ({
  // onLoad: (ehrId) => {
  //   dispatch({ type: LOAD_BLOODSUGAR, payload: agentEHR.Query.bloodsugar(ehrId, 0, 1) })
  // },
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) })
  },
  loadValues: (ehrId, offset, limit, disease) => {
    // eslint-disable-next-line no-console
    console.log('loadValues')
    // eslint-disable-next-line no-console
    console.log(`disease ${disease}`)
    if (disease === 'DIABETES') {
      // eslint-disable-next-line no-console
      console.log('diabetes')
      dispatch({
        type: LOAD_BLOODSUGAR,
        payload: agentEHR.Query.bloodsugar(ehrId, offset, limit),
      })
    } else if (disease === 'OBESITY') {
      // eslint-disable-next-line no-console
      console.log('obesity')
      dispatch({
        type: LOAD_WEIGHT,
        payload: agentEHR.Query.weight(ehrId, limit),
      })
    }
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

// eslint-disable-next-line prefer-const
// let bloodsugar = null

// eslint-disable-next-line no-unused-vars
const ChildSimulation = (props) => {
  const { id } = props.match.params
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  const { bloodsugar } = props
  // const { weight } = props
  // const bloodsugar = props.ehr.bloodsugar[0].value
  // const [count, setCount] = useState(0)
  // const [bloodsugar, setBloodsugar] = useState(props.bloogsugar.bloodsugar[0].value)

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    // document.title = `You clicked ${count} times`
    props.onLoad(id)
    props.loadValues(id, 0, 3, disease)
    }, [id, disease]) // eslint-disable-line
  

  // const { bloodsugar } = props
  //  let bloodsugarValue
  const date = getCurrentDate()

  const handleLoad = () => {
    // eslint-disable-next-line no-console
    console.log(bloodsugar)
    if (bloodsugar === null) {
      // props.onLoad(props.currentUser.ehrid)
      // bloodsugar = props.ehr.bloodsugar.bloodsugar[0].value
    }
  }

  const [Meal_type, setMeal] = React.useState('Måltid')
  const handleChange = (event) => {
    props.onLoad(props.currentUser.ehrid)
    // eslint-disable-next-line no-console
    // console.log(`bsValue: ${bloodsugar[0].value}`)
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

  const classes = useStyles()

  function getCurrentDate() {
    const today = new Date()
    const todaysDate = `${String(today.getFullYear())}-${String(today.getMonth())}-${String(today.getDate())}`
    return todaysDate
  }

  function getDialogInfo() {
    // eslint-disable-next-line no-console
    // console.log(`Meal_type: ${Meal_type}`)
    if (Meal_size === 1) {
      if (Meal_type === 'Måltid') {
        if (bloodsugar === 7) {
          return neutralDialogInfo
        }
      }

      return goodDialogInfo
    }
    return badDialogInfo
  }
  return (
    <Container className={classes.root}>
      {/* {(window.onload = props.onLoad(props.currentUser.ehrid))} */}
      {handleLoad()}
      {/* {(window.onload = setBloodsugar())} */}
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
