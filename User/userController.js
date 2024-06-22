const Users = require('./userSchema')
const url = require('../url')
const multer = require('multer')
const jwt = require('jsonwebtoken');
const advocateSchema = require('../Advocates/advocateSchema');
const juniors = require('../JuniorAdvocate/junioradvocateSchema');

const secret="user"


const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = 'prefix-'; // Add your desired prefix here
    const originalname = file.originalname;
    const extension = originalname.split('.').pop();
    const filename = uniquePrefix + originalname.substring(0, originalname.lastIndexOf('.')) + '-' + Date.now() + '.' + extension;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage }).single("profilePic");
//User Registration 

const registerUser = async (req, res) => {



  // let existingUser1= await Users({email:req.body.email});
  //   let existingUser2 = await advocateSchema({email:req.body.email});
  //   let existingUser3 = await juniors({email:req.body.email});

  //   if(existingUser1||existingUser2||existingUser3){
  //     console.log("here",existingUser1,"sc",existingUser2,"tid",existingUser3);
  //       return res.json ({
  //           status : 409,
  //           msg : "Email Already Registered With Us !!",
  //           data : null
  //       })
  //   }  
    // else{
      const newUser = new Users({
        name: req.body.name,
        contact: req.body.contact,
        password: req.body.password,
        email: req.body.email,
        gender: req.body.gender,
        nationality: req.body.nationality,
        address: req.body.address,
        dob: req.body.dob,
        profilePic: req.file
    
      })
    await newUser.save().then(data => {
      return res.json({
        status: 200,
        msg: "Inserted successfully",
        data: data
      })
    }).catch(err => {

      if (err.code == 11000) {
        return res.json({
          status: 409,
          msg: "Mail Id  already in Use",
          data: err
        })
      }
      return res.json({
        status: 500,
        msg: "Data not Inserted",
        data: err
      })
    })
  // }
  
  }

//User Registration -- finished

// View User by ID
const viewUserById = (req, res) => {
  Users.findById({ _id: req.params.id })
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

// Delete User by ID
const deleteUserById = (req, res) => {
  Users.findByIdAndDelete({ _id: req.params.id })
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

// Forgot Password for User
const forgotPassword = (req, res) => {
  Users.findOneAndUpdate({ email: req.body.email }, {
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

// Reset Password for User
const resetPassword = async (req, res) => {
  let pwdMatch = false;

  await Users.findById({ _id: req.params.id })
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
      await Users.findByIdAndUpdate({ _id: req.params.id }, {
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

const createToken = (User) => {
  return jwt.sign({ UserId: User._id }, secret, { expiresIn: '1h' });
};

const login = (req, res) => {
  const { email, password } = req.body;

  Users.findOne({ email }).then(User => {
   

    if (!User) {
      return res.json({status:405,msg: 'User not found' });
    }

      if (User.password!=password) {
        return res.json({ status:405,msg: 'Password Mismatch !!' });
      }
      if (User.password!=password) {
        return res.json({ status:405,msg: 'Password Mismatch !!' });
      }
    
      const token = createToken(User);

      res.json({
          status:200,
          data:User, 
          token });
   
  }).catch(err=>{
   console.log(err);
          return res.json({status:500,msg: 'Something went wrong' });
        
  })
};


//validate

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  console.log("t1",token);
  console.log("secret",secret);
  if (!token) {
    return res.json({status:401,msg: 'Unauthorized' });
  }
  jwt.verify(token, secret, (err, decodedToken) => {
    console.log(decodedToken);
    if (err) {
      return res.json({status:401, messagge: 'Unauthorized' ,err:err});
    }

    req.User = decodedToken.UserId;
    next();
    return res.json({ status:200,msg: 'ok' ,User:decodedToken.UserId});
  });
  console.log(req.User);
};

//Login Custome --finished


// Update User by ID
const editUserById =async (req, res) => {
  // let existingUser = await Users.findOne({ req.body.contact });
  // if (existingUser) {
  //     return res.json({
  //         status: 409,
  //         msg: "contact Number Already Registered With Us !!",
  //         data: null
  //     });
  // }
 await Users.findByIdAndUpdate({ _id: req.params.id }, {
  name: req.body.name,
    contact: req.body.contact,
    email: req.body.email,
    gender: req.body.gender,
    nationality: req.body.nationality,
    address: req.body.address,
    dob: req.body.dob,
    profilePic: req.file
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


// View all Users
const viewUsers = (req, res) => {
  Users.find()
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

module.exports = {
  registerUser,
  viewUserById,
  editUserById,
  login,
  forgotPassword,
  viewUsers,
  deleteUserById,
  resetPassword,
  upload,
  requireAuth
}