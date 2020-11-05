import React from 'react'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import { Typography } from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Button from '@material-ui/core/Button';


const marks = [
  {
    value: 4,
    label: '4° mmol/L',
  },
  {
    value: 15,
    label: '15 mmol/L',
  },
];

function valuetext(value) {
  return `${value} mmol/L`;
}
export default function InputSlider() {
  const classes = useStyles();
  const [value, setValue] = React.useState(10);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 3) {
      setValue(3);
    } else if (value > 20) {
      setValue(20);
    }
  };

  return (
    <Container className={classes.paper} component={Paper}>
      <div className={classes.paper}>
        <h1> Lägg in ditt mätvärde</h1>
      <Typography id="input-slider" gutterBottom>
        mmol/L
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            defaultValue={10}
            getAriaValueText={valuetext}
            step={1}
            valueLabelDisplay="auto"
            marks={marks}
            max = {15}
            min = {5}
          />
        </Grid>
        <Grid item>
          <Input
            defaultValue={15}
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 3,
              max: 15,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
          <h5> mmol/L </h5>
        </Grid>
      </Grid>
      <Button
        className={classes.button}
        startIcon={<CheckBoxIcon/>}
        onClick = {(ev) => this.submitForm(ev)}
      >
      </Button>
    </div>
    </Container>
  );
}


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}))
