import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Button,
  Grid
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import RewardCardList from "./RewardCardList";
import { DELETE_REWARD } from "../../constants/actionTypes";
import agent from "../../agent"
import agentEHR from "../../agentEHR";

import {
  PAGE_UNLOADED,
  LOAD_PARTY,
} from "../../constants/actionTypes";


const mapStateToProps = (state) => ({
    ...state.common,
    ...state.ehr,
  });

  const mapDispatchToProps = (dispatch) => ({
    onLoad: (ehrId) =>
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) }),
    onUnload: () => dispatch({ type: PAGE_UNLOADED }),

    deleteReward: (nameOf, description, reward, endDate, ehrid, snackbar) => {
      const payload=agent.Parent.deleteReward(nameOf, description, reward, endDate, ehrid)
      dispatch({ type: DELETE_REWARD, payload, snackbar}) 
    },
  })

const RewardCard = (props) => {
  const classes = styles();
  const {one_reward} = props
  ////const {id} = props.currentUser ? props.currentUser.children[0].child.ehrid : null
//  const rewards = props.currentUser ? props.currentUser.children[0].child.rewards : null


  const deleteReward = (nameOf, description, reward, endDate, id) => (ev) => {
    ev.preventDefault()
    const snackbar = {
      message: `Du tog bort reward`,
      color: 'success',
      open: true,
    }
    props.deleteReward(nameOf, description, reward, endDate, id, snackbar)

  }
  return (
    <Container className={classes.root}>
        
            <Card elevation={3} className={classes.innerCard}>
            <Grid container  direction="row" alignItems="center">
            <Grid item xs = {10}>
            <CardHeader
              title={one_reward.nameOf}
              titleTypographyProps={{ variant: "h5" }}
              avatar={<MonetizationOnIcon></MonetizationOnIcon>}
            ></CardHeader>
              </Grid>
            <Grid item xs = {2}>
              <Button
               onClick={deleteReward(one_reward.nameOf, one_reward.description, one_reward.reward, one_reward.endDate)}
               >
                <DeleteIcon color="primary" />
              </Button>
            </Grid>
            </Grid>
            <CardContent className={classes.card}>Beskrivning: {one_reward.description}</CardContent>
            <CardContent className={classes.card}>Belöning: {one_reward.reward}</CardContent>
            <CardContent className={classes.card}>Deadline: {one_reward.endDate}</CardContent>

          </Card>

    </Container>
  )
}

const styles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(0),
    },
    innerCard: {
      borderRadius: 10,
      padding: theme.spacing(0),
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
  },
  card: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(0),
    marginTop: theme.spacing(0),
}
}));
  
  export default connect(mapStateToProps, mapDispatchToProps)(RewardCard);
  