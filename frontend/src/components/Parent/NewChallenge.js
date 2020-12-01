import React from "react";
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
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
import RedeemIcon from "@material-ui/icons/Redeem";
import agent from "../../agent"
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import {
  PAGE_UNLOADED,
  FIELD_CHANGE,
  SAVE_REWARD
} from "../../constants/actionTypes";

const mapStateToProps = (state) => ({
    ...state.common,
    ...state.ehr,
  });

  const mapDispatchToProps = (dispatch) => ({
    onChange: (key, value) =>
      dispatch({ type: FIELD_CHANGE, key, value }),
    onUnload: () => dispatch({ type: PAGE_UNLOADED }),
  
    submitGoal: (nameOf, description, reward, endDate, ehrid, snackbar) => {
      const payload=agent.Parent.addReward(nameOf, description, reward, endDate, ehrid)
      dispatch({ type: SAVE_REWARD,  payload, snackbar}) 
    }
    
    })

const NewChallenge = (props) => {
    const classes = styles();
    const { id } = props.match.params
    let {nameOf, description, reward, endDate } = props


    //if diabetes 
    let premade = { 
      name: /* disease === "DIABETES" ? 'Blodsocker Streak' :  */'Logga vikt',
      desc: 'Logga ditt blodsocker 7 dagar på raken för att vinna utmaningen!',
      rew: 'Åka och bada',
      days: '7'           
    }


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
{/*   <CardHeader
    title="Skapa egen Utmaning"
    titleTypographyProps={{ variant: "h5" }}
    avatar={<EmojiEventsIcon></EmojiEventsIcon>}
  >
    \
  </CardHeader> */}

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
        labelId="goalweight-label"
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
        labelId="description-label"
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
        labelId="reward-label"
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
        labelId="day-label"
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
<form 
    onSubmit={submitForm(nameOf, description, reward, endDate, id)}
    noValidate>
<Accordion elevation={2} className={classes.card}>


<AccordionSummary expandIcon={<ExpandMoreIcon />}>
<Typography variant="h5">Välj en förbestämd utmaning</Typography>
</AccordionSummary>
  <RedeemIcon
    className={classes.RedeemIcon}
    fontSize="large"
  ></RedeemIcon>

<Typography variant="h6">Namn på utmaning</Typography>
      <Typography >
      {premade.name}
        <Divider/>
        </Typography>

        <Typography variant="h6">Beskrivning</Typography>
        <Typography >
        {premade.desc}
        <Divider/>
        </Typography>

        <Typography variant="h6">Belöning</Typography>
        <Typography >
        {premade.rew}
        <Divider/>
        </Typography>

        <Typography variant="h6">Antal Dagar</Typography>
        <Typography >
          {premade.days}
        <Divider/>
        </Typography>
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
  