import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import { Divider } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import ScheduleIcon from '@material-ui/icons/Schedule'
import PhoneIcon from '@material-ui/icons/Phone'
import agentEHR from '../../agentEHR'
import { PAGE_UNLOADED, LOAD_PARTY } from '../../constants/actionTypes'
import CaregivingPage from '../Parent/CaregivingPage'

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
    this.props.onLoad(this.props.currentUser.ehrid)
    this.props.currentUser.parents.forEach((parent) => {
      this.props.onLoad(parent.ehrid)
    })
  }

  render() {
    const { classes } = this.props
    const parent = this.props.currentUser.parents[0]
      ? `${this.props.currentUser.parents[0].user.name} ${this.props.currentUser.parents[0].user.surname}`
      : null

    return (
      <Container component="main" maxWidth="md">
        <div className={classes.paper}>
          <h1>Delad data</h1>
          <p>Nedan finns listat de förmyndare som har tillgång till din data samt den vårdpersonal som har det.</p>
        </div>
        <Container maxWidth="xs">
          <Paper>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src="väntar på bild medans vill jag ha bokstav.jpg" />
                </ListItemAvatar>
                <ListItemText primary={parent} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <ScheduleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Tillgång sedan 27 mars 2020" />
              </ListItem>
              <ListItem button component="a" href="callto:0701234567">
                <ListItemIcon>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="070 - 1234567" />
              </ListItem>
            </List>
          </Paper>
        </Container>
        <CaregivingPage />
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AccessedData))
