import React from 'react';
import { connect } from 'react-redux';
import {
  OPEN_SNACKBAR,
  FIELD_CHANGE,
} from '../../constants/actionTypes';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Grid } from '@material-ui/core';
import CustomPaginationActionsTable from '../TablePagination';
import TimeLineChart from '../TimeLineChart'

const mapStateToProps = state => { 
  return {
    ...state.common,
}};

const mapDispatchToProps = dispatch => ({
  onChangeField: (key, value) => 
    dispatch({ type: FIELD_CHANGE, key: key, value }),
  onOpenSnackbar: (message, color) =>
    dispatch({ type: OPEN_SNACKBAR, message, color }),
});

// In future we access the database and create values 
// with a format suited for the Table here.
// You can insert an arbitrary amount of columns here.
const testData = [
  [new Date(2020, 8, 1, 15, 30).toLocaleString(), 3.7],
  [new Date(2020, 9, 5, 15, 30).toLocaleString(), 14.0],
  [new Date(2020, 9, 13, 6, 20).toLocaleString(), 17.2],
  [new Date(2020, 9, 13, 13, 30).toLocaleString(), 32.3],
  [new Date(2020, 9, 13, 18, 30).toLocaleString(), 17.2],
  [new Date(2020, 9, 13, 22, 30).toLocaleString(), 11.3],
  [new Date(2020, 9, 14, 0, 30).toLocaleString(), 3.3],
  [new Date(2020, 9, 14, 6, 30).toLocaleString(), 22.3],
  [new Date(2020, 4, 14, 9, 0).toLocaleString(), 5.3],
  [new Date(2020, 0, 14, 9, 0).toLocaleString(), 24.3],
  [new Date(2020, 7, 14, 9, 0).toLocaleString(), 14.3],


  
].sort((a, b) => (a[0] < b[0] ? -1 : 1));

const col_desc = ['Datum vid registrering', 'Värde (mmol/L)'];


class MonitorChildValue extends React.Component {
  constructor() {
    super();
    this.submitForm = (key, value) => ev => {
      ev.preventDefault();
      const color = this.validate(this.props.childValue) ? "success" : "error";
      const message = this.validate(this.props.childValue) ? `Du loggade värdet: ${this.props.childValue} mmol/L` : "Fel format!";
      this.props.onOpenSnackbar(message, color);
    };
    this.changeField = ev => {
      this.props.onChangeField(ev.target.id, ev.target.value);
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }
  
  validate = (val) => {
    return (val < 100 && val > 0)
  }

  render() {
    const { classes } = this.props;
    const childValue = this.props.childValue;
    const errors = this.props.errors ? this.props.errors : null;
    const open = this.props.snackbarOpen;
    return (
      <Container>
        <div className={classes.paper}>
        <Typography component="h1" variant="h3">
              Hantera (namn) värden
          </Typography>
          <p></p>
          <Grid container spacing={5}>            
            <Grid item xs={12} sm={6}>
            <Typography component="h1" variant="h5">
              Tabell
              </Typography>
              <CustomPaginationActionsTable rows = {testData} titles = {col_desc} paginate = {true}>

              </CustomPaginationActionsTable>
            </Grid>
            <Grid item xs={12} sm={6}>
            <Typography component="h1" variant="h5">
              Graf
              </Typography>
              <TimeLineChart chartData = {testData} label = {"Blodsocker (mmol/L)"}></TimeLineChart>
            </Grid>
            <Grid item xs={12} align = "center">
              <Avatar className={classes.avatar}>
              <AddIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Skriv in ditt barns blodsockervärde
              </Typography>
            
            <form className={classes.form} noValidate onSubmit={this.submitForm(getCurrentDate(), childValue)} autoComplete="off">
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  id="childValue"
                  name="childValue"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">mmol/L</InputAdornment>,
                  }}
                  value={childValue}
                  disabled={open}
                  
                  onChange={this.changeField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                  type="submit"
                  variant="contained"
                  color="primary" 
                  disabled={this.props.inProgress || open}
                  className={classes.submit}
                  >
                    Logga värde
                  </Button>
                </Grid>
              </Grid>
              </form>
              
            </Grid> 
        </Grid>
      </div>
    </Container>
    );
  }
}


const styles = theme => {
  return ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '50%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  });
};

export function getCurrentDate() {
  var today = new Date();
  var todaysDate = String(today.getFullYear()) + '-' + String(today.getMonth()) + '-' + String(today.getDate()) + " " + String(today.getHours()) + ":" + String(today.getMinutes());
  return todaysDate;
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MonitorChildValue));


