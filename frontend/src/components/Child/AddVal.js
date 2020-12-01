import React, { useEffect } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Grid, Box, Paper, GridList } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import {
  OPEN_SNACKBAR,
  FIELD_CHANGE,
  LOAD_PARTY,
  LOAD_BLOODSUGAR,
  SAVE_BLOODSUGAR,
  LOAD_WEIGHT,
  SAVE_WEIGHT,
  SAVE_TIMER,
} from "../../constants/actionTypes";
import agentEHR from "../../agentEHR";
import agent from "../../agent";
import thinkingAvatar from "../../Static/thinking_avatar.png";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import selectSad from "../../Static/select_sad.png";
import selectGrumpy from "../../Static/select_grumpy.png";
import selectNormal from "../../Static/select_normal.png";
import selectHappy from "../../Static/select_happy.png";
import selectVeryHappy from "../../Static/select_very_happy.png";

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
  currentUser: state.common.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  onChangeAuth: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onChangeField: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onSubmit: (ehrId, measurement, snackbar, disease, timer) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    dispatch({
      type: disease === "DIABETES" ? SAVE_BLOODSUGAR : SAVE_WEIGHT,
      payload:
        disease === "DIABETES"
          ? agentEHR.Composition.saveBloodSugar(ehrId, measurement)
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
              })
          : agentEHR.Demograhics.newMeasurment(null, measurement, ehrId).then(
              () => {
                dispatch({
                  type: LOAD_WEIGHT,
                  payload: agentEHR.Query.weight(ehrId, 20),
                });
              }
            ),

      snackbar,
    }),
  onOpenSnackbar: (message, color) =>
    dispatch({ type: OPEN_SNACKBAR, message, color }),
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) });
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

