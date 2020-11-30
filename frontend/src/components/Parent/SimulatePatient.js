import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import {
  Accordion,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Grid,
  Button,
  Slider,
  Divider,
  ListItemText
} from '@material-ui/core'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined'
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined'
import InputSlider from '../InputSlider'
import {
  FIELD_CHANGE,
  LOAD_PARTY,
  LOAD_BLOODSUGAR,
  LOAD_WEIGHT,
  UPDATE_BOOLEAN,
  OPEN_SNACKBAR,
} from '../../constants/actionTypes'
import agentEHR from '../../agentEHR'
import SimulateChart from '../SimulateChart'
import profileAvatar from '../../Static/profile_avatar.png'

/**
 * Page where a parent can make simulations based on a specific childs values
 *
 */

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
})

const mapDispatchToProps = (dispatch) => ({
  onChange: (key, value) => {
    dispatch({ type: FIELD_CHANGE, key, value })
  },
  onLoad: (ehrId, key = 'showGraph', value = false) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) })
    dispatch({ type: UPDATE_BOOLEAN, key, value })
  },
  loadValues: (ehrId, offset, limit, disease) => {
    if (disease === 'DIABETES')
      dispatch({ type: LOAD_BLOODSUGAR, payload: agentEHR.Query.bloodsugar(ehrId, offset, limit) })
    else if (disease === 'OBESITY') dispatch({ type: LOAD_WEIGHT, payload: agentEHR.Query.weight(ehrId, limit) })
  },
  onOpen: (key = 'showGraph', value, noInputDiet, noInputTraining, meal, bloodsugar) => {
    dispatch({ type: UPDATE_BOOLEAN, key, value })
    if (value && noInputDiet && !meal)
      dispatch({
        type: OPEN_SNACKBAR,
        message: 'Du simulerade enbart träning, mata in värden för kalorier per dag om du vill simulera även kost',
        color: 'success',
      })
    else if (value && noInputTraining && !meal)
      dispatch({
        type: OPEN_SNACKBAR,
        message:
          'Du simulerade kost, mata in värden för träningstillfällen och intensitet om du vill simulera även träning',
        color: 'success',
      })
    else if (value && meal) {
      if (bloodsugar[0].value + meal > 10) {
        dispatch({
          type: OPEN_SNACKBAR,
          message: 'Du simulerade måltid, denna måltid kommer göra att ditt barn överstiger sin blodsockergräns',
          color: 'error',
        })
      } else if (bloodsugar[0].value + meal - 1.5 < 3)
        dispatch({
          type: OPEN_SNACKBAR,
          message: 'Du simulerade måltid, denna måltid kommer göra att ditt barn går under sin blodsockergräns',
          color: 'error',
        })
      else
        dispatch({
          type: OPEN_SNACKBAR,
          message: 'Du simulerade måltid, denna måltid kommer göra att ditt barn håller sig inom gränsvärdena',
          color: 'success',
        })
    } else if (value)
      dispatch({ type: OPEN_SNACKBAR, message: 'Du simulerade både kost och träning', color: 'success' })
  },
})

