import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ChildList from './ChildList';
import { PAGE_UNLOADED } from '../../constants/actionTypes';
import { Typography } from '@material-ui/core';
const mapStateToProps = state => { 
  return {
    ...state.common
}};

const mapDispatchToProps = dispatch => ({
  onUnload: () =>
    dispatch({ type: PAGE_UNLOADED }),
});

class Parent extends React.Component {
  
  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const { classes } = this.props;
    const children = this.props.currentUser ? this.props.currentUser.children : null;
    if (children) {
      return (
        <Container component="main" maxWidth="md">
          <div className={classes.paper}>
            <ChildList children={children} />
          </div>
        </Container>
      );
    } else {
      return (
      <Container component="main" maxWidth="md">
        <div className={classes.paper}>
          <Typography type="h5">Inga barn</Typography>
        </div>
      </Container>
      );
    }
  }
}


const styles = theme => {
  return ({
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
      width: '50%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Parent));


