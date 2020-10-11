import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Settings from '@material-ui/icons/Settings';
import Add from '@material-ui/icons/Add';
import InsertChart from '@material-ui/icons/InsertChart';
import React from 'react';
import { connect } from 'react-redux';
import { UPDATE_BOOLEAN } from '../constants/actionTypes';

const drawerWidth = 240;

const styles = makeStyles(theme => ({
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
}));


const mapStateToProps = state => {
    return {
        ...state.common
    }
};

const mapDispatchToProps = dispatch => ({
    onOpenDrawer: (value) =>
        dispatch({ type: UPDATE_BOOLEAN, key: 'drawerOpen', value })
});

const PersistantDrawer = (props) => {
    const open = props.drawerOpen;
    const classes = styles();
    const accountType = props.currentUser.type;
    const handleDrawerClose = () => {
        props.onOpenDrawer(!open);
    };
    if (accountType === "parent") {
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
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {<ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <ListItem button component="a" href="/parent">
                            <ListItemIcon><AccountCircle /></ListItemIcon>
                            <ListItemText primary={"Min profil"} />
                        </ListItem>
                        <ListItem button component="a" href="/settings">
                            <ListItemIcon><Settings /></ListItemIcon>
                            <ListItemText primary={"Inställningar"} />
                        </ListItem>
                        <ListItem button component="a" href="/register-patient">
                            <ListItemIcon><Add /></ListItemIcon>
                            <ListItemText primary={"Registrering av barn"} />
                        </ListItem>
                    </List>
                    <Divider />
                </Drawer>
            </div>
        );
    } else {
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
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {<ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <ListItem button component="a" href="/child">
                            <ListItemIcon><AccountCircle /></ListItemIcon>
                            <ListItemText primary={"Min profil"} />
                        </ListItem>
                        <ListItem button component="a" href="/parent-child-overview">
                            <ListItemIcon><InsertChart /></ListItemIcon>
                            <ListItemText primary={"Statistik"} />
                        </ListItem>
                    </List>
                    <Divider />
                </Drawer>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersistantDrawer);