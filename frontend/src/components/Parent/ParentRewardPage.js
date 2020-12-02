import React, {useEffect} from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  Container,
  Grid,
  Button,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
//import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import DeleteIcon from "@material-ui/icons/Delete";
import { Divider } from "@material-ui/core";
import RewardCardList from './RewardCardList';
import agentEHR from "../../agentEHR";

import {
  PAGE_UNLOADED,
  LOAD_PARTY,
  LOAD_BLOODSUGAR,
  LOAD_WEIGHT
} from "../../constants/actionTypes";

const mapStateToProps = (state) => ({
  ...state.common,
  ...state.ehr,
})

const mapDispatchToProps = (dispatch) => ({

  onLoad: (ehrId) =>
    dispatch({ type: LOAD_PARTY, payload: agentEHR.EHR.getParty(ehrId) }),
    loadValues: (ehrId, offset, limit, disease) => {
      if (disease === 'DIABETES')
        dispatch({ type: LOAD_BLOODSUGAR, payload: agentEHR.Query.bloodsugar(ehrId, offset, limit) })
      else if (disease === 'OBESITY') dispatch({ type: LOAD_WEIGHT, payload: agentEHR.Query.weight(ehrId, limit) })
    },
  onUnload: () => dispatch({ type: PAGE_UNLOADED }),
  
  })



const ParentRewardPage = (props) => {
  

  const classes = styles();
  const {id}  = props.match.params
  const disease = props.party ? `${props.party[id].additionalInfo.disease}` : null
  //funkar inte med 2 barn [0]
  const rewards = props.currentUser ? props.currentUser.children[0].child.rewards : null
  //const rewards = props.party ? `${props.party[id].additionalInfo.disease}` : null

  useEffect(() => {
    props.onLoad(id)
    props.loadValues(id, 0, 11, disease)
  }, [id, disease]) // eslint-disable-line
  
  return (
    /* -------------------------------Utmaningar-------------------------------------- */

    <Container className={classes.root}>
      <Grid item xs={12} className={classes.card}>
        <Card elevation={5} className={classes.card}>
          <CardHeader
            title="Utmaningar"
            titleTypographyProps={{ variant: 'h5' }}
            avatar={<EmojiEventsIcon></EmojiEventsIcon>}
          >
            \
          </CardHeader>
          <CardContent>
            <Button
              className={classes.button}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              href={`/add-reward/${id}`}
            >
              Lägg Till Ny Utmaning
            </Button>
            <Grid> Pågående</Grid>
          <Grid>

          <RewardCardList rewards={rewards}>

          </RewardCardList>

          </Grid>
            <Grid>
              <List subheader="Avklarade">
                <ListItem>
                  <ListItemText> text </ListItemText>
                  <ListItemIcon>
                    <Button>
                      <DeleteIcon color="primary" />
                    </Button>
                  </ListItemIcon>
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText> Åka och bada </ListItemText>
                  <ListItemIcon>
                    <Button>
                      <DeleteIcon color="primary" />
                    </Button>
                  </ListItemIcon>
                </ListItem>
                <Divider />
              </List>
            </Grid>
          </CardContent>
        </Card>
      </Grid>




    </Container>
  )
}

const styles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
    alignItems: 'top',
    display: 'flex',
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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  inputs: {
    padding: theme.spacing(1),
  },
  RedeemIcon: {
    display: 'flex',
    margin: 'auto',
  },
}))

export default connect(mapStateToProps, mapDispatchToProps)(ParentRewardPage)
