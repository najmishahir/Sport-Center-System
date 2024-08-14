// middleware function that validates the data submitted by a customer for registering or logging in
const validateData = function(req, res, next) {
  // function to check the validity of the email address entered by the customer
  // return true if email is valid and false otherwise
  function validateEmail(email) {
    return /^[^\s@]+@(gmail\.com|yahoo\.com|hotmail\.com)$/.test(email);
  }
  
  // function to check if phone number is valid (11 digits && starts with 0)
  function validatePhoneNumber(phoneNumber) {
    // check if phoneNumber is null or undefined
    if (phoneNumber == null) {
      return false;
    }
    // remove any non-digit characters from the phone number
    phoneNumber = phoneNumber.replace(/\D/g, '');
    return /^0\d{10}$/.test(phoneNumber);
  }

  // for register route
  if (req.path === "/register") {
    // if customer does not fill in all required information
    if (![req.body].every(Boolean)) {
      return res.status(401).json( {message: "Missing Credentials"} );  
    }
    // if email is invalid 
    else if (!validateEmail(req.body.email) && validatePhoneNumber(req.body.number)) {
      return res.status(401).json( {message: "Invalid Email"} );
    }
    // if phone number is invalid
    else if (!validatePhoneNumber(req.body.number) && validateEmail(req.body.email)) {
      return res.status(401).json( {message: "Invalid Phone Number"} );
    }
    else if (!validateEmail(req.body.email) && !validatePhoneNumber(req.body.number)) {
      return res.status(401).json( {message: "Invalid Phone Number and Email"} );
    }
  } 
  
  // for login route
  else if (req.path === "auth/login") {
    if (![req.body].every(Boolean)) {
      return res.status(401).json( {message: "Missing Credentials"} );
    } 
    else if (!validateEmail(req.body.customerEmail)) {
      return res.status(401).json( {message: "Invalid Email"} );
    }
  }

   // for login route
  else if (req.path === "auth/staff/login") {
    if (![req.body].every(Boolean)) {
      return res.status(401).json( {message: "Missing Credentials"} );
    } 
    else if (!validateEmail(req.body.staffEmail)) {
      return res.status(401).json( {message: "Invalid Email"} );
    }
  }
  next();
};

module.exports = validateData;