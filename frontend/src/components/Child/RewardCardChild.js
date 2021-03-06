import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { Container, Grid, Typography, SvgIcon } from '@material-ui/core'
import LinearProgress from '@material-ui/core/LinearProgress'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { DELETE_REWARD, PAGE_UNLOADED, LOAD_PARTY } from '../../constants/actionTypes'
import agent from '../../agent'
import agentEHR from '../../agentEHR'
import MyDialog from '../MyDialog'

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: (ehrId) => dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) }),
  onUnload: () => dispatch({ type: PAGE_UNLOADED }),

  deleteReward: (nameOf, description, reward, endDate, ehrid, snackbar) => {
    const payload = agent.Parent.deleteReward(nameOf, description, reward, endDate, ehrid)
    dispatch({ type: DELETE_REWARD, payload, snackbar })
  },
})

const RewardCard = (props) => {
  const classes = styles()
  const { oneReward } = props

  const dialogInfo = [
    'Hämta belöning',
    '',
    'Bra jobbat! En notis har skickats till din förälder/ vårdnadsgivare.',
    '',
    '',
  ]

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
        </Grid>
        <CardContent className={classes.card}>{oneReward.description}</CardContent>
        <CardContent className={classes.card}>Belöning: {oneReward.reward}</CardContent>
        <CardContent className={classes.card}>Slutdatum: {oneReward.endDate}</CardContent>
        <CardContent className={classes.card}>
          <Typography variant="caption">
            {' '}
            Avklarad
            <LinearProgress color="primary" size={40} thickness={50} variant="determinate" value="100" />{' '}
          </Typography>
        </CardContent>
        <CardContent className={classes.card}>
          <MyDialog
            buttonLabel={dialogInfo[0]}
            title={dialogInfo[1]}
            text={dialogInfo[2]}
            pictureLocation={dialogInfo[3]}
            alt={dialogInfo[4]}
          ></MyDialog>
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
