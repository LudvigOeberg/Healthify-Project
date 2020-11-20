import { Avatar, Typography, Grid } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import React from 'react'
import { connect } from 'react-redux'
import Modal from '@material-ui/core/Modal'
import TextField from '@material-ui/core/TextField';
import { PAGE_UNLOADED, LOAD_PARTY } from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import {useState} from 'react';


const mapStateToProps = (state) => ({
  ...state.common,
  ...state.auth,
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: (ehrId) => dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) }),
  onUnload: () => dispatch({ type: PAGE_UNLOADED }),
})

const ParentSettingsPage = (props) => {
  const classes = styles()
  const email = props.currentUser.email
  const name = props.currentUser ? `${props.currentUser.name} ${props.currentUser.surname}` : null
  const [emailIsOpen, setEmailIsOpen] = useState(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);


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
            <Button type="submit" variant="contained" color="primary" onClick={() => setEmailIsOpen(true) }>
              Ändra e-postadress
            </Button>
          </Grid>
          <Grid className={classes.buttonGroup}>
            <Button type="submit" variant="contained" color="secondary" onClick={() => setDeleteIsOpen(true)}>
                Radera konto
            </Button>
          </Grid>

          {/*change email button popup */}
          <Modal
            className={classes.modalStyle}
            disableAutoFocus
            open={emailIsOpen}
            // onClose={console.log("closed modal")}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <Grid container direction="column" className={classes.emailModal}>
              <Grid container direction="row" className={classes.yesnoButtons}>
                <Grid>
                  <Typography variant="h6"> Ange ny e-postadress </Typography>
                </Grid>
              <form noValidate>
              <TextField 
                required
                id="email" 
                label="e-post" 
                variant="outlined" 
                autoComplete="email"
                //helperText={errors && (errors.email || errors.general)}
                //error={errors && (errors.email ? true : !!(false || errors.general))}
                value={email}
                //onChange={onChangeField}

              />
              </form>
                <Button type="submit" variant="contained" color="secondary" onClick={() => setEmailIsOpen(false)}>
                  Submit
                </Button>
                <Button type="submit" variant="contained" color="primary" onClick={() => setEmailIsOpen(false)}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Modal>

          {/*delete button popup */}
          <Modal
            className={classes.modalStyle}
            disableAutoFocus
            open={deleteIsOpen}
            // onClose={console.log("closed modal")}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"

          >
            <Grid container direction="column" className={classes.modalButton}>
              <Typography component="h1" variant="h5">
                  Bekräfta radering av konto
              </Typography>
              <Grid container direction="row" className={classes.yesnoButtons}>
                <Button type="submit" variant="contained" color="secondary" onClick={() => setDeleteIsOpen(false)}>
                  Ja
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  onClick={() => setDeleteIsOpen(false)} >
                    Nej
                </Button>
              </Grid>
            </Grid>
          </Modal>
        </div>
      </Container>
    )
}

const styles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emailText: {

    justifyContent: 'center',
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
    padding: '16px',
    borderRadius: 10

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
    borderRadius: 10

  },
  yesnoButtons: {
    justifyContent: 'space-evenly',
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
}))
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ParentSettingsPage))
