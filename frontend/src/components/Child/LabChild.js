import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import Slider from '@material-ui/core/Slider'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

import MyDialog from '../MyDialog'
// import MySlider from '../MySlider'

/**
 * Page where the child may run a simulation.
 */

/* eslint-disable */
const mapStateToProps = (state) => ({
  // currentUser: state.common.currentUser,
});

const mapDispatchToProps = (dispatch) => ({});

const date = getCurrentDate();

const marks = [
  {
    value: 1,
    label: "Lite",
  },
  {
    value: 2,
    label: "Mellan",
  },
  {
    value: 3,
    label: "Mycket",
  },
];

const value = 2;
let meal = "Måltid";
let info;

const badDialogInfo = [
  "Simulera",
  "Simulation",
  "Du kommer att må sämre om du äter detta.",
  "../Static/sad_avatar.png",
  "sad avatar",
];

const goodDialogInfo = [
  "Simulera",
  "Simulation",
  "Du kommer att må bättre om du äter detta!",
  "../Static/happy_avatar.png",
  "happy avatar",
];

class LabChild extends React.Component {
  constructor() {
    super();
  }
  componentWillUnmount() {}

  render() {
    const { classes } = this.props;
    const { mealSize } = this.props;

    return (
      <Container className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card className={classes.card}>
              <Grid item xs={8}>
                <Typography
                  variant="h4"
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  Ny simulering
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="overline" display="block" gutterBottom>
                  {date}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography
                  variant="body1"
                  className={classes.diet}
                  gutterBottom
                >
                  {meal}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography
                  variant="subtitle1"
                  className={classes.eatText}
                  gutterBottom
                >
                  Hur mycket vill du äta?
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Slider
                  value={mealSize}
                  defaultValue={2}
                  step={1}
                  marks={marks}
                  min={1}
                  max={3}
                  onChange={handleSliderChange}
                />
                {/* <MySlider></MySlider> */}
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                Måltid
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={meal}
                onChange={handleChange}
                label="Meal"
              >
                <MenuItem value="">
                  <em>Måltid</em>
                </MenuItem>
                <MenuItem value={"snack"}>Snack</MenuItem>
                <MenuItem value={"mellanmål"}>Mellanmål</MenuItem>
              </Select>
            </FormControl>
            {/* <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  // error={errors && (errors.disease ? true : !!(false || errors.general))}
                >
            <Select
              labelId="disease-label"
              label="Sjukdom"
              value="Måltid"
              // onChange={this.changeDisease}
              MenuProps={{
                disableScrollLock: true,
              }}
            >
              <MenuItem id="diease" value="DIABETES">
                Diabetes
              </MenuItem>
              <MenuItem id="diease" value="OBESITY">
                Fetma
              </MenuItem>
            </Select>
            </FormControl> */}
          </Grid>

          <Grid item xs={6}>
            <Button
              component={Link}
              href={"/child-laboration"}
              variant="outlined"
              color="primary"
              fullWidth
            >
              {" "}
              Tillbaka
            </Button>{" "}
          </Grid>
          <Grid item xs={6}>
            <MyDialog
              {...(info = getDialogInfo())}
              buttonLabel={info[0]}
              title={info[1]}
              text={info[2]}
              pictureLocation={info[3]}
              alt={info[4]}
            ></MyDialog>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

const styles = (theme) => ({
  root: {
    display: "flex",
    marginTop: theme.spacing(8),
    alignItems: "top",
    padding: theme.spacing(1),
  },
  card: {
    minWidth: 328,
    padding: 30,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  diet: {
    textAlign: "left",
  },
  buttons: {
    marginTop: theme.spacing(2),
  },
  eatText: {
    color: theme.palette.text.disabled,
  },
  title: {
    color: theme.palette.text.primary,
  },
});

function getCurrentDate() {
  const today = new Date();
  const todaysDate = `${String(today.getFullYear())}-${String(
    today.getMonth()
  )}-${String(today.getDate())}`;
  return todaysDate;
}

function getDialogInfo() {
  if (value === 2) {
    return goodDialogInfo;
  }
  return badDialogInfo;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(LabChild));
