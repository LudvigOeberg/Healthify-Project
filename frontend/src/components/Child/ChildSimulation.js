/* eslint-disable no-return-assign */
import React from 'react'
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

import MyDialog from '../MyDialog'

const mapStateToProps = (state) => ({
  ...state.common,
})

const mapDispatchToProps = () => ({})

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing(8),
    alignItems: 'top',
    padding: theme.spacing(1),
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

const ChildSimulation = () => {
  const date = getCurrentDate()

  const [meal, setMeal] = React.useState('Måltid')

  const handleChange = (event) => {
    setMeal(event.target.value)
  }

  const [value, setValue] = React.useState(2)

  const handleSliderChange = (event, newValue) => {
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

  // eslint-disable-next-line prefer-const
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

  const classes = useStyles()

  function getCurrentDate() {
    const today = new Date()
    const todaysDate = `${String(today.getFullYear())}-${String(today.getMonth())}-${String(today.getDate())}`
    return todaysDate
  }

  function getDialogInfo() {
    if (value === 2) {
      return goodDialogInfo
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
                {meal}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="subtitle1" className={classes.eatText} gutterBottom>
                Hur mycket vill du äta?
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Slider
                value={value}
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
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Måltid</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={meal}
              onChange={handleChange}
              label="Meal"
            >
              <MenuItem value="Måltid">Måltid</MenuItem>
              <MenuItem value="Snack">Snack</MenuItem>
              <MenuItem value="Mellanmål">Mellanmål</MenuItem>
            </Select>
          </FormControl>
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
