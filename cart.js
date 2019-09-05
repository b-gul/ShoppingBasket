
/**
 * A simple B2C E-commerce Shopping Cart Stock Request Controller based on Protype Pattern
 * Author: @bgul <berke.gul@println.work>
 */

function ShoppingBasketService(config) {
  this.backendUrl = config.backendUrl; 
  
  this.productElemIdPrefix = config.productElemIdPrefix;

  this.requestedStockQtyForProduct = {};
  this.remainingMaxRequestForProductStockQty = {};
    
  this.customerDebit = config.customerDebit; 
  this.customerBalance = config.customerBalance;
  
  this.basketRecordCount = config.basketRecordCount;
  this.mobileBasketRecordCount = config.mobileBasketRecordCount; 
  this.basketTotalPrice = config.basketTotalPrice; 
  this.currency = config.currency;
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
    return document.getElementById(this.productElemIdPrefix + '-' + id).getElementsByClassName('stock')[0];
  },
  
  /**
   * @param {Integer} id Holds div id data
   * @returns {HTMLDivElement}
   */
  remainedMaxStockCountOfProduct (id) {
    return document.getElementById(this.productElemIdPrefix + '-' + id).getElementsByClassName('max-stock')[0];
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
   * @param {Object} args Holds product id, max stock qty and price value
   */
  productRequestTransaction (args) {
    if (this.checkBalance(args) == true && this.checkStock(args) == true &&
      this.checkStockRequestQtyIsSet(args) == true ) {
      
      // Closure variable
      var basketService = this.shoppingBasketService;
      
      this.shoppingBasketService.addProductRequestToBasket(args.id).then(function (res) {
  
        alert(res.data);
        
        basketService
          .setNewMaxStockQtyForProduct({id: args.id, stock: args.stock})
          .resetCounterForProduct(args.id)
          .setNewCustomerAccountInfo({id: args.id, price: args.price})
          .createBasketRecordForProduct(args.id)
          .addPriceToBasketTotal({id: args.id, price: args.price});

      }).then(function (error) {
         alert(error);
        
         /**
          * You may have to create your own frontend logic for specific 
          * warning messages throwed by backend!
          *
          * E.g:
          * Required product's stock is out could not exist 
          * while client want to add into basket(but on client side it seems exist).
          * 
          */
      });

    } else if (this.checkBalance(args) == false) {
      alert('Insufficient funds!');
    } else if (this.checkStockRequestQtyIsSet(args) == false) {
      alert('Please select stock qty!');
    } else if (this.checkStock(args) == false) {
      alert('Out of stock!');
    }
  },
}

var config = {
  /**
   * Controller path for backend
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
  basketRecordCount:  document.getElementById('basket-count'),
  mobileBasketRecordCount: document.getElementById('mobile-basket-count'),
  basketTotalPrice: document.getElementById('basket-total'),
 
  /**
   * Customizable currency sign 
   */
  currency: ''
};

BasketService = new ShoppingBasketService(config);
BasketController = new ShoppingBasketController();
BasketController.wireService(BasketService);
