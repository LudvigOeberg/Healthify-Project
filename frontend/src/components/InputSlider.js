import React from 'react';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import { FormControl, FormHelperText, InputLabel, InputAdornment} from '@material-ui/core/';
import { connect } from 'react-redux'
import { FIELD_CHANGE } from '../constants/actionTypes';


const mapStateToProps = (state) => ({
  ...state.common,

})

const mapDispatchToProps = (dispatch) => ({
  onChange: (key,value) => {dispatch({ type: FIELD_CHANGE, key, value })},

})
 function InputSlider(props) {
  const { unit, step, min, max, id, output, definition} = props;
  //const [value, setValue] = React.useState(output);
  //const onChange = (ev) => props.onChange(id, ev.target.value)
  const handleOffset = (val) => props.onChange(id, val)
 

  

  const handleSliderChange = (event, newValue) => {
    props.onChange(id, newValue);
  };

  const handleInputChange = (event) => {
    props.onChange(id, event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (output < min && typeof goalweight === 'number') {
      handleOffset(min);
    } else if (output > max) {
      handleOffset(max);
    }
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={8} md={9}>
          <Slider
            value={typeof output === 'number' ? output : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            step={step}
            min={min}
            max= {max}
          />
        </Grid>
        <Grid item xs={4} md={3}>
          <FormControl
            fullWidth
            
          >
          <InputLabel id={`${unit}-label`} shrink={typeof output === 'number' ? true: false}>{definition}</InputLabel>
          <Input
            endAdornment={<InputAdornment position="end">{unit}</InputAdornment>}
            fullWidth
            id={`${unit}`}
            value={output}
            labelId={`${unit}-label`}
            label={`${unit}`}
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
          <FormHelperText id={`${unit}`}>{`I heltal mellan ${min} och ${max} `}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(InputSlider)

