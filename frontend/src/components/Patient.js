import React, { Component } from 'react'
import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import {
    PATIENT_PAGE_UNLOADED,
    LOCAL_SAVE,
    FIELD_CHANGE
} from '../constants/actionTypes';

const mapStateToProps = state => {
    return {
        ...state.common
    }
};

const mapDispatchToProps = dispatch => ({
    onChangeAuth: (key, value) =>
        dispatch({ type: FIELD_CHANGE, key: key, value }),
    onSubmit: (key, value) =>
        dispatch({ type: LOCAL_SAVE, key: key, value }),
    onUnload: () =>
        dispatch({ type: PATIENT_PAGE_UNLOADED }),
});

class Patient extends Component {

    constructor() {
        super();
        this.changeAuth = ev => this.props.onChangeAuth(ev.target.id, ev.target.value);
        this.submitForm = (key, value) => ev => {
            ev.preventDefault();
            this.props.onSubmit(key, value);
        };
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        const blodsugar = this.props.blodsugar;
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <h1>Patient vy</h1>
                    <h2> Var vänlig skriv in ditt blodsocker värde</h2>
                    <form className={classes.form} noValidate autoComplete="off" onSubmit={this.submitForm("blodsugar:" + getCurrentDate(), blodsugar)}>
                        <TextField
                            required
                            id="blodsugar"
                            label="Blodsocker värde"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position="start">mmol/L</InputAdornment>,
                            }}
                            onChange={this.changeAuth}
                            value={blodsugar}
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
                    <h1> {blodsugar} </h1>
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
    var todaysDate = String(today.getFullYear()) + '-' + String(today.getMonth()) + '-' + String(today.getDate());
    return todaysDate;
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Patient));