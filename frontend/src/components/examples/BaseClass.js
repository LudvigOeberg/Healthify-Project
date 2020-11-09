import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

class Login extends React.Component {
  constructor() {
    super()
  }

  componentWillUnmount() {
    this.props.onUnload()
  }

  render() {
    const { classes } = this.props

    return <Container component="main" maxWidth="xs"></Container>
  }
}

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login))
