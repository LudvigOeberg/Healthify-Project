import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { Grid, Avatar, Paper } from '@material-ui/core'
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
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    position: "absolute",
    left: "50%",
    bottom: "23.81%",
    },

    paper: {
    height: '100%',
    padding: theme.spacing(1),
    },
}))

export default function Copyright() {
  const classes = useStyles()
  return (
    <footer className={classes.footer}>
    <Grid container className={classes.root} height="100%">
        <Grid item xs = {3}>
        <Paper className={classes.paper} square variant = "outlined">
            <HomeIcon />
        </Paper>
        </Grid>
        <Grid item xs = {3}>
        <Paper className={classes.paper} square variant = "outlined">
            <FlashOnIcon/>
        </Paper>     
        </Grid>
        {/* <Grid item xs = {2}>  
            <Avatar className={classes.avatar}>
            <AddIcon />
            </Avatar>
        </Grid> */}
        <Grid item xs = {3}>
        <Paper className={classes.paper} square variant = "outlined">
            <TimelineIcon/>
        </Paper>
        </Grid>
        <Grid item xs = {3}>
        <Paper className={classes.paper} square variant = "outlined">
            <FitnessCenterIcon/>
        </Paper>
        </Grid>
    </Grid>
    <Avatar className={classes.avatar} >
        <AddIcon />
    </Avatar>
    </footer>
  )
}

