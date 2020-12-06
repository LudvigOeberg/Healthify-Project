import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import { LOAD_BLOODSUGAR, LOAD_PARTY, LOAD_WEIGHT } from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import bgAvatar from '../../Static/real_life_rewards_child_bg.png'
import RewardCardList from '../Parent/RewardCardList'
import RewardCardChild from './RewardCardChild'

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) })
  },
  loadValues: (ehrId, offset, limit, disease) => {
    if (disease === 'DIABETES')
      dispatch({
        type: LOAD_BLOODSUGAR,
        payload: agentEHR.Query.bloodsugar(ehrId, offset, limit),
      })
    else if (disease === 'OBESITY')
      dispatch({
        type: LOAD_WEIGHT,
        payload: agentEHR.Query.weight(ehrId, limit),
      })
  },
})

const useStyles = makeStyles((theme) => ({
  paper: {
    //  marginTop: theme.spacing(8),
    marginTop: '-5vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backgroundImage: {
    maxWidth: '110%',
    maxHeight: '50vh',
  },
  card: {
    position: 'relative',
    top: '-15vh',
    borderWidth: 5,
    borderColor: theme.palette.primary.main,
    borderRadius: 20,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  title: {
    color: theme.palette.text.primary,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  wrapper: {
    position: 'relative',
    top: '-10vh',
  },
}))

const ChildRealLifeRewards = (props) => {
  const id = props.currentUser.ehrid
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  const { rewards } = props.currentUser

  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 1, disease)
  }, [id, disease]); // eslint-disable-line

  const classes = useStyles()

  const finishedReward = {
    description: 'Ta ett test om dagen',
    endDate: '2020-12-17',
    nameOf: 'Gå på bio',
    reward: 'Se Bilar 4 på bio',
  }

  return (
    <Container component="main" maxWidth="" className={classes.paper}>
      <img src={bgAvatar} alt="background" className={classes.backgroundImage}></img>
      <Card variant="outlined" className={classes.card}>
        <CardContent>
          <Typography variant="h4" className={classes.title} color="textSecondary" gutterBottom>
            Dina utmaningar
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Här kan du se vilka utmaningar som du kan göra samt hur det går för dig i de olika utmaningarna!
          </Typography>
        </CardContent>
      </Card>
      <Container className={classes.wrapper}>
        <RewardCardChild oneReward={finishedReward}></RewardCardChild>
        <RewardCardList rewards={rewards}></RewardCardList>
      </Container>
    </Container>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ChildRealLifeRewards)
