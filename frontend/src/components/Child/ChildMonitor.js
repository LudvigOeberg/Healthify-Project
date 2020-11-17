import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { connect } from 'react-redux'
import PersonIcon from '@material-ui/icons/Person'
import TimeLineChart from '../TimeLineChart'
import {
  PATIENT_PAGE_UNLOADED,
  FIELD_CHANGE,
  UPDATE_BOOLEAN,
  LOAD_PARTY,
  LOAD_BLOODSUGAR,
} from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import { Grid, Paper } from '@material-ui/core'
import CustomPaginationActionsTable from '../TablePagination'
import Reformat from '../../reformatEHRData'
import smileChild from '../../Static/smile_child.png'
import Typography from '@material-ui/core/Typography'

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
  onOpenSnackbar: (value) => dispatch({ type: UPDATE_BOOLEAN, key: 'snackbarOpen', value }),
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
      <Grid className={classes.bigDiv}>
        <Container component="main" maxWidth="sm" disableGutters>
          <Grid className={classes.paper}>
            <Grid className={classes.circle}>
              <Grid className={classes.avatarCircle}>
                <img className={classes.centerIcon} src={smileChild} alt="smile child"></img>
              </Grid>
              <Grid className={classes.statCircle2}>
                  <Grid className={classes.smallCircle}>
                  <h1 className={classes.centerText}>78 </h1>
                  <h5 className={classes.centerText}>
                    <br />
                    Mg/DL
                  </h5>
                  </Grid>
              </Grid>
              <Grid className={classes.statCircle1}>
                <Grid className={classes.smallCircle}>
                  <h1 className={classes.centerText}>78 </h1>
                  <h5 className={classes.centerText}>
                    <br />
                    Mg/DL
                  </h5>
                </Grid>
              </Grid>
              <Grid className={classes.statCircle3}>
                <Grid className={classes.smallCircle}>
                  <h1 className={classes.centerText}>± 1 </h1>
                </Grid>
              </Grid>
              <Grid className={classes.statCircle4}>
                <Grid className={classes.smallCircle}>
                  <h1 className={classes.centerText}>78 </h1>
                  <h5 className={classes.centerText}>
                    <br />
                    Mg/DL
                  </h5>
                </Grid>
              </Grid>
              <Grid className={classes.statCircle5}>
                <Grid className={classes.smallCircle}>
                  <h2 className={classes.centerText}>0 </h2>
                  <h2 className={classes.centerText}>
                    <br />0
                  </h2>
                </Grid>
              </Grid>
            </Grid>
            <h2>Blodsocker</h2>
            <TimeLineChart
              chartData={bloodsugarData ? Reformat.bloodsugar(bloodsugarData, false, true) : null}
              label="Blodsocker (mmol/L)"
            ></TimeLineChart>
            <h2>Tidigare mätningar</h2>
            <CustomPaginationActionsTable
              paginate
              titles={['Datum', 'mmol/L']}
              columns={['x', 'y']}
              rows={bloodsugarData ? Reformat.bloodsugar(bloodsugarData, false) : null}
            />
          </Grid>
        </Container>
      </Grid>
    )
  }
}

const styles = (theme) => ({
  bigDiv: {
    marginTop: theme.spacing(8),
    overflowX: 'hidden',
  },
  circle: {
    marginTop: '-145vw',
    width: '200vw',
    height: '200vw',
    lineHeight: '500px',
    borderRadius: '49%',
    backgroundColor: '#17478c',
    position: 'relative',
  },
  smallCircle: {
    width: '18vw',
    height: '18vw',
    borderRadius: '50%',
    fontSize: '2.5vw',
    lineHeight: '8vw',
    color: theme.palette.text.primary,
    backgroundColor: '#fff',
  },
  statCircle1: {
    position: 'absolute',
    bottom: '36vw',
    left: '57vw',
  },
  statCircle2: {
    position: 'absolute',
    bottom: '15vw',
    left: '66vw',
  },
  statCircle3: {
    position: 'absolute',
    bottom: '4vw',
    left: '90vw',
  },

  statCircle4: {
    position: 'absolute',
    bottom: '15vw',
    right: '66vw',
  },

  statCircle5: {
    position: 'absolute',
    bottom: '36vw',
    right: '57vw',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatarCircle: {
    position: 'absolute',
    width: '40vw',
    height: '40vw',
    bottom: '24vw',
    left: '80vw',
    borderRadius: '50%',
    backgroundColor: '#C4C4C4',
  },
  centerText: {
    position: 'absolute',
    top: '23%',
    left: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
  centerSmallerText: {
    position: 'absolute',
    top: '23%',
    left: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },

  centerIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '100%',
    height: 'auto',
    color: theme.palette.text.disabled,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChildMonitor))
