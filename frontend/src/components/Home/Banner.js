import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


const Banner = ({ appName, token }) => {
  const classes = useStyles();
  if (token) {
    return null;
  }
  return (
    
    <div className={classes.paper}>
      <Typography variant="h3">
        {appName}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default Banner;
