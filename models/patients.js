const {Schema, default:mongoose} = require('mongoose')

const PatientSchema = new Schema({
    fullname: String,
    phonenumber: String,
    email: String,
    dob: String,
    uniqueid: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    medications: String,
    ailment: String,
    note: String,
    zipcode: String,
    profilepic: String,
    facilityAdminId: String,
    staff: [{type: Schema.Types.ObjectId, ref: 'Staffs'}],
    reports: [{type: Schema.Types.ObjectId, ref: 'Reports'}]
})

const Patients = mongoose.model('Patients', PatientSchema)
module.exports = {Patients}