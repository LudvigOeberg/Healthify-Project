import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
// import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
// import Input from '@material-ui/core/Input'
// import VolumeUp from '@material-ui/icons/VolumeUp'

const useStyles = makeStyles({
  root: {
    width: 250,
  },
  input: {
    width: 42,
  },
})

let val

export function getValue() {
  return val
}

export default function MySlider() {
  const classes = useStyles()
  const [value, setValue] = React.useState(2)

  const handleSliderChange = (event, newValue) => {
    setValue(newValue)
    // eslint-disable-next-line react/no-this-in-sfc

    // eslint-disable-next-line no-console
    console.log(value)

    if (value == null || value === undefined) {
      // eslint-disable-next-line react/no-this-in-sfc
      this.val = value
    }
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={2} alignItems="center">
        <Grid item></Grid>
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <h1>{value}</h1>
        </Grid>
      </Grid>
    </div>
  )
}
