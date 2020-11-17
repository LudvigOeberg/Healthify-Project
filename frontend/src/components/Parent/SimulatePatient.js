import React, {useEffect} from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { Accordion, TextField, Typography, FormControl, Select, MenuItem, InputLabel, Container, Paper, Grid, Button, Modal, Slider} from '@material-ui/core';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputSlider from '../InputSlider';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { FIELD_CHANGE, LOAD_PARTY, LOAD_BLOODSUGAR, LOAD_WEIGHT, UPDATE_BOOLEAN } from '../../constants/actionTypes';
import agentEHR from '../../agentEHR'
import SimulateChart from '../SimulateChart'


const mapStateToProps = (state) => ({
    ...state.common,
    ...state.ehr
})

const mapDispatchToProps = (dispatch) => ({
    onChange: (key,value) => {dispatch({ type: FIELD_CHANGE, key, value })},
    onLoad: (ehrId, key="showGraph", value=false) => {
        dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) })
        dispatch({type: UPDATE_BOOLEAN, key, value})
      },
      loadValues: (ehrId, offset, limit, disease) => {
        if (disease==="DIABETES")
          dispatch({ type: LOAD_BLOODSUGAR, payload: agentEHR.Query.bloodsugar(ehrId, offset, limit) })
        else if (disease==="OBESITY")
          dispatch({ type: LOAD_WEIGHT, payload: agentEHR.Query.weight(ehrId, limit)})
      },
    onOpen: (key="showGraph",value) => {dispatch({type: UPDATE_BOOLEAN, key, value})}
})

const SimulatePatient = (props) => {
    const { id } = props.match.params
    const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
    const classes = styles()
    const { intensity, calorieintake, trainingammount, goalweight, meal, weight, bloodsugar, showGraph } = props
    const onChange = (ev) => props.onChange(ev.target.id, ev.target.value)
    const changeIntensity = (ev) => props.onChange("intensity", ev.target.value)

    
    useEffect(() => {
        props.onLoad(id)
        props.loadValues(id, 0, 1, disease) 
        }, [id, disease]) // eslint-disable-line
    
    const marks = [
        {
          value: 1,
          label: 'Lite',
        },
        {
          value: 2,
          label: 'Mellan',
        },
        {
          value: 3,
          label: 'Mycket',
        },
    ];

    const handleGraph = () => {
        props.onOpen("showGraph", !showGraph);
      };
    
    
    const handleSliderChange = (event, newValue) => {
        props.onChange("meal", newValue);
      };

    if(disease==="OBESITY"){
    return (
        <Container className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card variant="outlined" className={classes.card}>
                            <CardHeader title="Simulering" />
                            <CardContent hidden={showGraph}>
                                Här kan du simulera hur ditt barn kommer att må i framtiden beroende på vilka vanor barnet har.
                            </CardContent>
                            <CardContent hidden={!showGraph}>
                                Detta är enbart en simulering och bör ej betraktas som fakta.
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={2} hidden={showGraph}> 
                    <Grid container spacing={2}>
                    
                    <Grid item xs={12}>
                        <Typography variant="h5">Ny Simulering</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Accordion variant="outlined" rounded >
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
                                        <InputSlider unit={"kcal"} step={200} min={0} max={3000} id="calorieintake" output={calorieintake}></InputSlider>
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
                                        <InputSlider unit={"stycken"} step={1} min={1} max={7} id="trainingammount" output={trainingammount} ></InputSlider>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl
                                            fullWidth
                                            id="intensity"
                                        //error={errors && (errors.gender ? true : !!(false || errors.general))}
                                        >
                                            <InputLabel id="intensity-label">Intensitet</InputLabel>
                                            <Select
                                                labelId="intensity-label"
                                                label="intensity"
                                                
                                                value={intensity}
                                                onChange={changeIntensity}
                                            //error={errors && (errors.gender ? true : !!(false || errors.general))}
                                            >
                                                <MenuItem value={1}>
                                                    Lågintensiv
                                                </MenuItem>
                                                <MenuItem  value={2}>
                                                    Medelintensiv
                                                </MenuItem>
                                                <MenuItem value={3}>
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
                                        value={goalweight}
                                        onChange={onChange}
                                        />
                                        </Grid>
                                            
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
                </Paper>

            {/* _____________________________________ */}
                <Grid item xs={12}>
                <Paper hidden={!showGraph}>
                <Grid container spacing={2} justify='center' alignItem='center'>
                <Grid item xs={12} md={8}>
                <SimulateChart
                disease={disease}
                weight={weight}
                intensity={intensity}
                calorieintake={calorieintake}
                trainingammount={trainingammount}
                goalweight={goalweight}
                bloodsugar={bloodsugar}
                meal={meal}
                />
                </Grid>
                </Grid>    
                </Paper>
                </Grid>
            {/* _____________________________________ */}
                
                </Grid>
                <Grid item xs={6}>
                        <Button
                         type="submit"
                         fullWidth
                         variant="outlined"
                         color="primary"
                         href={showGraph ?  null : `/parent-child-overview/${id}`}
                         onClick={showGraph ? handleGraph : null}
                        > Tillbaka </Button>
                       
                    </Grid>
                    <Grid item xs={6}>
                        <Button 
                         type="submit"
                         fullWidth
                         variant="contained"
                         color="primary"
                         onClick = {handleGraph} 
                         disabled = {showGraph}
                        >
                            Simulera</Button> 
                    </Grid>
                </Grid>
              {/*   
                <Modal
                    open={modalOpen}
                    onClose={handleModal}
                    className={classes.modal}
                >
                    <Paper  className={classes.paper} >  
                    <Typography component="h1" variant="h5">
                    Simuleringsresultat: 
                    </Typography>
                    <Typography>
                    Ditt barn kommer gå ner 45kg om dagen 
                    </Typography>
                    </Paper>
                </Modal> */}
               
        </Container>


    )
    }
    else if (disease==="DIABETES"){
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
                                <Typography variant="h6">Måltid</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2} justify="center" alignItems="center">
                                    <Grid item xs={12}>
                                        <Typography id="training-slider" gutterBottom>
                                            Hur mycket vill du äta?
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={11} >
                                        <Slider
                                        value={meal}   
                                        onChange={handleSliderChange}
                                        step={1}
                                        min ={1}
                                        max= {3}
                                        //valueLabelDisplay="auto"
                                        marks={marks}
                                        >

                                        </Slider>
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
                         href={`/parent-child-overview/${id}`}
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

    } else {

    return(
        <Container className={classes.root}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Card variant="outlined" className={classes.card}>
                    <CardHeader title="Simulering" />
                    <CardContent>
                        Här kan du simulera hur ditt barn kommer att må i framtiden beroende på vilka vanor barnet har. Men vi hittar inget barn
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={6}>
                        <Button
                         type="submit"
                         fullWidth
                         variant="outlined"
                         color="primary"
                         href={`/parent-child-overview/${id}`}
                        >
                        
                        Tillbaka</Button> 
                    </Grid>
        </Grid>
        </Container>
    )
    }
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
    },
   
}))

export default connect(mapStateToProps, mapDispatchToProps)(SimulatePatient)


