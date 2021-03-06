import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import AccountCircle from '@material-ui/icons/AccountCircle'
// import TimelineIcon from '@material-ui/icons/Timeline'
import Settings from '@material-ui/icons/Settings'
import Add from '@material-ui/icons/Add'
import InsertChart from '@material-ui/icons/InsertChart'
import GroupIcon from '@material-ui/icons/Group'
import React from 'react'
import { connect } from 'react-redux'
import { UPDATE_BOOLEAN } from '../constants/actionTypes'

const drawerWidth = 240

const styles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}))

const mapStateToProps = (state) => ({
  ...state.common,
  location: state.router.location.pathname,
})

const mapDispatchToProps = (dispatch) => ({
  onOpenDrawer: (value) => dispatch({ type: UPDATE_BOOLEAN, key: 'drawerOpen', value }),
})

const PersistantDrawer = (props) => {
  const open = props.drawerOpen
  const classes = styles()
  const accountType = props.currentUser.type
  const handleDrawerClose = () => {
    props.onOpenDrawer(!open)
  }
  if (accountType === 'parent') {
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
          id="openParentDrawerButton"
        >
          <div className={classes.drawerHeader}>
            <IconButton id="closeParentDrawerButton" onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItemLink
              id="parentProfileDrawerLink"
              href="/parent"
              text="Min profil"
              avatarComponent={<AccountCircle />}
              location={props.location}
            />
            <ListItemLink
              id="parentSettingsDrawerLink"
              href="/parent-settings"
              text="Inställningar"
              avatarComponent={<Settings />}
              location={props.location}
            />
            <ListItemLink
              id="registerPatientDrawerLink"
              href="/register-patient"
              text="Registrering av barn"
              avatarComponent={<Add />}
              location={props.location}
            />
          </List>
          <Divider />
        </Drawer>
      </div>
    )
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
        id="openChildDrawerButton"
      >
        <div className={classes.drawerHeader}>
          <IconButton id="closeChildDrawerButton" onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItemLink href="/child" text="Min profil" avatarComponent={<AccountCircle />} location={props.location} />
          <ListItemLink
            id="childStatisticsDrawerLink"
            href="/child-monitor"
            text="Statistik"
            avatarComponent={<InsertChart />}
            location={props.location}
          />
          <ListItemLink
            id="sharedDataDrawerLink"
            href="/accessed-data"
            text="Delad data"
            avatarComponent={<GroupIcon />}
            location={props.location}
          />
          {/* <ListItemLink
            id="childLabDrawerLink"
            href="/child-laboration"
            text="Laboratoriet"
            avatarComponent={<TimelineIcon />}
            location={props.location}
          /> */}
          <ListItemLink
            id="childSettingsDrawerLink"
            href="/settings"
            text="Inställningar"
            avatarComponent={<Settings />}
            location={props.location}
          />
        </List>
        <Divider />
      </Drawer>
    </div>
  )
}

const ListItemLink = (props) => (
  <ListItem button selected={props.href === props.location} component="a" href={props.href}>
    <ListItemIcon>{props.avatarComponent}</ListItemIcon>
    <ListItemText primary={props.text} />
  </ListItem>
)

export default connect(mapStateToProps, mapDispatchToProps)(PersistantDrawer)
