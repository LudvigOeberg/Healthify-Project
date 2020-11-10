import {
  Avatar,
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  InputLabel,
  FormControl
} from '@material-ui/core'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ChildCareIcon from '@material-ui/icons/ChildCare'
import { withStyles } from '@material-ui/core/styles'
import {
  REGISTER_CHILD,
  UPDATE_FIELD_AUTH,
  REGISTER_PAGE_UNLOADED,
  UPDATE_AUTH_BOOLEAN,
} from '../../constants/actionTypes'
import agent from '../../agent'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


const mapStateToProps = (state) => ({ ...state.auth, ...state.common })

const mapDispatchToProps = (dispatch) => ({
  onChangeFieldAuth: (key, value) => dispatch({ type: UPDATE_FIELD_AUTH, key, value }),
  onSubmit: (name, surname, email, password, confirmPassword, dateofbirth, gender, snackbar) => {
    const payload = agent.Parent.registerChild(name, surname, email, password, confirmPassword, dateofbirth, gender)
    dispatch({ type: REGISTER_CHILD, payload, snackbar })
  },
  onChangeBooleanAuth: (key, value) => dispatch({ type: UPDATE_AUTH_BOOLEAN, key, value }),
  onUnload: () => dispatch({ type: REGISTER_PAGE_UNLOADED }),
})

class PatientRegister extends Component {
  constructor() {
    super()
    this.changeAuth = (ev) => this.props.onChangeFieldAuth(ev.target.id, ev.target.value)
    this.changeMonth = (ev) => this.props.onChangeFieldAuth('month', ev.target.value)
    this.changeDay = (ev) => this.props.onChangeFieldAuth('day', ev.target.value)
    this.changeDisease = (ev) => this.props.onChangeFieldAuth('disease', ev.target.value)
    this.changeSex = (ev) => this.props.onChangeFieldAuth('sex', ev.target.value)
    this.changeAuthBoolean = (ev) => {
      this.props.onChangeBooleanAuth(ev.target.id, ev.target.checked)
    }
    this.submitForm = (name, surname, email, password, confirmPassword, year, disease, month, day, sex) => (ev) => {
      ev.preventDefault()
      const snackbar = {
        message: `Du registrerade barnet ${name} ${surname} 
                    som lider av ${disease==='diabetes' ? 'diabetes' : 'fetma'}`,
        color: 'success',
        open: true,
      }
      
      this.props.onSubmit(name, surname, email, password, confirmPassword, `${year}-${month}-${day}T00:00:00.000Z`, sex, snackbar)
    }
  }

  componentWillUnmount() {
    this.props.onUnload()
  }

