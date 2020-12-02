import { Container, Grid, Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import React from 'react'
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded'
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
      <Grid container className={classes.root} direction="row" justify="center" spacing={2} alignItems="flex-start">
        {children.map((child) => (
          <Grid item>
            <ChildListItem child={child.child} partyIn={props.party ? props.party[child.child.ehrid] : null} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <div className={classes.paper}>
            <a className={classes.link} id="parentAddChildLink" href="/register-patient">
              <AddCircleOutlineRoundedIcon color="primary" style={{ fontSize: 100 }} />
              <Typography fontSize="50" color="primary" align="center">
                Lägg till barn
              </Typography>
            </a>
          </div>
        </Grid>
      </Grid>
    </Container>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
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
  root: {
    margin: '0px !important',
    // display: 'horizontal',
    padding: theme.spacing(1),
    maxWidth: '100%',
  },
  link: {
    textDecoration: 'none !important',
  },
}))

export default connect(mapStateToProps)(ChildList)
