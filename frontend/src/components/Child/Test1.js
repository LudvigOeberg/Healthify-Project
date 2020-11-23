import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper, Box } from '@material-ui/core'
import Moment from 'moment'
import agentEHR from '../../agentEHR'
import { UPDATE_BOOLEAN, FIELD_CHANGE, LOAD_BLOODSUGAR, LOAD_PARTY, LOAD_WEIGHT } from '../../constants/actionTypes'

//import ehr from '../../reducers/ehr'

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
  currentUser: state.common.currentUser,
})

const mapDispatchToProps = (dispatch) => ({
  onChangeField: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
  onOpenSnackbar: (value) => dispatch({ type: UPDATE_BOOLEAN, key: 'snackbarOpen', value }),
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) })
  },
  loadValues: (ehrId, offset, limit, disease) => {
    if (disease === 'DIABETES')
      dispatch({ type: LOAD_BLOODSUGAR, payload: agentEHR.Query.bloodsugar(ehrId, offset, limit) })
    else if (disease === 'OBESITY') dispatch({ type: LOAD_WEIGHT, payload: agentEHR.Query.weight(ehrId, limit) })
  },
})


const Test1= (props) => {
  const id = props.currentUser.ehrid
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  const colDesc = [
    'Datum',
    `Värde ${disease === 'DIABETES' ? '(mmol/L)' : '(vikt i kg)'}`,
    `${disease === 'DIABETES' ? 'Blodsocker' : 'Viktklass'}`,
  ]
  const classes = styles()
  const { bloodsugar } = props
  const { weight } = props
  const age = props.party ? `${Moment().diff(props.party[id].dateOfBirth, 'years')} år` : null
  const name = props.party ? `${props.party[id].firstNames} ${props.party[id].lastNames}` : null
  const loading = props.inProgress

  //---------------Avataren----------------------




  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 3, disease)
    }, [id, disease]) // eslint-disable-line


  return (
    <div className={classes.main}>
      <Grid container className={classes.root} spacing={2} height="100%">
        <Grid item xs={12}>
            <Box textAlign="center"> 
                <Typography component="h1" variant="h6">
                  {name}
                </Typography>
                <Typography variant="subtitle1">{age}</Typography>
                <Typography variant="subtitle1">{disease === 'DIABETES' ? 'Diabetes' : 'Fetma'}</Typography>
              </Box>  
          </Grid>
      </Grid>
    </div>
  )
}

const styles = makeStyles((theme) => ({
  root: {
    margin: '0px !important',
    alignItems: 'top',
    display: 'flex',
    padding: theme.spacing(1),
    maxWidth: '100%',
  },
  paper: {
    marginTop: theme.spacing(4),
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
  main: {
    width: '100%',
  },
}))

export default connect(mapStateToProps, mapDispatchToProps)(Test1)
