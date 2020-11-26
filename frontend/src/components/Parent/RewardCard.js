import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";


const mapStateToProps = (state) => ({
    ...state.common,
  });

const RewardCard = (props) => {
  const classes = styles();
    

  const challengeName = "heeej duuu" //{props.nameOf}
  const challengeDesc = "Logga ditt blodsocker 3 dagar i rad för att få reward!";
  const challengeReward = "Biobiljett";
  const challengeDeadline = "senast 2023";

  return (
    <Container className={classes.root}>

            <Card elevation={3} className={classes.innerCard}>
            <CardHeader
              title={challengeName}
              titleTypographyProps={{ variant: "h5" }}
              avatar={<MonetizationOnIcon></MonetizationOnIcon>}
            ></CardHeader>
            <CardContent className={classes.card}>{challengeDesc}</CardContent>
            <CardContent className={classes.card}>Belöning: {challengeReward}</CardContent>
            <CardContent className={classes.card}>Deadline: {challengeDeadline}</CardContent>
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
  