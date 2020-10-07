import React, { Component } from 'react'
import  { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {Button} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';



export default class Patient extends Component {
    render() {
        return (
            <div>

                <h1>Patient vy</h1>
                <h2> Var vänlig skriv in ditt blodsocker värde</h2>
                <form className="bloodSugarForm" noValidate autoComplete="off">
                    <TextField 
                        required id = "standard-required"
                        id="blodsugar" 
                        label="Blodsocker värde" 
                        variant = "outlined"
                        InputProps={{
                                        startAdornment: <InputAdornment position="start">mmol/L</InputAdornment>,
                                    }}
                        onChange= {handleTestFieldState(this)}
                    />
                </form>
                <Button 
                    className="uploadBloodSugarLevel" 
                    variant="contained" 
                    color="primary"
                    onClick={() => { alert('clicked'), localStorage.setItem("BloodSugarValue",) }}>
                Skicka in
                </Button>
            </div>
        )
    }
}

function getInitialState() {
    return {
        textFieldValue: ''
    }
}

function handleTestFieldState(e) {
    alert('updated');
    this.setState({
        textFieldValue: e.target.value
    });
}

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: '25ch',
    },
  }));
  
  function InputAdornments() {
    const classes = useStyles();
    const [values, setValues] = React.useState({
      amount: '',
      password: '',
      weight: '',
      weightRange: '',
      showPassword: false,
    });
}