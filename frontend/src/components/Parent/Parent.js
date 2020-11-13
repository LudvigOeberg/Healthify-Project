import { Avatar, Typography } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import { withStyles } from '@material-ui/core/styles'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import AddIcon from '@material-ui/icons/Add'
import ChildList from './ChildList'
import { PAGE_UNLOADED, LOAD_PARTY } from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'

const mapStateToProps = (state) => ({
  ...state.common,
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: (ehrId) => dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) }),
  onUnload: () => dispatch({ type: PAGE_UNLOADED }),
})

class ParentPage extends Component {
  componentWillUnmount() {
    this.props.onUnload()
  }

  componentDidMount() {
    if (this.props.currentUser.children) {
      this.props.currentUser.children.forEach((child) => {
        this.props.onLoad(child.child.ehrid)
      })
    }
  }

  render() {
    const { classes } = this.props
    const children = this.props.currentUser ? this.props.currentUser.children : null
    const name = this.props.currentUser ? `${this.props.currentUser.name} ${this.props.currentUser.surname}` : null
    if (children) {
      return (
        <Container component="main" maxWidth="md">
          <div className={classes.paper}>
            <Avatar className={classes.purple} src="test.123" alt={name} />
            <Typography component="h1" variant="h5">
              {name}
            </Typography>

            {/* child list component to list children for logged in user */}
            {/* eslint-disable-next-line react/no-children-prop */}
            <ChildList children={children} />
          </div>
        </Container>
      )
    }
    return (
      <Container component="main" maxWidth="md">
        <div className={classes.paper}>
          <Avatar className={classes.purple} src="test.123" alt={name} />
          <Typography component="h1" variant="h5">
            {name}
          </Typography>

          <div className={classes.paper}>
            <a href="/register-patient">
              <AddIcon color="primary" style={{ fontSize: 100 }} />
            </a>
            <Typography fontSize="50" color="primary">
              Lägg till barn
            </Typography>
          </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ParentPage))
