const express = require('express')
const app = express()
const port = 3000
var path    = require("path");
var bodyParser = require('body-parser');
var products = [{Name:"Book", Price:24.99 , Description:"This is a Harry Potter Book", Img:"/image/harrypotter.jpg"},
{Name:"Cloth", Price:14.99 , Description:"This is Winterwear", Img:"https://www.burton.com/static/product/W18/13211103960_1.png?impolicy=bglt&imwidth=246"},
{Name:"SmartPhone", Price:649.99 , Description:"This is an Iphone ", Img:"/image/iphone.jpg"},
{Name:"HP Laptop", Price:749.99 , Description:"This is a HP laptop", Img:"/image/hp.png"}]
const fs = require('fs');
app.use(express.static('static'))
app.use(bodyParser())
app.set('view engine', 'pug')
var cart= [];
app.get('/',function(req,res){
  res.render('index',{products: products});
  //__dirname : It will resolve to your project folder.
});

//app.get('/', (req, res) => res.send('Hello World!'))
// send the rendered view to the client
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