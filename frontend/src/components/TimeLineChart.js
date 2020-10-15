import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@material-ui/core/styles';

/**
 * Displays a timeline graph with Xaxis as time format and regular values as Yaxis
 * @param {const} props- a 2D array (can change to array of objects) with x-values and y-values, 
 * a label for the values, unit for time (year, month, day)
 * Should look like below:
 * <TimeLineChart chartData = {data} label = {"Blodsocker (mmol/L)" unit = {'day'}}></TimeLineChart>
 * 
 *  Author: Martin Dagermo
 */

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

export default function TimeLineChart(props) {
  const chartData = props.chartData;
  const label = props.label;
  const theme = useTheme();
  const unit = props.unit;
  return (
      <Line
        data={createChartProps(chartData, label, theme)}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          legend:{
            display:true,
            position:'bottom'
          },
          scales: {
              xAxes: [{
                  type: 'time',
                  time: {
                      unit: unit
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
  );
}