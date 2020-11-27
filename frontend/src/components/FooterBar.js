import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper, Tooltip, Fab, SvgIcon } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },

  footer: {
    position: 'fixed',
    bottom: 0,
    padding: theme.spacing(0),
    marginTop: 'auto',
    display: 'flex',
    width: '100%',
    zIndex: 10001,
  },

  avatar: {
    // border: '5px solid white',
    // borderRadius: '50%',
    backgroundColor: '#59B014',
    position: 'absolute',
    left: '50%',
    marginLeft: -theme.spacing(3),
    bottom: '44%',
    width: theme.spacing(6),
    height: theme.spacing(6),
  },

  paper: {
    height: '100%',
    padding: theme.spacing(1),
    textAlign: 'center',
  },

  borderRight: {
    borderRight: '1px solid #C4C4C4',
  },
}))

export default function FooterBar() {
  const classes = useStyles()

  return (
    <footer className={classes.footer}>
      <Grid container className={classes.root} height="100%">
        <Grid item xs={3} className={classes.borderRight}>
          <a id="homeFooterLink" href='/child'>
            <Tooltip title="Hem" aria-label="home">
              <Paper className={classes.paper} square>
                <SvgIcon width="22" height="12" viewBox="0 0 22 12">
                  <path
                    d="M7.99998 16V11H12V16C12 16.55 12.45 17 13 17H16C16.55 17 17 16.55 17 16V8.99997H18.7C19.16 8.99997 19.38 8.42997 19.03 8.12997L10.67 0.599971C10.29 0.259971 9.70998 0.259971 9.32998 0.599971L0.969976 8.12997C0.629976 8.42997 0.839976 8.99997 1.29998 8.99997H2.99998V16C2.99998 16.55 3.44998 17 3.99998 17H6.99998C7.54998 17 7.99998 16.55 7.99998 16Z"
                    fill="black"
                    fillOpacity="0.6"
                  />
                </SvgIcon>
              </Paper>
            </Tooltip>
          </a>
        </Grid>

        <Grid item xs={3} className={classes.borderRight}>
          {/* Här ska reward sidan in */}
          <a id="rewardFooterLink" href="/child">
            <Tooltip title="Pokal" aria-label="trophy">
              <Paper className={classes.paper} square>
                <SvgIcon width="22" height="10" viewBox="2 5 22 12">
                  <path
                    d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM7 10.82C5.84 10.4 5 9.3 5 8V7h2v3.82zM19 8c0 1.3-.84 2.4-2 2.82V7h2v1z"
                    fill="black"
                    fillOpacity="0.6"
                  />
                </SvgIcon>
              </Paper>
            </Tooltip>
          </a>
        </Grid>

        <Grid item xs={3} className={classes.borderRight}>
          <a id="statisticsFooterLink" href="/child-monitor/">
            <Tooltip title="Simulera" aria-label="simulation">
              <Paper className={classes.paper} square>
                <SvgIcon width="22" height="12" viewBox="0 0 22 12">
                  <path
                    d="M20 0C18.55 0 17.74 1.44 18.07 2.51L14.52 6.07C14.22 5.98 13.78 5.98 13.48 6.07L10.93 3.52C11.27 2.45 10.46 1 9 1C7.55 1 6.73 2.44 7.07 3.52L2.51 8.07C1.44 7.74 0 8.55 0 10C0 11.1 0.9 12 2 12C3.45 12 4.26 10.56 3.93 9.49L8.48 4.93C8.78 5.02 9.22 5.02 9.52 4.93L12.07 7.48C11.73 8.55 12.54 10 14 10C15.45 10 16.27 8.56 15.93 7.48L19.49 3.93C20.56 4.26 22 3.45 22 2C22 0.9 21.1 0 20 0Z"
                    fill="black"
                    fillOpacity="0.6"
                  />
                </SvgIcon>
              </Paper>
            </Tooltip>
          </a>
        </Grid>

        <Grid item xs={3}>
          <a id="laborationFooterLink" href="/child-laboration">
            <Tooltip title="Labb" aria-label="lab">
              <Paper className={classes.paper} square>
                <SvgIcon width="22" height="12" viewBox="0 0 22 12">
                  <path
                    d="M16.2934 16.2L10.312 7.50375V2.8125L11.7042 0.91125C11.9723 0.54 11.7351 0 11.302 0H5.19682C4.76368 0 4.52648 0.54 4.79462 0.91125L6.18684 2.8125V7.50375L0.205429 16.2C-0.299897 16.9425 0.184804 18 1.03045 18H15.4683C16.314 18 16.7987 16.9425 16.2934 16.2Z"
                    fill="black"
                    fillOpacity="0.6"
                  />
                </SvgIcon>
              </Paper>
            </Tooltip>
          </a>
        </Grid>
      </Grid>

      <a id="addFooterLink" href="/add">
        <Tooltip title="Lägg till" aria-label="add">
          <Fab color="primary" className={classes.avatar}>
            <AddIcon fontSize="medium" />
          </Fab>
        </Tooltip>
      </a>
    </footer>
  )
}
