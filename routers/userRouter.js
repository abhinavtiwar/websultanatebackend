const express = require("express");
const router = express.Router();
const Model = require("../models/userModel");
const bcrypt = require("bcrypt");
const multer = require('multer');
const upload = multer().none();
const salt = bcrypt.genSaltSync(12);
     
router.post("/add" , upload, (req, res) => {
  const formdata = req.body;   
  const hash = bcrypt.hashSync(formdata.password, salt);
  formdata.password = hash;  
  console.log(req.body); //used to get the data in post
  // res.send("request processed in user router");

  //create operation of crud
  new Model(formdata)
    .save()
    .then((result) => {
      //shortcut used is thenc
      console.log("data sucessfully saved in user router");
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.json(err);
    });
});

//this is used for feched all user data
router.get("/getall", (req, res) => {
  Model.find({})
    .then((result) => {
      console.log("User data fetched");
      res.json(result);
    })
    .catch((err) => {
      console.error("error");
      res.json(err);
    });
});



router.get("/getbyid/:id", (req, res) => {
  Model.findById(req.params.id)
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.json(err);
    });
});

// for login page
router.post("/authenticate", (req, res) => {
  const formdata = req.body;
  //findone is used to find first entry
  Model.findOne({ email: formdata.email })
    .then((result) => {
      // logic for validating user credentials
      // if email and password matches then result will contain their data
      if (result) {
        if (bcrypt.compareSync(formdata.password, result.password))
          res.json(result);
        else {
          res.status(300).json({ status: "Login Failed" });
        }
      } else {
        // if result is null
        res.status(300).json({ status: "Login Failed" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(300).json(err);
    });
});

router.put("/update/:id", (req, res) => {
  const formdata = req.body;
  //to find the entry by id and update with formdata
  Model.findByIdAndUpdate(req.params.id, formdata, {new : true})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error("error");
      res.json(err);
    });
});

router.get('/getall',(req,res) =>{
    
  Model.find({})
  .then((result) => {//
      res.json(result);
  }).catch((err) => {
      console.error(err);
      res.json(err);
  });
}); 

// to find the entry by id and update with formdat
module.exports = router;
