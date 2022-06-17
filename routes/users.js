const { Router } = require('express');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* GET Userlist page. */
router.get('/userlist', function (req, res) {
  const db = req.db;
  const collection = db.get('users');
  collection.find({}, {}, function (err, docs) {
    res.render('userlist', {
      'userlist': docs
    });
    // res.json(docs);
  });
});

/* GET user by id */
router.get("/:id", function(req, res){
  const db = req.db;

  const userToFind = req.params.id;

  const collection = db.get("users");
  collection.findOne({"_id": userToFind},{},function(e,docs){
    res.json(docs);
  });
});

/* Ajouter et modifier un utilisateur */
router.post('/adduser', function(req, res, next){
  // On déclare notre variable de la base de données
  const db = req.db;

  //On déclare les inputs du formulaire
  const userName = req.body.username;
  const userEmail = req.body.useremail;
  const userFullName = req.body.userfullname;
  const userAge = req.body.userage;
  const userLocation = req.body.userlocation;
  const userGender = req.body.usergender;
  const actionType = req.body.actiontype;
  const updateId = req.body.updateid;

  // Mise en place de notre collection (Table)
  const collection = db.get('users');

  switch (actionType) {
    case "edit":
      collection.update({'_id' : updateId},
        {$set:{
        "username" : userName,
        "email" : userEmail,
        "fullname" : userFullName,
        "age" : userAge,
        "location" : userLocation,
        "gender" : userGender
      }},function(err){
        if (err) {
          res.send("There was a problem adding the information to the database")
        }
        else{
          res.redirect("/users/userlist");
          next();
        }
      })
      break;
    
      default:
        collection.insert({
        "username" : userName, 
        "email" : userEmail,
        "fullname" : userFullName,
        "age" : userAge,
        "location" : userLocation,
        "gender" : userGender
        }, function(err, doc){
        if (err) {
          // Si il y a une erreur , on retourne une erreur
          res.send("There was a problem adding the information to the database")
        }
        else{
          //Si il n'y a aucune erreur, on se redirige sur la page 
          res.redirect("/users/userlist");
          next();
        }
      });
    break;
  }
});

router.get('/deleteuser/:id', function(req,res,next){
  
  const db = req.db;

  const collection = db.get("users");

  console.log(req.params);
  const userToDelete = req.params.id;

  collection.remove({"_id" : userToDelete},function(err){
    if (err) {
      // Si il y a une erreur , on retourne une erreur
      res.send("There was a problem adding the information to the database")
    } else {
      //Si il n'y a aucune erreur, on se redirige sur la page 
      res.redirect("/users/userlist");
      next();
    }
  })
})


module.exports = router;
