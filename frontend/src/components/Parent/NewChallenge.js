import React, {useEffect} from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  FormControl,
  InputLabel,
  Input,
  Typography,
  Divider
} from "@material-ui/core";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
import RedeemIcon from "@material-ui/icons/Redeem";
import agent from "../../agent"
import agentEHR from '../../agentEHR'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {
  PAGE_UNLOADED,
  FIELD_CHANGE,
  SAVE_REWARD,
  LOAD_PARTY,
  LOAD_BLOODSUGAR,
  LOAD_WEIGHT

} from "../../constants/actionTypes";

const mapStateToProps = (state) => ({
    ...state.common,
    ...state.ehr,
  });

  const mapDispatchToProps = (dispatch) => ({
    onLoad: (ehrId) =>
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) }),
    onChange: (key, value) =>
      dispatch({ type: FIELD_CHANGE, key, value }),
    onUnload: () => dispatch({ type: PAGE_UNLOADED }),
    loadValues: (ehrId, offset, limit, disease) => {
      if (disease === 'DIABETES')
        dispatch({ type: LOAD_BLOODSUGAR, payload: agentEHR.Query.bloodsugar(ehrId, offset, limit) })
      else if (disease === 'OBESITY') dispatch({ type: LOAD_WEIGHT, payload: agentEHR.Query.weight(ehrId, limit) })
    },
    submitGoal: (nameOf, description, reward, endDate, ehrid, snackbar) => {
      const payload=agent.Parent.addReward(nameOf, description, reward, endDate, ehrid)
      dispatch({ type: SAVE_REWARD, ehrid, payload, snackbar}) 
    }
    
    })

const NewChallenge = (props) => {
    const classes = styles();
    const { id } = props.match.params
    let {nameOf, description, reward, endDate } = props
    const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null

      let premade = { 
        name: disease === "DIABETES" ? 'Blodsocker Streak' :  'Logga vikt',
        desc: disease === "DIABETES" ? 'Logga ditt blodsocker 7 dagar på raken för att vinna utmaningen!': 'Spring 20 gånger',
        rew : disease === "DIABETES" ? 'Åka och bada' : 'Biobesök',
        days: disease === "DIABETES" ? '7' : '20'           
      }   
    
  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 11, disease)
  }, [id, disease]) // eslint-disable-line

    const handleForm = (ev) => {
        props.onChange(ev.target.id, ev.target.value)
      }

    const submitForm = (nameOf, description, reward, endDate, id) => (ev) =>{
      ev.preventDefault()
      const snackbar = {
        message: 'Du skapade en ny utmaning' ,
        color: 'success',
        open: true,
      }
      props.submitGoal(nameOf, description, reward, endDate, id, snackbar)
      //redirect href={`/add-reward/${id}`}
    }

return (
<Grid item xs={12} className={classes.card}>

<form 
    onSubmit={submitForm(nameOf, description, reward, endDate, id)}
    noValidate>
<Accordion elevation={2} className={classes.card}>


  <AccordionSummary avatar={<EmojiEventsIcon/>} expandIcon={<ExpandMoreIcon />}>
  <Typography variant="h5"> Skapa egen Utmaning </Typography>
  </AccordionSummary>
  <RedeemIcon
    className={classes.RedeemIcon}
    fontSize="large"
  ></RedeemIcon>
    <FormControl fullWidth className={classes.inputs}>
      <InputLabel>Namn på Utmaning</InputLabel>
      <Input
        fullWidth
        value={nameOf}
        id="nameOf"
        margin="dense"
        onChange={handleForm}
      />
    </FormControl>

    <FormControl fullWidth className={classes.inputs}>
      <InputLabel>Beskrivning</InputLabel>
      <Input
        fullWidth
        value={description}
        id="description"
        margin="dense"
        onChange={handleForm}
      />
    </FormControl>
    <FormControl fullWidth className={classes.inputs}>
      <InputLabel>Belöning</InputLabel>
      <Input
        value={reward}
        fullWidth
        id="reward"
        margin="dense"
        onChange={handleForm}
      />
    </FormControl>

    <FormControl fullWidth className={classes.inputs}>
      <InputLabel shrink={true}>Slutdatum</InputLabel>
      <Input
        fullWidth
        type='date'
        value={endDate}
        id="endDate"
        margin="dense"
        onChange={handleForm}
      />
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

{/* ---------------------------- */}

<form 
    onSubmit={submitForm(premade.name, premade.desc, premade.rew, premade.days, id)}
    noValidate>
<Accordion elevation={2} className={classes.card}>
<AccordionSummary expandIcon={<ExpandMoreIcon />}>
<Typography variant="h5">Välj en förbestämd utmaning</Typography>
</AccordionSummary>
  <RedeemIcon
    className={classes.RedeemIcon}
    fontSize="large"
  ></RedeemIcon>

  
<Grid className={classes.inputs}>
  <Typography  color="primary" variant="caption">Namn på utmaning</Typography>
      <Typography >
      {premade.name}
        <Divider/>
        </Typography>
        </Grid>

        <Grid className={classes.inputs}>
        <Typography  color="primary" variant="caption" >Beskrivning</Typography>
        <Typography >
        {premade.desc}
        <Divider/>
        </Typography>
        </Grid>
        
        <Grid className={classes.inputs}>
        <Typography  color="primary" variant="caption">Belöning</Typography>
        <Typography >
        {premade.rew}
        <Divider/>
        </Typography>
        </Grid>

        <Grid className={classes.inputs}>
        <Typography  color="primary" variant="caption">Antal Dagar</Typography>
        <Typography >
          {premade.days}
        <Divider/>
        </Typography>
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

</Grid>

    )
}

const styles = makeStyles((theme) => ({
    root: {
      marginTop: theme.spacing(8),
      alignItems: "top",
      display: "flex",
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
      display: "flex",
      margin: "auto",
    },
  }));
  
  export default connect(mapStateToProps, mapDispatchToProps)(NewChallenge);
  