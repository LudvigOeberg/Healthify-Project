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

import sadAvatar from '../Static/sad_avatar.png'
import happyAvatar from '../Static/happy_avatar.png'

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
  // const { title } = props
  const { text } = props
  // const { pictureLocation } = props
  const { alt } = props
  let avatar

  if (alt === 'sad avatar') {
    avatar = sadAvatar
  } else {
    avatar = happyAvatar
  }

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen} fullWidth>
        {buttonLabel}
        <ArrowForwardIosIcon />
      </Button>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogContent dividers>
          <Typography textAlign="center" gutterBottom>
            {text}
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
            <img src={avatar} alt={alt}></img>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Okej
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
