import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'

import { LOAD_BLOODSUGAR, LOAD_PARTY, LOAD_WEIGHT } from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import labAvatar from '../../Static/lab_avatar.png'
import foodAvatar from '../../Static/food_avatar.png'
import trainingAvatar from '../../Static/workout_avatar_run.png'

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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
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

const ChildLaboration = (props) => {
  const id = props.currentUser.ehrid
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null

  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 1, disease)
  }, [id, disease]); // eslint-disable-line

  const classes = useStyles()

  const training = [trainingAvatar, 'training avatar', '/simulate-child-obesity', 'TRÄNING']
  const food = [foodAvatar, 'food avatar', '/simulate-child-diabetes', 'KOST']

  function getCardContent() {
    if (disease === 'DIABETES') {
      return food
    }
    return training
  }

  const cardContent = getCardContent()

  return (
    <Container component="main" maxWidth="md">
      <div className={classes.paper}>
        <img src={labAvatar} alt="laboration avatar"></img>
        <Card variant="outlined" className={classes.card}>
          <CardContent>
            <Typography variant="h4" className={classes.title} color="textSecondary" gutterBottom>
              Välkommen till labbet!
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Här kan du simluera hur du kommer att må i framtiden beroende på dina vanor. Tryck på ett kort för att
              börja.
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.diet}>
          <Button id="childSimulationPageButton" component={Link} href={cardContent[2]} color="inherit">
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={6} sm={6}>
                <Typography variant="h6" className={classes.title} color="textSecondary" gutterBottom>
                  {cardContent[3]}
                </Typography>{' '}
              </Grid>
              <Grid item xs={6} sm={6}>
                <img src={cardContent[0]} alt={cardContent[1]} height="100px"></img>
              </Grid>
            </Grid>
          </Button>
        </Card>
      </div>
    </Container>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ChildLaboration)
