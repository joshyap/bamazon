var mysql = require('mysql');
var inquirer = require('inquirer');

var productsArray = [];

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "Bamazon"
})

connection.connect(function(err){
  console.log("Connected as id: " + connection.threadId);
  if (err) throw err;
})

connection.query("select * from products", function (err, response) {
    productsArray = response;
    for (var i = 0; i < response.length; i++) {
        console.log(response[i].item_id + " | " + response[i].product_name + " | " + response[i].department_name + " | " + response[i].price + " | " + response[i].stock_quantity)
    };
    console.log("--------------");
    // console.log(response);
    startFunction();
});


var startFunction = function () {
    // console.log(productsArray);
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to buy?",
            choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            // choices: ['id 1: cell phone','id 2: felt road bike','id 3: raspberry pi','id 4: acoustic guitar','id 5: laptop','id 6: backpack','id 7: drawing journal','id 8: water bottle','id 9: wristwatch','id 10: basketball'],
            name: "choice"
        },
        {
            type: "input",
            message: "How Many units would you like to buy?",
            name: "howMany"
        }
    ]).then(function (user) {
        updateStock(user);
    });
};


var updateStock = function(user) {
    var selection;
    for (var i = 0; i < productsArray.length; i++) {
        if (user.choice == productsArray[i].item_id) {
            selection = productsArray[i];
        }
    }
    if (user.howMany <= selection.stock_quantity) {
        var newQuantity = (selection.stock_quantity - user.howMany);
            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newQuantity
            }, {
                item_id: user.choice
            }], function (err, res) {
                console.log("Successfully ordered " + user.howMany + " " + selection.product_name)
                connection.end();
            });

        } else {
            console.log("Insufficient stock. Try a lower order quantity or check back later.");
            connection.end();
        }
};
