import React, { Component, useState} from 'react'
import  { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {Button} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';

export default function Patient() {
    var [textValue, setTextValue] = useState('');
    function setTextState(e) {
        console.log(e.target.value);
        setTextValue(e.target.value);
    }
    
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
                                onChange= {setTextState}
                />
            </form>
            <Button 
                className="uploadBloodSugarLevel" 
                variant="contained" 
                color="primary"
                onClick={() => { alert('Du registrerade värdet: ' + textValue), localStorage.setItem('BloodSugarValue:' + getCurrentDate(), textValue )}}>
            Skicka in
            </Button>
            <h1> {textValue} </h1>
        </div>
    )
}

export function getCurrentDate(){
    var today = new Date(); 
    var todaysDate = String(today.getFullYear()) + '-' +  String(today.getMonth()) + '-' + String(today.getDate());
    return todaysDate;
}