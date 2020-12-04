import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Button, Container, FormControl, InputLabel, Input, Typography, Divider, Paper, SvgIcon, ListItemText} from '@material-ui/core'
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents'
import RedeemIcon from '@material-ui/icons/Redeem'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import agentEHR from '../../agentEHR'
import agent from '../../agent'
import {
  PAGE_UNLOADED,
  FIELD_CHANGE,
  SAVE_REWARD,
  LOAD_PARTY,
  LOAD_BLOODSUGAR,
  LOAD_WEIGHT,
} from '../../constants/actionTypes'
import profileAvatar from '../../Static/profile_avatar.png'
import Moment from 'moment'

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) })
  },
  onChange: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onUnload: () => dispatch({ type: PAGE_UNLOADED }),
  loadValues: (ehrId, offset, limit, disease) => {
    if (disease === 'DIABETES')
      dispatch({ type: LOAD_BLOODSUGAR, payload: agentEHR.Query.bloodsugar(ehrId, offset, limit) })
    else if (disease === 'OBESITY') dispatch({ type: LOAD_WEIGHT, payload: agentEHR.Query.weight(ehrId, limit) })
  },
  submitGoal: (nameOf, description, reward, endDate, startDate, ehrid, snackbar) => {
    const payload = agent.Parent.addReward(nameOf, description, reward, endDate, startDate, ehrid)
    dispatch({ type: SAVE_REWARD, ehrid, payload, snackbar })
  },
})

const NewChallenge = (props) => {
  const classes = styles()
  const { id } = props.match.params
  const { nameOf, description, reward, endDate, rew, days} = props
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  const name = props.party ? `${props.party[id].firstNames} ${props.party[id].lastNames}` : null
  const today = new Date()

  const premade = {
    name: disease === 'DIABETES' ? 'Blodsocker Streak' : 'Nå ditt viktmål',
    desc: disease === 'DIABETES' ? `Logga ditt blodsocker varje dag för att vinna utmaningen!` : 'När du når ditt viktmål vinner du utmaningen!',
    dateQuestion: disease === 'DIABETES' ? 'Hur länge ska ditt barns värde ligga inom det hälsosamma intervallet för att klara utmaningen?' : 'Till vilket datum ska ditt barn ha uppnått sitt viktmål?'

  }

  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 11, disease)
  }, [id, disease]) // eslint-disable-line

  const handleForm = (ev) => {
    props.onChange(ev.target.id, ev.target.value)
  }

  const submitForm = (_nameOf, _description, _reward, _endDate, _startDate, _id) => (ev) => {
    ev.preventDefault()
    const snackbar = {
      message: 'Du skapade en ny utmaning',
      color: 'success',
      open: true,
    }
    props.submitGoal(_nameOf, _description, _reward, _endDate, _startDate, _id, snackbar)
  }

  return (
      <Container className={classes.root}>
      <Grid justify="center" direction="column" alignItems="center" container>
        <Grid justify="left" alignItems="left" container>
          <a href={`/parent-reward/${id}`}>
            <Paper className={classes.backpaper} elevation={5}>
              <SvgIcon viewBox="0 0 15 22">
                <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" fill="#4F4F4F" fillOpacity="1"></path>
              </SvgIcon>
            </Paper>
          </a>
        </Grid>
        <Grid item xs={6}>
          <img src={profileAvatar} alt="Profile"></img>
        </Grid>
        <Grid item xs={4} className={classes.avatarName}>
          <Typography variant="h5"> {name} </Typography>
          <ListItemText secondary={disease === 'DIABETES' ? 'Diabetes' : 'Fetma'} />
        </Grid>
      </Grid>
      <form onSubmit={submitForm(nameOf, description, reward, endDate, Moment(today).format('YYYY-MM-DD'), id)} noValidate>
        <Accordion elevation={2} className={classes.card}>
          <AccordionSummary avatar={<EmojiEventsIcon />} expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5"> Skapa egen Utmaning </Typography>
          </AccordionSummary>
          <RedeemIcon className={classes.RedeemIcon} fontSize="large"></RedeemIcon>
          <FormControl fullWidth className={classes.inputs}>
            <InputLabel>Namn på Utmaning</InputLabel>
            <Input fullWidth value={nameOf} id="nameOf" margin="dense" onChange={handleForm} />
          </FormControl>

          <FormControl fullWidth className={classes.inputs}>
            <InputLabel>Beskrivning</InputLabel>
            <Input fullWidth value={description} id="description" margin="dense" onChange={handleForm} />
          </FormControl>
          <FormControl fullWidth className={classes.inputs}>
            <InputLabel>Belöning</InputLabel>
            <Input value={reward} fullWidth id="reward" margin="dense" onChange={handleForm} />
          </FormControl>

          <FormControl fullWidth className={classes.inputs}>
            <InputLabel shrink>Slutdatum</InputLabel>
            <Input fullWidth type="date" value={endDate} id="endDate" margin="dense" onChange={handleForm} />
          </FormControl>
          <Button
            className={classes.button}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={props.inProgress}
          >
            Spara Utmaning
          </Button>
        </Accordion>
      </form>


      <form onSubmit={submitForm(premade.name, premade.desc, rew, days, Moment(today).format('YYYY-MM-DD'), id)} noValidate>
        <Accordion elevation={2} className={classes.card}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">Välj en förbestämd utmaning</Typography>
          </AccordionSummary>
          <RedeemIcon className={classes.RedeemIcon} fontSize="large"></RedeemIcon>

          <Grid className={classes.inputs}>
            <Typography color="primary" variant="caption">
              Namn på utmaning
            </Typography>
            <Typography>
              {premade.name}
              <Divider />
            </Typography>
          </Grid>

          <Grid className={classes.inputs}>
            <Typography color="primary" variant="caption">
              Beskrivning
            </Typography>
            <Typography>
              {premade.desc}
              <Divider />
            </Typography>
          </Grid>

          <Grid className={classes.inputs}>
          <FormControl fullWidth className={classes.inputs}>
            <InputLabel>Belöning</InputLabel>
            <Input value={rew} fullWidth id="rew" margin="dense" onChange={handleForm} />
          </FormControl>
          </Grid>

          <Grid className={classes.inputs}>
            <FormControl fullWidth className={classes.inputs}>
            <InputLabel shrink></InputLabel>
            <Input fullWidth type="date" value={days} id="days" margin="dense" onChange={handleForm} />
          </FormControl>
{/* 

            <Typography>
              {premade.days}
              <Divider />
            </Typography> */}
          </Grid>

          <Button
            className={classes.button}
            type="submit" 
            fullWidth
            variant="contained"
            color="primary"
            disabled={props.inProgress}
          >
            Lägg till
          </Button>
        </Accordion>
      </form>
      </Container> 
  )
}

const styles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(0),
    alignItems: 'top',
    padding: theme.spacing(1),
  },
  card: {
    borderRadius: 10,
    padding: theme.spacing(1),
    marginBottom: 5,
  },
  innerCard: {
    borderRadius: 10,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  inputs: {
    padding: theme.spacing(1),
  },
  RedeemIcon: {
    display: 'flex',
    margin: 'auto',
  },
  backpaper: {
    width: '60px',
    height: '60px',
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    borderRadius: '50%',
  },
  avatarName: {
    textAlign: 'center',
  },
}))

export default connect(mapStateToProps, mapDispatchToProps)(NewChallenge)
