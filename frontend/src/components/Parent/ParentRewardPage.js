import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import {
  Accordion,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Container,
  Paper,
  Grid,
  Button,
  Slider,
  Input,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
} from '@material-ui/core'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import InputSlider from '../InputSlider'
import { Avatar } from '@material-ui/core'
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import Icon from '@material-ui/core/Icon';
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete';
import { Divider } from '@material-ui/core'

import agentEHR from '../../agentEHR'

import { PAGE_UNLOADED, LOAD_PARTY, UPDATE_FIELD_AUTH, } from '../../constants/actionTypes'


const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
});

const mapDispatchToProps = (dispatch) => ({
  onChangeField: (key, value) =>
    dispatch({ type: UPDATE_FIELD_AUTH, key, value }),
  onLoad: (ehrId) =>
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) }),
  onUnload: () => dispatch({ type: PAGE_UNLOADED }),
});

const ParentRewardPage = (props) => {


const classes = styles()
const name = props.currentUser ? `${props.currentUser.name} ${props.currentUser.surname}` : null
const challengeName = "Biobiljett placeholder :)"
const challengeDesc = "Logga ditt blodsocker 3 dagar i rad för att få reward!"
  return (
    <Container className={classes.root}>
      <Grid item xs={12} className={classes.card}>
        <Card elevation={5} className={classes.card}>
          <CardHeader
             title='Utmaningar' titleTypographyProps={{variant:"h5"}} avatar={<EmojiEventsIcon></EmojiEventsIcon>} >\
          </CardHeader> 
          <CardContent>
            <Button className={classes.button}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
             // onClick={   }
             >Lägg Till Ny Utmaning 
            </Button>
          <Grid> Pågående</Grid>
            <Card elevation={3}  className={classes.innerCard}>
              <CardHeader title={challengeName} titleTypographyProps={{variant:"h5"}} avatar={<MonetizationOnIcon></MonetizationOnIcon>} ></CardHeader>
              <CardContent>
                {challengeDesc}
              </CardContent>
            </Card>
            
          
            <Grid>
            <List subheader={'Avklarade'}>
            
                <ListItem>
                <ListItemText> Köpa Glass </ListItemText>

                <ListItemIcon>
                  <EditIcon color="primary" />
                </ListItemIcon>
                
                <ListItemIcon>
                    <DeleteIcon color="primary" />
                </ListItemIcon>
              
                </ListItem>
                <Divider />

                <ListItem>
                <ListItemText> Åka och bada </ListItemText>

                <ListItemIcon>
                  <EditIcon color="primary" />
                </ListItemIcon>

                <ListItemIcon>
                  <DeleteIcon color="primary" />
                </ListItemIcon>
                
                </ListItem>
                <Divider />
            </List>
            </Grid>

          </CardContent>
        </Card>
      </Grid>
    </Container>
  );
};

const styles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
    alignItems: "top",
    display: "flex",
    padding: theme.spacing(1),
  },
  card: {
    borderRadius: 10,
    padding: theme.spacing(1),
  },
  innerCard: {
    borderRadius: 10,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),

  },
  button: {
    marginBottom: theme.spacing(4),
  }
}));

export default connect(mapStateToProps, mapDispatchToProps)(ParentRewardPage);
