const express = require('express')
const app = express()
const port = 3000
var path    = require("path");
var bodyParser = require('body-parser');
var session = require('express-session');
var sass = require('node-sass-middleware');
// Get a reference to the database service
//var products = [{Name:"Book", Price:24.99 , Description:"This is a Harry Potter Book", Img:"/image/harrypotter.jpg"},
//{Name:"Cloth", Price:14.99 , Description:"This is Winterwear", Img:"https://www.burton.com/static/product/W18/13211103960_1.png?impolicy=bglt&imwidth=246"},
//{Name:"SmartPhone", Price:649.99 , Description:"This is an Iphone ", Img:"/image/iphone.jpg"},
//{Name:"HP Laptop", Price:749.99 , Description:"This is a HP laptop", Img:"/image/hp.png"}]
// var serviceAccount = require("/home/donipolo/dtn/website/DTN/dtnionadmin.json");
var sess;
const fs = require('fs')
// var products = [];
details_split = fs.readFileSync("item.json")//.split('\n')//.forEach(function(line){
// 	//var data = line.split('\t')
// 	//console.log(data)
// //})
var details = JSON.parse(details_split)
//var details = words.
console.log(details)

//console.log(details["product_no_1"])
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
app.use(session({secret: 'ssshhhhh'}));
app.use(
	sass({
			src: __dirname + '/static/scss', //where the sass files are 
			dest: __dirname + '/static/css', //where css should go
			debug: true // obvious
	})
);
app.set('view engine', 'pug')
var cart= [];
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname +'/signup.html'));
	});
app.get('/loginPage',function(req,res){
	res.sendFile(path.join(__dirname +'/loginPage.html'));
	});
app.get('/home',function(req,res){
	sess=req.session;
	console.log('check check miek check' + sess.email);
		// var myRef = admin.database().ref('Products');
	
		// var newData={
		// 		name : "dpg",
		// 		price : 12.34,
		// 		description: "fsdf",
		// 		imgurl : "fsdfa"

		//  }
	
		//  myRef.push(newData);
	if(sess.email == undefined){
		res.redirect('/');
		res.end();
	}
	else{
		var products = [];

	// console.log(product.lenght);
	for(const key in details){
	products.push(details[key])
	};
	console.log("This is my " + products);
  res.render('index',{products: products});
	};
	
  //__dirname : It will resolve to your project folder.
});

app.post('/signup',function(req,res){
	console.log(req.body)
	var fname = req.body.fname;
	var lname = req.body.lname;
	var email = req.body.email;
	var password1 = req.body.password1;
	var password2 = req.body.password2;
	var signup_data = fs.readFileSync('user.json');
	// console.log(signup_data);
	var signup = JSON.parse(signup_data);
	for(var i = 0 ; i < signup.length; i++){
		if (signup[i].email === email){res.send("This email is unavailable")};
	};
	var usr_list = {fname:fname,lname:lname, email:email, password1:password1 , password2:password2}
	signup.push(usr_list);
	console.log(signup);
	fs.writeFile('user.json',JSON.stringify(signup), function(err, signup){
		if (err) {
			console.log(err)
			res.status(404).end();
		};
    console.log("Successfully Written to File.");
	});
	sess= req.session;
	sess.email = email;
	res.redirect('/home');
//   })
//   .catch(function(error)
//   {
// 	console.log("Error creating new user:", error);

// 	});
 });

