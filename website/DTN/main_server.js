const express = require('express')
const app = express()
const port = 3000
var path    = require("path");
var bodyParser = require('body-parser');

var async = require("async");
// Get a reference to the database service
//var products = [{Name:"Book", Price:24.99 , Description:"This is a Harry Potter Book", Img:"/image/harrypotter.jpg"},
//{Name:"Cloth", Price:14.99 , Description:"This is Winterwear", Img:"https://www.burton.com/static/product/W18/13211103960_1.png?impolicy=bglt&imwidth=246"},
//{Name:"SmartPhone", Price:649.99 , Description:"This is an Iphone ", Img:"/image/iphone.jpg"},
//{Name:"HP Laptop", Price:749.99 , Description:"This is a HP laptop", Img:"/image/hp.png"}]
var admin = require("firebase");
var database = admin.database;
// var serviceAccount = require("/home/donipolo/dtn/website/DTN/dtnionadmin.json");
var config = {
    apiKey: "AIzaSyClUivJKciQU4IDYOwHZ4L3lszmEoafVDA",
    authDomain: "dtnion.firebaseapp.com",
    databaseURL: "https://dtnion.firebaseio.com",
    projectId: "dtnion",
    storageBucket: "dtnion.appspot.com",
    messagingSenderId: "829471931069"
  };

  admin.initializeApp(config);

  module.exports = {
    isAuthenticated: function (req, res, next) {
      var user = admin.auth().currentUser;
      if (user !== null) {
        req.user = user;
        next();
      } else {
        res.redirect('/login');
      }
    },
  }
const fs = require('fs')
// var products = [];
details_split = fs.readFileSync("item.json")//.split('\n')//.forEach(function(line){
// 	//var data = line.split('\t')
// 	//console.log(data)
// //})
var words = JSON.parse(details_split)
//var details = words.
console.log(words)

//console.log(words["product_no_1"])
// function writeUserData(product, price,description, imgUrl) {
//   admin.database().ref('' + userId).set({
//     username: name,
//     email: email,
//     profile_picture : imageUrl
//   });
//}
app.use(express.static('static'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'pug')
var cart= [];
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname +'/signup.html'));
  });
app.get('/home',function(req,res){
	
		// var myRef = admin.database().ref('Products');
	
		// var newData={
		// 		name : "dpg",
		// 		price : 12.34,
		// 		description: "fsdf",
		// 		imgurl : "fsdfa"

		//  }
	
		//  myRef.push(newData);

	var products = [];
	// var prod = admin.database();
	// var ref = prod.ref("Products");
	// ref.off();
	// //var promise = admin.firestore().doc("DTNion/Products").get();
	// ref.once('value').then(function(snapshot) {
	// 	console.log(snapshot.val());
	// 	products.push(snapshot.val());
	// 	//console.log(snapshot.val());
	// 	snapshot.forEach(function(childSnapshot) {
	// 		//var childKey = childSnapshot.key;
	// 		var childData = childSnapshot.val();
	// 		products.push(childData);
	// 		console.log(products);
	// 		// ...
	// 	});
	// });
	
	// console.log(product.lenght);
	for(const key in words){
		products.push(words[key])
	};
	console.log("This is my " + products);
  res.render('index',{products: products});
  //__dirname : It will resolve to your project folder.
});

// handling post requests for login
app.post('/login',function(req,res){
	console.log(req.body)
	var email = req.body.email;
	debugger;
    var password = req.body.password;
	admin.auth().signInWithEmailAndPassword(email, password).then(function(userRecord)
	{
	  console.log("Successfully created new user:", userRecord.uid);
	  res.redirect('/home');
	  // res.status(201).end();
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// [START_EXCLUDE]
		if (errorCode === 'auth/wrong-password') {
		  alert('Wrong password.');
		} else {
		  alert(errorMessage);
		}
		console.log(error);
		res.redirect('/home'); // redirect to home page once login is done
		// [END_EXCLUDE]
	  });
});
// handling post requests for signup
app.post('/signup',function(req,res){
	console.log(req.body)
	var email = req.body.email;
  var password = req.body.password;

  admin.auth().createUserWithEmailAndPassword(email,password)
  .then(function(userRecord)
  {
	console.log("Successfully created new user:", userRecord.uid);
	res.redirect('/home');
    // res.status(201).end();
  })
  .catch(function(error)
  {
	console.log("Error creating new user:", error);

	});
});

app.post('/buy',function(req,res){
		console.log(req.body)
		var itemName = req.body.item_name
		var price = parseFloat(req.body.price)
		var quantity = parseInt(req.body.quantity)
		console.log(itemName, price)
		cart.push({'Name': itemName , 'Price':price ,'Quantity' : quantity, "Subtotal" : price*quantity, "Description" : req.body.description,"Img":req.body.Img })
		console.log(cart)
		var total = 0;
		for (i=0; i < cart.length;i++){
			total += cart[i].Subtotal
		};
		res.render('cart_index', {message: cart,total:total.toFixed(2)})
		//res.sendFile(path.join(__dirname +'/index_buy.html'))
       	//res.send('This product has been added to a list')
    

});

app.get('/route',function(req,res){
	var str = '';
	fs.readFileSync('cart.txt').toString().split('\n').forEach(function(line){
		res.write(line +'\n')})
		res.end()

		//str= str.concat(newline)})
	//res.send(fs.readFileSync('cart.txt').toString())
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))