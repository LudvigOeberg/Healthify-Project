import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
// import Grid from '@material-ui/core/Grid'
// import Button from '@material-ui/core/Button'
// import Link from '@material-ui/core/Link'

import { LOAD_BLOODSUGAR, LOAD_PARTY, LOAD_WEIGHT } from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import bgAvatar from '../../Static/real_life_rewards_child_bg.png'

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
    marginTop: '-3%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
  },
  card: {
    position: 'relative',
    top: '-100px',
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
  diet: {
    marginTop: '7vh',
    borderWidth: 5,
    borderColor: theme.palette.primary.main,
    borderRadius: 20,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const ChildRealLifeRewards = (props) => {
  const id = props.currentUser.ehrid
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null

  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 1, disease)
  }, [id, disease]); // eslint-disable-line

  const classes = useStyles()

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
    </Container>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ChildRealLifeRewards)
