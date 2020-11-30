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


const mapStateToProps = (state) => ({
    ...state.common,
  });

const RewardCard = (props) => {
  const classes = styles();
  
  const {one_reward} = props

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
              <Button>
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
  
  export default connect(mapStateToProps)(RewardCard);
  