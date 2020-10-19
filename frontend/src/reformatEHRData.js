import Moment from 'moment';
Moment.locale('sv');
const Reformat = {
    /**
     * Formats the bloodsugar values recieved from agentEHR.
     * @param {data} data the data from agentEHR
     * @param {reverse} reverse if the sorting should be reveresed
     */
    bloodsugar: (data, reverse = false) => {
        const dataObjects = [];
        if (reverse) {
            for (var i = data.length - 1; i >= 0; i--) {
                dataObjects.push({ x: Moment(data[i].time).format('YYYY-MM-DD [kl:] hh:mm'), y: data[i].value });
            }
        } else {
            for (i = 0; i < data.length; i++) {
                dataObjects.push({ x: Moment(data[i].time).format('YYYY-MM-DD [kl:] hh:mm'), y: data[i].value });
            }
        }
        return dataObjects;
    }
}

export default Reformat;