import { Avatar, TextField, Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import { withStyles } from '@material-ui/core/styles'
import RestoreIcon from '@material-ui/icons/Restore'
import React, { Component } from 'react'
import { connect } from 'react-redux'

/* eslint-disable */
const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

class ResetPassword extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { classes } = this.props
    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <RestoreIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Återställ lösenord
          </Typography>

          <form className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              name="email"
              label="Mailadress"
              autoComplete="email"
              autoFocus
            />

            <Button id="resetLoginButton" type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Logga In
            </Button>
          </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ResetPassword))
