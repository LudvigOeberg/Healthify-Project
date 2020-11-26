import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'
import ChildCareIcon from '@material-ui/icons/ChildCare'
import Moment from 'moment'
import CustomPaginationActionsTable from '../TablePagination'
import CaregivingTeam from '../CaregivingTeam'
import agentEHR from '../../agentEHR'
import { UPDATE_BOOLEAN, FIELD_CHANGE, LOAD_BLOODSUGAR, LOAD_PARTY, LOAD_WEIGHT } from '../../constants/actionTypes'
import TimeLineChart from '../TimeLineChart'
import Reformat from '../../reformatEHRData'

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
})

const mapDispatchToProps = (dispatch) => ({
  onChangeField: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onOpenSnackbar: (value) => dispatch({ type: UPDATE_BOOLEAN, key: 'snackbarOpen', value }),
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) })
  },
  loadValues: (ehrId, offset, limit, disease) => {
    if (disease === 'DIABETES')
      dispatch({ type: LOAD_BLOODSUGAR, payload: agentEHR.Query.bloodsugar(ehrId, offset, limit) })
    else if (disease === 'OBESITY') dispatch({ type: LOAD_WEIGHT, payload: agentEHR.Query.weight(ehrId, limit) })
  },
})



const ParentOverview = (props) => {
  const { id } = props.match.params
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  const SU_LO = props.party ? props.party[id].additionalInfo.SU_LO : null
  const SU_HI = props.party ? props.party[id].additionalInfo.SU_HI : null
  const colDesc = [
    'Datum',
    `Värde ${disease === 'DIABETES' ? '(mmol/L)' : '(vikt i kg)'}`,
    `${disease === 'DIABETES' ? 'Blodsocker' : 'Viktklass'}`,
  ]
  const classes = styles()
  const { bloodsugar } = props
  const { weight } = props
  const loading = props.inProgress
  const age = props.party ? `${Moment().diff(props.party[id].dateOfBirth, 'years')} år` : null
  const name = props.party ? `${props.party[id].firstNames} ${props.party[id].lastNames}` : null
  const input = bloodsugar || weight

  const reformatForChart = (data) => {
    if (bloodsugar) return Reformat.bloodsugar(data, false, true)
    if (weight) return Reformat.weight(data, false, true)
    return null
  }

  // Checks if given bloodsugar levels are considered low, high or good.
// getIndication & reformat are dublicated in MonitorChildValue
const getIndication = (data) => {
  if (data > 0 && data < SU_LO) {
    return 'Lågt'
  }
  if (data > SU_HI) {
    return 'Högt'
  }

  return 'Stabilt'
}

  const reformat = (data) => {
    const dataObjects = []
    for (let i = 0; i < data.length; i++) {
      dataObjects.push({
        time: new Date(data[i].time.substring(0, 16)).toLocaleString(),
        value: disease === 'DIABETES' ? data[i].value : data[i].weight,
        indicator: getIndication(disease === 'DIABETES' ? data[i].value : data[i].weight),
      })
    }
    return dataObjects
  }

  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 3, disease)
    }, [id, disease]) // eslint-disable-line

  const doctor = {
    name: 'Doktor X',
    mail: 'Dr.x@gmail.com',
    telephone: '070-XXX XX XX',
  }
  const shrink = {
    name: 'Psykolog Y',
    mail: 'P.Y@gmail.com',
    telephone: '070-YYY YY YY',
  }
  const nurse = {
    name: 'Sjuksköterska Z',
    mail: 'S.Z@gmail.com',
    telephone: '070-ZZZ ZZ ZZ',
  }
  const caregivers = [doctor, shrink, nurse]

  return (
    <div className={classes.main}>
      <Grid container className={classes.root} spacing={2} height="100%">
        <Grid item xs={12} sm={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper} elevation={2}>
                <Typography component="h2" variant="h6">
                  {' '}
                  HÄR SKA DET STÅ INFO OM HUR DET GÅR FÖR BARNET I GAMIFICATION-ASPEKTEN
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper} elevation={2}>
                <Typography component="h1" variant="h5">
                  {' '}
                  GRAF
                </Typography>
                <TimeLineChart
                  chartData={input ? reformatForChart(input) : null}
                  label={`${disease === 'DIABETES' ? 'Blodsocker (mmol/L)' : 'Vikt (kg)'}`}
                ></TimeLineChart>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
              <Paper className={classes.paper} elevation={2}>
                <Grid container spacing={1} alignItems="center" justify="center">
                  <Grid item xs={12}>
                    <Typography component="h2" variant="h6">
                      {' '}
                      Senaste mätningar
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomPaginationActionsTable
                      columns={['time', 'value', 'indicator']}
                      loading={loading}
                      rows={input ? reformat(input, false) : null}
                      titles={colDesc}
                      paginate={false}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button
                      id="toChildValues"
                      variant="contained"
                      color="secondary"
                      href={`/monitor-child/${id}`}
                      fullWidth
                    >
                      Hantera värden
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button
                      id="toSimulatePage"
                      variant="contained"
                      color="secondary"
                      href={`/simulate-patient/${id}`}
                      fullWidth
                    >
                      Simulera värden
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Paper className={classes.paper} elevation={3}>
                <Typography component="h1" variant="h6">
                  {name}
                </Typography>
                <Typography variant="subtitle1">{age}</Typography>
                <Typography variant="subtitle1">{disease === 'DIABETES' ? 'Diabetes' : 'Fetma'}</Typography>
                <Avatar className={classes.avatar}>
                  <ChildCareIcon fontSize="large" />
                </Avatar>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper} elevation={3}>
                <Typography component="h1" variant="h6">
                  {' '}
                  Vårdgivare
                </Typography>
                {/* Caregivers ska stå här och annan info. Ändra format. */}
                <CaregivingTeam caregivers={caregivers}></CaregivingTeam>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

const styles = makeStyles((theme) => ({
  root: {
    margin: '0px !important',
    alignItems: 'top',
    display: 'flex',
    padding: theme.spacing(1),
    maxWidth: '100%',
  },
  paper: {
    marginTop: theme.spacing(4),
    height: '100%',
    padding: theme.spacing(1),
  },
  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(20),
    height: theme.spacing(20),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  main: {
    width: '100%',
  },
}))

export default connect(mapStateToProps, mapDispatchToProps)(ParentOverview)
