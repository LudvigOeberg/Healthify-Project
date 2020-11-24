import React, { useEffect } from "react";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Grid } from "@material-ui/core";
import {
  OPEN_SNACKBAR,
  FIELD_CHANGE,
  LOAD_PARTY,
  LOAD_BLOODSUGAR,
  SAVE_BLOODSUGAR,
  LOAD_WEIGHT,
  SAVE_WEIGHT,
} from "../../constants/actionTypes";
import CustomPaginationActionsTable from "../TablePagination";
import TimeLineChart from "../TimeLineChart";
import agentEHR from "../../agentEHR";
import Reformat from "../../reformatEHRData";
import Slider from "@material-ui/core/Slider";
import Input from '@material-ui/core/Input'

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
});

const mapDispatchToProps = (dispatch) => ({
  onChangeAuth: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onChangeField: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onSubmit: (ehrId, measurement, snackbar, disease) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    dispatch({
      type: disease === "DIABETES" ? SAVE_BLOODSUGAR : SAVE_WEIGHT,
      payload:
        disease === "DIABETES"
          ? agentEHR.Composition.saveBloodSugar(ehrId, measurement).then(() => {
              dispatch({
                type: LOAD_BLOODSUGAR,
                payload: agentEHR.Query.bloodsugar(ehrId, 0, 20),
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

const AddVal2 = (props) => {
  const id = props.currentUser.ehrid;
  const classes = styles();
  const { childValue } = props;
  const open = props.snackbarOpen;
  const { bloodsugar } = props;
  const { weight } = props;
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
    // const color = validate(props.childValue) ? 'success' : 'error'
    // const message = validate(props.childValue) ? `Du loggade värdet: ${props.childValue} mmol/L` : 'Fel format!'
    // props.onOpenSnackbar(message, color)
    const measurementChild = props.childValue;
    const snackbar = {
      open: true,
      message: validate(props.childValue)
        ? `Du loggade värdet: ${props.childValue} ${
            disease === "DIABETES" ? "mmol/L" : "kg"
          }`
        : "Fel format!",
      color: validate(props.childValue) ? "success" : "error",
    };
    props.onSubmit(id, measurementChild, snackbar, disease);
  };

  const changeField = (ev) => {
    props.onChangeField(ev.target.id, ev.target.value);
  };

  const changeAuthSlider = (ev, value) => {
    props.onChangeField(ev.target.id, value);
  }

  const marks = [
    {
      value: 0,
      label: disease === "DIABETES" ? "0 mmol/L" : "0 kg",
    },
    {
      value: disease === "DIABETES" ? 15 : 150,
      label: disease === "DIABETES" ? "15 mmol/L" : "150 kg",
    },
  ];


  return (
    <Container component="main" maxWidth="md">
      <div className={classes.paper}>
        <Grid container spacing={5}>
          <Grid item xs={12} align="center">
            <Avatar className={classes.avatar}>
              <AddIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Skriv in din {" "}
              {disease === "DIABETES" ? "blodsockervärde" : "uppmätta vikt"}
            </Typography>
            <form
              className={classes.form}
              noValidate
              onSubmit={(ev) => submitForm(ev)}
              autoComplete="off"
            >
            </form>
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
                max={disease === "DIABETES" ? 15 : 150}
                min={0}
              />
            </Grid>
            <Grid item>
              <Input
                id="childValue"
                className={classes.input}
                value={childValue}
                margin="dense"
                onChange={changeField}
                inputProps={{
                  step: 1,
                  min: 0,
                  max: 15,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                //className={classes.button}
                onClick={(ev) => submitForm(ev)}
                disabled={props.inProgress || open}
                className={classes.submit}
              >
                {' '}
                Submit
              </Button>
            </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddVal2);
