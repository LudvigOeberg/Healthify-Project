import React, { useEffect } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Divider, Grid, ListItemText, Paper } from "@material-ui/core";
import {
  OPEN_SNACKBAR,
  FIELD_CHANGE,
  LOAD_PARTY,
  LOAD_BLOODSUGAR,
  SAVE_BLOODSUGAR,
  LOAD_WEIGHT,
  SAVE_WEIGHT,
} from "../../constants/actionTypes";
import CustomPaginationActionsTable from "../TableOverview";
import TimeLineChart from "../TimeLineChart";
import agentEHR from "../../agentEHR";
import Reformat from "../../reformatEHRData";
import profileAvatar from '../../Static/profile_avatar.png'
import Moment from 'moment'


const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
})

const mapDispatchToProps = (dispatch) => ({
  onChangeField: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onSubmit: (ehrId, measurement, snackbar, disease) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    dispatch({
      type: disease === 'DIABETES' ? SAVE_BLOODSUGAR : SAVE_WEIGHT,
      payload:
        // eslint-disable-next-line no-nested-ternary
        disease === 'DIABETES'
          ? agentEHR.Composition.saveBloodSugar(ehrId, measurement).then(() => {
            dispatch({
              type: LOAD_BLOODSUGAR,
              payload: agentEHR.Query.bloodsugar(ehrId, 0, 20),
            });
          })
          : measurement !== null
            ? agentEHR.Demograhics.newMeasurment(null, measurement, ehrId).then(
              () => {
                dispatch({
                  type: LOAD_WEIGHT,
                  payload: agentEHR.Query.weight(ehrId, 20),
                });
              }
            )
            : dispatch({
              type: LOAD_WEIGHT,
              payload: agentEHR.Query.weight(ehrId, 20),
            }),

      snackbar,
    }),
  onOpenSnackbar: (message, color) => dispatch({ type: OPEN_SNACKBAR, message, color }),
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) })
  },
  loadValues: (ehrId, offset, limit, disease) => {
    if (disease === 'DIABETES')
      dispatch({
        type: LOAD_BLOODSUGAR,
        payload: agentEHR.Query.bloodsugar(ehrId, offset, limit),
      })
    else if (disease === 'OBESITY')
      dispatch({
        type: LOAD_WEIGHT,
        payload: agentEHR.Query.weight(ehrId, limit),
      })
  },
})

