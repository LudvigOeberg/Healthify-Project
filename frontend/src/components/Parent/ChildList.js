import { Container, Grid, Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import React from 'react'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'
import ChildListItem from './ChildListItem'
/**
 * Displays a list of childrens
 * @param {ChildListItem} props
 */

const mapStateToProps = (state) => ({
  ...state.ehr,
})

function ChildList(props) {
  const { children } = props
  const classes = useStyles()
  return (
    <Container>
      <Grid container direction="row" justify="center" spacing={0} alignItems="flex-start">
        {children.map((child) => (
          <Grid key>
            <ChildListItem child={child.child} partyIn={props.party ? props.party[child.child.ehrid] : null} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <div className={classes.paper}>
            <a id="parentAddChildLink" href="/register-patient">
              <AddIcon color="primary" style={{ fontSize: 100 }} />
            </a>
            <Typography fontSize="50" color="primary">
              Lägg till barn
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Container>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justify: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default connect(mapStateToProps)(ChildList)
