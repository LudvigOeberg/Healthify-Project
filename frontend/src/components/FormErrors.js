import React from 'react';

const FormErrors = props => {
  const errors = props.errors;
  console.log(errors);
  if (errors) {
    return "";
     
  } else {
    return "";
  }
}

export default FormErrors;
