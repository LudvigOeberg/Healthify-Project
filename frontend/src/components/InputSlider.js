import React from 'react'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import Input from '@material-ui/core/Input'
import { FormControl, FormHelperText, InputLabel, InputAdornment } from '@material-ui/core/'
import { connect } from 'react-redux'
import { FIELD_CHANGE } from '../constants/actionTypes'

/**
 * A slider with an input box to the right, these two are displaying the same value
 * @param {unit} unit the unit of the input
 * @param {step} step the stepsize of both the input box and slider
 * @param {min} min the min value of the input
 * @param {max} max the max value of the input
 * @param {id} id id of the input
 * @param {input} input the variable that is the input
 * @param {definition} definition a definition of what the input is
 *
 */

const mapStateToProps = (state) => ({
  ...state.common,
})

const mapDispatchToProps = (dispatch) => ({
  onChange: (key, value) => {
    dispatch({ type: FIELD_CHANGE, key, value })
  },
})
function InputSlider(props) {
  const { unit, step, min, max, id, input, definition } = props
  // const [value, setValue] = React.useState(output);
  // const onChange = (ev) => props.onChange(id, ev.target.value)
  const handleOffset = (val) => props.onChange(id, val)

  const handleSliderChange = (event, newValue) => {
    props.onChange(id, newValue)
  }

  const handleInputChange = (event) => {
    props.onChange(id, event.target.value === '' ? '' : Number(event.target.value))
  }

  const handleBlur = () => {
    if (input < min && typeof goalweight === 'number') {
      handleOffset(min)
    } else if (input > max) {
      handleOffset(max)
    }
  }

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={8} md={9}>
          <Slider
            value={typeof input === 'number' ? input : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            step={step}
            min={min}
            max={max}
            id={id}
          />
        </Grid>
        <Grid item xs={4} md={3}>
          <FormControl fullWidth>
            <InputLabel id={`${id}-label`} shrink={typeof input === 'number'}>
              {definition}
            </InputLabel>
            <Input
              endAdornment={<InputAdornment position="end">{unit}</InputAdornment>}
              fullWidth
              id={`${id}`}
              value={input}
              labelId={`${id}-label`}
              label={`${unit}`}
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step,
                min,
                max,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
            <FormHelperText id={`${id}`}>{`I heltal mellan ${min} och ${max} `}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(InputSlider)
