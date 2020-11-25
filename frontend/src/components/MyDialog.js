import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import DetailsIcon from '@material-ui/icons/Details'

import sadAvatar from '../Static/sad_avatar_face.png'
import happyAvatar from '../Static/happy_avatar_face.png'
import neutralAvatar from '../Static/neutral_avatar_face.png'
import trainingAvatar from '../Static/workout_avatar_weights.png'
import runningAvatar from '../Static/workout_avatar_run.png'

const styles = (theme) => ({
  root: {
    justifyContent: 'center',
    textAlign: 'center',
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
})

// eslint-disable-next-line no-unused-vars
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles((theme) => ({
  root: {
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
}))(MuiDialogContent)

const DialogActions = withStyles((theme) => ({
  root: {
    justifyContent: 'center',
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions)

export default function MyDialog(props) {
  const [open, setOpen] = React.useState(false)

  const { buttonLabel } = props
  // eslint-disable-next-line prefer-const
  let { text } = props
  const { alt } = props
  // eslint-disable-next-line no-unused-vars
  const { weeks } = props
  let avatar

  if (alt === 'sad avatar') {
    avatar = sadAvatar
  } else if (alt === 'happy avatar') {
    avatar = happyAvatar
  } else if (alt === 'neutral avatar') {
    avatar = neutralAvatar
  } else if (alt === 'running avatar') {
    avatar = runningAvatar
  } else {
    avatar = trainingAvatar
  }

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  function getFirstPart() {
    if (avatar === trainingAvatar) {
      return text.substr(0, 39)
    }
    return text
  }

  // eslint-disable-next-line consistent-return
  function getSecondPart() {
    if (avatar === trainingAvatar) {
      return text.substr(46, 17)
    }
  }

  // eslint-disable-next-line consistent-return
  function getWeeks() {
    if (avatar === trainingAvatar) {
      return <b>{weeks}</b>
    }
  }

  return (
    <div>
      <Button id="openDialogButton" variant="contained" color="primary" onClick={handleClickOpen} fullWidth>
        {buttonLabel}
        <ArrowForwardIosIcon />
      </Button>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogContent dividers>
          <Container
            component="div"
            style={{
              padding: '15px',
              borderRadius: '30px',
              border: '1px solid #000',
            }}
          >
            <Typography textAlign="center" id="bubbleText" gutterBottom>
              {getFirstPart()}
              {getWeeks()}
              {getSecondPart()}
            </Typography>
          </Container>
          <Box display="flex" justifyContent="center" alignItems="center" height="45px">
            <DetailsIcon fontSize="large" />
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
            <img src={avatar} alt={alt} height="200px"></img>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button id="okButton" autoFocus onClick={handleClose} color="primary">
            Okej
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
