const Advocate = require('./advocateSchema');
const jwt = require('jsonwebtoken');
const secret = 'advocate'; 

const multer = require("multer");


const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = 'prefix-'; 
    const originalname = file.originalname;
    const extension = originalname.split('.').pop();
    const filename = uniquePrefix + originalname.substring(0, originalname.lastIndexOf('.')) + '-' + Date.now() + '.' + extension;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage }).array("files", 2);

const uploadProfile = multer({ storage: storage }).single('profilePic');

// Register Advocate
const registerAdvocate = async (req, res) => {
    try {
        const { name, bcNo, bcState, contact, email, password, gender, address, experience, nationality, qualification, dob, professionalExperience, dateOfEnrollment, specialization } = req.body;

        const newAdvocate = new Advocate({
            name,
            bcNo,
            bcState,
            contact,
            email,
            password,
            gender,
            address,
            experience,
            nationality,
            qualification,
            dob,
            professionalExperience,
            dateOfEnrollment,
            specialization,
            idProof:req.files[1],
            profilePic:req.files[0]
        });

        let existingAdvocate = await Advocate.findOne({ bcNo });
        let existingAdvocate2 = await Advocate.findOne({ contact });
        if (existingAdvocate) {
            return res.json({
                status: 409,
                msg: "BarCouncil Enrollment Number Already Registered With Us !!",
                data: null
            });
        }
        else if(existingAdvocate2) {
            return res.json({
                status: 409,
                msg: "Contact Number Already Registered With Us !!",
                data: null
            });
        }
        await newAdvocate.save()
            .then(data => {
                return res.json({
                    status: 200,
                    msg: "Inserted successfully",
                    data: data
                });
            })
            .catch(err => {
                if (err.code === 11000) {
                    return res.json({
                        status: 409,
                        msg: "Email already in use",
                        data: err
                    });
                }
                return res.json({
                    status: 500,
                    msg: "Data not Inserted",
                    data: err
                });
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View all advocates
const viewAdvocates = (req, res) => {
    Advocate.find({adminApproved:true})
        .exec()
        .then(data => {
            if (data.length > 0) {
                res.json({
                    status: 200,
                    msg: "Data obtained successfully",
                    data: data
                });
            } else {
                res.json({
                    status: 200,
                    msg: "No Data obtained"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not obtained",
                Error: err
            });
        });
};

// View all advocate Reqs
const viewAdvocateReqs = (req, res) => {
    Advocate.find({adminApproved:false})
        .exec()
        .then(data => {
            if (data.length > 0) {
                res.json({
                    status: 200,
                    msg: "Data obtained successfully",
                    data: data
                });
            } else {
                res.json({
                    status: 200,
                    msg: "No Data obtained"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not obtained",
                Error: err
            });
        });
};


// approve Advocate
const approveAdvocateById = (req, res) => {
    Advocate.findByIdAndUpdate({_id:req.params.id},{adminApproved:true})
        .exec()
        .then(data => {
            if (data.length > 0) {
                res.json({
                    status: 200,
                    msg: "Data obtained successfully",
                    data: data
                });
            } else {
                res.json({
                    status: 200,
                    msg: "No Data obtained"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not obtained",
                Error: err
            });
        });
};


// approve Advocate
const activateAdvocateById = (req, res) => {
    Advocate.findByIdAndUpdate({_id:req.params.id},{isActive:true})
        .exec()
        .then(data => {
            if (data.length > 0) {
                res.json({
                    status: 200,
                    msg: "Data obtained successfully",
                    data: data
                });
            } else {
                res.json({
                    status: 200,
                    msg: "No Data obtained"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not obtained",
                Error: err
            });
        });
};


// approve Advocate
const deactivateAdvocateById = (req, res) => {
    Advocate.findByIdAndUpdate({_id:req.params.id},{isActive:false})
        .exec()
        .then(data => {
            if (data.length > 0) {
                res.json({
                    status: 200,
                    msg: "Data obtained successfully",
                    data: data
                });
            } else {
                res.json({
                    status: 200,
                    msg: "No Data obtained"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not obtained",
                Error: err
            });
        });
};


// reject Advocate
const rejectAdvocateById = (req, res) => {
    Advocate.findByIdAndDelete({_id:req.params.id})
        .exec()
        .then(data => {
            if (data.length > 0) {
                res.json({
                    status: 200,
                    msg: "Data Removed successfully",
                    data: data
                });
            } else {
                res.json({
                    status: 200,
                    msg: "No Data obtained"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not obtained",
                Error: err
            });
        });
};

// Update advocate by ID
const editAdvocateById = async (req, res) => {
    const { name, bcNo, bcState, contact, email, password, gender, address, experience, nationality, qualification, dob, professionalExperience, dateOfEnrollment, specialization } = req.body;
console.log("profilePic",req.body.filename);
    Advocate.findByIdAndUpdate({ _id: req.params.id }, {
        name,
        bcNo,
        bcState,
        contact,
        email,
        password,
        gender,
        address,
        experience,
        nationality,
        qualification,
        dob,
        professionalExperience,
        dateOfEnrollment,
        specialization,
        profilePic:req.file
    })
        .exec()
        .then(data => {
            res.json({
                status: 200,
                msg: "Updated successfully"
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not Updated",
                Error: err
            });
        });
};

// View advocate by ID
const viewAdvocateById = (req, res) => {
    Advocate.findById({ _id: req.params.id })
        .exec()
        .then(data => {
            res.json({
                status: 200,
                msg: "Data obtained successfully",
                data: data
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "No Data obtained",
                Error: err
            });
        });
};

// Delete advocate by ID
const deleteAdvocateById = (req, res) => {
    Advocate.findByIdAndUpdate({ _id: req.params.id },{isActive:'inactive'})
        .exec()
        .then(data => {
            res.json({
                status: 200,
                msg: "Data removed successfully",
                data: data
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "No Data obtained",
                Error: err
            });
        });
};

// Forgot Password for advocate
const forgotPassword = (req, res) => {
    Advocate.findOneAndUpdate({ email: req.body.email }, {
        password: req.body.password
    })
        .exec()
        .then(data => {
            if (data != null)
                res.json({
                    status: 200,
                    msg: "Updated successfully"
                });
            else
                res.json({
                    status: 500,
                    msg: "User Not Found"
                });
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not Updated",
                Error: err
            });
        });
};

// Reset Password for advocate
const resetPassword = async (req, res) => {
    let pwdMatch = false;

    await Advocate.findById({ _id: req.params.id })
        .exec()
        .then(data => {
            if (data.password === req.body.oldpassword)
                pwdMatch = true;
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not Updated",
                Error: err
            });
        });

    if (pwdMatch) {
        await Advocate.findByIdAndUpdate({ _id: req.params.id }, {
            password: req.body.newpassword
        })
            .exec()
            .then(data => {
                if (data != null)
                    res.json({
                        status: 200,
                        msg: "Updated successfully"
                    });
                else
                    res.json({
                        status: 500,
                        msg: "User Not Found"
                    });
            })
            .catch(err => {
                res.status(500).json({
                    status: 500,
                    msg: "Data not Updated",
                    Error: err
                });
            });
    } else {
        res.json({
            status: 405,
            msg: "Your Old Password doesn't match"
        });
    }
};

const createToken = (user) => {
    return jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
};

//advocate login
const login = (req, res) => {
    const { email, password } = req.body;

    Advocate.findOne({ email }).then(user => {

        if (!user) {
            return res.json({ status: 405, msg: 'User not found' });
        }

        if (user.password != password) {
            return res.json({ status: 405, msg: 'Password Mismatch !!' });
        }
        if (user.adminApproved==false) {
            return res.json({ status: 405, msg: 'Please get Approval From Admin!!' });
        }
        const token = createToken(user);

        res.json({
            status: 200,
            data: user,
            token
        });

    }).catch(err => {
        console.log(err);
        return res.json({ status: 500, msg: 'Something went wrong' });
    })
};

// Validate
const requireAuth = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.json({ status: 401, msg: 'Unauthorized' });
    }
    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
            return res.json({ status: 401, msg: 'Unauthorized', err: err });
        }

        req.user = decodedToken.userId;
        next();
    });
};

module.exports = {
    registerAdvocate,
    viewAdvocates,
    editAdvocateById,
    viewAdvocateById,
    deleteAdvocateById,
    forgotPassword,
    resetPassword,
    login,
    requireAuth,
    upload,
    viewAdvocateReqs,
    approveAdvocateById,
    rejectAdvocateById,
    activateAdvocateById,
    deactivateAdvocateById,
    uploadProfile
};
