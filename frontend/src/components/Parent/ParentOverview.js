import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
    UPDATE_BOOLEAN,
    FIELD_CHANGE,
    LOAD_BLOODSUGAR,
    LOAD_PARTY
} from '../../constants/actionTypes';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {  makeStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import CustomPaginationActionsTable from '../TablePagination';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import CaregivingTeam from '../CaregivingTeam';
import agentEHR from '../../agentEHR';

const mapStateToProps = state => {
    return {
        ...state.common,
        ...state.ehr
    }
};

const mapDispatchToProps = dispatch => ({
    onChangeField: (key, value) =>
        dispatch({ type: FIELD_CHANGE, key: key, value }),
    onOpenSnackbar: (value) =>
        dispatch({ type: UPDATE_BOOLEAN, key: 'snackbarOpen', value }),
    onLoad: (ehrId, offset, limit) => {
        dispatch({ type: LOAD_BLOODSUGAR, payload: agentEHR.Query.bloodsugar(ehrId, offset, limit) });
        dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) });
    }
});

const ParentOverview = (props) => {
    useEffect(() => {
        props.onLoad(id, 0, 3);
    }, [])
    const col_desc = ['Datum', '(mmol/L)'];
    const classes = styles();
    const { id } = props.match.params;
    const bloodsugar = props.bloodsugar;
    const name = props.party ? props.party[id].firstNames + " " + props.party[id].lastNames : null;
    
    const doctor = {
        name: "Doktor X",
        mail: "Dr.x@gmail.com",
        telephone: "070-XXX XX XX"
    }
    const shrink = {
        name: "Psykolog Y",
        mail: "P.Y@gmail.com",
        telephone: "070-YYY YY YY"
    }
    const nurse = {
        name: "Sjuksköterska Z",
        mail: "S.Z@gmail.com",
        telephone: "070-ZZZ ZZ ZZ"
    }   
    const caregivers = [doctor, shrink, nurse]

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
                            <Typography component="h1" variant="h8"> Senaste mätningar
                        </Typography>
                            HÄR SKA DET STÅ INFO OM DE TRE SENASTE MÄTNINGARNA
                            PLUS EN LÄNK TILL MONITORCHILDVALUE
                    <CustomPaginationActionsTable columns={['time', 'value']} rows={bloodsugar} titles={col_desc} paginate={false} />
                            <Button variant="contained" color="secondary" href={'/monitor-child/' + id}>
                                Hantera värden
                            </Button>
                        </Paper >
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Paper className={classes.paper} elevation={3}>
                            <Typography component="h1" variant="h8">
                                {name}
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
                            <Typography component="h1" variant="h8"> Vårdgivare
                            </Typography>
                            Caregivers ska stå här och annan info. Ändra format.
                            <CaregivingTeam caregivers={caregivers}></CaregivingTeam>
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
