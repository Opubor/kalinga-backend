var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const multer  = require('multer')
const {initializeApp}  = require('firebase/app')
const {getStorage, ref, getDownloadURL, uploadBytesResumable}  = require('firebase/storage')
const { randomBytes } = require('crypto')
const fs = require('fs')
const { Staffs, getStaff } = require('../models/staffs');
const { Facilities } = require('../models/facilities');
const { Patients } = require('../models/patients');
const { Reports } = require('../models/report');
const auth = require('../middlewares/auth')
const createHttpError = require("http-errors");

const {staffValidator,UpdatePasswordValidator, facilityValidator, patientValidator, reportValidator} = require('../validators/validators')

// USER-DETAILS : USER-DETAILS : USER-DETAILS : USER-DETAILS
router.get('/me',auth, async function(req,res,next){
    try {
        const currentUser = await getStaff(req.staff.id)
        console.log(currentUser)
        return res.json(currentUser)
    } catch (error) {
        return res.status(401).send(error.message)
    }
})

// FIRE-BASE : FIRE-BASE : FIRE-BASE : FIRE-BASE
const firebaseConfig = {
    apiKey: "AIzaSyAL6tFDnBhbOO7_ejvsOI1qlMR-fvl6g8o",
    authDomain: "kalinga-23865.firebaseapp.com",
    projectId: "kalinga-23865",
    storageBucket: "kalinga-23865.appspot.com",
    messagingSenderId: "922179444759",
    appId: "1:922179444759:web:927b7b995c45e37d263c52",
    measurementId: "G-GHJ3QSVJD8"
  };
initializeApp(firebaseConfig);
const storage = getStorage();
const upload = multer({storage: multer.memoryStorage()});

