import { Grid, Paper, Typography, RadioGroup, FormControlLabel, FormLabel, Radio, FormControl } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import React from 'react'
import { Line } from 'react-chartjs-2'

import { connect } from 'react-redux'
import Simulate from './SimulateEHRData'
import { FIELD_CHANGE } from '../constants/actionTypes'

/**
 * A chart that displays the simulation
 * @param {disease} disease "DIABETES" or "OBESITY", the disease which is being simulated
 * @param {calorieintake} calorieintake intake of calories per day, when simulating obesity
 * @param {goalweight} goalweight goalweight for the child, when simulating obesity
 * @param {trainingammount} trainingammount number of excercise occasions per week, when simulating obesity
 * @param {intensity} intensity intensity of the excercise occasions, when simulating obesity
 * @param {weight} weight last measures weight entry in database, when simulating obesity
 *
 * @param {meal} meal size of meal, when simulating diabetes
 * @param {bloodsugar} bloodsugar last measures bloodsugar entry in database, when simulating diabetes
 */

const mapStateToProps = (state) => ({
  ...state.common,
})

const mapDispatchToProps = (dispatch) => ({
  onChangeRadio: (value) => dispatch({ type: FIELD_CHANGE, key: 'timeHorizon', value }),
})

const getSettings = (disease, timeHorizon) => {
  const today = new Date()
  if (disease === 'OBESITY' && timeHorizon === '1month') {
    return {
      min: today.setDate(today.getDate()),
      max: today.setDate(today.getDate() + 30),
      unit: 'day',
      stepSize: 7,
      dispFormat: 'DD MMM',
    }
  }
  if (disease === 'OBESITY' && timeHorizon === '3month') {
    return {
      min: today.setDate(today.getDate()),
      max: today.setDate(today.getDate() + 91),
      unit: 'day',
      stepSize: 7,
      dispFormat: 'DD MMM',
    }
  }
  if (disease === 'OBESITY' && timeHorizon === '6month') {
    return {
      min: today.setDate(today.getDate()),
      max: today.setDate(today.getDate() + 183),
      unit: 'month',
      stepSize: 1,
      dispFormat: 'MMM YY',
    }
  }
  if (disease === 'OBESITY' && timeHorizon === 'year') {
    return {
      min: today.setDate(today.getDate()),
      max: today.setDate(today.getDate() + 364),
      unit: 'month',
      stepSize: 1,
      dispFormat: 'MMM YY',
    }
  }
  if (disease === 'DIABETES') {
    return {
      min: today.setHours(today.getHours(), today.getMinutes()),
      max: today.setHours(today.getHours() + 4, today.getMinutes()),
      unit: 'hour',
      stepSize: 0.5,
      dispFormat: 'HH:mm',
    }
  }
  return null
}

function SimulateChart(props) {
  const disease = props.disease ? props.disease : null
  const intensity = props.intensity ? props.intensity : 0
  const calorieintake = props.calorieintake ? props.calorieintake : 1600
  const goalweight = props.goalweight ? props.goalweight : 0
  const trainingammount = props.trainingammount ? props.trainingammount : 0
  const meal = props.meal ? props.meal : 0
  const weight = props.weight ? props.weight.weight : 0
  const bloodsugar = props.bloodsugar ? props.bloodsugar[0].value : 0
  const theme = useTheme()
  const timeHorizon = props.timeHorizon ? props.timeHorizon : 'year'
  const displaySettings = getSettings(disease, timeHorizon)

  const changeRadio = (event) => {
    props.onChangeRadio(event.target.value)
  }

  const obesityData = {
    datasets:
      goalweight === 0
        ? [
            {
              label: 'Viktsimulering',
              fill: false,
              lineTension: 0.1,
              backgroundColor: theme.palette.secondary.main,
              borderColor: theme.palette.primary.main,
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: Simulate.weight(weight, trainingammount, calorieintake, intensity),
            },
          ]
        : [
            {
              label: 'Viktsimulering',
              fill: false,
              lineTension: 0.1,
              backgroundColor: theme.palette.secondary.main,
              borderColor: theme.palette.primary.main,
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: Simulate.weight(weight, trainingammount, calorieintake, intensity),
            },
            {
              label: 'Målvikt',
              fill: false,
              lineTension: 0.1,
              backgroundColor: theme.palette.secondary.main,
              borderColor: theme.palette.secondary.main,
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: theme.palette.primary.main,
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: theme.palette.primary.main,
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: Simulate.constant(goalweight),
            },
          ],
  }

  const diabetesData = {
    datasets: [
      {
        label: 'Blodsockersimulering',
        fill: false,
        lineTension: 0.1,
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.primary.main,
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: Simulate.bloodsugar(bloodsugar, meal),
      },
      {
        label: 'Högt blodsocker',
        fill: false,
        lineTension: 0.1,
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: theme.palette.primary.main,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: theme.palette.primary.main,
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: Simulate.constant(10),
      },
      {
        label: 'Lågt blodsocker',
        fill: false,
        lineTension: 0.1,
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: theme.palette.primary.main,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: theme.palette.primary.main,
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: Simulate.constant(3),
      },
    ],
  }

  return (
    <div>
      <Grid container spacing={2} alignItems="center" justify="center">
        <Grid item xs={12}>
          <Typography component="h2" variant="h5" align="center">
            {disease === 'DIABETES' ? 'Blodsocker' : 'Vikt'}
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Line
            data={disease === 'DIABETES' ? diabetesData : obesityData}
            options={{
              maintainAspectRatio: true,
              responsive: true,
              legend: {
                display: false,
                position: 'bottom',
                labels: {
                  fontSize: 14,
                },
              },
              scales: {
                xAxes: [
                  {
                    type: 'time',
                    time: {
                      unit: displaySettings.unit,
                      unitStepSize: displaySettings.stepSize,
                      displayFormats: {
                        day: displaySettings.dispFormat,
                        hour: displaySettings.dispFormat,
                        month: displaySettings.dispFormat,
                      },
                    },
                    ticks: {
                      min: displaySettings.min,
                      max: displaySettings.max,
                    },
                  },
                ],
                yAxes: [
                  {
                    ticks: {
                      suggestedMax: disease === 'DIABETES' ? 12 : weight + 10,
                      suggestedMin: disease === 'DIABETES' ? 0 : weight - 10,
                    },
                  },
                ],
              },
            }}
          />
        </Grid>
        <Grid item>
          <Paper elevation={0} hidden={disease === 'DIABETES'}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Tidsspann</FormLabel>
              <RadioGroup row aria-label="horizon" name="horizon" value={timeHorizon} onChange={changeRadio}>
                <FormControlLabel value="1month" control={<Radio />} label="En månad" />
                <FormControlLabel value="3month" control={<Radio />} label="Tre månader" />
                <FormControlLabel value="6month" control={<Radio />} label="Sex månader" />
                <FormControlLabel value="year" control={<Radio />} label="Ett år" />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SimulateChart)
