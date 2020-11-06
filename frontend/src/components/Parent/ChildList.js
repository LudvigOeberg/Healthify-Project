import { Container, Grid } from '@material-ui/core'
import React from 'react'
import ChildListItem from './ChildListItem'
/**
 * Displays a list of childrens
 * @param {ChildListItem} props
 */
export default function ChildList(props) {
  const { children } = props
  return (
    <Container>
      <Grid container direction="row" justify="center" spacing={0}>
        {children.map((child) => (
          <Grid key>{ChildListItem(child.child)}</Grid>
        ))}
      </Grid>
    </Container>
  )
}
