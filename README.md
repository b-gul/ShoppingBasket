# ShoppingBasket


A simple Vanilla JS(ES-5) shopping basket controller for your frontend.
You can easily hook up with your backend iterations.

Live DEMO(Warning: DEMO code has differences to work properly on JSFiddle): https://jsfiddle.net/bgul/16w92q0m/

# Features
* It is lighweight, solid, modular and scalable(you can add your own facades into **BasketServiceController** for your suitable needs).
* Simple XSS protection provided by textContent().
* Axios support.
* Limits stock increment, and applies the logic => (max stock - requested quantity).
* Changes customer balance and debit.
* Prevents buying requests when customer balance is 0 or in case customer balance is not enough for required amount.


Add axios in your \<head>
```
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```


Import the file BEFORE CLOSING \<body> tag:
```
<script src="./cart.js"></script>
```

At the end of **cart.js** file there is an configuration array that you can configure your service beforehand.

```
var config = {
  /**
   * Controller path for backend
   * Request method: GET
   * Warning: This property is going to concatenated with two parameters.
   * Parameters: ?id=<id>&qty=<qty>
   */
  backendUrl: '', 
 
  /**
   * Specified div id prefix 
   */
  productElemIdPrefix: 'product',
 
  /**
   * Specified div ids for account balance informations
   */
  customerDebit: document.getElementById('customer-debit'),
  customerBalance: document.getElementById('customer-balance'),
 
  /**
   * Specified div ids for shopping basket information
   */
  basketRecordCount: document.getElementById('basket-count'),
  mobileBasketRecordCount: document.getElementById('mobile-basket-count'),
  basketTotalPrice: document.getElementById('basket-total'),
 
  /**
   * Customizable currency sign 
   */
  currency: ''
};
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


HTML USAGE SAMPLE
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
