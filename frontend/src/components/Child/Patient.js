import React, { useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box, Container } from "@material-ui/core";
import agentEHR from "../../agentEHR";
import {
  FIELD_CHANGE,
  LOAD_PARTY,
  LOAD_WEIGHT,
  LOAD_BLOODSUGAR,
  PATIENT_PAGE_UNLOADED,
} from "../../constants/actionTypes";
import normalAvatar from "../../Static/normal_avatar.png";
import happyAvatar from "../../Static/happy_avatar.png";
import sadAvatar from "../../Static/sad_avatar.png";
import { setTimer } from './AddVal'

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
});

const mapDispatchToProps = (dispatch) => ({
  onChangeAuth: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
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

const Patient = (props) => {
  const id = props.currentUser.ehrid;
  const disease = props.party
    ? `${props.party[id].additionalInfo.disease}`
    : null;
  
  const classes = styles();
  const { bloodsugar } = props;
  const { weight } = props;

  let Avatar = normalAvatar;

  if (
    disease === "DIABETES" ? bloodsugar : weight !== null && disease === "DIABETES" ? bloodsugar : weight !== undefined
  ) {
    if (
      (disease === "DIABETES" ? bloodsugar[0].value : weight[0].value) < 4 ||
      (disease === "DIABETES" ? bloodsugar[0].value : weight[0].value) > 8
    ) {
      Avatar = sadAvatar;
    } else {
      Avatar = happyAvatar;
    }
    if ((disease === "DIABETES" ? bloodsugar[0].time : weight[0].time) < setTimer()) { //Might not work
      Avatar = normalAvatar;
    }
  }


  useEffect(() => {
    props.onLoad(id);
    props.loadValues(id, 0, 20, disease);
  }, [id, disease]); // eslint-disable-line

  return (
    <Container maxWidth="" className={classes.backGround} >
      <Grid container className={classes.root} spacing={2} height="100%">
        <Grid item xs={12}>
          <Box textAlign="center">
            <img id="currentMood" className={classes.avatar} src={Avatar} alt="mood avatar"></img>
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

export function getCurrentUTCDate(int) {
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

export default connect(mapStateToProps, mapDispatchToProps)(Patient);
