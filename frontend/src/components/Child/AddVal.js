import React, { useEffect } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Grid } from "@material-ui/core";
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
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import agent from "../../agent";

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

  const changeAuthSlider = (ev, value) => {
    props.onChangeField(ev.target.id, value);
  };

  const marks = [
    {
      value: 0,
      label: disease === "DIABETES" ? "0 mmol/L" : "0 kg",
    },
    {
      value: disease === "DIABETES" ? 15 : 100,
      label: disease === "DIABETES" ? "15 mmol/L" : "100 kg",
    },
  ];

  return (
    <Container component="main" maxWidth="md">
      <div className={classes.paper}>
        <Grid item xs={12} container spacing={5}>
          <Grid item xs={12} align="center">
            <Typography component="h1" variant="h5">
              Skriv in{" "}
              {disease === "DIABETES"
                ? "ditt blodsockervärde"
                : "din uppmätta vikt"}
            </Typography>
            <form
              className={classes.form}
              noValidate
              onSubmit={(ev) => submitForm(ev)}
              autoComplete="off"
            ></form>
          </Grid>
          <Grid container spacing={5} alignItems="center"></Grid>
          <Grid item xs>
            <Slider
              id="childValue"
              value={childValue}
              onChange={(ev, value) => changeAuthSlider(ev, value)}
              aria-labelledby="input-slider"
              defaultValue={10}
              step={disease === "DIABETES" ? 0.1 : 1}
              valueLabelDisplay="auto"
              marks={marks}
              max={disease === "DIABETES" ? 15 : 100}
              min={0}
            />
          </Grid>
          <Grid item>
            <Input
              id="showCurrentchildValue"
              className={classes.input}
              value={childValue}
              margin="dense"
              onChange={changeField}
              inputProps={{
                step: 1,
                min: 0,
                max: 15,
                type: "number",
                "aria-labelledby": "input-slider",
              }}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Button
            id="addButton weight/bloodsugar"
            variant="contained"
            color="secondary"
            onClick={(ev) => submitForm(ev)}
            disabled={props.inProgress || open}
            className={classes.submit}
          >
            {" "}
            Spara
          </Button>
        </Grid>
      </div>
    </Container>
  );
};

const styles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
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
    margin: theme.spacing(3, 0, 2),
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
