import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';


export default function InputSlider(props) {
  const { unit, step, min, max} = props;
  const [value, setValue] = React.useState(null);
  
  

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < min) {
      setValue(min);
    } else if (value > max) {
      setValue(max);
    }
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={10}>
          <Slider
            value={typeof value === 'number' ? value : null}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            step={step}
            min={min}
            max= {max}
          />
        </Grid>
        <Grid item xs={2}>
          <Input
            fullWidth
            value={value}
            margin="dense"
            placeholder= {unit}
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: step,
              min: min,
              max: max,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
            
          />
        </Grid>
      </Grid>
    </div>
  );
}



