import React from 'react';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import { connect } from 'react-redux'
import { FIELD_CHANGE } from '../constants/actionTypes';


const mapStateToProps = (state) => ({
  ...state.common,

})

const mapDispatchToProps = (dispatch) => ({
  onChange: (key,value) => {dispatch({ type: FIELD_CHANGE, key, value })},

})
 function InputSlider(props) {
  const { unit, step, min, max, id, output} = props;
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
    if (output < min) {
      handleOffset(min);
    } else if (output > max) {
      handleOffset(max);
    }
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={10}>
          <Slider
            value={output}
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
            value={output}
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

export default connect(mapStateToProps, mapDispatchToProps)(InputSlider)

