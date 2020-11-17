import React, {useEffect} from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { Accordion, Typography, FormControl, Select, MenuItem, InputLabel, Container, Paper, Grid, Button,  Slider, Input, FormHelperText, InputAdornment} from '@material-ui/core';
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
    var noInputTraining
    var noInputDiet
    var noInput
    
    useEffect(() => {
        props.onLoad(id)
        props.loadValues(id, 0, 1, disease) 
        }, [id, disease]) // eslint-disable-line

    if(typeof calorieintake !=='number'){
            noInputDiet=true
    } else {
        noInputDiet=false
    }
    
    if(typeof trainingammount !=='number' || !intensity || typeof goalweight!=='number') {
        noInputTraining=true
    }else {
        noInputTraining=false}
    
    if(noInputDiet && noInputTraining)
        noInput=true
    else
        noInput=false
    
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

      const handleGoalweight = (event) => {
        props.onChange(event.target.id, event.target.value === '' ? '' : Number(event.target.value));
      };
    
      const handleBlur = () => {
        if (goalweight < 40 && typeof goalweight === 'number') {
          props.onChange("goalweight", 40);
        } else if (goalweight > 100) {
            props.onChange("goalweight", 100);
        } 
      };
    

    if(disease==="OBESITY"){
    return (
        <Container className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card variant="outlined" className={classes.card}>
                        <CardHeader title={showGraph ? "Info om simulering" : "Simulering"} />
                          
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
                    <Grid container spacing={2} >
                    <Grid item xs={12}>
                        <Typography variant="h5">Ny Simulering</Typography>
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <Accordion variant="outlined" rounded  >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography variant="h6">Kost</Typography>
                            </AccordionSummary>
                            <AccordionDetails >
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography id="training-slider" gutterBottom>
                                            Genomsnittligt kaloriintag per dag
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputSlider unit={"kcal"} step={200} min={0} max={3000} id="calorieintake" output={calorieintake} definition='Kalorier'></InputSlider>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <Accordion variant="outlined" rounded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography variant="h6">Träning</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2} justify='flex-start' alignItems='flex-start'>
                                    <Grid item xs={12}>
                                        <Typography id="training-slider" gutterBottom>
                                            Antal Träningspass per vecka
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputSlider unit={"st"} step={1} min={0} max={7} id="trainingammount" output={trainingammount} definition='Antal'></InputSlider>
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <FormControl
                                            fullWidth
                                            id="intensity"
                                        
                                        //error={errors && (errors.gender ? true : !!(false || errors.general))}
                                        >
                                            <InputLabel id="intensity-label" >Intensitet</InputLabel>
                                            <Select
                                                labelId="intensity-label"
                                                label="intensity"
                                                value={intensity}
                                                onChange={changeIntensity}
                                            //error={errors && (errors.gender ? true : !!(false || errors.general))}
                                            >
                                                <MenuItem type='number' value={1}>
                                                    Lågintensiv
                                                </MenuItem>
                                                <MenuItem type='number' value={2}>
                                                    Medelintensiv
                                                </MenuItem>
                                                <MenuItem type='number' value={3}>
                                                    Högintensiv
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} md={4} justify='flex-end' alignItems='flex-end'>
                                    <FormControl
                                        fullWidth
                                        >
                                    <InputLabel id="goalweight-label" shrink={typeof goalweight === 'number' ? true: false}>Målvikt</InputLabel>
                                    <Input
                                        endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
                                        fullWidth
                                        value={ goalweight }
                                        id='goalweight'
                                        //margin="dense"
                                        //placeholder='Målvikt'
                                        onChange={handleGoalweight}
                                        onBlur={handleBlur}
                                        labelId="goalweight-label"
                                        label="goalweight"
                                        inputProps={{
                                        step: 1,
                                        min: 40,
                                        max: 100,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                        }}
                                        
                                    />
                                       <FormHelperText id='goalweight'>I heltal mellan 40 och 100</FormHelperText>
                                    </FormControl>
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
                         disabled = {noInput || showGraph}
                        >
                            Simulera</Button> 
                    </Grid>
                </Grid>
        </Container>


    )
    }
    else if (disease==="DIABETES"){
          return (
        <Container className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card variant="outlined" className={classes.card}>
                            <CardHeader title="Simulering" hidden={showGraph}/>
                            <CardHeader title="Info om simulering" hidden={!showGraph}/>
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
                         disabled = {showGraph || !meal}
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


