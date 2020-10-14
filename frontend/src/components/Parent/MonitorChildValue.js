import React from 'react';
import { connect } from 'react-redux';
import {
  UPDATE_BOOLEAN,
  FIELD_CHANGE,
} from '../../constants/actionTypes';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MySnackbar from '../MySnackbar';
import InputAdornment from '@material-ui/core/InputAdornment';
import Measurements from '../Measurements';
import {
  LineChart, XAxis, Tooltip, CartesianGrid, Line,
  YAxis
} from 'recharts';
import { Grid, Paper, } from '@material-ui/core';
import CustomPaginationActionsTable from '../TablePagination';

const mapStateToProps = state => { 
  return {
    ...state.common,
}};

const mapDispatchToProps = dispatch => ({
  onChangeField: (key, value) => 
    dispatch({ type: FIELD_CHANGE, key: key, value }),
  onOpenSnackbar: (value) =>
    dispatch({ type: UPDATE_BOOLEAN, key: 'snackbarOpen', value }),
});

// In future we access the database and create values 
// with a format suited for the Table here.
// You can insert an arbitrary amount of columns here.
const test_data = [
  ['2020-09-01', 3.7],
  ['2020-09-15', 16.7],
  ['2020-09-05', 25.0],
  ['2020-09-14', 6.2],
  ['2020-09-25', 9.0],
  ['2020-09-15', 19.5],
].sort((a, b) => (b[0] < a[0] ? -1 : 1));

const col_desc = ['Registration Date', 'Value (mmol/L)'];


class MonitorChildValue extends React.Component {
  constructor() {
    super();
    this.submitForm = (key, value) => ev => {
      ev.preventDefault();
      this.props.onOpenSnackbar(true);
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

          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <LineChart
              width={300} height={400}
              margin={{ top: 40, right: 40, bottom: 20, left: 20 }}  >
              <CartesianGrid vertical={false} />

              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
                <Tooltip
                    wrapperStyle={{
                        borderColor: 'white',
                        boxShadow: '2px 2px 3px 0px rgb(204, 204, 204)',
                    }}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#666666' }}
                />
                <Line dataKey="value" stroke="#ff7300" dot={false} />
              </LineChart>  
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomPaginationActionsTable rows = {test_data} titles = {col_desc} paginate = {true}>

              </CustomPaginationActionsTable>
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
                  autoFocus
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

              <MySnackbar open={open} color={this.validate(childValue) ? "success":"error"} 
              message={this.validate(childValue) ? "Du loggade värdet: " + childValue + " mmol/L" : "Fel format!"} />
              
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