// handling post requests for login
app.post('/login',function(req,res){
	// console.log(req.body)
	sess = req.session;
//In this we are assigning email to sess.email variable.
//email comes from HTML page.
	var email = req.body.email;
	var password1 = req.body.password1;
	var password2 = req.body.password2;
	// // admin.auth().signInWithEmailAndPassword(email, password)
	const login_data = fs.readFileSync('user.json');
	const login = JSON.parse(login_data);
	console.log(login);
	for (var i =0 ; i < login.length ; i++){
		console.log(login[i].email);
		if (email == login[i].email && password1 == login[i].password1 && password2 == login[i].password2 ){
			sess.email=email;
			res.redirect('/home')
		};
	};

	// then(function(userRecord)
	// {
	//   console.log("Successfully created new user:", userRecord.user_id);
	//   res.redirect('/home');
	//   // res.status(201).end();
	// }).catch(function(error) {
	// 	// Handle Errors here.
	// 	var errorCode = error.code;
	// 	var errorMessage = error.message;
	// 	// [START_EXCLUDE]
	// 	if (errorCode === 'auth/wrong-password') {
	// 	  alert('Wrong password.');
	// 	} else {
	// 	  alert(errorMessage);
	// 	}
	// 	console.log(error);
	// 	res.redirect('/home'); // redirect to home page once login is done
	// 	// [END_EXCLUDE]
	  // });
});
// handling post requests for signup

app.post('/buy',function(req,res){
		console.log(req.body)
		sess = req.session;
		var email = sess.email;
		var seen = false;
		var itemName = req.body.item_name
		var price = parseFloat(req.body.price)
		var quantity = parseInt(req.body.quantity)
		var cart = [];
		const cart_data = fs.readFileSync('cart.json');
		const login = JSON.parse(cart_data);
		console.log(login);
		var k;
		var found = false;
		for (var k =0 ; k < login.length ; k++){
			console.log(login[k].email);
			if (email == login[k].email){
				cart = login[k].cart;
				found = true;
				break;
			};
		};
		for(var i = 0 ; i < cart.length; i++){
			if (cart[i].Name === itemName){
				cart[i].Quantity += quantity;
				cart[i].Subtotal = cart[i].Quantity * cart[i].Price;
				seen = true;
			};
		};

		console.log(itemName, price)
		if (!seen){
			if (!found) {
							login.push({'email': email , 'cart': [{'Name': itemName , 'Price':price ,'Quantity' : quantity, "Subtotal" : price*quantity, "Description" : req.body.description,"Img":req.body.Img }]})
							k = login.length -1;
			}
			else{
				login[k].cart.push({'Name': itemName , 'Price':price ,'Quantity' : quantity, "Subtotal" : price*quantity, "Description" : req.body.description,"Img":req.body.Img })
			// cart.push({'email': email , 'Name': itemName , 'Price':price ,'Quantity' : quantity, "Subtotal" : price*quantity, "Description" : req.body.description,"Img":req.body.Img })
				// cart = login[k];
		};
		};
		fs.writeFile('cart.json',JSON.stringify(login), function(err, cart){
			if (err) {
				console.log(err)
				res.status(404).end();
			};
			console.log("Successfully Written to File.");
		});
		// console.log(cart)
		var total = 0;
		for (i=0; i < login[k].cart.length;i++){
			total += login[k].cart[i].Subtotal
		};
		res.render('cart_index', {message: login[k].cart,total:total.toFixed(2)})
		
		
		//res.sendFile(path.join(__dirname +'/index_buy.html'))
       	//res.send('This product has been added to a list')
    

});
app.post('/remove', function(req,res){
		console.log(req.body)
		var email = req.session.email;
		var new_cart = [];
		var itemName = req.body.item_name;
		var price = parseFloat(req.body.price);
		var quantity = parseInt(req.body.quantity);
		const cart_data = fs.readFileSync('cart.json');
		const data = JSON.parse(cart_data);
		var total = 0;

		for(var i = 0 ; i < data.length; i++){
			if (data[i].email=== email){
				for(var j = 0; j < data[i].cart.length; j++){
						if(data[i].cart[j].Name!== itemName && data[i].cart[j].Quantity !== quantity){
							new_cart.push(data[i].cart[j]);
							total += data[i].cart[j].Subtotal
			
						};
				};
				data[i].cart = new_cart;
			}; 
		};
		fs.writeFile('cart.json',JSON.stringify(data), function(err, cart){
			if (err) {
				console.log(err)
				res.status(404).end();
			};
			console.log("Successfully Written to File.");
		});
		res.render('cart_index', {message: new_cart,total:total.toFixed(2)})


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