import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Box, Container, Grid, Paper } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import TimeLineChart from '../TimeLineChart'
import { FIELD_CHANGE, LOAD_PARTY, LOAD_BLOODSUGAR, LOAD_WEIGHT } from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import CustomPaginationActionsTable from '../TablePagination'
import Reformat from '../../reformatEHRData'
import smileChild from '../../Static/profile_neutral_avatar.png'

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
})

const mapDispatchToProps = (dispatch) => ({
  onChangeAuth: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
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

const ChildMonitor = (props) => {
  const id = props.currentUser.ehrid
  const classes = styles()
  const { bloodsugar } = props
  const { weight } = props
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  const loading = props.inProgress
  const colDesc = [
    'Datum',
    `Värde ${disease === 'DIABETES' ? '(mmol/L)' : '(vikt i kg)'}`,
    `${disease === 'DIABETES' ? 'Blodsocker' : 'Viktklass'}`,
  ]
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
        time: new Date(data[i].time.substring(0, 16)).toLocaleString(),
        value: disease === 'DIABETES' ? data[i].value : data[i].weight,
        indicator: getIndication(disease === 'DIABETES' ? data[i].value : data[i].weight),
      })
    }
    return dataObjects
  }
  const getIndication = (data) => {
    if (data > 0 && data < 4) {
      return 'Lågt'
    }
    if (data > 9) {
      return 'Högt'
    }

    return 'Stabilt'
  }

  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 20, disease)
  }, [id, disease]); // eslint-disable-line

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} className={classes.paperTop}>
        <Grid container spacing={2} className={classes.stats}>
          <Grid item xs={3}>
            <Paper className={`${classes.circle} ${classes.circleSm}`}>
              <div style={{ marginTop: '-63px'}}>
                  <Typography variant="h6">78</Typography>
                  <Typography variant="body2">mmol/L</Typography>
              </div>
            </Paper>
            <Box textAlign="center">
              <Typography className={classes.text} variant="body1">
                Genomsnitt
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
              <img className={classes.centerIcon} src={smileChild} alt="smile child"></img>
          </Grid>
          <Grid item xs={3}>
          <Paper className={`${classes.circle} ${classes.circleSm}`}>
              <div style={{ marginTop: '-60px'}}>
                <Typography style={{ margin: '0 0 0 0'}} variant="body2">0</Typography> 
                <hr style={{width:"50%" }}/>               
                <Typography variant="body2">0</Typography>
              </div>
          </Paper>
            <Box textAlign="center">
              <Typography className={classes.text} variant="body1">
                Hög/Låg
              </Typography>
            </Box>
          </Grid>
          <Grid justify="space-evenly" alignItems="flex-start" container spacing={2} className={classes.circlesUnder}>
            <Grid item xs={3}>
              <Paper className={`${classes.circle} ${classes.circlesUnder}`}>
                <div style={{ marginTop: '-60px'}}>
                    <Typography variant="h6">50</Typography>
                    <Typography variant="body2">g</Typography>
                </div>
              </Paper>
              <Box textAlign="center">
                <Typography className={classes.text} variant="body1">
                  Kolhydrater
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Paper className={`${classes.circle} ${classes.circleSm}`}>
                <div style={{ marginTop: '-65px'}}>
                  <Typography variant="h4">15</Typography>
                  <Typography variant="body3">dagar</Typography>
                </div>
              </Paper>
              <Box textAlign="center">
                <Typography className={classes.text} variant="body1">
                  Streak
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
            <Paper className={`${classes.circle} ${classes.circlesUnder}`}>
              <div style={{ marginTop: '-60px'}}>
                <Typography variant="h6">1</Typography>
                <Typography variant="body2">+ -</Typography>                    
              </div>
            </Paper>
              <Box textAlign="center">
                <Typography className={classes.text} variant="body1">
                  Avvikelse
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={12} md={12}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h5">
              Tabell
            </Typography>
            <CustomPaginationActionsTable
              id="childTable"
              columns={['time', 'value', 'indicator']}
              loading={loading}
              rows={input ? reformat(input, false) : null}
              titles={colDesc}
              paginate
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h5">
              Graf
            </Typography>
            <TimeLineChart
              id="childGraph"
              chartData={input ? reformatForChart(input) : null}
              label={disease === 'DIABETES' ? 'Blodsocker (mmol/L)' : 'Vikt (kg)'}
            ></TimeLineChart>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

const styles = makeStyles((theme) => ({
  circle: {
    textAlign: "center",
    width: '100%',
    borderRadius: '50%',
    background: '#F2F2F2',
    paddingTop: '100%',
    position: 'relative',
    boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
  },
  text: {
    color: '#F2F2F2',
    fontWeight: '500',
  },
  circleSm: {
    marginTop: '50%',
  },
  circlesUnder: {
    marginTop: '-10%',
  },
  stats: {
    padding: theme.spacing(2),
  },
  centerIcon: {
    width: '100%',
    borderRadius: "50%"
  },
  paper: {
    // Defines the papers below avatar
    height: '100%',
    padding: theme.spacing(2),
  },
  paperTop: {
    marginBottom: theme.spacing(2),
    borderRadius: '0% 0% 30% 30%',
    background: '#004894',
  },
}))

export default connect(mapStateToProps, mapDispatchToProps)(ChildMonitor)
