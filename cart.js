
/**
 * A simple B2C E-commerce Shopping Cart Stock Request Controller based on Protype Pattern
 * Author: @bgul <berke.gul@println.work>
 */

function ShoppingBasketService() {	 
  this.backendUrl = ''; // Controller path for backend
 
  this.requestedStockQtyForProduct = {};
  this.remainingMaxRequestForProductStockQty = {};
    
  this.customerDebit = document.getElementById('customer-debit');
  this.customerBalance = document.getElementById('customer-balance');
    
  this.basketRecordCount = document.getElementById('basket-count');
  this.mobileBasketRecordCount = document.getElementById('mobile-basket-count');
  this.basketTotalPrice = document.getElementById('basket-total');

  this.currency = '(currencyGoesHere)';
}


ShoppingBasketService.prototype = {

  /**
   * Constructor function
   */
  constructor: ShoppingBasketService,
  
  /**
   * @param {Integer} id Holds div id data
   * @returns {HTMLDivElement} 
   */
  stockCountOfProduct (id) {
    return document.getElementById('product-' + id).getElementsByClassName('stock')[0];
  },
  
  /**
   * @param {Integer} id Holds div id data
   * @returns {HTMLDivElement}
   */
  remainedMaxStockCountOfProduct (id) {
    return document.getElementById('product-' + id).getElementsByClassName('max-stock')[0];
  },
  
  /**
   * @param {Object} data Holds product id and maximum range for increasing button
   * @returns {Object} ShoppingCartService
   */
  increaseStockRequestQtyForProductUntilMaxStock (data) {
    var stockCount = this.stockCountOfProduct(data.id);
    var maxStockCount =  this.remainedMaxStockCountOfProduct(data.id);

    if (! this.remainingMaxRequestForProductStockQty.hasOwnProperty(data.id)) {
      this.remainingMaxRequestForProductStockQty[data.id] = data.stock;
    }

    if (stockCount.textContent < this.remainingMaxRequestForProductStockQty[data.id] 
      && maxStockCount !== 0) {
      stockCount.textContent = parseInt(stockCount.textContent) + 1;
    } 

    return this;
  },
  
  /**
   * @param {Integer} id Holds div id data
   * @returns {Object} ShoppingCartService
   */
  decreaseStockRequestQtyForProduct (id) {
    var stockCount = this.stockCountOfProduct(id);

    if (stockCount.textContent > 0) {
      stockCount.textContent = parseInt(stockCount.textContent) - 1;
    } 
    
    return this;
  },
  
  /**
   * @param {Integer} id Holds id data
   * @returns {Object} ShoppingCartService
   */
  setRequestedStockCountForProduct (id) {
    var stockCount = this.stockCountOfProduct(id);

    if (! this.requestedStockQtyForProduct.hasOwnProperty(id)){
      this.requestedStockQtyForProduct[id] = [];
    }
        
    this.requestedStockQtyForProduct[id] = parseInt(stockCount.textContent);
    window.localStorage.setItem(id, this.requestedStockQtyForProduct[id]);

    return this;
  },

  /**
   * @param {Integer} id Holds id data
   */
  getRequestedStockCountForProduct (id) {
    return window.localStorage.getItem(id);
  },

  /**
   * @param {Object} data Holds product id and stock
   */
  checkIfRequestedStockQtyForProductIsset (data) {
    var stockCount = this.stockCountOfProduct(data.id);
    var maxStockCount = this.remainedMaxStockCountOfProduct(data.id);

    if (parseInt(stockCount.textContent) == 0 && parseInt(maxStockCount.textContent) > 0) {
      this.remainingMaxRequestForProductStockQty[data.id] = data.stock;        
      return false;
    } else {
      return true;
    }
  },

  /**
   * @param {Integer} id Holds id data
   * @return {Object} ShoppingCartService
   */
  setNewMaxStockQtyForProduct (data) {
    var stockCount = this.stockCountOfProduct(data.id);
    var maxStockCount = this.remainedMaxStockCountOfProduct(data.id);
    
    if (! this.remainingMaxRequestForProductStockQty.hasOwnProperty(data.id)){
      this.remainingMaxRequestForProductStockQty[data.id] = [];
    }

    var totalRequested = this.getRequestedStockCountForProduct(data.id);
    
    if (parseInt(stockCount.textContent) > 0) {
      this.remainingMaxRequestForProductStockQty[data.id] -= totalRequested;
    } 

    maxStockCount.textContent = this.remainingMaxRequestForProductStockQty[data.id]; 

    return this;
  },
  
  /**
   * @param {Integer} id Holds div id data
   * @returns {Object} ShoppingCartService
   */
  resetCounterForProduct (id) {
    var stockCount = this.stockCountOfProduct(id);  
    stockCount.textContent = 0;
    return this;
  },
  
  /**
   * @param {Integer} id Holds id data
   * @returns {Object} ShoppingCartService
   */
  createBasketRecordForProduct (id) {
    
   if (window.localStorage.getItem('b' + id) == null
       && parseFloat(this.customerBalance.textContent) !== 0) {
     window.localStorage.setItem('b' + id, id);
     this.basketRecordCount.textContent = parseInt(this.basketRecordCount.textContent) + 1;
     this.mobileBasketRecordCount.textContent = parseInt(this.mobileBasketRecordCount.textContent) + 1;
   }
   
   return this;
  },
  
  /**
   * @param {Object} data Holds product id and price
   */
  addPriceToBasketTotal (data) {
    var totalRequested = this.getRequestedStockCountForProduct(data.id); 
    var sum = data.price * totalRequested;
    
    this.basketTotalPrice.textContent = parseFloat(this.basketTotalPrice.textContent) + sum + this.currency;
  },
  
  /**
   * @param {Integer} id Holds id data for product
   * @returns {Boolean} backedActionCompleted
   */
  addProductRequestToBasket (id) {
    var totalRequested = this.getRequestedStockCountForProduct(id);
    var request axios.get(this.backendUrl + '?id=' + id  + '&qty=' + totalRequested);

    return request;
  },
  
  /**
   * @param {Object} data Holds product id and price
   */
  checkCustomerBalance (data) {
    var requestedStockQty = this.getRequestedStockCountForProduct(data.id);
    var calculation = requestedStockQty * data.price;

    if (calculation > parseFloat(this.customerBalance.textContent) 
        || parseFloat(this.customerBalance.textContent) == 0) {		
      return false;
    } else {
      return true;
    }
  },

  /**
   * @param {Integer} id Holds id data for product
   * @returns {Boolean} 
   */
  checkStockIfExist (id) {
    var remainedStockCount = this.remainedMaxStockCountOfProduct(id);

    if (parseInt(remainedStockCount.textContent) == 0){
      return false;
    } else {
      return true;
    }
  },
  
  /**
   * @param {Integer} id Holds id data for product
   */
  destroyStockRequestQtyForProduct (id) {
    window.localStorage.removeItem(id);
  },
  
  /**
   * @param {Object} data Holds product id and price
   * @returns {Object} ShoppingCartService
   */
  setNewCustomerAccountInfo (data) {
    var requestedStockQty = this.getRequestedStockCountForProduct(data.id);
    var stockCount = this.stockCountOfProduct(data.id);
    
    if (parseInt(stockCount.textContent) < 0) {
      this.customerDebit.textContent = parseFloat(this.customerDebit.textContent) + data.price + this.currency;
      this.customerBalance.textContent = parseFloat(this.customerBalance.textContent) - data.price + this.currency;
    } else { 
      this.customerDebit.textContent = parseFloat(this.customerDebit.textContent) + (requestedStockQty * data.price) + this.currency;
      this.customerBalance.textContent = parseFloat(this.customerBalance.textContent) - (requestedStockQty * data.price) + this.currency;
    } 
    
    return this;
  },

};


