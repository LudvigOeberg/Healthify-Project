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
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MySnackbar from '../MySnackbar';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Grid, Paper, TablePagination } from '@material-ui/core';
import CustomPaginationActionsTable from '../TablePagination';
import TimeLineChart from '../TimeLineChart'
import ChildCareIcon from '@material-ui/icons/ChildCare';
import { sizing } from '@material-ui/system';
import CaregivingTeam from '../CaregivingTeam'

const testData = [
    [new Date(2020, 8, 1, 15, 30).toLocaleString(), 3.7],
    [new Date(2020, 9, 5, 15, 30).toLocaleString(), 14.0],
    [new Date(2020, 9, 13, 6, 20).toLocaleString(), 17.2],
].sort((a, b) => (a[0] < b[0] ? -1 : 1));

const col_desc = ['Datum', '(mmol/L)'];


const mapStateToProps = state => {
    return {
        ...state.common,
    }
};

const mapDispatchToProps = dispatch => ({
    onChangeField: (key, value) =>
        dispatch({ type: FIELD_CHANGE, key: key, value }),
    onOpenSnackbar: (value) =>
        dispatch({ type: UPDATE_BOOLEAN, key: 'snackbarOpen', value }),
});

const ParentOverview = (props) => {
    const classes = styles();

    return (
        <Grid container className={classes.root} spacing={5} height="100%">
            <Grid item xs={12} sm={12} md={6}>
                <Paper className={classes.paper} elevation={3}>
                    HÄR SKA DET STÅ INFO OM HUR DET GÅR FÖR BARNET
                    I GAMIFICATION-ASPEKTEN
                </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper} elevation={3}>
                            HÄR SKA DET STÅ INFO OM DE TRE SENASTE MÄTNINGARNA
                            PLUS EN LÄNK TILL MONITORCHILDVALUE
                    <CustomPaginationActionsTable rows={testData} titles={col_desc} paginate={false} />
                            <Button variant="contained" color="secondary" href="/monitor">
                                Hantera värden
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Paper className={classes.paper} elevation={3}>
                            <Typography component="h1" variant="h8">
                                Greta Gretasson
                    </Typography>

                            <Typography variant="subtitle1">
                                7 år, Diabetes typ 1
                    </Typography>
                            <Avatar className={classes.avatar}>
                                <ChildCareIcon fontSize="large" />
                            </Avatar>
                        </Paper>
                    </Grid>
                    <Grid item item xs={6} sm={12}>
                        <Paper className={classes.paper} elevation={3}>
                        </Paper>
                    </Grid>

                </Grid>
            </Grid>
        </Grid>
    )
}

const styles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(0),
        alignItems: 'top',
        display: 'flex',
        padding: theme.spacing(1)
    },
    paper: {
        height: '100%',
        padding: theme.spacing(1)
    },
    avatar: {
        margin: theme.spacing(1),
        width: theme.spacing(20),
        height: theme.spacing(20),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default connect(mapStateToProps, mapDispatchToProps)(ParentOverview);
