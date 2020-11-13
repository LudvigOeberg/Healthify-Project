import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import AddIcon from '@material-ui/icons/Add'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import InputAdornment from '@material-ui/core/InputAdornment'
import { Grid } from '@material-ui/core'
import { OPEN_SNACKBAR, FIELD_CHANGE, LOAD_PARTY, LOAD_BLOODSUGAR, SAVE_BLOODSUGAR, LOAD_WEIGHT, SAVE_WEIGHT } from '../../constants/actionTypes'
import CustomPaginationActionsTable from '../TablePagination'
import TimeLineChart from '../TimeLineChart'
import agentEHR from '../../agentEHR'
import Reformat from '../../reformatEHRData'

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
})

const mapDispatchToProps = (dispatch) => ({
  onChangeField: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onSubmit: (ehrId, measurement, snackbar, disease) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    dispatch({
      type: disease==="DIABETES" ? SAVE_BLOODSUGAR : SAVE_WEIGHT,
      payload: disease==="DIABETES" ? 
      agentEHR.Composition.saveBloodSugar(ehrId, measurement).then(() => {
        dispatch({
          type: LOAD_BLOODSUGAR,
          payload: agentEHR.Query.bloodsugar(ehrId, 0, 20),
        })
      }) 
      :
      agentEHR.Demograhics.newMeasurment(null, measurement, ehrId).then(() => {
        dispatch({
          type: LOAD_WEIGHT,
          payload: agentEHR.Query.weight(ehrId, 20),
        })
      })
      
      ,
      snackbar,
    }),
  onOpenSnackbar: (message, color) => dispatch({ type: OPEN_SNACKBAR, message, color }),
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) }) 
  },
  loadValues: (ehrId, offset, limit, disease) => {
    disease==="DIABETES" ?
    dispatch({ type: LOAD_BLOODSUGAR, payload: agentEHR.Query.bloodsugar(ehrId, offset, limit) })
    :
    dispatch({ type: LOAD_WEIGHT, payload: agentEHR.Query.weight(ehrId, limit)})
  }
})



const MonitorChildValue = (props) => {
  const { id } = props.match.params
  const classes = styles()
  const { childValue } = props
  const open = props.snackbarOpen
  const { bloodsugar } = props
  const { weight } = props
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  const name = props.party ? `${props.party[id].firstNames} ${props.party[id].lastNames}` : null
  const loading = props.inProgress
  const colDesc = ['Datum', `Värde ${disease === 'DIABETES' ? '(mmol/L)' : '(vikt i kg)'}`, `${disease === 'DIABETES' ? 'Blodsocker' : 'Viktklass'}`]
  const data = bloodsugar ? bloodsugar: weight
 
  const reformatForChart = (data) => {
    if(bloodsugar)
      return Reformat.bloodsugar(data, false, true)
    else if(weight)
      return Reformat.weight(data, false, true)
    else
      return null
 }


  useEffect(() => {
    disease ? props.loadValues(id, 0, 20, disease) : props.onLoad(id)
  }, [id, disease]) // eslint-disable-line

  const validate = (val) => val < 100 && val > 0

  const submitForm = (ev) => {
    ev.preventDefault()
    // const color = validate(props.childValue) ? 'success' : 'error'
    // const message = validate(props.childValue) ? `Du loggade värdet: ${props.childValue} mmol/L` : 'Fel format!'
    // props.onOpenSnackbar(message, color)
    const measurementChild = props.childValue
    const snackbar = {
      open: true,
      message: validate(props.childValue) ? `Du loggade värdet: ${props.childValue} ${disease==="DIABETES" ? 'mmol/L' : 'kg'}` : 'Fel format!',
      color: validate(props.childValue) ? 'success' : 'error',
    }
    props.onSubmit(id, measurementChild, snackbar, disease)
  }
  const changeField = (ev) => {
    props.onChangeField(ev.target.id, ev.target.value)
  }

  // getIndication & reformat are dublicated in ParentOverview.
  const getIndication = (data) => {
    if (data > 0 && data < 4) {
      return 'Lågt'
    }
    if (data > 9) {
      return 'Högt'
    }

    return 'Stabilt'
  }
  const reformat = (data) => {
    const dataObjects = []
    for (let i = 0; i < data.length; i++) {
      dataObjects.push({
        time: new Date(data[i].time.substring(0, 16)).toLocaleString(),
        value: disease==="DIABETES" ? data[i].value : data[i].weight,
        indicator: getIndication(disease==="DIABETES" ? data[i].value : data[i].weight),
      })
    }
    return dataObjects
  }

  return (
    <Container>
      <div className={classes.paper}>
        <Typography component="h1" variant="h3">
          Hantera {name}s värden
        </Typography>
        <p></p>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12} md={6}>
            <Typography component="h1" variant="h5">
              Tabell
            </Typography>
            <CustomPaginationActionsTable
              //   columns={['x', 'y']}
              columns={['time', 'value', 'indicator']}
              loading={loading}
              rows={data ? reformat(data, false) : null}
              // rows={bloodsugar ? Reformat(bloodsugar, false) : null}
              titles={colDesc}
              paginate
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Typography component="h1" variant="h5">
              Graf
            </Typography>
            <TimeLineChart
              chartData={data ? reformatForChart(data) : null}
              label={disease === "DIABETES" ? "Blodsocker (mmol/L)" : "Vikt (kg)"}
            ></TimeLineChart>
          </Grid>
          <Grid item xs={12} align="center">
            <Avatar className={classes.avatar}>
              <AddIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Skriv in ditt barns {disease === 'DIABETES' ? 'blodsockervärde' : 'uppmätta vikt'}
            </Typography>
            <form className={classes.form} noValidate onSubmit={(ev) => submitForm(ev)} autoComplete="off">
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    id="childValue"
                    name="childValue"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{disease === 'DIABETES' ? 'mmol/L' : 'kg'}</InputAdornment>,
                    }}
                    value={childValue}
                    disabled={open}
                    onChange={changeField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={props.inProgress || open}
                    className={classes.submit}
                  >
                    Logga värde
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </div>
    </Container>
  )
}

const styles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '50%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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
