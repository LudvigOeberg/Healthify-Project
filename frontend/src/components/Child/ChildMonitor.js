import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

import Container from '@material-ui/core/Container'
import { connect } from 'react-redux'
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
      <Container component="main" maxWidth="sm">
        <div className={classes.paper}>
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
    )
  }
}

const styles = (theme) => ({
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
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChildMonitor))
