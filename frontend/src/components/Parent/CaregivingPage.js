import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import { PAGE_UNLOADED} from '../../constants/actionTypes'
import CaregivingTeam from '../CaregivingTeam'

const mapStateToProps = (state) => ({
  ...state.common,
})

const mapDispatchToProps = (dispatch) => ({
  onUnload: () => dispatch({ type: PAGE_UNLOADED }),
})

class NewCaregivingPage extends Component {
  componentWillUnmount() {
    this.props.onUnload()
  }

  render() {
    const { classes } = this.props

    const doctor = {
      name: 'Doktor X',
      mail: 'Dr.x@gmail.com',
      telephone: '070-XXX XX XX',
    }
    const shrink = {
      name: 'Psykolog Y',
      mail: 'P.Y@gmail.com',
      telephone: '070-YYY YY YY',
    }
    const nurse = {
      name: 'Sjuksköterska Z',
      mail: 'S.Z@gmail.com',
      telephone: '070-ZZZ ZZ ZZ',
    }
    const caregivers = [doctor, shrink, nurse]
    const type = this.props.currentUser ? `${this.props.currentUser.type}` : null

    const description = () => {
      if (type === 'child') {
        return 'Dina vårdgivare'
      }
      return 'Ditt barns vårdgivare'
    }

    return (
      <div className={classes.paper}>
        <Grid container justify="center">
          <Grid item xs={12}>
            <Typography className={classes.typography} component="h1" variant="h5">
              {description()}
            </Typography>
          </Grid>
          <Grid item>
            <CaregivingTeam caregivers={caregivers} />
          </Grid>
        </Grid>
      </div>
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
  typography: {
    textAlign: 'center',
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NewCaregivingPage))
