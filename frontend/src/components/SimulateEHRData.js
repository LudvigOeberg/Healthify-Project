import Moment from 'moment'
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
        for (let i = 0; i < 14; i++) {
            if (i===0){
                dataObjects.push({ x: Moment(today.setDate(today.getDate())).format('YYYY-MM-DD HH:MM'), y: data+i*(((calorieintake*7)-(1600*7)-
                (intensity*trainingammount*400))/7000).toFixed(2)})
            } else {
                dataObjects.push({ x: Moment(today.setDate(today.getDate()+7)).format('YYYY-MM-DD HH:MM'), y: data+i*(((calorieintake*7)-(1600*7)-
                (intensity*trainingammount*400))/7000).toFixed(2)})
            }
        }
        return dataObjects
        
    },
    constant: (data) => {
        const dataObjects=[]
        const today= new Date()
        dataObjects.push({ x: Moment(today.setDate(today.getDate())).format('YYYY-MM-DD HH:MM'), y: data})
        dataObjects.push({ x: Moment(today.setDate(today.getDate()+14*7)).format('YYYY-MM-DD HH:MM'), y: data})
        return dataObjects
    }
}

export default Simulate