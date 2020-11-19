import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'

import labAvatar from '../../Static/lab_avatar.png'
import foodAvatar from '../../Static/food_avatar.png'

/**
 * Page where the child may choose what type of simulation to run.
 */

/* eslint-disable */
const mapStateToProps = (state) => ({
  currentUser: state.common.currentUser,
});

const mapDispatchToProps = (dispatch) => ({});

const value = 2;

class Laboration extends React.Component {
  constructor() {
    super();
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const { classes } = this.props;
    // this.props.simulationValue = value;
    // currentUser.simulationValue = value;

    return (
      <Container component="main" maxWidth="md">
        <div className={classes.paper}>
          <img src={labAvatar} alt="laboration avatar"></img>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography
                variant="h4"
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                Välkommen till labbet!
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Här kan du simluera hur du kommer att må i framtiden beroende på
                dina vanor. Tryck på ett kort för att börja.
              </Typography>
            </CardContent>
          </Card>
          <Card className={classes.diet}>
            <Button component={Link} href={"/simulate-child"} color="inherit">
              <Grid
                container

                alignItems="center"
                spacing={2}
              >
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="h4"
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    Kost
                  </Typography>{" "}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <img src={foodAvatar} alt="food avatar"></img>
                </Grid>
              </Grid>
            </Button>
          </Card>
        </div>
      </Container>
    );
  }
}

const styles = (theme) => ({
  paper: {
  //  marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  card: {
    borderWidth: 5,
    borderColor: theme.palette.primary.main,
    borderRadius: 20,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  title: {
    color: theme.palette.text.primary,
  },
  diet: {
    marginTop: "7vh",
    borderWidth: 5,
    borderColor: theme.palette.primary.main,
    borderRadius: 20,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Laboration));
