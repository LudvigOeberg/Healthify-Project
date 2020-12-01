import React, { useEffect } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Moment from 'moment'
import { connect } from 'react-redux'
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined'
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import TrendingDownIcon from '@material-ui/icons/TrendingDown'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
import agentEHR from '../../agentEHR'
import { LOAD_MULTIPLE_BLOODSUGARS, LOAD_MULTIPLE_WEIGHTS } from '../../constants/actionTypes'
/**
 * Displays a ChildListItemValue
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

function ChildListItemValue(props) {
    const { ehrId } = props
    const disease = props.partyIn ? props.partyIn.additionalInfo.disease : null
    const SU_LO = props.partyIn ? props.partyIn.additionalInfo.SU_LO : null
    const SU_HI = props.partyIn ? props.partyIn.additionalInfo.SU_HI : null
    const weight =
      disease === 'OBESITY' && props.weights && props.weights[ehrId] && props.weights[ehrId].weight[0]
        ? props.weights[ehrId].weight[0]
        : null
    const bloodsugar =
      disease === 'DIABETES' &&
      props.bloodsugars &&
      props.bloodsugars[ehrId] &&
      props.bloodsugars[ehrId].bloodsugar
        ? props.bloodsugars[ehrId].bloodsugar[0]
        : null
    const badBloodsugar = !!(
      props.bloodsugars &&
      disease === 'DIABETES' &&
      bloodsugar &&
      (bloodsugar.value < SU_LO || bloodsugar.value > SU_HI)
    )
    const badWeight = !!(
      props.weights &&
      disease === 'OBESITY' &&
      weight &&
      props.weights[ehrId].weight[1] &&
      props.weights[ehrId].weight[1].weight < weight.weight
    )
    const oneOrSameWeight = !(
      props.weights &&
      disease === 'OBESITY' &&
      weight &&
      props.weights[ehrId].weight[1] &&
      props.weights[ehrId].weight[1].weight !== weight.weight
    )
    useEffect(() => {
        if (disease === 'DIABETES') props.loadValues(ehrId, 0, 1, disease)
        else props.loadValues(ehrId, 0, 2, disease)
    }, [ehrId, disease])// eslint-disable-line
    
    Moment.locale('sv')
    return (
    <ListItem>
    <Paper hidden={!weight && !bloodsugar} elevation={0}>
        <ListItemIcon>
        <Paper hidden={(disease === 'DIABETES' && badBloodsugar) || disease === 'OBESITY'} elevation={0}>
            <ThumbUpAltOutlinedIcon style={{ color: 'green' }} />
        </Paper>
        <Paper hidden={(disease === 'DIABETES' && !badBloodsugar) || disease === 'OBESITY'} elevation={0}>
            <ThumbDownAltOutlinedIcon style={{ color: 'red' }} />
        </Paper>
        <Paper
            hidden={
            (disease === 'OBESITY' && badWeight) ||
            (disease === 'OBESITY' && oneOrSameWeight) ||
            disease === 'DIABETES'
            }
            elevation={0}
        >
            <TrendingDownIcon style={{ color: 'green' }} />
        </Paper>
        <Paper hidden={(disease === 'OBESITY' && !oneOrSameWeight) || disease === 'DIABETES'} elevation={0}>
            <ArrowRightAltIcon style={{ color: 'gray' }} />
        </Paper>
        <Paper
            hidden={
            (disease === 'OBESITY' && !badWeight) ||
            (disease === 'OBESITY' && oneOrSameWeight) ||
            disease === 'DIABETES'
            }
            elevation={0}
        >
            <TrendingUpIcon style={{ color: 'red' }} />
        </Paper>
        </ListItemIcon>
    </Paper>
    <ListItemText
        hidden={!bloodsugar}
        primary={`${props.bloodsugars && disease === 'DIABETES' && bloodsugar ? bloodsugar.value : null}
    ${props.bloodsugars && disease === 'DIABETES' && bloodsugar ? bloodsugar.unit : null}
    `}
        secondary={
        props.bloodsugars && disease === 'DIABETES' && bloodsugar
            ? Moment(bloodsugar.time).format('YYYY-MM-DD [kl:] HH:mm')
            : null
        }
    />
    <ListItemText hidden={bloodsugar || weight} primary="Inget värde har mätts" />
    <ListItemText
        hidden={!weight}
        primary={`${props.weights && disease === 'OBESITY' && weight ? weight.weight : null}
    ${props.weights && disease === 'OBESITY' && weight ? weight.unit : null}
    `}
        secondary={
        props.weights && disease === 'OBESITY' && weight
            ? Moment(weight.time).format('YYYY-MM-DD [kl:] HH:mm')
            : null
        }
    />
    </ListItem>
    )
  }

  export default connect(mapStateToProps, mapDispatchToProps)(ChildListItemValue)
