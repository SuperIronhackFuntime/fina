const express = require('express');
const router  = express.Router();
const Service = require('../models/service');
const User = require('../models/user');
const upload = require('../configs/multer');

/* GET home page */
router.get('/services', (req, res, next) => {
  Service.find()
  .then((list) => {
    res.json(list);
  })
  .catch((err) => {
    res.json(err)
  })
});

//add a NEW service
router.post('/services/create', (req, res, next)=>{
  console.log(req.body);
    const newService = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      // img: `/uploads/${req.file.filename}`
    }
  // Service.create(req.body) would work too
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> dfcc033cba09334d52b6d380d2086f3f62e012b9
  Service.create(newService)
  .then((serviceJustCreated)=>{
    res.json(serviceJustCreated)
  })
  .catch((err)=>{
    res.json(err)
  })

});

<<<<<<< HEAD
router.get('/services/:id', (req, res, next) => {
=======
    Service.create(newService)
    .then((serviceJustCreated)=>{
      res.json(serviceJustCreated)
    })
    .catch((err)=>{
      res.json(err)
    })
  });

  router.get('/services/:id', (req, res, next) => {
>>>>>>> 4622ebdfd186bf8f34c3b46c2ffd2decda05d4c2
=======
// router.get('/services/:id', (req, res, next) => {
//     Service.create(newService)
//     .then((serviceJustCreated)=>{
//       res.json(serviceJustCreated)
//     })
//     .catch((err)=>{
//       res.json(err)
//     })
//   });

  router.get('/services/:id', (req, res, next) => {
>>>>>>> dfcc033cba09334d52b6d380d2086f3f62e012b9
  if (req.isAuthenticated()) {
    User.findById(req.user, function(err, fulluser){
    res.json(fulluser);
  })
  }
  if (err) throw err;
})

router.put('/cart/:id/add', (req, res, next) => {
  console.log('user service on put to cart +===========', req.user);
  req.user.cart.unshift(req.params.id);
  req.user.save()
  .then(() => {
    console.log('req user info after the then of the put to cart >>>>>><<<<<<<<<<<', req. user);
    res.json(req.user)
  })
  .catch((err) => { 
    res.json(err)
  })
})



router.get('/userCart', (req, res, next) => {
  Service.find({_id: req.user.cart})
  .exec()
  .then((serviceResults) => {
    res.json(serviceResults)
  })
  .catch((err) => {
    res.json(err)
  })
})


router.post('/services/delete/:id', (req, res, next)=>{
      Service.findByIdAndRemove(req.params.id)
      .then((serviceJustDeleted)=>{
        res.json(serviceJustDeleted)
      })
      .catch((err)=>{
        res.json(err)
      })
    })

router.post('/services/update/:id', (req, res, next)=>{
      Service.findByIdAndUpdate(req.params.id, req.body)
      .then((updatedService)=>{
        res.json(updatedService)
      })
      .catch((err)=>{
        res.json(err)
      })
    })

module.exports = router;