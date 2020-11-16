import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { Accordion, TextField, Typography, FormControl, Select, MenuItem, InputLabel, Container, Paper, Grid, Button } from '@material-ui/core';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputSlider from '../InputSlider';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

const mapStateToProps = (state) => ({
    ...state.common,

})

const mapDispatchToProps = (dispatch) => ({

})

const SimulatePatient = (props) => {
    const classes = styles()
    const { intensity } = props

    return (
        <Container className={classes.root}>
            
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card variant="outlined" className={classes.card}>
                            <CardHeader title="Simulering" />
                            <CardContent>
                                Här kan du simulera hur ditt barn kommer att må i framtiden beroende på vilka vanor barnet har.
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={2}> 
                    <Grid container spacing={2}>
                    
                    <Grid item xs={12}>
                        <Typography variant="h5">Ny Simulering</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Accordion variant="outlined" rounded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography variant="h6">Kost</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography id="training-slider" gutterBottom>
                                            Genomsnittligt kaloriintag per dag
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputSlider unit={"kcal"} step={200} min={0} max={3000} ></InputSlider>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion variant="outlined" rounded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography variant="h6">Träning</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography id="training-slider" gutterBottom>
                                            Antal Träningspass per vecka
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputSlider unit={"stycken"} step={1} min={1} max={7}  ></InputSlider>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl
                                            fullWidth
                                            
                                        //error={errors && (errors.gender ? true : !!(false || errors.general))}
                                        >
                                            <InputLabel id="intensity-label">Intensitet</InputLabel>
                                            <Select
                                                labelId="intensity-label"
                                                label="intensity"
                                                value={intensity}
                                            //onChange={this.changeGender}
                                            //error={errors && (errors.gender ? true : !!(false || errors.general))}
                                            >
                                                <MenuItem id="intensity" value="low">
                                                    Lågintensiv
                                                </MenuItem>
                                                <MenuItem id="intensity" value="med">
                                                    Medelintensiv
                                                </MenuItem>
                                                <MenuItem id="intensity" value="high">
                                                    Högintensiv
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                        fullWidth
                                        name="goalWeight"
                                        id="goalWeight"
                                        label="Målvikt"
                                        helperText="Vikt i kg"
                                        />
                                        </Grid>
                                            
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
                </Paper>
                
                </Grid>
                <Grid item xs={6}>
                        <Button
                         type="submit"
                         fullWidth
                         variant="outlined"
                         color="primary"
                         
                        >
                        
                        Tillbaka</Button> 
                    </Grid>
                    <Grid item xs={6}>
                        <Button 
                         type="submit"
                         fullWidth
                         variant="contained"
                         color="primary"
                        >
                            Simulera</Button> 
                    </Grid>
                </Grid>
        </Container>


    )
}


const styles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(8),
        alignItems: 'top',
        display: 'flex',
        padding: theme.spacing(1),
        
    },
    paper: {
        height: '100%',
        padding: theme.spacing(1),
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
    card: {
        borderWidth: 5,
        borderColor: theme.palette.primary.main,
        borderRadius: 20
    }
}))

export default connect(mapStateToProps, mapDispatchToProps)(SimulatePatient)


