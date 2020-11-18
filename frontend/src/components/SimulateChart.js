import { useTheme } from '@material-ui/core/styles'
import React from 'react'
import { Line } from 'react-chartjs-2';
import Simulate from './SimulateEHRData'

const getSettings = (disease) => {
  const today = new Date()
  if (disease === 'OBESITY') {
    return {
      min: today.setDate(today.getDate()),
      max: today.setDate(today.getDate()+91),
      unit: 'day',
      stepSize: 7,
      dispFormat: 'DD MMM',
    }
  }
  if (disease === 'DIABETES') {
    return {
      min: today.setHours(today.getHours(), today.getMinutes()),
      max: today.setHours(today.getHours()+4, today.getMinutes()),
      unit: 'hour',
      stepSize: 0.5,
      dispFormat: 'HH:mm',
    }
}
}


export default function SimulateChart(props) {
    const disease = props.disease ? props.disease : null 
    const intensity = props.intensity ? props.intensity : 0
    const calorieintake = props.calorieintake ? props.calorieintake : 0
    const goalweight = props.goalweight ? props.goalweight : 0
    const trainingammount = props.trainingammount ? props.trainingammount : 0
    const meal = props.meal ? props.meal : 0
    const weight = props.weight? props.weight[0].weight : 0
    const bloodsugar = props.bloodsugar ? props.bloodsugar[0].value : 0
    const theme=useTheme()
    const displaySettings = getSettings(disease)

    const obesityData = {
        datasets: goalweight===0 ? 
        [
          {
            label: "Viktsimulering",
            fill: false,
            lineTension: 0.1,
            backgroundColor: theme.palette.secondary.main,
            borderColor: theme.palette.primary.main,
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: Simulate.weight(weight, trainingammount, calorieintake, intensity)
          }
        ]
        :
        [
          {
            label: "Viktsimulering",
            fill: false,
            lineTension: 0.1,
            backgroundColor: theme.palette.secondary.main,
            borderColor: theme.palette.primary.main,
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data:Simulate.weight(weight, trainingammount, calorieintake, intensity)
          },
          { 
            label: "Målvikt",
            fill: false,
            lineTension: 0.1,
            backgroundColor: theme.palette.secondary.main,
            borderColor: theme.palette.secondary.main,
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: theme.palette.primary.main,
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: theme.palette.primary.main,
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: Simulate.constant(goalweight)
          }
        ]
      };

      const diabetesData = {
        datasets: [
          {
            label: "Blodsockersimulering",
            fill: false,
            lineTension: 0.1,
            backgroundColor: theme.palette.secondary.main,
            borderColor: theme.palette.primary.main,
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: Simulate.bloodsugar(bloodsugar, meal)
          },
          { 
            label: "Högt blodsocker",
            fill: false,
            lineTension: 0.1,
            backgroundColor: theme.palette.secondary.main,
            borderColor: theme.palette.secondary.main,
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: theme.palette.primary.main,
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: theme.palette.primary.main,
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: Simulate.constant(10)
          },
          { 
            label: "Lågt blodsocker",
            fill: false,
            lineTension: 0.1,
            backgroundColor: theme.palette.secondary.main,
            borderColor: theme.palette.secondary.main,
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: theme.palette.primary.main,
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: theme.palette.primary.main,
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: Simulate.constant(3)
          }
        ]
      }
    

    return (
        <div>
        <Line  
        data={disease==="DIABETES" ? diabetesData : obesityData}
        options={{
          maintainAspectRatio: true,
          responsive: true,
          title: {
             display: true,
             text: disease==='DIABETES' ? 'Blodsocker' : 'Vikt'
          },
          legend:{
            display: true,
            position: "bottom",
            labels:{
              fontSize: 10
            }
            
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
                  suggestedMax: disease === 'DIABETES' ? 12 : weight+10,
                  suggestedMin: disease === 'DIABETES' ? 0 : weight-10
                },
              },
            ],
          },
        }}
        
        
        
        
        
        />
      </div>
    )
}

