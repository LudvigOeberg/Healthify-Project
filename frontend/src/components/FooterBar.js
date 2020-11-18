import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper, Tooltip, Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import HomeIcon from '@material-ui/icons/Home';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import TimelineIcon from '@material-ui/icons/Timeline';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';

const useStyles = makeStyles((theme) => ({
    root: {
    display: 'flex',
    },

    footer: {
    position: 'fixed',
    bottom: 0,
    padding: theme.spacing(0),
    marginTop: 'auto',
    display: 'flex',
    width : '100%'
    },

    avatar: {
    border: '5px solid white',
    borderRadius: "50%",
    backgroundColor: "#59B014",
    position: "absolute",
    left: "50%",
    marginTop: "-40px",
    marginLeft: "-40px",
    bottom: "23.81%",
    width: theme.spacing(10),
    height: theme.spacing(10),
    },

    icon: {
        marginLeft: "50%",
    },

    paper: {
    height: '100%',
    padding: theme.spacing(1),
    },
}))

export default function FooterBar() {
  const classes = useStyles()
  const child = false;

  return (
    <footer className={classes.footer}>
    <Grid container className={classes.root} height="100%">

        <Grid item xs = {3}>
        <a href = {child ? "/patient" : "/parent"}>
        <Tooltip title="Hem" aria-label="home">
            <Paper className={classes.paper} square variant = "outlined">
                <HomeIcon className={classes.icon}/>
            </Paper>        
        </Tooltip>
        </a>
        </Grid>

        <Grid item xs = {3}>
         <a> 
        <Tooltip title="Blixt" aria-label="lightning">
            <Paper className={classes.paper} square variant = "outlined">
                <FlashOnIcon className={classes.icon}/>
            </Paper>   
        </Tooltip>
        </a>  
        </Grid>

        <Grid item xs = {3}>
        <a>
        <Tooltip title="Simulera" aria-label="simulation">
            <Paper className={classes.paper} square variant = "outlined">
                <TimelineIcon className={classes.icon}/>
            </Paper>
        </Tooltip>
        </a>
        </Grid>

        <Grid item xs = {3}>
        <a>
        <Tooltip title="Labb" aria-label="lab">
            <Paper className={classes.paper} square variant = "outlined">
                <FitnessCenterIcon className={classes.icon}/>
            </Paper>
        </Tooltip>
        </a>
        </Grid>

    </Grid>

    <a>
        <Tooltip title="Lägg till" aria-label="add">
        <Fab color="primary" className={classes.avatar}>
                <AddIcon fontSize = "large"/>
        </Fab>
        </Tooltip>
    </a>
    </footer>
  )
}

