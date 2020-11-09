import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import AccessTime from '@material-ui/icons/AccessTime'
import AccountBox from '@material-ui/icons/AccountBox'
import Avatar from '@material-ui/core/Avatar'
import Container from '@material-ui/core/Container'
import { Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Moment from 'moment'
import EditIcon from '@material-ui/icons/Edit'
/**
 * Displays a ChildListItem
 * @param {const} props- a const with a name, an email and a telephone number to the ChildListItem
 * should look like below
 *
 */
export default function ChildListItem(props) {
  const classes = useStyles()
  Moment.locale('sv')
  return (
    <Container maxWidth="md">
      <div className={classes.paper}>
        <Paper>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar src="väntar på bild medans vill jag ha bokstav.jpg" alt={props.name} />
              </ListItemAvatar>
              <ListItemText primary={`${props.name} ${props.surname}`} />
              <a href={`/edit-child/${props.ehrid}`}>
                <ListItemIcon>
                  <EditIcon color="primary" />
                </ListItemIcon>
              </a>
            </ListItem>
            <Divider />
            <ListItem button component="a" href={`/parent-child-overview/${props.ehrid}`}>
              <ListItemIcon>
                <AccountBox color="primary" />
              </ListItemIcon>
              <ListItemText primary="Gå till översikt" />
            </ListItem>
            <ListItem button component="a" href="/caregiving-team">
              <ListItemIcon>
                <AccountBox color="primary" />
              </ListItemIcon>
              <ListItemText primary="Se vårdteam" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccessTime color="primary" />
              </ListItemIcon>
              <ListItemText primary={`Senast inloggad: ${Moment(props.lastseen).format('YYYY-MM-DD [kl:] hh:mm')}`} />
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
}))
