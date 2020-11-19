import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Container from '@material-ui/core/Container'
import { Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Moment from 'moment'
import ScheduleIcon from '@material-ui/icons/Schedule'
import PhoneIcon from '@material-ui/icons/Phone'
/**
 * Displays a ParentListItem
 * @param {const} props- a const with a name to the parent
 * should look like below
 *
 */
export default function ParentListItem(props) {
  const classes = useStyles()
  Moment.locale('sv')
  return (
    <Container maxWidth="md">
      <div className={classes.paper}>
        <Paper>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar src="väntar på bild medans vill jag ha bokstav.jpg" />
              </ListItemAvatar>
              <ListItemText primary={`${props.name} ${props.surname}`} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <ScheduleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Tillgång sedan 27 mars 2020" />
            </ListItem>
            <ListItem button component="a" href="callto:0701234567">
              <ListItemIcon>
                <PhoneIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="070 - 1234567" />
            </ListItem>
          </List>
        </Paper>
      </div>
    </Container>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
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
}))
