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
    LOCAL_SAVE,
    FIELD_CHANGE,
    UPDATE_BOOLEAN
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
    onSubmit: (key, value, snackbar) =>
        dispatch({ type: FIELD_CHANGE, key: key, value, snackbar }),
    onUnload: () =>
        dispatch({ type: PATIENT_PAGE_UNLOADED }),
    onOpenSnackbar: (value) =>
        dispatch({ type: UPDATE_BOOLEAN, key: 'snackbarOpen', value })
});



class Patient extends Component {

    constructor() {
        super();
        this.changeAuth = ev => this.props.onChangeAuth(ev.target.id, ev.target.value);
        this.submitForm = (key, value) => ev => {
            ev.preventDefault();
            const snackbar = {
                message: this.validate(this.props.bloodsugar) ? "Du loggade värdet: " + this.props.bloodsugar + " mmol/L" : "Fel format!",
                open: true,
                color: this.validate(this.props.bloodsugar) ? "success" : "error"
            }
            this.props.onSubmit(key, value, snackbar);
        };
    }


    componentWillUnmount() {
        this.props.onUnload();
    }

    validate = (val) => {
        return (val < 100 && val > 0)
    }

    render() {
        Object.keys(localStorage)
        const bloodsugar = this.props.bloodsugar;
        const { classes } = this.props;
        const open = this.props.snackbarOpen;
        return (
            <Container component="main" maxWidth="sm">
                <div className={classes.paper}>
                    <h1>Patientvy</h1>
                    <h2> Var vänlig skriv in ditt blodsockervärde</h2>
                    <form className={classes.form} noValidate autoComplete="off" onSubmit={this.submitForm(getCurrentDate(), bloodsugar)}>
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
    var todaysDate = String(today.getFullYear()) + '-' + String(today.getMonth()) + '-' + String(today.getDate()) + " " + String(today.getHours()) + ":" + String(today.getMinutes());
    return todaysDate;
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Patient));