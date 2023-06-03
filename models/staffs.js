const {Schema, default:mongoose} = require('mongoose')

const StaffSchema = new Schema({
    fullname: String,
    phonenumber: String,
    email: String,
    dob: String,
    role: String,
    uniqueid: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    profilepic: String,
    coverpic: String,
    password: String,
    facilityadminid: String,
    facilityname: String,
    reports: [{type: Schema.Types.ObjectId, ref: 'Reports'}],
    assignedfacility: [{type: Schema.Types.ObjectId, ref: 'Facilities'}],
})

async function getStaff(id){
    return await Staffs.findOne({_id:id})
}

const Staffs = mongoose.model('Staffs', StaffSchema)
module.exports = {Staffs, getStaff}