  render() {
    const { classes } = this.props
    const { email } = this.props
    const { password } = this.props
    const { confirmPassword } = this.props
    const { name } = this.props
    const { surname } = this.props
    const { year } = this.props
    const { month } = this.props
    const { day } = this.props
    const { sex } = this.props
    const errors = this.props.errors ? this.props.errors : null
    const { disease } = this.props
   

    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <ChildCareIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registrera patient
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={this.submitForm(name, surname, email, password, confirmPassword, year, disease,  month, day, sex)}
          >
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
                  helperText={errors && (errors.name || errors.general)}
                  error={errors && (errors.name ? true : !!(false || errors.general))}
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
                  helperText={errors && (errors.surname || errors.general)}
                  error={errors && (errors.surname ? true : !!(false || errors.general))}
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
                  helperText={errors && (errors.email || errors.general)}
                  error={errors && (errors.email ? true : !!(false || errors.general))}
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
                  helperText={errors && (errors.password || errors.general)}
                  error={errors && (errors.password ? true : !!(false || errors.general))}
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
                  helperText={errors && (errors.confirmPassword || errors.general)}
                  error={errors && (errors.confirmPassword ? true : !!(false || errors.general))}
                  value={this.props.confirmPassword}
                  onChange={this.changeAuth}
                />
              </Grid>
              <Grid item xs={12}>
              <InputLabel>Födelsedatum</InputLabel>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                 variant="outlined"
                 required
                 fullWidth
                 name="year"
                 type="year"
                 id="year"
                 label="År"
                 helperText={errors && (errors.confirmPassword || errors.general)}
                 error={errors && (errors.confirmPassword ? true : !!(false || errors.general))}
                 value={year}
                 onChange={this.changeAuth}
                /> 
                </Grid>
                <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                <InputLabel id='month-label'>Månad</InputLabel>
                <Select
                  labelId='month-label'
                  label='Månad'
                  //required
                  value={month}
                  onChange={this.changeMonth}
                
                >
                <MenuItem value='01'>Januari</MenuItem>
                <MenuItem value='02'>Februari</MenuItem>
                <MenuItem value='03'>Mars</MenuItem>
                <MenuItem value='04'>April</MenuItem>
                <MenuItem value='05'>Maj</MenuItem>
                <MenuItem value='06'>Juni</MenuItem>
                <MenuItem value='07'>Juli</MenuItem>
                <MenuItem value='08'>Augusti</MenuItem>
                <MenuItem value='09'>September</MenuItem>
                <MenuItem value='10'>Oktober</MenuItem>
                <MenuItem value='11'>November</MenuItem>
                <MenuItem value='12'>December</MenuItem>
                </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                <InputLabel id='day-label'>Dag</InputLabel>
                <Select
                  labelId='day-label'
                  label='Dag'
                  required
                  value={day}                  
                  onChange={this.changeDay}
                  
                >
                <MenuItem id="day" value='01'>1</MenuItem>
                <MenuItem id="day" value='02'>2</MenuItem>
                <MenuItem id="day" value='03'>3</MenuItem>
                <MenuItem id="day" value='04'>4</MenuItem>
                <MenuItem id="day" value='05'>5</MenuItem>
                <MenuItem id="day" value='06'>6</MenuItem>
                <MenuItem id="day" value='07'>7</MenuItem>
                <MenuItem id="day" value='08'>8</MenuItem>
                <MenuItem id="day" value='09'>9</MenuItem>
                <MenuItem id="day" value='10'>10</MenuItem>
                <MenuItem id="day" value='11'>11</MenuItem>
                <MenuItem id="day" value='12'>12</MenuItem>
                <MenuItem id="day" value='13'>13</MenuItem>
                <MenuItem id="day" value='14'>14</MenuItem>
                <MenuItem id="day" value='15'>15</MenuItem>
                <MenuItem id="day" value='16'>16</MenuItem>
                <MenuItem id="day" value='17'>17</MenuItem>
                <MenuItem id="day" value='18'>18</MenuItem>
                <MenuItem id="day" value='19'>19</MenuItem>
                <MenuItem id="day" value='20'>20</MenuItem>
                <MenuItem id="day" value='21'>21</MenuItem>
                <MenuItem id="day" value='22'>22</MenuItem>
                <MenuItem id="day" value='23'>23</MenuItem>
                <MenuItem id="day" value='24'>24</MenuItem>
                <MenuItem id="day" value='25'>25</MenuItem>
                <MenuItem id="day" value='26'>26</MenuItem>
                <MenuItem id="day" value='27'>27</MenuItem>
                <MenuItem id="day" value='28'>28</MenuItem>
                <MenuItem id="day" value='29'>29</MenuItem>
                <MenuItem id="day" value='30'>30</MenuItem>
                <MenuItem id="day" value='31'>31</MenuItem>
                </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id='sex-label'>Kön</InputLabel>
                <Select
                  labelId='sex-label'
                  label='kön'
                  //required
                  value={sex}
                  onChange={this.changeSex}
                >
                <MenuItem value='MALE'>Man</MenuItem>
                <MenuItem value='FEMALE'>Kvinna</MenuItem>
                <MenuItem value='OTHER'>Annat</MenuItem>
                <MenuItem value='NOT_SPECIFIED'>Vill ej specifiera</MenuItem>
                </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id='disease-label'>Sjukdom</InputLabel>
                <Select
                  labelId='disease-label'
                  label='Sjukdom'
                  //required
                  value={disease}
                  onChange={this.changeDisease}
                >
                <MenuItem value='diabetes'>Diabetes</MenuItem>
                <MenuItem value='obesity'>Fetma</MenuItem>
                </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={this.props.inProgress}
            >
              Registrera
            </Button>
          </form>
        </div>
      </Container>
    )
  }
}

const styles = (theme) => ({
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
    backgroundColor: '#fafafa',
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PatientRegister))
