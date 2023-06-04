const {Schema, default:mongoose} = require('mongoose')

const AppointmentsSchema = new Schema({
    patientid: String,
    facilityadminid: String,
    assignedstaffid: String,
    morningsession: String,
    morningstart: String,
    morningend: String,
    afternoonsession: String,
    afternoonstart: String,
    afternoonend: String,
    eveningsession: String,
    eveningstart: String,
    eveningend: String,
    patientname: String,
    morningcompleted: String,
    afternooncompleted: String,
    eveningcompleted: String,
    morningcancelled: String,
    afternooncancelled: String,
    eveningcancelled: String,
    caregivernote: String,
    patients: [{type: Schema.Types.ObjectId, ref: 'Patients'}],
    facilityadmin: [{type: Schema.Types.ObjectId, ref: 'Staffs'}],
    assignedstaff: [{type: Schema.Types.ObjectId, ref: 'Staffs'}],
})

const Appointments = mongoose.model('Appointments', AppointmentsSchema)
module.exports = {Appointments}