const AddVal = (props) => {
  const id = props.currentUser.ehrid;
  const classes = styles();
  const { childValue } = props;
  const open = props.snackbarOpen;
  const disease = props.party
    ? `${props.party[id].additionalInfo.disease}`
    : null;

  useEffect(() => {
    props.onLoad(id);
    props.loadValues(id, 0, 20, disease);
  }, [id, disease]); // eslint-disable-line

  const validate = (val) => val < 100 && val > 0;

  const submitForm = (ev) => {
    ev.preventDefault();

    let { timer } = props.currentUser;
    function startTimer() {
      if (disease === "DIABETES") {
        if (timer === null) {
          timer = setTimer();
        } else {
          timer = props.currentUser.timer;
        }
      }
    }

    const measurementChild = props.childValue;
    const HIGH_VAL =
      disease === "DIABETES" ? measurementChild > 8 : measurementChild > 70;
    const LOW_VAL =
      disease === "DIABETES" ? measurementChild < 4 : measurementChild < 0;

    let snackbar = {
      open: true,
      message: validate(props.childValue)
        ? `Ditt värde på ${props.childValue} ${
            disease === "DIABETES" ? "mmol/L" : "kg"
          } jättebra ut! -Att hålla koll på ditt ${
            disease === "DIABETES" ? "blodsockervärde" : "vikt"
          } är ett bra sätt att hålla en bra hälsa.`
        : "Fel format!",
      color: validate(props.childValue) ? "success" : "error",
    };

    if (disease === "DIABETES" && timer !== null) {
      timer = null;
      snackbar = {
        open: true,
        message: `Bra jobbat, hoppas du mår toppen!`,
        color: "success",
      };
    }

    if (HIGH_VAL) {
      startTimer();
      snackbar = {
        open: true,
        message: validate(props.childValue)
          ? `Åh nej, det ser ut som att ${
              disease === "DIABETES"
                ? "ditt blodsocker börjar bli högt. Se till att ta lite insulin snart så du inte börjar må dåligt."
                : "din vikt börjar gå upp. Försök röra på dig mer och äta hälsosammare."
            } `
          : "Fel format!",
        color: validate(props.childValue) ? "error" : "error",
      };
    }

    if (LOW_VAL) {
      startTimer();
      snackbar = {
        open: true,
        message: validate(props.childValue)
          ? `Åh nej, det ser ut som att ${
              disease === "DIABETES"
                ? "ditt blodsocker börjar bli lågt. Se till att äta något snart innan du börjar må dåligt och registrera ett nytt värde därefter."
                : "din vikt gått ner. Försök att äta mer."
            } `
          : "Fel format!",
        color: validate(props.childValue) ? "error" : "error",
      };
    }
    props.onSubmit(id, measurementChild, snackbar, disease, timer);
  };

  const changeField = (ev) => {
    props.onChangeField(ev.target.id, ev.target.value);
  };

  return (
    <div className={classes.backGround}>
      <Container component="main" maxWidth="md">
        <Grid container justify="center" textAlign="right">
          <Paper elevation={0} className={classes.backGround}>
            <Grid>
              <Typography className={classes.bubbleText} variant="h6">
                Hur mår du just nu?
              </Typography>
              <img
                id="currentMood"
                className={classes.centerIcon}
                src={thinkingAvatar}
                alt="mood avatar"
              ></img>
            </Grid>
          </Paper>
        </Grid>

        <Paper elevation={0} className={classes.lowerBG}>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid
              container
              justify="center"
              alignItems="center"
              className={classes.circle}
            >
              <img id="currentMood" src={selectSad} alt="mood avatar"></img>
            </Grid>
            <Grid
              container
              justify="center"
              alignItems="center"
              className={classes.circle}
            >
              <img id="currentMood" src={selectGrumpy} alt="mood avatar"></img>
            </Grid>
            <Grid
              container
              justify="center"
              alignItems="center"
              className={classes.circle}
            >
              <img id="currentMood" src={selectNormal} alt="mood avatar"></img>
            </Grid>
            <Grid
              container
              justify="center"
              alignItems="center"
              className={classes.circle}
            >
              <img id="currentMood" src={selectHappy} alt="mood avatar"></img>
            </Grid>
            <Grid
              container
              justify="center"
              alignItems="center"
              className={classes.circle}
            >
              <img
                id="currentMood"
                src={selectVeryHappy}
                alt="mood avatar"
              ></img>
            </Grid>
          </Grid>

          <Grid
            container
            alignItems="center"
            justify="center"
            direction="column"
          >
            <Paper className={classes.bubble}>
              <Grid item xs>
                <Box textAlign="center">
                  <Typography subtile1="h2" className={classes.inputText}>
                    {disease === "DIABETES"
                      ? "Hur högt blodsocker har du?"
                      : "Hur mycket väger du?"}
                  </Typography>
                </Box>

                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  id="childValue"
                  name="childValue"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {disease === "DIABETES" ? "mmol/L" : "kg"}
                      </InputAdornment>
                    ),
                  }}
                  value={childValue}
                  disabled={open}
                  onChange={changeField}
                  className={classes.submit}
                />
              </Grid>
            </Paper>

            <Box justify="center">
              <Button
                id="addButton weight/bloodsugar"
                variant="contained"
                color="primary"
                onClick={(ev) => submitForm(ev)}
                disabled={props.inProgress || open}
                className={classes.submit}
              >
                {" "}
                Spara
              </Button>
            </Box>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

const styles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "50%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(4),
  },
  backGround: {
    //position: "relative",
    background: "#72AAC9",
    height: "100%",
    //width: "100%",
    //zIndex: '0',
  },
  lowerBG: {
    borderRadius: "5% 5% 0% 0%",
    marginTop: "-2%",
    zIndex: "4",
    position: "relative",
    borderTop: "1px solid #c3bebe",
  },
  bubble: {
    border: "3px solid #64B4EA",
    margin: theme.spacing(3),
    borderRadius: "5%",
    zIndex: "0",
  },
  circle: {
    height: "70px",
    width: "70px",
    borderRadius: "50%",
    background: "#72AAC9",
    margin: theme.spacing(1),
    border: "2px solid #696969",
  },
  inputText: {
    color: theme.palette.text.disabled,
  },
  bubbleText: {
    color: theme.palette.text.primary,
    position: "relative",
    top: "160px",
    left: "270px",
    fontSize: "2vh",
  },
  centerIcon: {
    width: "100%",
  },
}));

export function getCurrentDate() {
  const today = new Date();
  const todaysDate = `${String(today.getFullYear())}-${String(
    today.getMonth()
  )}-${String(today.getDate())} ${String(today.getHours())}:${String(
    today.getMinutes()
  )}`;
  return todaysDate;
}

export function setTimer() {
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

export default connect(mapStateToProps, mapDispatchToProps)(AddVal);
