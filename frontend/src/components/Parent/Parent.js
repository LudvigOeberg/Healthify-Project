import { Avatar, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChildList from './ChildList';
import { PAGE_UNLOADED, LOAD_EHR_METRIC, LOAD_PARTY } from '../../constants/actionTypes';
import agentEHR from '../../agentEHR';
import { WEIGHT } from '../../constants/metrics';

const mapStateToProps = state => {
    return {
        ...state.common
    }
};

const mapDispatchToProps = dispatch => ({
    onLoad: (ehr_id) => {
        dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehr_id) });
        dispatch({ type: LOAD_EHR_METRIC, payload: agentEHR.query.weight(ehr_id), metric: WEIGHT });
    },
    onUnload: () =>
        dispatch({ type: PAGE_UNLOADED })
});

class ParentPage extends Component {
    componentWillUnmount() {
        this.props.onUnload();
    }
    
    componentWillMount() {
        this.props.currentUser.children.forEach(child => {
            this.props.onLoad(child.child.ehrid);
        });
    }

    render() {
        const { classes } = this.props;
        const children = this.props.currentUser ? this.props.currentUser.children : null;
        const name = this.props.currentUser ? this.props.currentUser.name + " " + this.props.currentUser.surname : null;
        if (children) {
            return (
                <Container component="main" maxWidth="md">
                    <div className={classes.paper}>
                        <Avatar
                            className={classes.purple}
                            src="test.123"
                            alt={name}
                        />
                        <Typography
                            component="h1"
                            variant="h5">
                            {name}
                        </Typography>
                        
                        {/* child list component to list children for logged in user */}
                        <ChildList children={children} />
                    </div>
                </Container>
            )
        } else {
            return (<div><Typography type="h5">Inga barn</Typography></div>);
        }
    }
}

const styles = theme => ({
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
    purple: {
        backgroundColor: 'purple',
        color: 'white'
    },
    form: {
        width: '400px',
        //width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ParentPage));