import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { Container, Grid, Button, SvgIcon, Typography, Paper, Divider } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import DeleteIcon from '@material-ui/icons/Delete'

import RewardCardList from './RewardCardList'
import agentEHR from '../../agentEHR'
import profileAvatar from '../../Static/profile_avatar.png'

import { PAGE_UNLOADED, LOAD_PARTY, LOAD_BLOODSUGAR, LOAD_WEIGHT } from '../../constants/actionTypes'

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
})

const mapDispatchToProps = (dispatch) => ({
  onLoad: (ehrId) => dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) }),
  loadValues: (ehrId, offset, limit, disease) => {
    if (disease === 'DIABETES')
      dispatch({ type: LOAD_BLOODSUGAR, payload: agentEHR.Query.bloodsugar(ehrId, offset, limit) })
    else if (disease === 'OBESITY') dispatch({ type: LOAD_WEIGHT, payload: agentEHR.Query.weight(ehrId, limit) })
  },
  onUnload: () => dispatch({ type: PAGE_UNLOADED }),
})

const ParentRewardPage = (props) => {
  const classes = styles()
  const { id } = props.match.params
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  const children = props.currentUser ? props.currentUser.children : null
  const name = props.party ? `${props.party[id].firstNames} ${props.party[id].lastNames}` : null

  const matchChild = (_id, _children) => {
    let rewards = null
    for (let i = 0; i < _children.length; ++i) {
      if (_children[i].child.ehrid === _id) rewards = _children[i].child.rewards
    }
    return rewards
  }
  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 11, disease)
  }, [id, disease]) // eslint-disable-line

  return (
    <Container className={classes.root}>
      <Grid justify="center" direction="column" alignItems="center" container>
        <Grid justify="left" alignItems="left" container>
          <a href="/parent">
            <Paper className={classes.backpaper} elevation={5}>
              <SvgIcon viewBox="0 0 15 22">
                <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" fill="#4F4F4F" fillOpacity="1"></path>
              </SvgIcon>
            </Paper>
          </a>
        </Grid>
        <Grid item xs={6}>
          <img src={profileAvatar} alt="Profile"></img>
        </Grid>
        <Grid item xs={4} className={classes.avatarName}>
          <Typography variant="h5"> {name} </Typography>
          <ListItemText secondary={disease === 'DIABETES' ? 'Diabetes' : 'Fetma'} />
        </Grid>
      </Grid>

      <Card elevation={5} className={classes.card}>
        <CardHeader
          title="Utmaningar"
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
        <CardContent>
          <Button
            className={classes.button}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            href={`/add-reward/${id}`}
          >
            Lägg Till Ny Utmaning
          </Button>
          <Grid> Pågående</Grid>
          <Grid>
            <RewardCardList rewards={matchChild(id, children)}></RewardCardList>
          </Grid>
          <Grid>
            <List subheader="Avklarade">
              <ListItem>
                <ListItemText> Spring Linköpingsloppet </ListItemText>
                <ListItemIcon>
                  <Button>
                    <DeleteIcon color="primary" />
                  </Button>
                </ListItemIcon>
              </ListItem>
              <Divider />

              <ListItem>
                <ListItemText>Logga värden varje dag</ListItemText>
                <ListItemIcon>
                  <Button>
                    <DeleteIcon color="primary" />
                  </Button>
                </ListItemIcon>
              </ListItem>
              <Divider />
            </List>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  )
}

const styles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(0),
    alignItems: 'top',
    padding: theme.spacing(1),
  },
  card: {
    borderRadius: 10,
    padding: theme.spacing(0),
  },
  backpaper: {
    width: '60px',
    height: '60px',
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    borderRadius: '50%',
  },
  innerCard: {
    borderRadius: 10,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  inputs: {
    padding: theme.spacing(1),
  },
  RedeemIcon: {
    display: 'flex',
    margin: 'auto',
  },
  avatar: {
    marginTop: theme.spacing(2),
  },
  avatarName: {
    textAlign: 'center',
  },
}))

export default connect(mapStateToProps, mapDispatchToProps)(ParentRewardPage)
