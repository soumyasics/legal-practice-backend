const router=require('express').Router()
const user=require('./User/userController')
const advocates=require('./Advocates/advocateController')
const cases=require('./Cases/caseController')
const appointments=require('./AdvAppointments/appointmentController')


//advocate routes
router.post('/registerAdvocate',advocates.upload,advocates.registerAdvocate)
router.post('/viewAdvocateById/:id',advocates.viewAdvocateById)
router.post('/forgotPassword',advocates.forgotPassword)
router.post('/loginAdvocate',advocates.login)
router.post('/editAdvocateById/:id',advocates.uploadProfile,advocates.editAdvocateById)
router.post('/deleteAdvocateById/:id',advocates.deleteAdvocateById)
router.post('/resetPassword/:id',advocates.resetPassword)
router.post('/approveAdvocateById/:id',advocates.approveAdvocateById)
router.post('/rejectAdvocateById/:id',advocates.rejectAdvocateById)
router.post('/requireAuth',advocates.requireAuth)
router.post('/viewAdvocateReqs',advocates.viewAdvocateReqs)
router.post('/viewAdvocates',advocates.viewAdvocates)
router.post('/activateAdvocateById/:id',advocates.activateAdvocateById)
router.post('/deactivateAdvocateById/:id',advocates.deactivateAdvocateById)


//users routers
router.post('/registerUser',user.upload,user.registerUser)
router.post('/loginUser',user.login)
router.post('/editUserById/:id',user.upload,user.editUserById)
router.post('/viewUserById/:id',user.viewUserById)
router.post('/forgotPassword',user.forgotPassword)
router.post('/resetPassword',user.resetPassword)
router.post('/deleteUserById/:id',user.deleteUserById)
router.post('/editUserById',user.upload,user.login)
router.post('/requireAuth',user.requireAuth)
router.post('/viewUsers',user.viewUsers)

//case routes
router.post('/createCase/:id',cases.upload,cases.createCase)
router.post('/getCaseType',cases.getCaseType)
router.post('/getCaseByUserId/:id',cases.getCaseByUserId)

router.post('/createAppointment',appointments.createAppointment)
router.post('/getAppointmentReqsByUserId/:id',appointments.getAppointmentReqsByUserId)
router.post('/getAppointmentReqsForAdv/:id',appointments.getAppointmentReqsForAdv)
router.post('/acceptReqbyAdv/:id',appointments.acceptReqbyAdv)
router.post('/rejectReqbyAdv/:id',appointments.rejectReqbyAdv)
router.post('/getAppointmentReqsById/:id',appointments.getAppointmentReqsById)

module.exports=router