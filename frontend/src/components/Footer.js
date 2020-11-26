import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(10),
    marginTop: 'auto',
  },
}))

export default function Copyright() {
  const classes = useStyles()
  return (
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        <Typography variant="body2" color="textSecondary" align="center">
          {'Copyright © '}
          <Link id="healthifyFooterLink" color="inherit" href="/">
            Healthify
          </Link>{' '}
          {new Date().getFullYear()}.
        </Typography>
      </Container>
    </footer>
  )
}
