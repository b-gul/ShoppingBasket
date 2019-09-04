# ShoppingCart


A simple shopping basket stock request controller for your frontend.
You can easily hook up with your backend iterations.

LIVE: https://jsfiddle.net/bgul/16w92q0m/

# Features
* Limits stock increment, decreases from max stock when you buy
* Customer balance and debit 
* Stops buying process when balance is 0
* Total price of basket
* Customizable price unit

Add axios in your \<head>
```
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```


Import the file BEFORE CLOSING \<body> tag:
```
<script src="./cart.js"></script>
```


You can implement anywhere you want:

```
BasketController.increment({
  id: id-value-comes-from-backend-iteration, 
  stock: stock-value-comes-from-backend-iteration
})

BasketController.decrement(id-value-comes-from-backend-iteration) 

BasketController.productRequestTransaction({
  id: id-value-comes-from-backend-iteration, 
  price: price-value-comes-from-backend-iteration, 
  stock: stock-value-comes-from-backend-iteration,
})
```

DO NOT FORGET TO UNCOMMENT THIS BLOCK WHEN YOUR BACKEND IS READY
```
.
.
.
addProductRequestToBasket(id) {
    
 // UNCOMMENT BELOW LINES WHEN YOUR BACKEND IS READY

 /* var totalRequested = this.getRequestedStockCountForProduct(id);

  axios.get(this.backendUrl + '?id=' + id  + '&qty=' + totalRequested).then(function(res) {
    UIkit.notification({
      message: res.data,
      pos: 'top-center',
      timeout: 1000
    });

    this.backendActionCompleted = true;
  }).then(function(error) {
    this.backendActionCompleted = false;
    this.backendWarningMessage = error;

    setTimeout(window.location.reload(), 1000);
  }); */

  this.backendActionCompleted = true; // UNCOMMENT THIS LINE IF YOU'RE USING THE ABOVE CODE
  return this.backendActionCompleted;
},
.
.
.
```

AND ALSO THIS BLOCK

```
.
.
.
createBasketRecordForProduct(id) {

 /* USE SNIPPET GIVEN BELOW IN PRODUCTION MODE */

 /*if (window.localStorage.getItem('b' + id) == null
    && parseFloat(this.customerBalance.textContent) !== 0) {
    window.localStorage.setItem('b' + id, id);
    this.basketRecordCount.textContent = parseInt(this.basketRecordCount.textContent) + 1;
    this.mobileBasketRecordCount.textContent = parseInt(this.mobileBasketRecordCount.textContent) + 1;
  }
  */

 if (this.basketRecords.indexOf(id) === -1 
    || parseFloat(this.customerBalance.textContent) !== 0) {
    this.basketRecords.push(id);
    this.basketRecordCount.textContent = parseInt(this.basketRecordCount.textContent) + 1;
  }

  return this;

},
.
.
.
```

HTML SAMPLE
```


<div id="product-1">
  <strong>Example Product 1</strong><br>
  Price: <span>50(currencyGoesHere)</span><br>
  <span class="stock">0</span> / <span class="max-stock">10</span>
  
  <div class="stock-request-controller">
    <button onclick="BasketController.increment({id: 1, stock: 10})">+</button>
    <button onclick="BasketController.decrement(1)">-</button>
    <button onclick="BasketController.productRequestTransaction({id: 1, price: 50, stock: 10})">add</button>
  </div>
</div>

<hr>

<div id="product-2">
  <strong>Example Product 2</strong><br>
  Price: <span>50(currencyGoesHere)</span><br>
  <span class="stock">0</span> / <span class="max-stock">10</span>
  <div class="stock-request-controller">
    <button onclick="BasketController.increment({id: 2, stock: 10})">+</button>
    <button onclick="BasketController.decrement(2)">-</button>
    <button onclick="BasketController.productRequestTransaction({id: 2, price: 50, stock: 10})">add</button>
  </div>

</div>

<hr>

<div id="product-3">
  <strong>Example Product 3</strong><br>
  Price: <span>50.50(currencyGoesHere)</span><br>
  <span class="stock">0</span> / <span class="max-stock">12</span>
  <div class="stock-request-controller">
    <button class="increase" onclick="BasketController.increment({id:3, stock:12})">+</button>
    <button onclick="BasketController.decrement(3)">-</button>
    <button onclick="BasketController.productRequestTransaction({id:3, price:50.50, stock: 12})">add</button>
  </div>
</div>


<hr> 

<h3>Account Informations</h3>
Customer Debit: <span id="customer-debit">0.00(currencyGoesHere)</span><br>
Customer Balance: <span id="customer-balance">500.00(currencyGoesHere)</span>

<hr />
Your Basket(<span id="basket-count">0</span>)<br />
Total: <span id="basket-total">0.00(currencyGoesHere)</span>
```
