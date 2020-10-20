import { Grid } from '@material-ui/core'
import React from 'react'
import Caregiver from './Caregiver'
/**
 * Displays a team of caregivers in a grid
 * @param {Caregiver} props - an array of caregivers (see input for component Caregiver)
 */
export default function CaregivingTeam(props) {
  const { caregivers } = props
  return (
    <Grid container direction="row" justify="center" spacing={0}>
      {caregivers.map((caregiver, i) => (
        <Grid key={i}>{Caregiver(caregiver)}</Grid>
      ))}
    </Grid>
  )
}
