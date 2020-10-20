import { Container, Link, makeStyles } from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  location: state.router.location.pathname,
})

const NotFound = (props) => {
  const classes = styles()
  return (
    <Container component="main" align="center" maxWidth="sm">
      <div className={classes.left}>
        <h2>
          <b>404.</b> <span className={classes.grey}>Något gick fel.</span>
        </h2>
        Sidan {props.location} hittades inte på servern.
        <br />
        Tillbaka till <Link href="/">startsidan.</Link>
      </div>
    </Container>
  )
}

const styles = makeStyles((theme) => ({
  left: {
    textAlign: 'left',
    marginTop: theme.spacing(8),
  },
  grey: {
    color: theme.palette.grey[500],
  },
}))

export default connect(mapStateToProps)(NotFound)
