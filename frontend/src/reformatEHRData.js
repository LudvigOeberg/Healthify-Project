import Moment from 'moment'
Moment.locale('sv')
const Reformat = {
  /**
   * Formats the bloodsugar values recieved from agentEHR.
   * @param {data} data the data from agentEHR
   * @param {reverse} reverse if the sorting should be reveresed
   * @param {iso} iso return iso format
   */
  bloodsugar: (data, reverse = false, iso = false) => {
    const dataObjects = []
    if (reverse) {
      for (let i = data.length - 1; i >= 0; i--) {
        if (iso) {
          dataObjects.push({ x: Moment(data[i].time).format('YYYY-MM-DD hh:mm'), y: data[i].value })
        } else dataObjects.push({ x: Moment(data[i].time).format('YYYY-MM-DD [kl:] hh:mm'), y: data[i].value })
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (iso) {
          dataObjects.push({ x: Moment(data[i].time).format('YYYY-MM-DD hh:mm'), y: data[i].value })
        } else dataObjects.push({ x: Moment(data[i].time).format('YYYY-MM-DD [kl:] hh:mm'), y: data[i].value })
      }
    }
    return dataObjects
  },
  weight: (data, reverse = false, iso = false) => {
    const dataObjects = []
    if (reverse) {
      for (let i = data.length - 1; i >= 0; i--) {
        if (iso) {
          dataObjects.push({ x: Moment(data[i].time).format('YYYY-MM-DD hh:mm'), y: data[i].weight })
        } else dataObjects.push({ x: Moment(data[i].time).format('YYYY-MM-DD [kl:] hh:mm'), y: data[i].weight })
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (iso) {
          dataObjects.push({ x: Moment(data[i].time).format('YYYY-MM-DD hh:mm'), y: data[i].weight })
        } else dataObjects.push({ x: Moment(data[i].time).format('YYYY-MM-DD [kl:] hh:mm'), y: data[i].weight })
      }
    }
    return dataObjects
  },
}

export default Reformat
