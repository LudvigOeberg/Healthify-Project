import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import CaregivingTeam from '../CaregivingTeam'

export default function CaregivingPage() {
    const classes = useStyles();

    const doctor = {
        name: "Doktor X",
        mail: "Dr.x@gmail.com",
        telephone: "070-XXX XX XX"
    } 
    const shrink = {
        name: "Psykolog Y",
        mail: "P.Y@gmail.com",
        telephone: "070-YYY YY YY"
    } 
    const nurse = {
        name: "Sjuksköterska Z",
        mail: "S.Z@gmail.com",
        telephone: "070-ZZZ ZZ ZZ"
    }
    const caregivers = [doctor, shrink, nurse]

    return (
        <div className={classes.paper}>
            <Grid container justify="center" alignItems="center">
                <Grid item xs={12}>
                    <Typography className={classes.typography} 
                        component="h1"
                        variant="h5">
                        Ditt barns vårdgivare
                    </Typography>
                </Grid>
                <Grid item>
                    <CaregivingTeam caregivers={caregivers}/>
                </Grid>
            </Grid>
        </div>
    )
}


const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    typography: {
        textAlign: 'center'
    }
})
);
