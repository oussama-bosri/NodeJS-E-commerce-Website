var express = require('express');
var ejs = require('ejs');
var bodyParse = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
const { UCS2_GENERAL_MYSQL500_CI } = require('mysql/lib/protocol/constants/charsets');
var app = express();
mysql.createConnection({

    host:"localhost",
    user:"root",
    password:"",
    database:"NodeJS-E-commerce-Website"
})


app.use(express.static('public'));
app.set('view engine','ejs');

app.listen(8081);
app.use(bodyParse.urlencoded({extended:true}));
app.use(session({secret:"secret"}));

// Function check if product in cart
function isProductInCart(cart,id) {
 for(let i=0; i<cart.length; i++ ){
    if(cart[i].id == id){
        return true;
    }
    return false ;

 }
}
function calculateTotal(cart,req){
    total = 0;
    for(let i=0; i<cart.legth; i++){
        // if we're offring a dicounting price
        if(cart[i].sale_price){
            total = total + (cart[i].sale_price*cart[i]*quantity);
        }else{
            total = total + (cart[i].pric*cart[i].quantity)
        }
    }
    req.session.total = total;
    return total;
}
//localhost:8080
app.get('/',function(req,res){

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"NodeJS-E-commerce-Website"
})
con.query("SELECT * FROM products",(err,result)=>{
    res.render('pages/index',{result:result});
})


});

//add product to cart
app.post('/add_to_cart',function(req,res){

var id =req.body.id;
var name = req.body.name;
var price =req.body.price;
var sale_price =req.body.sale_price;
var quantity =req.body.quantity;
var image =req.body.image;
var product = {id:id,name:name,price:price,sale_price:sale_price,quantity:quantity,image:image}

if(req,session.cart){
    var cart = req.session.cart; 
    if(!isProductInCart(cart,id)){
        cart.push(product);
    } 
}else{

    req.session.cart = [product]
    var cart = req.session.cart;
}

// calculate total 
calculateTotal(cart,req);

//return to cart page
res.redirect('/cart');
});

app.get('/cart',function(req,res){


});