const SimulatePatient = (props) => {
  const { id } = props.match.params
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  const SU_LO = props.party ? props.party[id].additionalInfo.SU_LO : null
  const SU_HI = props.party ? props.party[id].additionalInfo.SU_HI : null
  const goalweight = props.party ? props.party[id].additionalInfo.goalweight : null
  const name = props.party ? props.party[id].firstNames + ' ' + props.party[id].lastNames : null
  const classes = styles()
  const { intensity, calorieintake, trainingammount, meal, showGraph, avgBloodSugar } = props
  const changeIntensity = (ev) => props.onChange('intensity', ev.target.value)
  let noInputTraining
  let noInputDiet
  let noInput
  const weight = props.weight ? props.weight[0] : null
  const bloodsugar = props.bloodsugar ? props.bloodsugar : null
  const { AccordionOpen } = props

  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 1, disease)
        }, [id, disease]) // eslint-disable-line

  if (typeof calorieintake !== 'number') {
    noInputDiet = true
  } else {
    noInputDiet = false
  }

  if (typeof trainingammount !== 'number' || !intensity) {
    noInputTraining = true
  } else {
    noInputTraining = false
  }

  if (noInputDiet && noInputTraining) noInput = true
  else noInput = false

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
  ]

  const handleGraph = () => {
    props.onOpen('showGraph', !showGraph, noInputDiet, noInputTraining, meal, bloodsugar)
  }

  const handleSliderChange = (key) => (event, newValue) => {
    props.onChange(key, newValue)
  }


  const handleAccordionChange = (value) => (event, newExpanded) => {
    if (newExpanded) {
      props.onChange('AccordionOpen', value)
      if (value === 'HbA1c') props.onChange('meal', '')
      else if (value === 'Meal') props.onChange('avgBloodSugar', '')
    } else props.onChange('AccordionOpen', 'None')
  }

  if (disease === 'OBESITY' && weight) {
    return (
      
      <div className={classes.main}>
      <Grid container className={classes.avatar} justify="center" direction="column" alignItems="center" >
        <Grid item xs={6}>
          <img src={profileAvatar} alt="Profile"></img>
        </Grid>
        <Grid item xs={4} className={classes.avatarName}>
          <Typography variant="h5"> {name} </Typography>
          <ListItemText secondary={disease === 'DIABETES' ? 'Diabetes' : 'Fetma'} />
        </Grid>
      </Grid>
     

        <Grid container spacing={2} classname={classes.root} justify='center' alignItems='center'>
          <Grid item md={5} sm={10} xs={11}>
            <Paper variant="outlined" className={showGraph ? classes.card2 : classes.card}>
              <Typography variant='h5'>{showGraph ? 'Observera!' : 'Simulering'}</Typography>
              <Typography>{showGraph ? "Detta är enbart en simulering och bör ej betraktas som fakta." : 
              "Här kan du simulera hur ditt barn kommer att må i framtiden beroende på vilka vanor barnet har."} </Typography>
            </Paper>
          </Grid>
        </Grid>

          <Grid container spacing={2} className={classes.root} justify='center' alignItems='center'>
            <Grid item xs={12}>
            <Paper className={classes.paper} elevation={2} hidden={showGraph}>
              <Grid container className={classes.root} spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5">Ny Simulering</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Accordion id="obesityDropdownSimulationFood" variant="outlined" rounded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">Kost</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography id="training-slider" gutterBottom>
                            Genomsnittligt kaloriintag per dag
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <InputSlider
                            unit="kcal"
                            step={200}
                            min={0}
                            max={3000}
                            id="calorieintake"
                            input={calorieintake}
                            definition="Kalorier"
                          ></InputSlider>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Accordion id="obesityDropdownSimulationionTraining" variant="outlined" rounded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">Träning</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2} justify="flex-start" alignItems="flex-start">
                        <Grid item xs={12}>
                          <Typography id="training-slider" gutterBottom>
                            Antal Träningspass per vecka
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <InputSlider
                            unit="st"
                            step={1}
                            min={1}
                            max={7}
                            id="trainingammount"
                            input={trainingammount}
                            definition="Antal"
                          ></InputSlider>
                        </Grid>
                        <Grid item xs={6} md={4}>
                          <FormControl fullWidth id="intensity">
                            <InputLabel id="intensity-label">Intensitet</InputLabel>
                            <Select
                              labelId="intensity-label"
                              label="intensity"
                              value={intensity}
                              onChange={changeIntensity}
                              MenuProps={{
                                disableScrollLock: true,
                              }}
                            >
                              <MenuItem id="simulateLowIntensityLink" type="number" value={1}>
                                Lågintensiv
                              </MenuItem>
                              <MenuItem id="simulateMediumIntensityLink" type="number" value={2}>
                                Medelintensiv
                              </MenuItem>
                              <MenuItem id="simulateHighIntensityLink" type="number" value={3}>
                                Högintensiv
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
            </Grid>
            </Paper>
           
            <Grid item xs={12} md={8}>
                    <Paper className={classes.paper} hidden={!showGraph}>
                      <SimulateChart
                        disease={disease}
                        weight={weight}
                        intensity={intensity}
                        calorieintake={calorieintake}
                        trainingammount={trainingammount}
                        goalweight={goalweight}
                      />
                    </Paper>
                  </Grid>
                  </Grid> 
                
                <Grid item xs={6}>
            <Button
              className={classes.button}
              id="parentGoBackObesityButton"
              type="submit"
              fullWidth
              variant="outlined"
              color="primary"
              href={showGraph ? null : `/parent-child-overview/${id}`}
              onClick={showGraph ? handleGraph : null}
            >
              {' '}
              Tillbaka{' '}
            </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                className={classes.button}
                id="parentSimulateObesityButton"
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleGraph}
                disabled={noInput || showGraph}
              >
                Simulera
              </Button>
            </Grid>
          </Grid>
          
        </div>
    )
  }
  if (disease === 'DIABETES' && bloodsugar) {
    return (
      <div className={classes.main}>
        <Grid container className={classes.avatar} justify="center" direction="column" alignItems="center" >
          <Grid item xs={6}>
            <img src={profileAvatar} alt="Profile"></img>
          </Grid>
          <Grid item xs={4} className={classes.avatarName}>
            <Typography variant="h5"> {name} </Typography>
            <ListItemText secondary={disease === 'DIABETES' ? 'Diabetes' : 'Fetma'} />
          </Grid>
        </Grid>
     

        <Grid container spacing={2} classname={classes.root} justify='center' alignItems='center'>
          <Grid item md={5} sm={10} xs={11}>
            <Paper variant="outlined" className={showGraph ? classes.card2 : classes.card}>
            <Grid container className={classes.root} spacing={1}>
            <Grid item xs={12}>
              <Typography variant='h5'>{showGraph ? 'Observera!' : 'Simulering'}</Typography>
              </Grid>
              <Grid item xs={12}>
              <Typography>{showGraph ? "Detta är enbart en simulering och bör ej betraktas som fakta." : 
              "Här kan du simulera hur ditt barn kommer att må i framtiden beroende på vilka vanor barnet har."} </Typography>
              </Grid>
            </Grid>
            </Paper>
          </Grid>
        </Grid>
      
        <Grid container spacing={2} className={classes.root} justify='center' alignItems='center'>
            <Grid item xs={12}>
            <Paper className={classes.paper} elevation={2} hidden={showGraph}>
              <Grid container className={classes.root} spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5">Ny Simulering</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Accordion
                    id="diabetesDropDownSimulation"
                    variant="outlined"
                    rounded
                    expanded={AccordionOpen === 'Meal'}
                    onChange={handleAccordionChange('Meal')}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">Måltid</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2} justify="center" alignItems="center">
                        <Grid item xs={12}>
                          <Typography id="meal-slider" gutterBottom>
                            Hur mycket vill du äta?
                          </Typography>
                        </Grid>
                        <Grid item xs={11}>
                          <Slider
                            value={typeof meal === 'number' ? meal : 0}
                            onChange={handleSliderChange('meal')}
                            id="diabetesMealSlider"
                            step={1}
                            min={1}
                            max={3}
                            // valueLabelDisplay="auto"
                            marks={marks}
                          ></Slider>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                  </Grid>
                  <Grid item xs={12}>                  
                    <Accordion
                      id="HbA1cDropDownSimulation"
                      variant="outlined"
                      rounded
                      expanded={AccordionOpen === 'HbA1c'}
                      onChange={handleAccordionChange('HbA1c')}
                    >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">HbA1c</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2} justify="center" alignItems="center">
                        <Grid item xs={12}>
                          <Typography id="HbA1c-slider" gutterBottom>
                            Genomsnittligt blodsocker tre månader framåt
                          </Typography>
                        </Grid>
                        <Grid item xs={11}>
                          <Slider
                            value={typeof avgBloodSugar === 'number' ? avgBloodSugar : 0}
                            valueLabelDisplay="auto"
                            onChange={handleSliderChange('avgBloodSugar')}
                            step={0.1}
                            min={1}
                            max={15}
                          ></Slider>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Paper variant="outlined">
                            <Grid container spacing={2} style={{ padding: 10 }} justify="center" alignItems="center">
                              <Grid item xs={6}>
                                <Grid container spacing={0}>
                                  <Grid item xs={12}>
                                    <Typography variant="h5" align="center">
                                      Simulerat
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant="h5" align="center">
                                      HbA1c
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={6}>
                                <Grid container spacing={0} justify="center">
                                  <Grid container spacing={2} justify="center">
                                    <Grid item>
                                      <Typography variant="subtitle1" align="right">
                                        {avgBloodSugar ? Math.round(avgBloodSugar * 6 * 100) / 100 : 'Välj ett värde'}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Divider variant="middle" />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography variant="body2" style={{ color: 'gray' }} align="center">
                                      mmol/mol
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="body1">
                                  Ett normalt HbA1c-värde ska ligga i intervallet 27-52 mmol/mol. Detta värde kan
                                  påverkas av fler faktorer än blodsockret, har du några frågor kontakta ditt barns
                                  vårdteam.
                                </Typography>
                              </Grid>
                              <Grid item xs={2} md={1}>
                                <Paper
                                  elevation={0}
                                  hidden={!avgBloodSugar || avgBloodSugar * 6 < 27 || avgBloodSugar * 6 > 52}
                                >
                                  <ThumbUpAltOutlinedIcon style={{ color: 'green' }} />
                                </Paper>
                                <Paper
                                  elevation={0}
                                  hidden={!avgBloodSugar || (avgBloodSugar * 6 >= 27 && avgBloodSugar * 6 <= 52)}
                                >
                                  <ThumbDownAltOutlinedIcon style={{ color: 'red' }} />
                                </Paper>
                              </Grid>
                              <Grid item xs={10} md={11}>
                                <Typography variant="body1" hidden={!avgBloodSugar}>
                                  {!avgBloodSugar || (avgBloodSugar * 6 >= 27 && avgBloodSugar * 6 <= 52) ? 'Inom tröskel värdet' : 'Ej inom tröskelvärdet'}
                                </Typography>
                              </Grid>
                              
                            </Grid>
                          </Paper>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                    </Accordion>
                    </Grid>
                  </Grid>
            </Paper>
            
            {/* _____________________________________ */}
            <Grid item xs={12} md={8}>
              <Paper className={classes.paper} hidden={!showGraph}>
                <SimulateChart disease={disease} bloodsugar={bloodsugar} meal={meal} SU_LO={SU_LO} SU_HI={SU_HI} />
              </Paper>
            </Grid>
            {/* _____________________________________ */}
          </Grid>
          <Grid item xs={6}>
            <Button
              className={classes.button}
              id="parentGoBackDiabetesButton"
              type="submit"
              fullWidth
              variant="outlined"
              color="primary"
              href={showGraph ? null : `/parent-child-overview/${id}`}
              onClick={showGraph ? handleGraph : null}
            >
              {' '}
              Tillbaka{' '}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={0} hidden={AccordionOpen === 'HbA1c'}>
              <Button
                className={classes.button}
                id="parentSimulateDiabetesButton"
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleGraph}
                disabled={showGraph || !meal}
              >
                Simulera
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
  return (
    <div className={classes.main}>
      <Grid className={classes.avatar} justify="center" direction="column" alignItems="center" container>
        <Grid item xs={6}>
          <img src={profileAvatar} alt="Profile"></img>
        </Grid>
        <Grid item xs={4} className={classes.avatarName}>
          <Typography variant="h5"> {name} </Typography>
          <ListItemText secondary={disease === 'DIABETES' ? 'Diabetes' : 'Fetma'} />
        </Grid>
      </Grid>

      <Grid container spacing={2} className={classes.root} justify='center' alignItems='center'>
        <Grid item md={5} sm={10} xs={12}>
              <Paper variant="outlined" className={classes.card}>
                <Grid container className={classes.root} spacing={1}>
                <Grid item xs={12}>
                <Typography variant='h5'>Simulering</Typography>
                </Grid>
                <Grid item xs={12}>
                <Typography>
                Här kan du simulera hur ditt barn kommer att må i framtiden beroende på vilka vanor barnet har. Men vi
                hittar inga loggade värden för ditt barn. Mata in ett värde för att kunna simulera. Med hjälp av knappen
                nedan kommer du till sidan för att hantera ditt barns värden.
                </Typography>
                </Grid>
                <Grid item xs={8} md={4}>
                <Button className={classes.button} id="handleValues" fullWidth variant="contained" color="primary" href={`/monitor-child/${id}`}>
                  Hantera värden
                </Button>
                </Grid>
                </Grid>
              </Paper>
            </Grid>
      </Grid>

      <Grid container spacing={2} className={classes.root} justify='center' alignItems='center'>
        <Grid item md={5} sm={10} xs={12}>
          <Button
            className={classes.button}
            id="back"
            type="submit"
            fullWidth
            variant="outlined"
            color="primary"
            href={`/parent-child-overview/${id}`}
          >
            Tillbaka
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

const styles = makeStyles((theme) => ({
  root: {
    margin: '0px !important',
    // display: 'horizontal',
    padding: theme.spacing(1),
    maxWidth: '100%',
  },
  paper: {
   // height: '100%',
   padding: theme.spacing(2),
   marginTop: theme.spacing(2),
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
    borderRadius: 20,
    padding: theme.spacing(2),
   marginTop: theme.spacing(2),
  },
  card2: {
    borderWidth: 5,
    borderColor: theme.palette.secondary.main,
    borderRadius: 20,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  chart: {
    height: 500,
    padding: theme.spacing(1),
  },
  avatar: {
    marginTop: theme.spacing(6),
  },
  avatarName: {
    textAlign: 'center',
  },
  main: {
    width: '100%',
  },
  button: {
    top: '5px',
    marginBottom: '5px',
    padding: '10px 5px 10px 5px',
 
  },
}))

export default connect(mapStateToProps, mapDispatchToProps)(SimulatePatient)
