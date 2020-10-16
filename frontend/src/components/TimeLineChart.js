import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@material-ui/core/styles';
import { RadioGroup, FormControlLabel, FormLabel, Radio, FormControl } from '@material-ui/core';
import { connect } from 'react-redux';
import {
  FIELD_CHANGE
} from '../constants/actionTypes';

/**
 * Displays a timeline graph with Xaxis as time format and regular values as Yaxis
 * @param {const} props- a 2D array (can change to array of objects) with x-values and y-values, 
 * a label for the values, unit for time (year, month, day)
 * Should look like below:
 * <TimeLineChart chartData = {data} label = {"Blodsocker (mmol/L)"></TimeLineChart>
 * 
 *  Author: Martin Dagermo
 */

const mapStateToProps = state => { 
  return {
    ...state.common
  }
};

const mapDispatchToProps = dispatch => ({
  onChangeRadio: (value) =>
  dispatch({ type: FIELD_CHANGE, key: 'currSettings', value }),
});

function createChartProps(chartData, label, theme) {
  const dataObjects = [];
  for ( var i = 0; i < chartData.length; i++ ) {
      var subArray = chartData[i],
          item = {
            x: subArray[0],
            y: subArray[1]
          };
        dataObjects.push(item);
  }

  const state = {
      datasets: [{
          label: label,
          backgroundColor: theme.palette.secondary.main,
          borderColor: theme.palette.primary.main, 
          fill: false,
          lineTension: 0.1,
          borderWidth: 5,
          data: dataObjects
      }]
  }
  return state;
}

const getSettings = (horizon) => {
  var today = new Date();
  if (horizon === 'day') {
    return {
      min: today.setDate(today.getDate() - 1.1),
      unit: 'hour',
      stepSize: 3,
      dispFormat: 'HH:00'
    }
  } else if (horizon === 'week') {
    return {
      min: today.setDate(today.getDate() - 7),
      unit: 'day',
      stepSize: 1,
      dispFormat: 'ddd'
    }
  } else if (horizon === 'month') {
    return {
      min: today.setDate(today.getDate() - 30),
      unit: 'day',
      stepSize: 7,
      dispFormat: 'ddd DD MMM'
    }
  } else if (horizon === 'all') {
    return {
      min: null,
      unit: 'month',
      stepSize: 1,
      dispFormat: 'MMM Y'
    }
  }
}

const TimeLineChart = (props) =>  {
  const timeHorizon = props.currSettings === undefined ? 'all' : props.currSettings;
  const chartData = props.chartData;
  const label = props.label;
  const theme = useTheme();
  const displaySettings = getSettings(timeHorizon);

  const changeRadio = (event) => {
    props.onChangeRadio(event.target.value);
  };

  return (
    <div>
      <Line
        data={createChartProps(chartData, label, theme)}
        options={{
          maintainAspectRatio: true,
          responsive: true,
          legend:{
            display:true,
            position:'bottom'
          },
          scales: {
              xAxes: [{
                  type: 'time',
                  time: {
                      unit: displaySettings.unit,
                      // unit: timeHorizon == 'month' ? 'day' : 'all' ? 'month' : timeHorizon
                      unitStepSize: displaySettings.stepSize,
                      displayFormats: {
                        day: displaySettings.dispFormat,
                        hour: displaySettings.dispFormat,
                        month: displaySettings.dispFormat,
                     }
                    },
                  ticks: {
                    min: displaySettings.min,
                    // min: timeHorizon == 'day' ? new Date(1980, 0): new Date(2020, 5)
                  }
              }],
              yAxes: [{
                ticks: {
                  suggestedMax: 50,
                }
            }]
          }
        }}
      />
      <FormControl component="fieldset">
      <FormLabel component="legend">Tidsspann</FormLabel>
      <RadioGroup row={true} aria-label="horizon" name="horizon" value={timeHorizon} onChange={changeRadio}>
        <FormControlLabel value="day" control={<Radio />} label="Senaste dagen" />
        <FormControlLabel value="week" control={<Radio />} label="Senaste veckan" />
        <FormControlLabel value="month" control={<Radio />} label="Senaste månaden" />
        <FormControlLabel value="all" control={<Radio />} label="Fullständig" />
      </RadioGroup>
      </FormControl>
    </div>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(TimeLineChart);
