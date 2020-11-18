import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Box, Container, Grid, Paper } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'
import TimeLineChart from '../TimeLineChart'
import { PATIENT_PAGE_UNLOADED, FIELD_CHANGE, LOAD_PARTY, LOAD_BLOODSUGAR } from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import CustomPaginationActionsTable from '../TablePagination'
import Reformat from '../../reformatEHRData'
// import smileChild from '../../Static/smile_child.png'
// import smileChild from '../../Static/big_smile_child.png'

const mapStateToProps = (state) => ({
  ...state.ehr,
  currentUser: state.common.currentUser,
  bloodsugarValue: state.common.bloodsugar,
})

const mapDispatchToProps = (dispatch) => ({
  onChangeAuth: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onUnload: () => dispatch({ type: PATIENT_PAGE_UNLOADED }),
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) })
    dispatch({
      type: LOAD_BLOODSUGAR,
      payload: agentEHR.Query.bloodsugar(ehrId, 0, 20),
    })
  },
})

class ChildMonitor extends Component {
  constructor() {
    super()
    this.changeAuth = (ev) => this.props.onChangeAuth(ev.target.id, ev.target.value)
  }

  componentDidMount() {
    this.props.onLoad(this.props.currentUser.ehrid)
  }

  componentWillUnmount() {
    this.props.onUnload()
  }

  render() {
    const { classes } = this.props
    const bloodsugarData = this.props.bloodsugar
    return (
      <Container maxWidth="sm">
        <Paper className={classes.paperTop}>
          <Grid container spacing={2} className={classes.stats}>
            <Grid item xs={3}>
              <div className={`${classes.circleNew} ${classes.circleSm}`}></div>
              <Box textAlign="center">
                <Typography className={classes.text} variant="body1">
                  Genomsnitt
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Skeleton animation="false" variant="circle" className={classes.circleNew} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton animation="false" variant="circle" className={`${classes.circleNew} ${classes.circleSm}`} />
              <Box textAlign="center">
                <Typography className={classes.text} variant="body1">
                  Hög/Låg
                </Typography>
              </Box>
            </Grid>
            <Grid justify="space-evenly" alignItems="flex-start" container spacing={2} className={classes.circlesUnder}>
              <Grid item xs={3}>
                <Skeleton animation="false" variant="circle" className={classes.circleNew} />
                <Box textAlign="center">
                  <Typography className={classes.text} variant="body1">
                    Kolhydrater
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Skeleton animation="false" variant="circle" className={`${classes.circleNew} ${classes.circleSm}`} />
                <Box textAlign="center">
                  <Typography className={classes.text} variant="body1">
                    Avvikelse
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Skeleton animation="false" variant="circle" className={classes.circleNew} />
                <Box textAlign="center">
                  <Typography className={classes.text} variant="body1">
                    Genomsnitt
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h5">Mina mätningar</Typography>
              <CustomPaginationActionsTable
                paginate
                titles={['Datum', 'mmol/L']}
                columns={['x', 'y']}
                rows={bloodsugarData ? Reformat.bloodsugar(bloodsugarData, false) : null}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h5"> Blodsocker</Typography>
              <TimeLineChart
                chartData={bloodsugarData ? Reformat.bloodsugar(bloodsugarData, false, true) : null}
                label="Blodsocker (mmol/L)"
              ></TimeLineChart>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    )
  }
}

const styles = (theme) => ({
  circleNew: {
    width: '100%',
    paddingTop: '100%',
    borderRadius: '50%',
    background: 'white',
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
  text: {
    color: '#F2F2F2',
    fontWeight: '500',
  },

  centerText: {
    // Centers the numbers/text inside the bubble.
    position: 'absolute',
    top: '23%',
    left: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },

  centerIcon: {
    // Centers the avatar inside the bubble.
    position: 'absolute',
    top: '52.5%',
    left: '49%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '100%',
    height: 'auto',
    color: theme.palette.text.disabled,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
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
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChildMonitor))
