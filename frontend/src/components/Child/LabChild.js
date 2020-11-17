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
import MyDialog from '../MyDialog'

/* eslint-disable */
const mapStateToProps = (state) => ({});

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

class LabChild extends React.Component {
  constructor() {
    super();
  }
  componentWillUnmount() {
  }
  
  render() {
    const { classes } = this.props;

    return (
      <Container className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
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
                  Måltid
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
                  defaultValue={2}
                  step={1}
                  marks={marks}
                  min={1}
                  max={3}
                />
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid container direction="row" justify="center" alignItems="center">
            {" "}
            <Grid item xs={5}></Grid>
            <Grid item xs={1}>
              <Button
                component={Link}
                href={"/child-laboration"}
                variant="outlined"
                color="primary"
              >
                {" "}
                Tillbaka
              </Button>{" "}
            </Grid>
            <Grid item xs={1}>
              <MyDialog
                buttonLabel="Simulera"
                title="Simulation"
                text="Om du äter detta kommer du inte att må så bra."
                pictureLocation="../Static/sad_avatar.png"
                alt="sad avatar"
              ></MyDialog>
            </Grid>
            <Grid item xs={5}></Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(8),
    padding: theme.spacing(1),
    position: "absolute",
    maxWidth: "100%",
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(LabChild));
