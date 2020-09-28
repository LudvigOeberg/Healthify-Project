import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  UPDATE_FIELD_AUTH,
} from '../constants/actionTypes';

const mapStateToProps = state => { 
  return {
    ...state.auth
}};

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
});

class Login extends React.Component {
  constructor() {
    super();
    this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }
  
  render() {
    const { classes } = this.props;
    const email = this.props.email;
    const password = this.props.password;
    return (
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <form className={classes.form} noValidate onSubmit={this.submitForm(email, password)}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Mailadress"
              name="email"
              autoComplete="email"
              onChange={this.changeEmail}
              value={email}
              autoFocus
            />
            <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary" 
            disabled={this.props.inProgress}
            className={classes.submit}
            >
            Reset Password
          </Button>
          </form>
          </div>
        </Container>
    );
  }
}


const styles = theme => {
  return ({
    paper: {
      marginTop: theme.spacing(8),
    },
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));
