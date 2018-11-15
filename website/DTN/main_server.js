const express = require('express')
const app = express()
const port = 3000
var path    = require("path");
const fs = require('fs');
app.use(express.static('static'))

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

//app.get('/', (req, res) => res.send('Hello World!'))
// send the rendered view to the client
app.get('/buy',function(req,res){
		var itemName = req.query["item"]
		var price = req.query["price"]
		console.log(itemName, price)
		fs.appendFileSync('cart.txt', itemName + " " + price + "\n");
       	res.send('This product has been added to a list')
    

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