// STAFF_PROFILE-PIC : STAFF_PROFILE-PIC : STAFF_PROFILE-PIC : STAFF_PROFILE-PIC 
router.put('/staffpic/:id', upload.single('filename'), async function(req,res,next){
    try {
        const id = req.params.id
        const storageRef = ref(storage, `files/${req.file.originalname + " " + id}`)
        const metadata = {
            contentType: req.file.mimetype
        }
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        const profilepic = await getDownloadURL(snapshot.ref)
        await Staffs.findByIdAndUpdate(id,{profilepic})
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

// CREATE_STAFF : CREATE_STAFF : CREATE_STAFF : CREATE_STAFF
router.post('/staff', async function(req,res,next){
    try {
       const {fullname, phonenumber, email, dob, role, street, city, state, zipcode, password, facilityadminid, facilityname} = req.body
    //    const {error} = staffValidator.validate({fullname, phonenumber, email, dob, role, street, city, state, zipcode, password})
    //    if (error) throw new createHttpError.BadRequest(error.details[0].message);
       const date = new Date();
       const uniqueid = date.getFullYear() + "-" + randomBytes(2).toString("hex")
       let usedEmail = await Staffs.findOne({email : email})
       if(usedEmail){
           return res.status(403).send('Email already in use')
       }else{
           await Staffs.create({fullname, phonenumber, email, dob, role, street,uniqueid, city, state, zipcode, password,facilityadminid, facilityname});
           return res.status(200).send('Staff created successfully')
       }
    } catch (error) {
       return res.status(401).send(error.message)
    }
})

// READ_STAFF : READ_STAFF : READ_STAFF : READ_STAFF
router.get('/staff', async function(req,res,next){
    try {
        const {edit,q,sortAsc,sortDsc,staffid,role} = req.query
        let populate = ['assignedfacility']
        if(edit){
            let staffs = await Staffs.findById(edit).populate(populate)
            return res.json(staffs)
        }
        if(role === "admin"){ 
            if(sortAsc){
                let staffs = await Staffs.find().sort({_id : sortAsc}).populate(populate)
                return res.json(staffs)
            }
            if(sortDsc){
                let staffs = await Staffs.find().sort({_id : sortDsc}).populate(populate)
                return res.json(staffs)
            }
        
            if(q){
                var regex = new RegExp(q, "i")
                let staffs = await Staffs.find({fullname:regex}).sort({_id : 'descending'}).populate(populate)
                return res.json(staffs)
            }else{
                let staffs = await Staffs.find().sort({_id : 'descending'}).populate(populate)
                console.log(staffs)
                return res.json(staffs)
            }
        }
      
       if(role === "facilityadmin"){ 
            if(sortAsc){
                let staffs = await Staffs.find({facilityadminid: staffid}).sort({_id : sortAsc}).populate(populate)
                return res.json(staffs)
            }
            if(sortDsc){
                let staffs = await Staffs.find({facilityadminid: staffid}).sort({_id : sortDsc}).populate(populate)
                return res.json(staffs)
            }
            
            if(q){
                var regex = new RegExp(q, "i")
                let staffs = await Staffs.find({facilityadminid: staffid,fullname:regex}).sort({_id : 'descending'}).populate(populate)
                return res.json(staffs)
            }else{
                let staffs = await Staffs.find({facilityadminid: staffid}).sort({_id : 'descending'}).populate(populate)
                console.log(staffs)
                return res.json(staffs)
            }
        }
    } catch (error) {
        return res.status(401).send(error.message)
    }
})

// UPDATE_STAFF
router.put('/staff/:id', async function(req, res, next) {
    try {
        const{ fullname, phonenumber, email, dob, role, street, city, state, zipcode, password } = req.body
        const id = req.params.id
        // const {error} = staffValidator.validate({fullname, phonenumber, email, dob, role, street, city, state, zipcode, password})
        // if (error) throw new createHttpError.BadRequest(error.details[0].message);
        
        await Staffs.findByIdAndUpdate(id,{fullname, phonenumber, email, dob, role, street, city, state, zipcode, password})
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// DELETE_STAFF
router.delete('/staff/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await Staffs.findByIdAndRemove(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});

// ACCOUNT-SETTINGS
router.put('/settings/:id', async function(req, res, next) {
    try {
        const{ fullname,email,phonenumber,street,city,state,zipcode } = req.body
        const id = req.params.id
        await Staffs.findByIdAndUpdate(id,{fullname,email,phonenumber,street,city,state,zipcode})
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});

// ACCOUNT-SETTINGS #PASSWORD
router.put('/updatepassword/:id', async function(req, res, next) {
    try {
        const{ oldpassword, newpassword, confirmnewpassword  } = req.body
        const id = req.params.id
        const currentStaff = await Staffs.findOne({_id : id})
        if(oldpassword !== currentStaff.password){
            return res.status(401).send('Incorrect Password')
        }
        if(newpassword !== confirmnewpassword || newpassword == ""){
            return res.status(401).send('passwords do not match')
        }else{
            await Staffs.findByIdAndUpdate(id,{password: newpassword})
        }
        return res.status(200).send('Password Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});

// FACILITIES : FACILITIES : FACILITIES : FACILITIES : FACILITIES
// CREATE_FACILITIES
router.post('/facility', async function(req,res,next){
    try {
        const {name, phonenumber,staffid, street, city, state, zipcode} = req.body
        // const {error} = facilityValidator.validate({name, phonenumber,staffid, street, city, state, zipcode})
        // if (error) throw new createHttpError.BadRequest(error.details[0].message);
        // =============================================
        let facility = await Facilities.create({name, phonenumber,staffid, street, city, state, zipcode});
        let staff = await Staffs.findOne({_id : staffid})
        facility.staff = staff
        facility.save()
        let Assignedfacility = await Facilities.findOne({staffid: staffid})
        let assignedstaffid = staffid
        let facilityname = Assignedfacility?.name
        await Staffs.findByIdAndUpdate(assignedstaffid,{assignedfacility: Assignedfacility,facilityname: facilityname})
        return res.status(200).send('Facility created successfully')
    } catch (error) {
       return res.status(401).send(error.message)
    }
})
// READ_FACILITIES
router.get('/facility', async function(req, res, next) {
    try {
        const {edit,q,sortAsc,sortDsc} = req.query
        let populate = ['staff']
        if(edit){
            let facilities = await Facilities.findById(edit).populate(populate)
            return res.json(facilities)
        }
        if(sortAsc){
            let facilities = await Facilities.find().sort({_id : sortAsc}).populate(populate)
            return res.json(facilities)
        }
        if(sortDsc){
            let facilities = await Facilities.find().sort({_id : sortDsc}).populate(populate)
            return res.json(facilities)
        }
        if(q){
            var regex = new RegExp(q, "i")
            let facilities = await Facilities.find({name:regex}).sort({_id : 'descending'}).populate(populate)
            return res.json(facilities)
        }else{
            let facilities = await Facilities.find().sort({_id : 'descending'}).populate(populate)
            return res.json(facilities)
        }
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// UPDATE_FACILITY
router.put('/facility/:id', async function(req, res, next) {
    try {
        const{ name, phonenumber,staffid, street, city, state, zipcode } = req.body
        const id = req.params.id
        // const {error} = facilityValidator.validate({name, phonenumber,staffid, street, city, state, zipcode})
        // if (error) throw new createHttpError.BadRequest(error.details[0].message);
        // ===============================
        let facility = await Facilities.findByIdAndUpdate(id,{name, phonenumber,staffid, street, city, state, zipcode})
        let staff = await Staffs.findOne({_id : staffid})
        facility.staff = staff
        facility.save()
        // =================================
        let Assignedfacility = await Facilities.findOne({staffid})
        let assignedstaffid = staffid
        await Staffs.findByIdAndUpdate(assignedstaffid,{assignedfacility: Assignedfacility})
        return res.status(200).send('Updated Successfully')  
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// DELETE_FACILITY
router.delete('/facility/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await Facilities.findByIdAndDelete(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});

// PATIENT : PATIENT : PATIENT : PATIENT : PATIENT
// CREATE_PATIENT
router.post('/patient', async function(req,res,next){
    try {
       const {fullname, phonenumber, email, dob, street, city, state, zipcode, medications, ailment, note, facilityAdminId} = req.body
    //    const {error} = patientValidator.validate({fullname, phonenumber, email, dob, street, city, state, zipcode, medications, ailment, note})
    //     if (error) throw new createHttpError.BadRequest(error.details[0].message);
       const date = new Date();
       const uniqueid = date.getFullYear() + "-" + randomBytes(2).toString("hex")
       let usedEmail = await Patients.findOne({email : email})
       if(usedEmail){
           return res.status(403).send('Email already in use')
       }else{
          let patient =  await Patients.create({fullname, phonenumber, email, dob, street, city, state, zipcode, medications, ailment, note, uniqueid, facilityAdminId});
           let staff = await Staffs.findOne({_id : facilityAdminId})
           patient.staff = staff
           patient.save()
           return res.status(200).send('Patient created successfully')
       }
    } catch (error) {
       return res.status(401).send(error.message)
    }
})
// READ_PATIENT
router.get('/patients', async function(req,res,next){
    try {
        const {edit,q,sortAsc,sortDsc,facilityAdminId,role} = req.query
        let populate = ['staff']
        if(edit){
            let patients = await Patients.findById(edit)
            return res.json(patients)
        }
        if(role === "admin"){        
            if(sortAsc){
            let patients = await Patients.find().sort({_id : sortAsc}).populate(populate)
            return res.json(patients)
            }
            if(sortDsc){
                let patients = await Patients.find().sort({_id : sortDsc}).populate(populate)
                return res.json(patients)
            }
            if(q){
                var regex = new RegExp(q, "i")
                let patients = await Patients.find({fullname:regex}).sort({_id : 'descending'}).populate(populate)
                return res.json(patients)
            }else{
                let patients = await Patients.find().sort({_id : 'descending'}).populate(populate)
                return res.json(patients)
            }
        }
        if(role === "facilityadmin"){        
            if(sortAsc){
            let patients = await Patients.find({facilityAdminId: facilityAdminId}).sort({_id : sortAsc}).populate(populate)
            return res.json(patients)
            }
            if(sortDsc){
                let patients = await Patients.find({facilityAdminId: facilityAdminId}).sort({_id : sortDsc}).populate(populate)
                return res.json(patients)
            }
            if(q){
                var regex = new RegExp(q, "i")
                let patients = await Patients.find({facilityAdminId: facilityAdminId,fullname:regex}).sort({_id : 'descending'}).populate(populate)
                return res.json(patients)
            }else{
                let patients = await Patients.find({facilityAdminId: facilityAdminId}).sort({_id : 'descending'}).populate(populate)
                return res.json(patients)
            }
        }

    } catch (error) {
        return res.status(401).send(error.message)
    }
})
// UPDATE_PATIENT
router.put('/patient/:id', async function(req, res, next) {
    try {
        const{ fullname, phonenumber, email, dob, street, city, state, zipcode, medications, ailment, note } = req.body
        const id = req.params.id
        // const {error} = patientValidator.validate({fullname, phonenumber, email, dob, street, city, state, zipcode, medications, ailment, note})
        // if (error) throw new createHttpError.BadRequest(error.details[0].message);
        await Patients.findByIdAndUpdate(id,{fullname, phonenumber, email, dob, street, city, state, zipcode, medications, ailment, note})
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// DELETE_PATIENT
router.delete('/patient/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await Patients.findByIdAndDelete(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});

// REPORT : REPORT : REPORT : REPORT : REPORT
// CREATE_REPORT
router.post('/report', async function(req, res, next) {
    try {
        const{ reportname,reporttype, reporttext, staffid, patientid, date } = req.body
        // const {error} = reportValidator.validate({reportname,reporttype, reporttext, staffid, patientid, date})
        // if (error) throw new createHttpError.BadRequest(error.details[0].message);
        let patientname = ""
        let patient = []
        if (patientid.match(/^[0-9a-fA-F]{24}$/)) {
          patient = await Patients.findOne({_id : patientid})
          patientname = patient.fullname
        }   
        let report = await Reports.create({ reportname,reporttype, reporttext, staffid, patientname, patientid, date })
        // =======================================================================================
        let staff = await Staffs.findOne({_id : staffid})
        if(patient){
            patient.reports.push(report)
            patient.save()
        }else{
            res.send('error')
        }            
        report.patients = patient
        report.staff = staff
        report.save()
        // =======================================================================================
        return res.status(200).send('Added Successfully')
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// READ_REPORTS
router.get('/reports', async function(req, res, next) {
    const {edit,q,type,sortAsc,sortDsc} = req.query
    try {
        let populate = ['patients', 'staff']
        if(edit){
            let reports = await Reports.findById(edit).populate(populate).populate(populate)
            return res.json(reports)
        }
        if(sortAsc){
            let reports = await Reports.find({reporttype:type}).sort({_id : sortAsc}).populate(populate)
            return res.json(reports)
        }
        if(sortDsc){
            let reports = await Reports.find({reporttype:type}).sort({_id : sortDsc}).populate(populate)
            return res.json(reports)
        }
        if(q){
            var regex = new RegExp(q, "i")
            let reports = await Reports.find({reporttype:type,reportname:regex}).sort({_id : 'descending'}).populate(populate)
            return res.json(reports)
        }else{
            let reports = await Reports.find({reporttype:type}).sort({_id : 'descending'}).populate(populate)
            return res.json(reports)
        }
    } catch (error) {
        return res.status(401).send(error.message)
    }
});
// UPDATE_REPORT
router.put('/report/:id', async function(req, res, next) {
    try {
        const{  reportname,reporttype, reporttext, staffid, patientid, date } = req.body
        const id = req.params.id
        // const {error} = reportValidator.validate({reportname,reporttype, reporttext, staffid, patientid, date})
        // if (error) throw new createHttpError.BadRequest(error.details[0].message);
        let patientname = ""
        let patient = []
        if (patientid.match(/^[0-9a-fA-F]{24}$/)) {
          patient = await Patients.findOne({_id : patientid})
          patientname = patient.fullname
        }   
        let report = await Reports.findByIdAndUpdate(id,{ reportname,reporttype, reporttext, staffid, patientname, patientid, date })
         // =======================================================================================
         let staff = await Staffs.findOne({_id : staffid})
         if(patient){
             patient.reports.push(report)
             patient.save()
         }else{
             res.send('error')
         }            
         report.patients = patient
         report.staff = staff
         report.save()
         // =======================================================================================
        return res.status(200).send('Updated Successfully')
    } catch (error) {
        return res.send(error)
    }
});
// DELETE_REPORT
router.delete('/report/:id', async function(req, res, next) {
    try {
        const id = req.params.id
        await Reports.findByIdAndDelete(id)
        return res.status(200).send('Deleted Successfully')
    } catch (error) {
        return res.send(error)
    }
});

router.put('/picturereport/:id', upload.single('picturereport'), async function(req,res,next){
    try {
        const id = req.params.id
        const storageRef = ref(storage, `files/${req.file.originalname + " " + id}`)
        const metadata = {
            contentType: req.file.mimetype
        }
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        const picturereport = await getDownloadURL(snapshot.ref)
        await Reports.findByIdAndUpdate(id,{picturereport})
        return res.status(200).send('Updated Successfully')
        // return res.send({
        //     message: 'file uploaded to firebase storage',
        //     name: req.file.originalname,
        //     type: req.file.mimetype,
        //     downloadURL: picturereport
        // })
    } catch (error) {
        return res.status(400).send(error.message)
    }
})
router.put('/pdfreport/:id', upload.single('pdfreport'), async function(req,res,next){
    try {
        const id = req.params.id
        const storageRef = ref(storage, `files/${req.file.originalname + " " + id}`)
        const metadata = {
            contentType: req.file.mimetype
        }
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        const pdfreport = await getDownloadURL(snapshot.ref)
        await Reports.findByIdAndUpdate(id,{pdfreport})
        return res.status(200).send('Updated Successfully')
        // return res.send({
        //     message: 'file uploaded to firebase storage',
        //     name: req.file.originalname,
        //     type: req.file.mimetype,
        //     downloadURL: pdfreport
        // })
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

module.exports = router