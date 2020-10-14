import { Avatar, Container, Grid, TextField, Typography, Accordion, AccordionSummary, AccordionDetails, Button, FormControlLabel } from '@material-ui/core';
import React, { Component } from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import { withStyles } from '@material-ui/core/styles';
import { Checkbox } from '@material-ui/core';
import { 
    REGISTER_CHILD, 
    UPDATE_FIELD_AUTH,
    REGISTER_PAGE_UNLOADED,
    
} from '../../constants/actionTypes';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';






const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    onChangeFieldAuth: (key, value) =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: key, value }),
    onSubmit: (name, surname, email, password, confirmPassword) => {
        const payload = agent.Parent.registerChild(name, surname, email, password, confirmPassword);
        dispatch({ type: REGISTER_CHILD, payload });
    },
    onUnload: () =>
        dispatch({ type: REGISTER_PAGE_UNLOADED })
});


class PatientRegister extends Component {
    constructor() {
        super();
        this.changeAuth = ev => this.props.onChangeFieldAuth(ev.target.id, ev.target.value);
        this.submitForm = (name, surname, email, password, confirmPassword) => ev => {
            ev.preventDefault();
            this.props.onSubmit(name, surname, email, password, confirmPassword);
      
        }

        this.state = {
            diabetes: false,
            fetma: false,
        };
        this.handleChangeDiabetes = this.handleChangeDiabetes.bind(this);
        this.handleChangeFetma = this.handleChangeFetma.bind(this);
        this.onClickRegister = this.onClickRegister.bind(this)
    }

    handleChangeDiabetes() {
        if (!this.state.fetma) {
            this.setState(state => ({
                diabetes: !state.diabetes
            }));
        }
    }

    handleChangeFetma() {
        if (!this.state.diabetes) {
            this.setState(state => ({
                fetma : !state.fetma
            }));
        }
    }


    //Temporary until state handling workshop so i know how to use martins snackbar
    onClickRegister() {
        if (this.state.diabetes) {
            alert(`Namn: ${this.props.name} ${this.props.surname}. Sjukdom: Diabetes `)
        } else if (this.state.fetma) {
            alert(`Namn: ${this.props.name} ${this.props.surname}. Sjukdom: Fetma `)
        } else {
            alert("OBS! Ingen sjukdom har valts")
        }
    }


    componentWillUnmount() {
        this.props.onUnload();
    }

 

    render() {
        const { classes } = this.props;
        const email = this.props.email;
        const password = this.props.password;
        const confirmPassword = this.props.confirmPassword;
        const name = this.props.name;
        const surname = this.props.surname;
        const errors = this.props.errors ? this.props.errors : null;

    
        return (

            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <ChildCareIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Registrera patient
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={this.submitForm(name, surname, email, password, confirmPassword)} >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="name"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="name"
                                    name="name"
                                    label="Förnamn" 
                                    helperText={errors && (errors.name || errors.general)}
                                    error={errors && (errors.name ? true : false || errors.general ? true : false)}
                                    autoFocus
                                    value={this.props.name}
                                    onChange={this.changeAuth}
                                    />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="surname"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="surname"
                                    name="surname"
                                    label="Efternamn" 
                                    helperText={errors && (errors.surname || errors.general)}
                                    error={errors && (errors.surname ? true : false || errors.general ? true : false)}
                                    value={this.props.surname}
                                    onChange={this.changeAuth}
                                  />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Mailaddress"
                                    autoComplete="email"
                                    helperText={errors && (errors.email || errors.general)}
                                    error={errors && (errors.email ? true : false || errors.general ? true : false)}
                                    value={this.props.email}
                                    onChange={this.changeAuth}
                                />
                            </Grid>    
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    type="password"
                                    id="password"
                                    label="Lösenord"
                                    autoComplete="current-password"
                                    helperText={errors && (errors.password || errors.general)}
                                    error={errors && (errors.password ? true : false || errors.general ? true : false)}
                                    value={this.props.password}
                                    onChange={this.changeAuth}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    type="password"
                                    id="confirmPassword"
                                    label="Bekräfta lösenord"
                                    helperText={errors && (errors.confirmPassword || errors.general)}
                                    error={errors && (errors.confirmPassword ? true : false || errors.general ? true : false)}
                                    value={this.props.confirmPassword}
                                    onChange={this.changeAuth}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete=""
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="age"
                                    name="age"
                                    label="Ålder" />
                            </Grid>
                            <Grid item xs={12}>
                                
                                <Accordion className={classes.accordion} elevation={3}>
                                    <AccordionSummary style={{opacity: "0.87"}} expandIcon={<ExpandMoreIcon />}>
                                        Sjukdom
                                    </AccordionSummary>
                                    <AccordionDetails >  
                                        <FormControlLabel
                                        style={{opacity: "0.87"}}
                                        control={<Checkbox checked={this.state.diabetes} onChange={this.handleChangeDiabetes} name="checkedDiabetes" />}
                                        label="Diabetes"
                                        required
                                        fullWidth
                                        />
                                    </AccordionDetails>
                                    <AccordionDetails>   
                                        <FormControlLabel
                                        style={{opacity: "0.87"}}
                                        control={<Checkbox checked={this.state.fetma} onChange={this.handleChangeFetma} name="checkedFetma" />}
                                        label="Fetma"
                                        required
                                        fullWidth
                                        />
                                    </AccordionDetails>
                                </Accordion>
                               
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={this.props.inProgress}>
                            Registrera
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
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    accordion: {
        backgroundColor: "#fafafa",
        
        
    }
   
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PatientRegister));