const MonitorChildValue = (props) => {
  const { id } = props.match.params;
  const classes = styles();
  const { childValue } = props;
  const open = props.snackbarOpen;
  const { bloodsugar } = props;
  const { weight } = props;
  const disease = props.party
    ? `${props.party[id].additionalInfo.disease}`
    : null;
  /*  const SU_LO = props.party ? props.party[id].additionalInfo.SU_LO : null;
   const SU_HI = props.party ? props.party[id].additionalInfo.SU_HI : null; */
  const name = props.party
    ? `${props.party[id].firstNames} ${props.party[id].lastNames}`
    : null;
  const loading = props.inProgress;
  const input = bloodsugar || weight;
  let currSettings = props.currSettings ? props.currSettings : null
  let chartFormat = disease === 'DIABETES' ? 'Idag' : 'Senaste månaden'

  const reformatForChart = (data) => {
    if (bloodsugar) return Reformat.bloodsugar(data, false, true)
    if (weight) return Reformat.weight(data, false, true)
    return null
  }

  if (currSettings === 'month')
    chartFormat = 'Senaste månaden'
  else if (currSettings === 'all')
    chartFormat = 'Alla mätningar'
  else if (currSettings === 'week')
    chartFormat = 'Senaste veckan'
  else if (currSettings === 'day')
    chartFormat = 'Idag'


  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 20, disease)
  }, [id, disease]); // eslint-disable-line

  const validate = (val) => {
    if (disease === "DIABETES") {
      return val <= 15 && val > 0;
    }
    return val <= 100 && val >= 40
  }

  const submitForm = (ev) => {
    ev.preventDefault()

    const measurementChild = props.childValue

    const snackbar = {
      open: true,
      message: validate(props.childValue)
        ? `Du loggade värdet: ${props.childValue} ${disease === "DIABETES" ? "mmol/L" : "kg"
        }`
        : `${disease === "DIABETES"
          ? "Fel format eller ogiltigt blodsockervärde"
          : "Fel format eller ogiltig vikt"
        }`,
      color: validate(props.childValue) ? "success" : "error",
    };

    if (validate(props.childValue)) {
      props.onSubmit(id, measurementChild, snackbar, disease)
    } else {
      props.onSubmit(id, null, snackbar, disease)
    }
    return null;

  };

  const changeField = (ev) => {
    props.onChangeField(ev.target.id, ev.target.value)
  }

  const avgValue = (data, horizon) => {
    let sum = 0
    let days = 0
    let avg = 0
    const blocker = new Date()
    if (horizon === 'week')
      days = 7
    else if (horizon === 'month')
      days = 31
    else if (horizon === 'day' || !horizon)
      days = 1

    blocker.setDate(blocker.getDate() - days)
    for (let i = 0; i < data.length; i++) {
      if (days !== 0)
        if (Moment(blocker).format('YYYY-MM-DD HH:mm') > Moment(data[i].time).format('YYYY-MM-DD HH:mm'))
          break
      sum += disease === 'DIABETES' ? data[i].value : data[i].weight
      avg = sum / (i + 1)
    }
    return avg
  }

  const reformat = (data) => {
    const dataObjects = []
    for (let i = 0; i < data.length; i++) {
      dataObjects.push({
        time: Moment(data[i].time).format(
          'YYYY-MM-DD HH:mm',
        ) /* new Date(data[i].time.substring(0, 16)).toLocaleString() */,
        value: disease === 'DIABETES' ? `${data[i].value} mmol/L` : `${data[i].weight} kg`,
      })
    }
    return dataObjects
  }

  return (
    <div className={classes.main}>
      <Paper elevation={0} hidden={!disease} style={{backgroundColor:'#fafafa'}}>
      <Grid className={classes.avatar} justify="center" direction="column" alignItems="center" container>
        <Grid item xs={6}>
        <img src={profileAvatar} alt="Profile"></img>
        </Grid>
        <Grid item xs={4} className={classes.avatarName}>
          <Typography variant="h5"> {name} </Typography>
          <ListItemText secondary={disease === 'DIABETES' ? 'Diabetes' : 'Fetma'} />
        </Grid>
      </Grid>

      <Grid container spacing={2} className={classes.root} alignItems='center' justify='center'>
        <Grid item xs={12} md={3} align="center">
          <Paper variant='outlined' className={classes.paperOutline} >
            <Typography variant="body1">
              Skriv in ditt barns{" "}
              {disease === "DIABETES" ? "blodsockervärde" : "uppmätta vikt"}
            </Typography>

            <form
              className={classes.form}
              noValidate
              onSubmit={(ev) => submitForm(ev)}
              autoComplete="off"
            >

              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  align='center'
                  required
                  id="childValue"
                  name="childValue"
                  value={childValue}
                  disabled={open}
                  onChange={changeField}
                  helperText={disease === "DIABETES" ? "mellan 1-15 mmol/L." : "mellan 40-100kg"}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  id="addValueToChildButton"
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={props.inProgress || open}
                  className={classes.button}
                >
                  Logga värde
                  </Button>
              </Grid>

            </form>
          </Paper>
        </Grid>
      </Grid>


      <Grid container spacing={2} className={classes.root} justify='center'>
        <Grid item xs={12} sm={12} md={6}>
          <Paper elevation={2} className={classes.paper} style={{ height: '100%' }}>
            <Typography component="h1" variant="h5">
              Barnets mätningar
            </Typography>
            <ListItemText secondary={disease === 'DIABETES' ? 'Blodsocker' : 'Vikt'} />
            <CustomPaginationActionsTable
              columns={['time', 'value']}
              loading={loading}
              rows={input ? reformat(input, false) : null}
              paginate={false}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Paper elevation={2} className={classes.paper} style={{ width: '100%' }}>
            <Grid container spacing={2} className={classes.root}>

              <Grid item md={10} xs={8}>
                <Typography component="h1" variant="h5">{disease === 'DIABETES' ? 'Blodsocker' : 'Vikt'}</Typography>
              </Grid>
              <Grid item md={2} xs={4}>
                <Typography component="h1" variant="h5">{input ? Math.round(avgValue(input, currSettings) * 100) / 100 : 'Laddar..'}</Typography>
                <Divider />
              </Grid>
              <Grid item md={10}  xs={8}>
                <ListItemText secondary={chartFormat} />
              </Grid>
              <Grid item md={2}  xs={4}>
                <ListItemText secondary='Genomsnitt' />
              </Grid>
              <Grid item md={12}>
                <TimeLineChart
                  currSettings={disease === 'DIABETES' ? 'day' : 'month'}
                  chartData={input ? reformatForChart(input) : null}
                  label={
                    disease === "DIABETES" ? "Blodsocker (mmol/L)" : "Vikt (kg)"
                  }
                ></TimeLineChart>
              </Grid>



            </Grid>
          </Paper>
          <Grid container justify='center' alignItems='center' className={classes.root}>
            <Grid item xs={6}>
              <Button
                className={classes.button}
                fullWidth
                variant='outlined'
                color='primary'
                href={`/parent-child-overview/${id}`}
              >
                Tillbaka
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      </Paper>
    </div>
  );
};

const styles = makeStyles((theme) => ({
  paper: {
    // height: '100%',
    padding: theme.spacing(2),
    
  },
  paperOutline: {
    borderWidth: 5,
    borderColor: theme.palette.primary.main,
    borderRadius: 20,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  root: {
    margin: '0px !important',
    // display: 'horizontal',
    padding: theme.spacing(1),
    maxWidth: '100%',
  },
  form: {
    width: '50%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  main: {
    width: '100%',
  },
  avatar: {
    marginTop: theme.spacing(6),
  },
  avatarName: {
    textAlign: 'center',
  },
  button: {
    top: '5px',
    marginBottom: '5px',
    padding: '10px 5px 10px 5px',
  },
}))

export function getCurrentDate() {
  const today = new Date()
  const todaysDate = `${String(today.getFullYear())}-${String(today.getMonth())}-${String(today.getDate())} ${String(
    today.getHours(),
  )}:${String(today.getMinutes())}`
  return todaysDate
}

export default connect(mapStateToProps, mapDispatchToProps)(MonitorChildValue)
