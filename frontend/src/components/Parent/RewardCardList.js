import { Container } from '@material-ui/core'
import { connect } from 'react-redux'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import RewardCard from './RewardCard'

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
})

const RewardCardList = (props) => {
  const classes = styles()
  const { rewards } = props

  return (
    <Container className={classes.root}>
      {rewards ? rewards.map((r) => <RewardCard one_reward={r}></RewardCard>) : 'Det finns inga utmaningar'}
    </Container>
  )
}

const styles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
  },
}))

export default connect(mapStateToProps)(RewardCardList)
