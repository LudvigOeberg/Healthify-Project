import React, { useEffect } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box, Container } from "@material-ui/core";
import Moment from "moment";
import agentEHR from "../../agentEHR";
import {
  UPDATE_BOOLEAN,
  FIELD_CHANGE,
  LOAD_PARTY,
  LOAD_WEIGHT,
  SAVE_BLOODSUGAR,
  LOAD_BLOODSUGAR,
  SAVE_TIMER,
  PATIENT_PAGE_UNLOADED,
} from "../../constants/actionTypes";
import normalAvatar from "../../Static/normal_avatar.png";
import happyAvatar from "../../Static/happy_avatar.png";
import sadAvatar from "../../Static/sad_avatar.png";
import agent from "../../agent";

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
  currentUser: state.common.currentUser,
  historicalBloodSugar: state.ehr.bloodsugar,
});

const mapDispatchToProps = (dispatch) => ({
  onChangeAuth: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  //onChangeField: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onSubmit: (ehrId, bloodsugar, snackbar, timer) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    dispatch({
      type: SAVE_BLOODSUGAR,
      payload: agentEHR.Composition.saveBloodSugar(ehrId, bloodsugar)
        .then(() => {
          dispatch({
            type: LOAD_BLOODSUGAR,
            payload: agentEHR.Query.bloodsugar(ehrId, 0, 20),
          });
        })
        .then(() => {
          dispatch({
            type: SAVE_TIMER,
            payload: agent.Child.timer(timer),
          });
        }),
      snackbar,
    }),
  onUnload: () => dispatch({ type: PATIENT_PAGE_UNLOADED }),
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) });

    dispatch({
      type: LOAD_BLOODSUGAR,
      payload: agentEHR.Query.bloodsugar(ehrId, 0, 20),
    });
  },
  loadValues: (ehrId, offset, limit, disease) => {
    if (disease === "DIABETES")
      dispatch({
        type: LOAD_BLOODSUGAR,
        payload: agentEHR.Query.bloodsugar(ehrId, offset, limit),
      });
    else if (disease === "OBESITY")
      dispatch({
        type: LOAD_WEIGHT,
        payload: agentEHR.Query.weight(ehrId, limit),
      });
  },
});

const PatientNew = (props) => {
  const id = props.currentUser.ehrid;
  const disease = props.party
    ? `${props.party[id].additionalInfo.disease}`
    : null;
  const colDesc = [
    "Datum",
    `Värde ${disease === "DIABETES" ? "(mmol/L)" : "(vikt i kg)"}`,
    `${disease === "DIABETES" ? "Blodsocker" : "Viktklass"}`,
  ];
  const classes = styles();
  const { bloodsugar } = props;
  const { weight } = props;
  const age = props.party
    ? `${Moment().diff(props.party[id].dateOfBirth, "years")} år`
    : null;
  const name = props.party
    ? `${props.party[id].firstNames} ${props.party[id].lastNames}`
    : null;
  const loading = props.inProgress;
  //----------------------------------------------


  //---------------Avataren----------------------
  let Avatar = normalAvatar;

  if (
    props.historicalBloodSugar !== null &&
    props.historicalBloodSugar !== undefined
  ) {
    if (
      props.historicalBloodSugar[0].value < 4 ||
      props.historicalBloodSugar[0].value > 8
    ) {
      Avatar = sadAvatar;
    } else {
      Avatar = happyAvatar;
    }
    if (props.historicalBloodSugar[0].time < setTimer()) {
      Avatar = normalAvatar;
    }
  }
  //-----------------------------------------------

  useEffect(() => {
    props.onLoad(id);
    props.loadValues(id, 0, 3, disease);
  }, [id, disease]); // eslint-disable-line

  return (
    <Container maxWidth="" className={classes.backGround} >
      <Grid container className={classes.root} spacing={2} height="100%">
        <Grid item xs={12}>
          <Box textAlign="center">
             <Typography component="h1" variant="h5">
              {name},{age},{disease === "DIABETES" ? "Diabetes" : "Fetma"}
            </Typography>
            <img className={classes.avatar} src={Avatar} alt="mood avatar"></img>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

const styles = makeStyles((theme) => ({
  backGround: {
    position: 'absolute',
    padding: '38% 10% 40%',
    background: 'linear-gradient(0deg, rgba(118,176,208,1) 40%, rgba(106,161,191,1) 41%, rgba(125,180,213,1) 86%)',
    marginTop: '-3%', //Removes a small white space at the top.
    width: "100%",
  },
  avatar: {
    position: 'relative',
  },
}));

export function getCurrentUTCDate() {
  const today = new Date();
  const year = String(today.getUTCFullYear());
  let month = String(today.getUTCMonth());
  let day = String(today.getUTCDate());
  let hours = String(today.getUTCHours());
  let minutes = String(today.getUTCMinutes());
  let seconds = String(today.getUTCSeconds());

  --hours; // Handles the amount of time before the timer sets off.

  if (today.getUTCMonth() < 10) {
    month = `0${String(today.getUTCMonth())}`;
  }
  if (today.getUTCDate() < 10) {
    day = `0${String(today.getUTCDate())}`;
  }
  if (today.getUTCHours() < 10) {
    hours = `0${String(today.getUTCHours())}`;
  }
  if (today.getUTCMinutes() < 10) {
    minutes = `0${String(today.getUTCMinutes())}`;
  }
  if (today.getUTCSeconds() < 10) {
    seconds = `0${String(today.getUTCSeconds())}`;
  }
  ++month; // UTC uses month 0-11 in JS.

  const dateInfo = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  return dateInfo;
}

function setTimer() {
  const today = new Date();
  const year = String(today.getUTCFullYear());
  let month = String(today.getUTCMonth());
  let day = String(today.getUTCDate());
  let hours = String(today.getUTCHours());
  let minutes = String(today.getUTCMinutes());
  let seconds = String(today.getUTCSeconds());

  if (today.getUTCMonth() < 10) {
    month = `0${String(today.getUTCMonth())}`;
  }
  if (today.getUTCDate() < 10) {
    day = `0${String(today.getUTCDate())}`;
  }
  if (today.getUTCHours() < 10) {
    hours = `0${String(today.getUTCHours())}`;
  }
  if (today.getUTCMinutes() < 10) {
    minutes = `0${String(today.getUTCMinutes())}`;
  }
  if (today.getUTCSeconds() < 10) {
    seconds = `0${String(today.getUTCSeconds())}`;
  }
  ++month; // UTC uses month 0-11 in JS.

  const dateInfo = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  return dateInfo;
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientNew);
