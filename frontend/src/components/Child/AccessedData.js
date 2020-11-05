import React, { Component } from 'react'
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { PAGE_UNLOADED, LOAD_PARTY } from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import ParentList from './ParentList'
import CaregivingPage from '../Parent/CaregivingPage';

const mapStateToProps = (state) => ({
  ...state.common,
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: (ehrId) => dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) }),
  onUnload: () => dispatch({ type: PAGE_UNLOADED }),
})

class AccessedData extends Component {
  componentWillUnmount() {
    this.props.onUnload()
  }

  componentDidMount() {
    this.props.currentUser.parents.forEach((parent) => {
      this.props.onLoad(parent.ehrid)
    })
  }

  render() {
    const { classes } = this.props;
    const parents = this.props.currentUser ? this.props.currentUser.parents : null

    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <h1>Delad data</h1>
          <p>Nedan finns listat de förmyndare som har tillgång till din data 
              samt den vårdpersonal som har det.</p>
        </div>
        <ParentList parents={parents} />
        <CaregivingPage isParent={false} />
      </Container>
    );
  }
}

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AccessedData))

