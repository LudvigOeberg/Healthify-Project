import Moment from 'moment'

/**
 * Formats the bloodsugar or weight values recieved from agentEHR.
 * @param {data} data the data from agentEHR
 * @param {meal} meal size of meal, when simulation diabetes
 * @param {calorieintake} calorieintake intake of calories per day, when simulating obesity
 * @param {trainingammount} trainingammount number of excercise occasions per week, when simulating obesity
 * @param {intensity} intensity intensity of the excercise occasions, when simulating obesity
 */

Moment.locale('sv')
const Simulate = {
    bloodsugar: (data, meal)=>{
        const dataObjects=[]
        const today= new Date()
        for (let i = 0; i < 5; i++) {
            if(i===0){
                dataObjects.push({ x: Moment(today.setHours(today.getHours(), today.getMinutes())).format('YYYY-MM-DD HH:mm'), y: data})
            }
            else
                dataObjects.push({ x: Moment(today.setHours(today.getHours()+1, today.getMinutes())).format('YYYY-MM-DD HH:mm'), y: data+meal+1-i })
        }
        return dataObjects
    },
    weight: (data, trainingammount, calorieintake, intensity)=>{
        const dataObjects=[]
        const today= new Date()
        for (let i = 0; i < 53; i++) {
            if (i===0){
                dataObjects.push({ x: Moment(today.setDate(today.getDate())).format('YYYY-MM-DD HH:mm'), y: data+i*(((calorieintake*7)-(1600*7)-
                (intensity*trainingammount*400))/7000).toFixed(2)})
            } else {
                dataObjects.push({ x: Moment(today.setDate(today.getDate()+7)).format('YYYY-MM-DD HH:mm'), y: data+i*(((calorieintake*7)-(1600*7)-
                (intensity*trainingammount*400))/7000).toFixed(2)})
            }
        }
        return dataObjects
        
    },
    constant: (data) => {
        const dataObjects=[]
        const today= new Date()
        dataObjects.push({ x: Moment(today.setDate(today.getDate())).format('YYYY-MM-DD HH:mm'), y: data})
        dataObjects.push({ x: Moment(today.setDate(today.getDate()+52*7)).format('YYYY-MM-DD HH:mm'), y: data})
        return dataObjects
    }
}

export default Simulate