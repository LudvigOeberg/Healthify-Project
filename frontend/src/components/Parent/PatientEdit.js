import { Container, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { FIELD_CHANGE} from '../../constants/actionTypes'
import {
    Avatar,
    TextField,
    Typography,
    Button,
  } from '@material-ui/core'
  import { connect } from 'react-redux'
  import ChildCareIcon from '@material-ui/icons/ChildCare'
  import agent from '../../agent'

const mapStateToProps = (state) => ({
    ...state.common,
})

const mapDispatchToProps = (dispatch) =>({
    onChangeField: (key, value) => dispatch({ type: FIELD_CHANGE, key, value }),
    //editPatient: (child) => dispatch({type: EDIT_CHILD, child}),
})

const PatientEdit = (props) => {
    const classes = styles()
    const errors = props.errors ? props.errors : null
    const id = props.match.params
    const onChangeField = (ev) => props.onChangeField(ev.target.id, ev.target.value)
    const submitForm = () => props
    var email
    var childNo
    var name

    props.currentUser.children.map((child, i) => {
      if(child.child.ehrid=id){
        email=child.child.email
        name=child.child.name + child.child.surname
        childNo=i
      }
    })
    

    return (
        <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <ChildCareIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Ändra uppgifter för {name}
            </Typography>
            <form
            className={classes.form}
            noValidate
            onSubmit={submitForm()}
            >
                <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <TextField
                        variant="outlined"
                        required
                        fullWidth
                        disabled
                        id={`currentUser.children.${childNo}.child.email`}
                        name="email"
                        label="Mailaddress"
                        autoComplete="email"
                        helperText={errors && (errors.email || errors.general)}
                        error={errors && (errors.email ? true : !!(false || errors.general))}
                        value={email}
                        onChange={onChangeField}
                        />
                    </Grid>
                   {/*  <Grid item xs={12}>
                        <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="password"
                        type="password"
                        id="password"
                        label="Lösenord"
                        autoComplete="current-password"
                        helperText={errors && (errors.password || errors.general)}
                        error={errors && (errors.password ? true : !!(false || errors.general))}
                        value={password}
                        onChange={onChangeField}
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
                        helperText={errors && (errors.confirmPassword || errors.general)}
                        error={errors && (errors.confirmPassword ? true : !!(false || errors.general))}
                        value={confirmPassword}
                        onChange={onChangeField}
                        />
                    </Grid> */}
                    <Grid item xs={12} sm={6} >
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled
                        >
                          Spara
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} >
                      <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="secondary"
                          className={classes.submit}
                          disabled = {props.inProgress}
                          >
                            Ta bort {name}
                      </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
        </Container>
    )
}

const styles = makeStyles((theme) => ({
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
      margin: theme.spacing(0, 0, 0),
    },
  }))

export default  connect(mapStateToProps, mapDispatchToProps)(PatientEdit)
