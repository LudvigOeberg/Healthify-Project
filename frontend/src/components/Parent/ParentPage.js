import { Avatar, TextField, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from '@material-ui/core/Link';

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => ({

});

class ParentPage extends Component {
    constructor(props) {
        super(props)

    }
    render() {
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar
                        className={classes.purple}>B
            </Avatar>

                    <Typography
                        component="h1"
                        variant="h5">
                        Pappa Bosse McPlaceholder
                </Typography>

                    <form className={classes.form}>
                        <Typography
                            component="h1"
                            variant="h4">
                            Registrerade barn
                </Typography>
                        <Typography
                            component="h1"
                            variant="h5">
                            Maja, 7
                </Typography>
                        <Typography
                            component="h1"
                            variant="h5">
                            Diabetes, 1
                </Typography>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Om diabetes
                    </Button>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Ändra uppgifter
                    </Button>

                        <Button
                            component={Link} href="/PatientRegister"
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Lägg till barn
                    </Button>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Se vårdteam
                    </Button>

                    </form>
                </div>
            </Container>
        )
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
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ParentPage));