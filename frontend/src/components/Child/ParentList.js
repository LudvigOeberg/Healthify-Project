import { Container, Grid } from '@material-ui/core'
import React from 'react'
import ParentListItem from './ParentListItem'

/**
 * Displays a list of parents
 * @param {ParentListItem} props
 */
export default function ParentList(props) {
  const { parents } = props
  return (
    <Container>
      <Grid container direction="row" justify="center" spacing={0}>
        {parents.map((parent) => (
          <Grid key>{ParentListItem(parent.parent)}</Grid>
        ))}
      </Grid>
    </Container>
  )
}
