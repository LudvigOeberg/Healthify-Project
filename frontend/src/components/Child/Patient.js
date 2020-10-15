import React, { Component } from 'react'
import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import MySnackbar from '../MySnackbar';
import {
    PATIENT_PAGE_UNLOADED,
    FIELD_CHANGE,
    UPDATE_BOOLEAN,
    SAVE_BLOODSUGAR
} from '../../constants/actionTypes';
import Measurements from './Measurements';


const mapStateToProps = state => {
    return {
        ...state.common
    }
};

const mapDispatchToProps = dispatch => ({
    onChangeAuth: (key, value) =>
        dispatch({ type: FIELD_CHANGE, key: key, value }),
    onSubmit: (bloodSugarJson, snackbar) =>
        dispatch({ type: SAVE_BLOODSUGAR, bloodSugarJson, snackbar }),
    onUnload: () =>
        dispatch({ type: PATIENT_PAGE_UNLOADED })
});



class Patient extends Component {

    constructor() {
        super();
        this.changeAuth = ev => this.props.onChangeAuth(ev.target.id, ev.target.value);
        this.submitForm = (key) => ev => {
            ev.preventDefault();
            const bloodsugar = this.validate(this.props.bloodsugar) ? this.props.bloodsugar : null;
            var bloodSugarJson;
            if (bloodsugar) {
                if (this.props.bloodSugarJson) {
                    bloodSugarJson = this.props.bloodSugarJson;
                    bloodSugarJson.bloodsugar[bloodSugarJson.bloodsugar.length] = {"Date": getCurrentDate(), "bloodsugar value" : bloodsugar};
                } else {
                    bloodSugarJson =
                        {"bloodsugar":[
                        {"Date": getCurrentDate(), "bloodsugar value" : bloodsugar}
                    ]};
                }
            } else {
                bloodSugarJson = this.props.bloodSugarJson;
            }
            const snackbar = {
                open: true,
                message: this.validate(bloodsugar) ? "Du loggade värdet: " + bloodsugar + " mmol/L" : "Fel format!",
                color: this.validate(bloodsugar) ? "success" : "error"
            }
            this.props.onSubmit(bloodSugarJson, snackbar);
        };
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    validate = (val) => {
        return (val < 100 && val > 0)
    }
    render() {
        const bloodsugar = this.props.bloodsugar;
        const { classes } = this.props;
        const open = this.props.snackbarOpen;
        return (
            <Container component="main" maxWidth="sm">
                <div className={classes.paper}>
                    <h1>Patientvy</h1>
                    <h2> Var vänlig skriv in ditt blodsockervärde</h2>
                    <form className={classes.form} noValidate autoComplete="off" onSubmit={this.submitForm("bloodSugarJson")}>
                        <TextField
                            required
                            id="bloodsugar"
                            label="Blodsockervärde"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position="start">mmol/L</InputAdornment>,
                            }}
                            onChange={this.changeAuth}
                            value={bloodsugar}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            type="submit"
                            className={classes.submit}
                        >
                            Skicka in
                        </Button>
                    </form>
                    <Measurements>
                    </Measurements>
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
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
    });
};

export function getCurrentDate() {
    var today = new Date();
    var month = String(today.getMonth());
    var day = String(today.getDate());
    var hours = String(today.getHours());
    var minutes = String(today.getMinutes());

    if(today.getMonth() < 10){
        month = "0" + String(today.getMonth());
    }
    if(today.getDate() < 10){
        day ="0" + String(today.getDate());
    }
    if(today.getHours() < 10){
        hours ="0" + String(today.getDate());
    }
    if(today.getMinutes() < 10){
        minutes ="0" + String(today.getDate());
    }


    var dateInfo = {"year": String(today.getFullYear()),
                    "month": month,
                    "day": day,
                    "hours": hours,
                    "minutes" : minutes};
    return dateInfo;
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Patient));