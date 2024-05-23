const router=require('express').Router()
const advocates=require('./Advocates/advocateController')


//advocate routes
router.post('/registerAdvocate',advocates.upload,advocates.registerAdvocate)
router.post('/viewAdvocateById/:id',advocates.viewAdvocateById)
router.post('/forgotPassword',advocates.forgotPassword)
router.post('/loginAdvocate',advocates.login)
router.post('/editAdvocateById/:id',advocates.upload,advocates.editAdvocateById)
router.post('/deleteAdvocateById/:id',advocates.deleteAdvocateById)
router.post('/resetPassword/:id',advocates.resetPassword)
router.post('/approveAdvocateById/:id',advocates.approveAdvocateById)
router.post('/rejectAdvocateById/:id',advocates.rejectAdvocateById)
router.post('/requireAuth',advocates.requireAuth)
router.post('/viewAdvocateReqs',advocates.viewAdvocateReqs)
router.post('/viewAdvocates',advocates.viewAdvocates)

module.exports=router