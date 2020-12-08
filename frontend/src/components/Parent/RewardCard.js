import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, Typography, SvgIcon, Paper, IconButton } from '@material-ui/core'
import LinearProgress from '@material-ui/core/LinearProgress'
import DeleteIcon from '@material-ui/icons/Delete'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Moment from 'moment'
import { DELETE_REWARD, PAGE_UNLOADED, LOAD_PARTY, LOAD_BLOODSUGAR } from '../../constants/actionTypes'
import agent from '../../agent'
import agentEHR from '../../agentEHR'

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: (ehrId) => {
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) })
    dispatch({
      type: LOAD_BLOODSUGAR,
      payload: agentEHR.Query.bloodsugar(ehrId, 0, 20),
    })
  },
  onUnload: () => dispatch({ type: PAGE_UNLOADED }),

  deleteReward: (nameOf, description, reward, endDate, ehrid, snackbar) => {
    const payload = agent.Parent.deleteReward(nameOf, description, reward, endDate, ehrid)
    dispatch({ type: DELETE_REWARD, payload, snackbar })
  },
})

const RewardCard = (props) => {
  const classes = styles()
  const { oneReward } = props
  const today = new Date()
  const { bloodsugar } = props
  const { type } = props.currentUser

  let deleteVisibilityType = 'visible'

  // eslint-disable-next-line no-console
  console.log(`type: ${type}`)
  if (type === 'child') {
    deleteVisibilityType = 'hidden'
    // eslint-disable-next-line no-console
    console.log(`visibility: ${deleteVisibilityType}`)
  }

  const deleteReward = (nameOf, description, reward, endDate, id) => (ev) => {
    ev.preventDefault()
    const snackbar = {
      message: `Du tog bort reward`,
      color: 'success',
      open: true,
    }
    props.deleteReward(nameOf, description, reward, endDate, id, snackbar)
  }

  const daysElapsed = Moment(today).diff(Moment(oneReward.startDate), 'days')
  const daysTot = Moment(oneReward.endDate).diff(Moment(oneReward.startDate), 'days')

  const checkMeasurement = (data) => {
    const compare = new Date(oneReward.startDate)
    let daysLogged = 0
    for (let i = 0; i < daysElapsed + 1; ++i) {
      for (let y = 0; y < data.length; ++y) {
        if (Moment(Moment(compare).add(i, 'days')).format('YYYY-MM-DD') === Moment(data[y].time).format('YYYY-MM-DD')) {
          daysLogged += 1
          break
        }
      }
    }
    return daysLogged
  }

  return (
    <Container className={classes.root}>
      <Card elevation={3} className={classes.innerCard}>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={10}>
            <CardHeader
              title={oneReward.nameOf}
              titleTypographyProps={{ variant: 'h5' }}
              avatar={
                <SvgIcon width="22" height="10" viewBox="2 5 22 12">
                  <path
                    d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM7 10.82C5.84 10.4 5 9.3 5 8V7h2v3.82zM19 8c0 1.3-.84 2.4-2 2.82V7h2v1z"
                    fill="#FFD700"
                    fillOpacity="1"
                  />
                </SvgIcon>
              }
            ></CardHeader>
          </Grid>
          <Grid item xs={2}>
          </Grid>
        </Grid>
        <CardContent className={classes.card}>{oneReward.description}</CardContent>
        <CardContent className={classes.card}>Belöning: {oneReward.reward}</CardContent>
        <CardContent className={classes.card}>Startdatum: {oneReward.startDate}</CardContent>
        <CardContent className={classes.card}>Slutdatum: {oneReward.endDate}</CardContent>
        <CardContent className={classes.card}>
          <Paper elevation={0} hidden={oneReward.nameOf === 'Blodsocker Streak'}>
            <Typography variant="caption">
              {' '}
              {`${daysTot - daysElapsed} dagar kvar av utmaningen!`}
              <LinearProgress
                color="primary"
                variant="determinate"
                value={bloodsugar ? (checkMeasurement(bloodsugar) / daysTot) * 100 : (daysElapsed / daysTot) * 100}
              />{' '}
            </Typography>
          </Paper>
          <Paper elevation={0} hidden={oneReward.nameOf !== 'Blodsocker Streak' || !bloodsugar}>
            <Typography variant="caption">
              {' '}
              {bloodsugar
                ? `${checkMeasurement(bloodsugar)} av ${daysTot} dagar loggade!`
                : 'Ditt barn har aldrig mätt sitt blodsocker'}
              <LinearProgress
                color="primary"
                variant="determinate"
                value={bloodsugar ? (checkMeasurement(bloodsugar) / daysTot) * 100 : (daysElapsed / daysTot) * 100}
              />{' '}
            </Typography>
          </Paper>
          <Paper
            elevation={0}
            hidden={
              bloodsugar && oneReward.nameOf === 'Blodsocker Streak'
                ? checkMeasurement(bloodsugar) === daysElapsed + 1
                : true
            }
          >
            <Typography variant="subtitle2">Ditt barn har inte loggat alla dagar</Typography>
          </Paper>
        </CardContent>
      </Card>
    </Container>
  )
}

const styles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
    width: '100%',
  },
  innerCard: {
    borderRadius: 10,
    padding: theme.spacing(0),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  backpaper: {
    width: '60px',
    height: '60px',
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    borderRadius: '50%',
  },
  card: {
    padding: theme.spacing(0),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(0),
  },
}))

export default connect(mapStateToProps, mapDispatchToProps)(RewardCard)
