import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

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
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Button component={Link} href="/" color="inherit">{props.appName}</Button>
          </Typography>
          <Link href="/logout" color="inherit">Logga ut</Link>
        </Toolbar>
      </AppBar>
    </div>
  }

  return null;
};

class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-light" style={{zIndex: 100}}>
          <LoggedOutView currentUser={this.props.currentUser} appName={this.props.appName} />
          <LoggedInView currentUser={this.props.currentUser} appName={this.props.appName} />
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
}));

export default Header;
