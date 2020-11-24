import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import PhoneIcon from '@material-ui/icons/Phone'
import MailIcon from '@material-ui/icons/Mail'
import Container from '@material-ui/core/Container'
import { Divider } from '@material-ui/core'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

/**
 * Displays a caregiver
 * @param {const} props- a const with a name, an email and a telephone number to the caregiver
 * should look like below
 * const doctor={
 * name: "Sebastian",
 * mail: "hej@gmail.com",
 * telephone: "XXX-XXXXXXX"
 * }
 */
export default function Caregiver(props) {
  return (
    <Container>
      <List>
        <ListItem>
          <ListItemIcon>
            <AccountCircleIcon fontSize = "large"/> 
          </ListItemIcon>
          <ListItemText primary={props.name} secondary = {props.org}/>
        </ListItem>
        <Divider />
        <ListItem button component="a" href={`mailto:${props.mail}`}>
          <ListItemIcon>
            <MailIcon/>
          </ListItemIcon>
          <ListItemText primary={props.mail} />
        </ListItem>
        <ListItem button component="a" href={`tel:${props.telephone}`}>
          <ListItemIcon>
            <PhoneIcon/>
          </ListItemIcon>
          <ListItemText primary={props.telephone} />
        </ListItem>
      </List>
    </Container>
  )
}