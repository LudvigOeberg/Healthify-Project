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
import CustomPaginationActionsTable from '../TablePagination'
import Reformat from '../../reformatEHRData'

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
      <div className={classes.bigDiv}>
        <Container component="main" maxWidth="sm" disableGutters>
          <div className={classes.paper}>
            <div className={classes.circle}>
              <div className={classes.avatarCircle}>
                <PersonIcon className={classes.centerIcon} />
              </div>
              <div className={classes.statCircle2}>
                <div className={classes.smallCircle}>
                  <h1 className={classes.centerText}>50 </h1>
                  <h5 className={classes.centerText}>
                    <br />g
                  </h5>
                </div>
              </div>
              <div className={classes.statCircle1}>
                <div className={classes.smallCircle}>
                  <h1 className={classes.centerText}>78 </h1>
                  <h5 className={classes.centerText}>
                    <br />
                    Mg/DL
                  </h5>
                </div>
              </div>
              <div className={classes.statCircle3}>
                <div className={classes.smallCircle}>
                  <h1 className={classes.centerText}>± 1 </h1>
                </div>
              </div>
              <div className={classes.statCircle4}>
                <div className={classes.smallCircle}>
                  <h1 className={classes.centerText}>78 </h1>
                  <h5 className={classes.centerText}>
                    <br />
                    Mg/DL
                  </h5>
                </div>
              </div>
              <div className={classes.statCircle5}>
                <div className={classes.smallCircle}>
                  <h2 className={classes.centerText}>0 </h2>
                  <h2 className={classes.centerText}>
                    <br />0
                  </h2>
                </div>
              </div>
            </div>
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
          </div>
        </Container>
      </div>
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
    borderRadius: '50%',
    backgroundColor: '#17478c',
    position: 'relative',
  },
  smallCircle: {
    width: '20vw',
    height: '20vw',
    borderRadius: '50%',
    fontSize: '1rem',
    lineHeight: '40px',
    color: theme.palette.text.primary,
    backgroundColor: '#fff',
  },
  statCircle1: {
    position: 'absolute',
    bottom: '43vw',
    left: '55vw',
  },
  statCircle2: {
    position: 'absolute',
    bottom: '20vw',
    left: '62vw',
  },
  statCircle3: {
    position: 'absolute',
    bottom: '4vw',
    left: '90vw',
  },

  statCircle4: {
    position: 'absolute',
    bottom: '20vw',
    right: '62vw',
  },

  statCircle5: {
    position: 'absolute',
    bottom: '43vw',
    right: '55vw',
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
    bottom: '27vw',
    left: '80vw',
    borderRadius: '50%',
    fontSize: '25px',
    textAlign: 'center',
    backgroundColor: theme.palette.text.secondary,
  },
  centerText: {
    position: 'absolute',
    top: '15%',
    left: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },

  centerIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '15vw',
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