function ShoppingBasketController() {
  this.shoppingBasketService = null;
}

ShoppingBasketController.prototype = {
    
  /**
   * Constructor function
   */
  constructor: ShoppingBasketController,
  
  /**
  * @param {Object} service
  */
  wireService (service) {
    this.shoppingBasketService = service;
  },
  
  /**
   * @param {Object} args Holds product id, max stock qty
   */
  increment (args) {
    this.shoppingBasketService
      .increaseStockRequestQtyForProductUntilMaxStock({id: args.id, stock: args.stock})
      .setRequestedStockCountForProduct(args.id);
  },
  
  /**
   * @param {Integer} id Holds id data of product
   */
  decrement (id) {
    this.shoppingBasketService
      .decreaseStockRequestQtyForProduct(id)
      .setRequestedStockCountForProduct(id);
  },

  /**
   * @param {Object} args Holds product id, max stock qty and price value
   * @returns {Object} ShoppingCartService
   */
  checkBalance (args) {
    return this.shoppingBasketService
      .checkCustomerBalance({id: args.id, price: args.price});
  },

  /**
   * @param {Object} args Holds product id, max stock qty and price value
   * @returns {Object} ShoppingCartService
   */
  checkStock (args) {
    return this.shoppingBasketService
      .checkStockIfExist(args.id);
  },
  
  /**
   * @param {Object} args Holds product id, max stock qty and price value
   * @returns {Object} ShoppingCartService
   */
  checkStockRequestQtyIsSet (args) {
    return this.shoppingBasketService
      .checkIfRequestedStockQtyForProductIsset(args);
  },
  
  /**
   * @returns {Object} ShoppingCartService
   */ 
  destroyStockRequest (args) {
    return this.shoppingBasketService.destroyStockRequestQtyForProduct(args.id);
  },
  
  /**
   * @param {Object} args Holds product id, max stock qty and price value
   */
  productRequestTransaction (args) {
    if (this.checkBalance(args) == true && this.checkStock(args) == true &&
      this.checkStockRequestQtyIsSet(args) == true ) {

      this.shoppingBasketService.addProductRequestToBasket(args.id).then(function (res) {
  
        alert(res.data);
  
        this.shoppingBasketService
          .setNewMaxStockQtyForProduct({id: args.id, stock: args.stock})
          .resetCounterForProduct(args.id)
          .setNewCustomerAccountInfo({id: args.id, price: args.price})
          .createBasketRecordForProduct(args.id)
          .addPriceToBasketTotal({id: args.id, price: args.price});

      }).then(function (error) {
         alert(error);
      });

    } else if (this.checkBalance(args) == false) {
      alert('Insufficient funds!');
      this.destroyStockRequest(args.id);
    } else if (this.checkStockRequestQtyIsSet(args) == false) {
      alert('Please select stock qty!');
    } else if (this.checkStock(args) == false) {
      alert('Out of stock!');
    }
  },
}

BasketService = new ShoppingBasketService();
BasketController = new ShoppingBasketController();
BasketController.wireService(BasketService);
