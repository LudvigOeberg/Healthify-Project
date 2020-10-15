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
    UPDATE_AUTH_BOOLEAN,
    UPDATE_BOOLEAN
    
} from '../../constants/actionTypes';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MySnackbar from '../MySnackbar';






const mapStateToProps = state => ({ ...state.auth, ...state.common });

const mapDispatchToProps = dispatch => ({
    onChangeFieldAuth: (key, value) =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: key, value }),
    onSubmit: (name, surname, email, password, confirmPassword) => {
        const payload = agent.Parent.registerChild(name, surname, email, password, confirmPassword);
        dispatch({ type: REGISTER_CHILD, payload });
    },
    onChangeBooleanAuth: (key, value) => 
        dispatch({type: UPDATE_AUTH_BOOLEAN, key: key, value}),
    onUnload: () =>
        dispatch({ type: REGISTER_PAGE_UNLOADED }),
    onOpenSnackbar: (value) =>
        dispatch({ type: UPDATE_BOOLEAN, key: 'snackbarOpen', value })
});


class PatientRegister extends Component {
    constructor() {
        super();
        this.changeAuth = ev => this.props.onChangeFieldAuth(ev.target.id, ev.target.value);
        this.changeAuthBoolean = ev => {
                this.props.onChangeBooleanAuth(ev.target.id, ev.target.checked);
        }  
        this.submitForm = (name, surname, email, password, confirmPassword) => ev => {
            ev.preventDefault();
            this.props.onOpenSnackbar(true)
            //this.props.onSubmit(name, surname, email, password, confirmPassword);
          
        }
     
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    disease(diabetes, fetma) {
        if (diabetes) {
            return "diabetes"
        } else if(fetma) {
            return "fetma"
        }
    }

    render() {
        const { classes } = this.props;
        const email = this.props.email;
        const password = this.props.password;
        const confirmPassword = this.props.confirmPassword;
        const name = this.props.name;
        const surname = this.props.surname;
        const errors = this.props.errors ? this.props.errors : null;
        const open = this.props.snackbarOpen;
        const diabetes = this.props.diabetes;
        const fetma = this.props.fetma;
        
        

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
                                    value={this.props.age}
                                    onChange={this.changeAuth}
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
                                        control={<Checkbox checked={diabetes} required disabled={fetma} onChange={this.changeAuthBoolean} id="diabetes"/>}
                                        label="Diabetes"
                                        required
                                        
                                        />
                                    </AccordionDetails>
                                    <AccordionDetails>   
                                        <FormControlLabel
                                        style={{opacity: "0.87"}}
                                        control={<Checkbox checked={fetma} required disabled={diabetes} onChange={this.changeAuthBoolean} id="fetma"/>}
                                        label="Fetma"
                                        
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
                        <MySnackbar open={open} color="success" message={"Du registrerade barnet " + name + " " + surname 
                            + " som lider av " + this.disease(diabetes, fetma)} />
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
