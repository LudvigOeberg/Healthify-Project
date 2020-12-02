import { Grid, Typography } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import { withStyles } from '@material-ui/core/styles'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import ChildList from './ChildList'
import { PAGE_UNLOADED, LOAD_PARTY } from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import profileAvatar from '../../Static/rsz_avatar.png'


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
        <Container component="main">
          <div className={classes.paper}>
            <Grid className={classes.avatar} justify="center" direction="column" alignItems="center" container>
              <Grid item xs={8}>
                <img src={profileAvatar} alt="Profile"></img>
              </Grid>
              <Grid item xs={4} className={classes.avatarName}>
                <Typography variant="h5"> {name} </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h6' align='center'>
                  {children && children[0] ? "Registrerade barn" : 'Inga registrerade barn'}
                </Typography>
              </Grid>
            </Grid>
            {/* child list component to list children for logged in user */}
            {/* eslint-disable-next-line react/no-children-prop */}
            <ChildList children={children} />
          </div>
        </Container>
      )
    }
    return (
      <Container component="main">
        <div className={classes.paper}>
          <Grid className={classes.avatar} justify="center" direction="column" alignItems="center" container>
            <Grid item xs={6}>
              <img src={profileAvatar} alt="Profile" ></img>
            </Grid>
            <Grid item xs={4} className={classes.avatarName}>
              <Typography variant="h5"> {name} </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6' align='center'>
                Inga registrerade barn
            </Typography>
            </Grid>
          </Grid>



          <div className={classes.paper}>
            <a className={classes.link} id="parentAddChildLink" href="/register-patient">
            <AddCircleOutlineRoundedIcon color="primary" style={{ fontSize: 100 }} />
            <Typography fontSize="50" color="primary" align='center'>
              Lägg till barn
            </Typography>
            </a>
          </div>
        </div>
      </Container>
    )
  }
}

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  main: {
    width: '100%',
  },
  avatar: {
    marginTop: theme.spacing(6),
  },
  avatarName: {
    textAlign: 'center',
  },
  link:{
    textDecoration: 'none !important'
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ParentPage))
