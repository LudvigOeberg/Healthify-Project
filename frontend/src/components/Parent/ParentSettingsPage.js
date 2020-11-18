import { Avatar, Typography, Grid } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from '@material-ui/core/Modal'
import { PAGE_UNLOADED, LOAD_PARTY } from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'

const mapStateToProps = (state) => ({
  ...state.common,
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: (ehrId) => dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) }),
  onUnload: () => dispatch({ type: PAGE_UNLOADED }),
})

class ParentSettingsPage extends Component {
  constructor() {
    super()
    this.state = { openDeleteButton: false }
    this.state = { openEmailButton: false }
  }

  componentWillUnmount() {
    this.props.onUnload()
  }

  componentDidMount() {}

  changeEmail() {
    //change email
    this.setState({ openEmailButton: false })
  }
  deleteAccount() {
    // delete account from database
    // console.log("delete account")
    this.setState({ openDeleteButton: false })
  }

  render() {
    const { classes } = this.props
    const email = this.props.currentUser.email
    const name = this.props.currentUser ? `${this.props.currentUser.name} ${this.props.currentUser.surname}` : null
    return (
      <Container component="main" maxWidth="md">
        {/* {console.log(this.state.openDeleteButton)} */}
        <div className={classes.paper}>
          <Avatar className={classes.purple} src="test.123" alt={name} />
          <Typography component="h1" variant="h5">
            {name} Inställningar
          </Typography>
        </div>

        <div className={classes.paper}>
          <Grid className={classes.buttonGroup}>
            <Button type="submit" variant="contained" color="primary" onClick={() => this.setState({ openEmailButton: true })}>
              Change Email Address
            </Button>
          </Grid>
          <Grid className={classes.buttonGroup}>
            <Button type="submit" variant="contained" color="secondary" onClick={() => this.setState({ openDeleteButton: true })}>
              Delete Account
            </Button>
          </Grid>

          {/*change email button popup */}
          <Modal
            className={classes.modalStyle}
            disableAutoFocus
            open={this.state.openEmailButton}
            // onClose={console.log("closed modal")}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <Grid container direction="column" className={classes.emailModal}>
              <Grid> 
              <Typography component="h1">
                Your current email is: {email}
              </Typography>
              </Grid>
              <Grid>
              <Typography> Enter a new email address </Typography>

              </Grid>

              <Grid container direction="row" className={classes.yesnoButtons}>
                <Button type="submit" variant="contained" color="secondary" onClick={() => this.changeEmail()}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Modal>

          {/*delete button popup */}
          <Modal
            className={classes.modalStyle}
            disableAutoFocus
            open={this.state.openDeleteButton}
            // onClose={console.log("closed modal")}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <Grid container direction="column" className={classes.modalButton}>
              <Typography component="h1" variant="h5">
                Are you sure you want to delete?
              </Typography>
              <Grid container direction="row" className={classes.yesnoButtons}>
                <Button type="submit" variant="contained" color="secondary" onClick={() => this.deleteAccount()}>
                  Yes
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  onClick={() => this.setState({ openDeleteButton: false })} >
                  No
                </Button>
              </Grid>
            </Grid>
          </Modal>
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
  buttonGroup: {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '8px'
  },
  emailModal: {
    outline: 'none',
    width: '40%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: '8px',
  },
  modalButton: {
    outline: 'none',
    width: '40%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: '8px',
  },
  yesnoButtons: {
    justifyContent: 'space-around',
  },
  modalStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
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
