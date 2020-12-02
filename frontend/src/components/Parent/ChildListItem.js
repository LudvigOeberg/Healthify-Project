import React, { useEffect } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import AccountBox from '@material-ui/icons/AccountBox'
import Avatar from '@material-ui/core/Avatar'
import { Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Moment from 'moment'
import EditIcon from '@material-ui/icons/Edit'
import { connect } from 'react-redux'
import agentEHR from '../../agentEHR'
import { LOAD_MULTIPLE_BLOODSUGARS, LOAD_MULTIPLE_WEIGHTS } from '../../constants/actionTypes'
import ChildListItemValue from './ChildListItemValue'
import profileAvatar from '../../Static/profile_avatar.png'
/**
 * Displays a ChildListItem
 * @param {const} props- a const with a name, an email and a telephone number to the ChildListItem
 * should look like below
 *
 */

const mapStateToProps = (state) => ({
  ...state.ehr,
  ...state.common,
})

const mapDispatchToProps = (dispatch) => ({
  loadValues: (ehrId, offset, limit, disease) => {
    if (disease === 'DIABETES')
      dispatch({ type: LOAD_MULTIPLE_BLOODSUGARS, ehrId, payload: agentEHR.Query.bloodsugar(ehrId, offset, limit) })
    else if (disease === 'OBESITY')
      dispatch({ type: LOAD_MULTIPLE_WEIGHTS, ehrId, payload: agentEHR.Query.weight(ehrId, limit) })
  },
})

function ChildListItem(props) {
  const { child } = props
  const disease = props.partyIn ? props.partyIn.additionalInfo.disease : null
  const classes = useStyles()

  useEffect(() => {
    if (disease === 'DIABETES') props.loadValues(child.ehrid, 0, 1, disease)
    else props.loadValues(child.ehrid, 0, 2, disease)
  }, [child.ehrid, disease])// eslint-disable-line

  Moment.locale('sv')
  return (
    <Paper className={classes.paper}>
      <List className={classes.card}>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={profileAvatar} alt={child.name} />
          </ListItemAvatar>
          <ListItemText
            primary={`${child.name} ${child.surname} `}
            secondary={disease === 'DIABETES' ? 'Diabetes' : 'Fetma'}
          />
          <a id="parentsEditChildButton" href={`/edit-child/${child.ehrid}`}>
            <ListItemIcon>
              <EditIcon color="primary" />
            </ListItemIcon>
          </a>
        </ListItem>
        <Divider />
        <ListItem id="parentsChildOverviewButton" button component="a" href={`/parent-child-overview/${child.ehrid}`}>
          <ListItemIcon>
            <AccountBox color="primary" />
          </ListItemIcon>
          <ListItemText primary="Gå till översikt" />
        </ListItem>

        <ChildListItemValue ehrId={child.ehrid} partyIn={props.party ? props.party[child.ehrid] : null} />
      </List>
    </Paper>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
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
  card: {
    minWidth: 300,
  },
}))

export default connect(mapStateToProps, mapDispatchToProps)(ChildListItem)
