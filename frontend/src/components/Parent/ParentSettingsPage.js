import { Avatar, Typography } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PAGE_UNLOADED, LOAD_PARTY } from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import ConfirmDialog from './ConfirmPopup'

const mapStateToProps = (state) => ({
  ...state.common,
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: (ehrId) => dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) }),
  onUnload: () => dispatch({ type: PAGE_UNLOADED }),
})

class ParentSettingsPage extends Component {
  componentWillUnmount() {
    this.props.onUnload()
  }

  componentDidMount() {}

  render() {
    const { classes } = this.props
    const name = this.props.currentUser ? `${this.props.currentUser.name} ${this.props.currentUser.surname}` : null
    return (
      <Container component="main" maxWidth="md">
        <div className={classes.paper}>
          <Avatar className={classes.purple} src="test.123" alt={name} />
          <Typography component="h1" variant="h5">
            {name} Inställningar
          </Typography>
        </div>

        <div className={classes.paper}>
          <Button type="submit" variant="contained" color="secondary">
            Delete Account
          </Button>
        </div>
      </Container>
    )
  }
}

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(12),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  purple: {
    backgroundColor: 'purple',
    color: 'white',
  },
  form: {
    width: '400px',
    // width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
})
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ParentSettingsPage))
