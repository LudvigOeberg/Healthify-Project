import Typography from '@material-ui/core/Typography'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { Grid, Paper, Switch } from '@material-ui/core'

const styles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  main: {
    marginTop: theme.spacing(12),
    display: 'flex',
    flexDirection: 'column',
  },
  img: {
    maxWidth: '-webkit-fill-available',
    marginRight: theme.spacing(2),
    border: '0.5px solid #E0E0E0',
    borderRadius: '10px',
  },
}))

export default function Integrations() {
  const classes = styles()

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.main}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h5">Koppla enheter</Typography>
              <Typography variant="body2">
                Koppla dina enheter och andra appar för att kunna hämta data automatiskt.
              </Typography>
            </Paper>
          </Grid>
          <Integration
            name="Fitbit"
            desc="Träningsaktivitet"
            img="https://cdn.iconscout.com/icon/free/png-512/fitbit-4-569194.png"
          />
          <Integration
            name="Apple Health"
            desc="Träningsaktivitet"
            img="https://i.pinimg.com/originals/aa/b7/20/aab7203d85c8be9330717930c53c643d.png"
          />
          <Integration
            name="Runkeeper"
            desc="Träningsaktivitet"
            img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7rKlJyCTheX9uZ-dR7Lolo07TvLLR0FeIDnRkEvWJhU49Ydfm4yapG7w87qy0S1adwe_334-RhMYSNdud6fPFI7M8daH6FO0&usqp=CAU&ec=45725305"
          />
          <Integration
            name="Freestyle Libre"
            desc="FGM Blodsockermätare"
            img="https://play-lh.googleusercontent.com/rnDwO2HQHKHtxF3Y5YdEJTqlgeKr1Qxp2gBvJRxT1sAPXqOOSuTqJbWvgVnBYqW8rz_U"
          />
          <Integration
            name="Lifesum"
            desc="Kosthållning"
            img="https://assets.materialup.com/uploads/28546dc1-9e90-4f84-bf5f-a7cc5363219a/preview.jpg"
          />
        </Grid>
      </div>
    </Container>
  )
}

function Integration(props) {
  const classes = styles()
  const { img } = props
  const { desc } = props
  const { name } = props
  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={2}>
            <img alt="App" className={classes.img} src={img} />
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h5">{name}</Typography>
            <Typography variant="body2">{desc}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Switch color="primary" name="checkedB" inputProps={{ 'aria-label': 'primary checkbox' }} />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}
