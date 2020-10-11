import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';
import { LOGOUT, UPDATE_BOOLEAN } from '../constants/actionTypes';
import PersistantDrawer from './Drawer';

const LoggedOutView = props => {
  const classes = useStyles();
  if (!props.currentUser) {
    return (
      <div className={classes.root}>
      <AppBar className={classes.nav} position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Button className={classes.title} component={Link} href="/" color="inherit">{props.appName}</Button>
          </Typography>
          <Button component={Link} href="/login" color="inherit">Logga in</Button>
          <Button component={Link} href="/register" color="inherit">Registrera dig</Button>
          <Button component={Link} href="/ParentPage" color="inherit"> Parent Page </Button>
        </Toolbar>
      </AppBar>
    </div>
    );
  }
  return null;
};

const LoggedInView = props => {
  const classes = useStyles();
  if (props.currentUser) {
    return (
    <div className={classes.root}>
      <AppBar className={clsx(classes.nav, {
          [classes.appBarShift]: props.drawerOpen,
        })} position="static">
        <Toolbar>
          <IconButton className={clsx(classes.menuButton, props.drawerOpen && classes.hide)} onClick={props.openDrawer(props.drawerOpen)} edge="start" color="inherit" aria-label="menu">
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Button component={Link} href="/" color="inherit">{props.appName}</Button>
          </Typography>
          <Button component={Link} onClick={props.logout} color="inherit">Logga ut</Button>
        </Toolbar>
      </AppBar>
      <PersistantDrawer/>
    </div>
    );
  }

  return null;
};

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  drawerOpen: state.common.drawerOpen
});

const mapDispatchToProps = dispatch => ({
  onClickLogout: () => dispatch({ type: LOGOUT }),
  onClickDrawerOpen: (value) => dispatch({ type: UPDATE_BOOLEAN, key: "drawerOpen", value })
});

class Header extends React.Component {
  constructor() {
    super();
    this.logout = ev => this.props.onClickLogout();
    this.openDrawer = ev => val => this.props.onClickDrawerOpen(val);
  }

  render() {
    const drawerOpen = this.props.drawerOpen;
    return (
      <nav className="navbar navbar-light" style={{zIndex: 100}}>
          <LoggedOutView currentUser={this.props.currentUser} appName={this.props.appName} />
          <LoggedInView openDrawer={this.openDrawer} drawerOpen={drawerOpen} currentUser={this.props.currentUser} appName={this.props.appName} logout={this.logout} />
      </nav>
    );
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textTransform: `none`,
    fontSize: `1rem`,
  },
  hide: {
    display: 'none',
  },
}));

export default connect(mapStateToProps, mapDispatchToProps)(Header);
