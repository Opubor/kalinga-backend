const {Schema, default:mongoose} = require('mongoose')

const FacilitiesSchema = new Schema({
    name: String,
    phonenumber: String,
    staffid: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    staff: [{type: Schema.Types.ObjectId, ref: 'Staffs'}],
})

const Facilities = mongoose.model('Facilities', FacilitiesSchema)
module.exports = {Facilities}