import React, {useEffect} from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import AccountBox from '@material-ui/icons/AccountBox'
import Avatar from '@material-ui/core/Avatar'
import Container from '@material-ui/core/Container'
import { Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Moment from 'moment'
import EditIcon from '@material-ui/icons/Edit'
import { connect } from 'react-redux'
import {
  LOAD_MULTIPLE_BLOODSUGARS,
  LOAD_MULTIPLE_WEIGHTS,
} from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
/**
 * Displays a ChildListItem
 * @param {const} props- a const with a name, an email and a telephone number to the ChildListItem
 * should look like below
 *
 */

const mapStateToProps = (state) =>({
  ...state.ehr,
  ...state.common
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
  const child = props.child
  const disease = props.partyIn ? props.partyIn.additionalInfo.disease : null
  const classes = useStyles()
  const weight  = disease==='OBESITY' && props.weights && props.weights[child.ehrid] && props.weights[child.ehrid].weight[0] ? props.weights[child.ehrid].weight[0] : null
  const bloodsugar =  disease==='DIABETES' && props.bloodsugars && props.bloodsugars[child.ehrid] && props.bloodsugars[child.ehrid].bloodsugar ? props.bloodsugars[child.ehrid].bloodsugar[0]  : null
  const badBloodsugar = props.bloodsugars && disease==='DIABETES' &&  bloodsugar && (bloodsugar.value<3 || bloodsugar.value>10) ? true : false
  const badWeight = props.weights && disease==='OBESITY' && weight && props.weights[child.ehrid].weight[1] && props.weights[child.ehrid].weight[1].weight < weight.weight ? true : false
  const oneOrSameWeight = props.weights && disease==='OBESITY' && weight && props.weights[child.ehrid].weight[1] && props.weights[child.ehrid].weight[1].weight !== weight.weight? false : true
  

  useEffect(() => {
    if(disease==='diabetes')
      props.loadValues(child.ehrid, 0, 1, disease)
    else
      props.loadValues(child.ehrid, 0, 2, disease)
  }, [child.ehrid, disease])// eslint-disable-line

  Moment.locale('sv')
  return (
    <Container maxWidth="md">
      <div className={classes.paper}>
        <Paper>
          <List className={classes.card}>
            <ListItem>
              <ListItemAvatar>
                <Avatar src="väntar på bild medans vill jag ha bokstav.jpg" alt={child.name} />
              </ListItemAvatar>
              <ListItemText primary={`${child.name} ${child.surname} `} secondary={disease==='DIABETES' ? 'Diabetes' : 'Fetma'}/>
              <a href={`/edit-child/${child.ehrid}`}>
                <ListItemIcon>
                  <EditIcon color="primary" />
                </ListItemIcon>
              </a>
            </ListItem>
            <Divider />
            <ListItem button component="a" href={`/parent-child-overview/${child.ehrid}`}>
              <ListItemIcon>
                <AccountBox color="primary" />
              </ListItemIcon>
              <ListItemText primary="Gå till översikt" />
            </ListItem>
           {/*  <ListItem>
              <ListItemIcon>
                <AccessTime color="primary" />
              </ListItemIcon>
              <ListItemText primary={`Senast inloggad: ${Moment(child.lastSeen).format('YYYY-MM-DD [kl:] hh:mm')}`} />
            </ListItem> */}
            
            <ListItem >
            <Paper hidden={!weight && !bloodsugar} elevation={0}>
              <ListItemIcon>
                <Paper hidden={(disease==='DIABETES' && badBloodsugar) || disease==='OBESITY'} elevation={0}>
                  <ThumbUpAltOutlinedIcon style={{color: "green"}}/>
                </Paper>
                <Paper hidden={(disease==='DIABETES' && !badBloodsugar) || disease==='OBESITY'} elevation={0}>
                  <ThumbDownAltOutlinedIcon style={{color: "red"}}/>
                </Paper>
                <Paper hidden={(disease==='OBESITY' && badWeight ) || (disease==='OBESITY' && oneOrSameWeight ) || disease==='DIABETES' } elevation={0}>
                  <TrendingDownIcon style={{color: "green"}}/>
                </Paper>
                <Paper hidden={(disease==='OBESITY' && !oneOrSameWeight) || disease==='DIABETES' } elevation={0}>
                  <ArrowRightAltIcon style={{color: "gray"}}/>
                </Paper>
                <Paper hidden={( disease==='OBESITY' &&  !badWeight)  || (disease==='OBESITY' && oneOrSameWeight ) || disease==='DIABETES' } elevation={0}>
                  <TrendingUpIcon style={{color: "red"}}/>
                </Paper>
              </ListItemIcon>
              </Paper>
              <ListItemText 
              hidden={!bloodsugar} 
              primary={`${props.bloodsugars && disease==='DIABETES' &&  bloodsugar  ? bloodsugar.value : null }
              ${props.bloodsugars && disease==='DIABETES' &&  bloodsugar ? bloodsugar.unit : null }
              `} 
              secondary={props.bloodsugars && disease==='DIABETES' &&  bloodsugar ? Moment(bloodsugar.time).format('YYYY-MM-DD [kl:] HH:mm') : null}

              />
              <ListItemText 
              hidden={bloodsugar || weight} 
              primary={`${child.name} har inte mätt något värde än `}
              />
              <ListItemText 
              hidden={!weight} 
              primary={`${props.weights && disease==='OBESITY' && weight ? weight.weight : null }
              ${props.weights && disease==='OBESITY' && weight  ? weight.unit : null }
              `} 
              secondary= {props.weights && disease==='OBESITY' && weight ? Moment(weight.time).format('YYYY-MM-DD [kl:] HH:mm') : null }
              />
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
    justifyItems: 'flex-start'
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
    width:'100%',
    minWidth: 300
  }
}))

export default connect(mapStateToProps, mapDispatchToProps)(ChildListItem)