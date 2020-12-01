import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper, ListItemText, SvgIcon, List, ListItem } from '@material-ui/core'
import Moment from 'moment'
import CustomPaginationActionsTable from '../TableOverview'
import CaregivingTeam from '../CaregivingTeam'
import agentEHR from '../../agentEHR'
import { UPDATE_BOOLEAN, FIELD_CHANGE, LOAD_BLOODSUGAR, LOAD_PARTY, LOAD_WEIGHT } from '../../constants/actionTypes'
import TimeLineChart from '../TimeLineChart'
import Reformat from '../../reformatEHRData'
import profileAvatar from '../../Static/profile_avatar.png'

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

  const classes = styles()
  const { bloodsugar } = props
  const { weight } = props
  const loading = props.inProgress
  const name = props.party ? `${props.party[id].firstNames} ${props.party[id].lastNames}` : null
  const input = bloodsugar || weight

  const reformatForChart = (data) => {
    if (bloodsugar) return Reformat.bloodsugar(data, false, true)
    if (weight) return Reformat.weight(data, false, true)
    return null
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

  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 11, disease)
  }, [id, disease]) // eslint-disable-line

  const doctor = {
    name: 'Doktor X',
    org: 'Region Östergötland',
    mail: 'Dr.x@gmail.com',
    telephone: '070-XXX XX XX',
  }
  const caregivers = [doctor]

  return (
    <div className={classes.main}>
      <Grid className={classes.avatar} justify="center" direction="column" alignItems="center" container>
        <Grid item xs={6}>
          <img src={profileAvatar} alt="Profile"></img>
        </Grid>
        <Grid item xs={4} className={classes.avatarName}>
          <Typography variant="h5"> {name} </Typography>
          <ListItemText secondary={disease === 'DIABETES' ? 'Diabetes' : 'Fetma'} />
        </Grid>
      </Grid>

      <Grid spacing={1} className={classes.root} justify="center" alignItems="center" container>
        <Grid item md={2} sm={4} xs={6}>
          <Button
            id="toChildValuesButton"
            className={classes.button}
            variant="contained"
            color="primary"
            href={`/monitor-child/${id}`}
            fullWidth
          >
            Hantera värden
          </Button>
        </Grid>
        <Grid item md={2} sm={4} xs={6}>
          <Button
            id="toSimulatePageButton"
            className={classes.button}
            variant="contained"
            color="primary"
            href={`/simulate-patient/${id}`}
            fullWidth
          >
            Simulera värden
          </Button>
        </Grid>
      </Grid>

      <Grid container className={classes.root} spacing={2} justify="center" height="100%">
        <Grid item xs={12}>
        <Paper className={classes.paper} elevation={2}>
          <Typography component="h1" variant="h5">
              Senaste mätningen
          </Typography>
          <ListItem disableGutters={true}> 
          <SvgIcon width="22" height="10" viewBox="2 5 22 12">
                <path
                  d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM7 10.82C5.84 10.4 5 9.3 5 8V7h2v3.82zM19 8c0 1.3-.84 2.4-2 2.82V7h2v1z"
                  fill="primary"
                  fillOpacity="0.6"
              />
              </SvgIcon>
              {/* <ListItemText primary = "Utmaningar"/> */}
              <Typography component="h1" variant="h5" style={{ marginLeft: '.5rem' }}>
                {"Utmaningar"}
              </Typography>
          </ListItem>
        </Paper>
        </Grid>
        <Grid item xs={12}>
        <Paper className={classes.paper} elevation={2}>
            <ListItem disableGutters={true}>
            <SvgIcon width="22" height="10" viewBox="2 5 22 12">
                <path
                  d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM7 10.82C5.84 10.4 5 9.3 5 8V7h2v3.82zM19 8c0 1.3-.84 2.4-2 2.82V7h2v1z"
                  fill="primary"
                  fillOpacity="0.6"
              />
              </SvgIcon>
              {/* <ListItemText primary = "Utmaningar"/> */}
              <Typography component="h1" variant="h5" style={{ marginLeft: '.5rem' }}>
                {"Utmaningar"}
              </Typography>
            </ListItem>
        </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper className={classes.paper} elevation={2}>
            <Grid container spacing={1} alignItems="center" justify="center">
              <ListItemText
                primary="Tidigare mätningar"
                secondary={disease === 'DIABETES' ? 'Blodsocker' : 'Vikt'}
              />
              <Grid item xs={12}>
                <CustomPaginationActionsTable
                  columns={['time', 'value']}
                  loading={loading}
                  rows={input ? reformat(input, false) : null}
                  paginate={false}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper className={classes.paper} elevation={2}>
                <Typography variant="h5">{disease === 'DIABETES' ? 'Blodsocker' : 'Vikt'}</Typography>
                <ListItemText secondary="Idag" />
                <p></p>
                <TimeLineChart
                  chartData={input ? reformatForChart(input) : null}
                  label={`${disease === 'DIABETES' ? 'Blodsocker (mmol/L)' : 'Vikt (kg)'}`}
                  currSettings={disease === 'DIABETES' ? 'day' : 'month'}
                  hideRadio
                ></TimeLineChart>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className={classes.paper} elevation={2}>
            <Typography variant="h5"> Vårdgivare</Typography>
            {/* Caregivers ska stå här och annan info. Ändra format. */}
            <CaregivingTeam caregivers={caregivers}></CaregivingTeam>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

const styles = makeStyles((theme) => ({
  root: {
    margin: '0px !important',
    // display: 'horizontal',
    padding: theme.spacing(1),
    maxWidth: '100%',
  },
  button: {
    top: '20px',
    marginBottom: '20px',
  },

  list: {
    padding: 0,
  },

  paper: {
    // height: '100%',
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  avatar: {
    marginTop: theme.spacing(6),
  },
  avatarName: {
    textAlign: 'center',
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
