import {
  Avatar,
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@material-ui/core'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ChildCareIcon from '@material-ui/icons/ChildCare'
import { withStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import {
  REGISTER_CHILD,
  UPDATE_FIELD_AUTH,
  REGISTER_PAGE_UNLOADED,
  UPDATE_AUTH_BOOLEAN,
} from '../../constants/actionTypes'
import agent from '../../agent'

const mapStateToProps = (state) => ({ ...state.auth, ...state.common })

const mapDispatchToProps = (dispatch) => ({
  onChangeFieldAuth: (key, value) => dispatch({ type: UPDATE_FIELD_AUTH, key, value }),
  onSubmit: (name, surname, email, password, confirmPassword, dateofbirth, gender, disease, snackbar) => {
    const payload = agent.Parent.registerChild(
      name,
      surname,
      email,
      password,
      confirmPassword,
      dateofbirth,
      gender,
      disease,
    )
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
    this.changeGender = (ev) => this.props.onChangeFieldAuth('gender', ev.target.value)
    this.changeAuthBoolean = (ev) => {
      this.props.onChangeBooleanAuth(ev.target.id, ev.target.checked)
    }
    this.submitForm = (name, surname, email, password, confirmPassword, disease, dateofbirth, gender) => (ev) => {
      ev.preventDefault()
      const snackbar = {
        message: `Du registrerade barnet ${name} ${surname} 
                    som lider av ${disease === 'diabetes' ? 'diabetes' : 'fetma'}`,
        color: 'success',
        open: true,
      }

      this.props.onSubmit(
        name,
        surname,
        email,
        password,
        confirmPassword,
        `${dateofbirth}T00:00:00.000Z`,
        gender,
        disease,
        snackbar,
      )
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
    const { gender } = this.props
    const { dateofbirth } = this.props
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
            onSubmit={this.submitForm(name, surname, email, password, confirmPassword, disease, dateofbirth, gender)}
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
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="dateofbirth"
                  type="date"
                  id="dateofbirth"
                  label="Födelsedatum"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText={errors && (errors.dateofbirth || errors.general)}
                  error={errors && (errors.dateofbirth ? true : !!(false || errors.general))}
                  value={dateofbirth}
                  onChange={this.changeAuth}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  error={errors && (errors.gender ? true : !!(false || errors.general))}
                >
                  <InputLabel id="gender-label">Kön</InputLabel>
                  <Select
                    labelId="gender-label"
                    label="kön"
                    value={gender}
                    onChange={this.changeGender}
                    error={errors && (errors.gender ? true : !!(false || errors.general))}
                  >
                    <MenuItem value="MALE">Man</MenuItem>
                    <MenuItem value="FEMALE">Kvinna</MenuItem>
                    <MenuItem value="OTHER">Annat</MenuItem>
                    <MenuItem value="UNKNOWN">Vill ej specifiera</MenuItem>
                  </Select>
                  <FormHelperText>{errors && (errors.gender || errors.general)}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  error={errors && (errors.disease ? true : !!(false || errors.general))}
                >
                  <InputLabel id="disease-label">Sjukdom</InputLabel>
                  <Select labelId="disease-label" label="Sjukdom" value={disease} onChange={this.changeDisease}>
                    <MenuItem value="DIABETES">Diabetes</MenuItem>
                    <MenuItem value="OBESITY">Fetma</MenuItem>
                  </Select>
                  <FormHelperText>{errors && (errors.disease || errors.general)}</FormHelperText>
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
