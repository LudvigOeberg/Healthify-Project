import React from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PhoneIcon from '@material-ui/icons/Phone';
import MailIcon from '@material-ui/icons/Mail';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';


export default function Cargiver() {
    const classes = useStyles();  
    return (
        <Container maxWidth="sm">
            <div className={classes.paper}>
                <Paper>
                <List>
                    <ListItem alignItems="center">
                        <ListItemAvatar alignItems="flex">
                            <Avatar alt="Dr.X" />
                        </ListItemAvatar>
                        <ListItemText primary="Doktor X" />
                    </ListItem>
                    <Divider />
                    <ListItem button component="a" href="mailto:Dr.X@gmail.com"  alignItems="center">
                        <ListItemIcon>
                            <MailIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Dr.X@gmail.com" />
                    </ListItem>
                    <ListItem button component="a" href="tel:070-XXX XX XX" alignItems="center">
                        <ListItemIcon>
                            <PhoneIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="070-XXX XX XX" />
                    </ListItem>
                </List>
                </Paper>
            </div>
        </Container>
    )
}

const useStyles = makeStyles((theme) => ({
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
);
