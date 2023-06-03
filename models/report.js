const {Schema, default:mongoose} = require('mongoose')

const ReportSchema = new Schema({
    reportname: String,
    reporttype: String,
    reporttext: String,
    pdfreport: String,
    picturereport: String,
    staffname: String,
    staffid: String,
    patientname: String,
    patientid: String,
    date: String,
    patients: [{type: Schema.Types.ObjectId, ref: 'Patients'}],
    staff: [{type: Schema.Types.ObjectId, ref: 'Staffs'}]
})

const Reports = mongoose.model('Reports', ReportSchema)
module.exports = {Reports}