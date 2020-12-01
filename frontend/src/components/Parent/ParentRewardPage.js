import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  Container,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Input,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import DeleteIcon from "@material-ui/icons/Delete";
import { Divider } from "@material-ui/core";
import RedeemIcon from "@material-ui/icons/Redeem";

import agentEHR from "../../agentEHR";

import {
  PAGE_UNLOADED,
  LOAD_PARTY,
  UPDATE_FIELD_AUTH,
} from "../../constants/actionTypes";

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (key, value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key, value }),
  onLoad: (ehrId) =>
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) }),
  onUnload: () => dispatch({ type: PAGE_UNLOADED }),
});

const ParentRewardPage = (props) => {
  
//  const onChange = (ev) => props.onChange(ev.target.id, ev.target.value)

  const {nameOf, description, reward, numberOfDays} = props
  
  const classes = styles();
  const challengeName = "Biobiljett placeholder :)";
  const challengeDesc =
    "Logga ditt blodsocker 3 dagar i rad för att få reward!";
    
  const sendForm = (ev) => {
    props.onChange(ev.target.id, ev.target.value)
  }

  return (
    /* -------------------------------Utmaningar-------------------------------------- */

    <Container className={classes.root}>
      <Grid item xs={12} className={classes.card}>
        <Card elevation={5} className={classes.card}>
          <CardHeader
            title="Utmaningar"
            titleTypographyProps={{ variant: "h5" }}
            avatar={<EmojiEventsIcon></EmojiEventsIcon>}
          >
            \
          </CardHeader>
          <CardContent>
            <Button
              className={classes.button}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              // onClick={   }
            >
              Lägg Till Ny Utmaning
            </Button>
            <Grid> Pågående</Grid>
            <Card elevation={3} className={classes.innerCard}>
              <CardHeader
                title={challengeName}
                titleTypographyProps={{ variant: "h5" }}
                avatar={<MonetizationOnIcon></MonetizationOnIcon>}
              ></CardHeader>
              <CardContent>{challengeDesc}</CardContent>
            </Card>

            <Grid>
              <List subheader={"Avklarade"}>
                <ListItem>
                  <ListItemText> Köpa Glass </ListItemText>
                  <ListItemIcon>
                    <Button>
                      <DeleteIcon color="primary" />
                    </Button>
                  </ListItemIcon>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText> Åka och bada </ListItemText>
                  <ListItemIcon>
                    <Button>
                      <DeleteIcon color="primary" />
                    </Button>
                  </ListItemIcon>
                </ListItem>
                <Divider />
              </List>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* -------------------------Ny Utmaning------------------------------- */}
      <Grid item xs={12} className={classes.card}>
        <Card elevation={5} className={classes.card}>
          <CardHeader
            title="Ny Utmaning"
            titleTypographyProps={{ variant: "h5" }}
            avatar={<EmojiEventsIcon></EmojiEventsIcon>}
          >
            \
          </CardHeader>

          <RedeemIcon
            className={classes.RedeemIcon}
            fontSize="large"
          ></RedeemIcon>

          <CardContent>
            <FormControl fullWidth className={classes.inputs}>
              <InputLabel>Namn på utmaningen</InputLabel>
              <Input
                fullWidth
                value={nameOf}
                id="nameOf"
                margin="dense"
                labelId="goalweight-label"
                onChange={sendForm}
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
                onChange={sendForm}
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
                onChange={sendForm}
              />
            </FormControl>

            <FormControl fullWidth className={classes.inputs}>
              <InputLabel>Antal dagar</InputLabel>
              <Input
                fullWidth
                value={numberOfDays}
                id="numberOfDays"
                margin="dense"
                labelId="day-label"
                onChange={sendForm}
              />
            </FormControl>
          </CardContent>
        </Card>

        <Button
          className={classes.button}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          onClick={sendForm}
        >
          Spara Utmaning
        </Button>
      </Grid>
    </Container>
  );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(ParentRewardPage);
