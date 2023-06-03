const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const loginValidator = Joi.object({
    email: Joi.string().email().max(200).required().messages({'string.empty': 'Please provide an Email'}),
    password: Joi.string().max(200).required().messages({'string.empty': 'Please provide a Password'})
});

const staffValidator = Joi.object({
    fullname: Joi.string().max(200).required().messages({'string.empty': 'Please provide a name'}),
    phonenumber: Joi.string().max(200).required().messages({'string.empty': 'Phone number is required'}),
    email: Joi.string().email().max(200).required().messages({'string.empty': 'Email is required'}),
    dob: Joi.string().max(200).required().messages({'string.empty': 'Please provide your date of birth'}),
    role: Joi.string().max(200).required().messages({'string.empty': 'Please provide a role'}),
    street: Joi.string().max(200).required().messages({'string.empty': 'Please provide a Street'}),
    city: Joi.string().max(200).required().messages({'string.empty': 'Please provide a City'}),
    state: Joi.string().max(200).required().messages({'string.empty': 'Please provide a State'}),
    zipcode: Joi.string().max(200).required().messages({'string.empty': 'Please provide a Zipcode'}),
    // profilepic: Joi.string().min(0).max(200),
    // coverpic: Joi.string().min(0).max(200),
    password: Joi.string().min(5).max(30).required().messages({'string.empty': 'Password is required'})
});

const UpdatePasswordValidator = Joi.object({
    oldpassword: Joi.string().max(200).required().messages({'string.empty': 'Old password is required'}),
    newpassword: Joi.string().max(200).required().messages({'string.empty': 'New password is required'}),
    confirmnewpassword: Joi.string().max(200).required().messages({'string.empty': 'Password re-enter your new password'}),
});

const facilityValidator = Joi.object({
    name: Joi.string().max(200).required().messages({'string.empty': 'Please provide the facility name'}),
    phonenumber: Joi.string().max(200).required().messages({'string.empty': 'Phone number is required'}),
    staffid: Joi.string().max(200).required().messages({'string.empty': 'Please provide the staff name'}),
    street: Joi.string().max(200).required().messages({'string.empty': 'Please provide a Street'}),
    city: Joi.string().max(200).required().messages({'string.empty': 'Please provide a City'}),
    state: Joi.string().max(200).required().messages({'string.empty': 'Please provide a State'}),
    zipcode: Joi.string().max(200).required().messages({'string.empty': 'Please provide a Zipcode'}),
});

const patientValidator = Joi.object({
    fullname: Joi.string().max(200).required().messages({'string.empty': 'Please provide a name'}),
    phonenumber: Joi.string().max(200).required().messages({'string.empty': 'Phone number is required'}),
    email: Joi.string().email().max(200).required().messages({'string.empty': 'Email is required'}),
    dob: Joi.string().max(200).required().messages({'string.empty': 'Please provide your date of birth'}),
    street: Joi.string().max(200).required().messages({'string.empty': 'Please provide a Street'}),
    city: Joi.string().max(200).required().messages({'string.empty': 'Please provide a City'}),
    state: Joi.string().max(200).required().messages({'string.empty': 'Please provide a State'}),
    zipcode: Joi.string().max(200).required().messages({'string.empty': 'Please provide a Zipcode'}),
    medications: Joi.string().min(0).max(200),
    ailment: Joi.string().min(0).max(200),
    note: Joi.string().min(0).max(200),
});

const reportValidator = Joi.object({
    reportname: Joi.string().max(200).required().messages({'string.empty': 'Please provide a report name'}),
    reporttype: Joi.string().max(200).required().messages({'string.empty': 'Please provide a report type name'}),
    reporttext: Joi.string().min(0).max(200),
    staffid: Joi.string().max(200).required().messages({'string.empty': 'Please provide a Staff Name'}),
    patientid: Joi.string().max(200).required().messages({'string.empty': 'Please provide a Patient Name'}),
    date: Joi.string().max(200).required().messages({'string.empty': 'Please provide a Date'}),
});

module.exports={loginValidator, staffValidator, facilityValidator, patientValidator, reportValidator, UpdatePasswordValidator}