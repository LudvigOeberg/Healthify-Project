import React from 'react'
import { Line } from 'react-chartjs-2';

export default function SimulateChart(props) {
    const disease = props 
    const intensity = props.intensity ? props.intensity : 0
    const calorieintake = props.calorieintake ? props.calorieintake : 0
    const goalweight = props.goalweight ? props.goalweight : 0
    const trainingammount = props.trainingammount ? props.trainingammount : 0
    const meal = props.meal ? props.meal : 0
    const weight = props.weight? props.weight[0].weight : 0
    const bloodsugar = props.bloodsugar ? props.bloodsugar[0].value : 0
    
    const obesityData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            label: "Viktsimulering",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
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
            //data: [4, 5, 6, 7, 22,]
            data: [weight, weight-intensity, weight-intensity*2, weight-intensity*3, weight-intensity*4, weight-intensity*5, weight-intensity*6]
          }
        ]
      };

      const diabetesData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            label: "Blodsockersimulering",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            // borderDash: [],
            //borderDashOffset: 0.0,
            //  borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [bloodsugar, bloodsugar -1, bloodsugar -2]
          }
        ]
      }
      
    return (
        <div>
        <h2>Line Example</h2>
        <Line  data={disease==="DIABETES" ? diabetesData : obesityData} />
      </div>
    )
}
