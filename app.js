var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, description, value) {
      var newItem, ID;

      /// Create a new ID
      ID =
        (data.allItems[type].length > 0
          ? data.allItems[type][data.allItems[type].length - 1].id
          : 0) + 1;

      if (type === "exp") {
        newItem = new Expense(ID, description, value);
      } else if (type === "inc") {
        newItem = new Income(ID, description, value);
      }
      data.allItems[type].push(newItem);
      return newItem;
    }
  };
})();

var uiController = (function() {
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeList: '.income__list',
    expenseList: '.expenses__list'
  };
  return {
    getinput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };
    },
    getDOMStrings: function() {
      return DOMStrings;
    },
    addListItem: function(obj , type) {
      var html , element;
      if (type === 'inc') {
        element = (DOMStrings.incomeList);
        html =
          `<div class="item clearfix" id="income-${obj.id}"> 
            <div class="item__description">${obj.description}</div> 
            <div class="right clearfix"> 
              <div class="item__value">${obj.value}</div> 
              <div class="item__delete"> 
                <button class="item__delete--btn">
                  <i class="ion-ios-close-outline"></i>
                </button> 
              </div> 
            </div> 
          </div>`;
      } else {
        element = (DOMStrings.expenseList);
        html =
          `<div class="item clearfix" id="expense-${obj.id}"> 
            <div class="item__description">${obj.description}</div> 
            <div class="right clearfix"> <div class="item__value">${obj.value}</div> 
            <div class="item__percentage">21%</div> 
            <div class="item__delete"> 
              <button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i>
              </button> 
            </div> 
          </div>`;
      }
      
      document.querySelector(element).insertAdjacentHTML('beforeend', html);
         
    }
  };
})();

var controller = (function(budgetCtrl, uiCtrl) {
  function setupEventListeners() {
    var DOM = uiCtrl.getDOMStrings();

    document
      .querySelector(DOM.inputButton)
      .addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function(event) {
      if (event.keyCode == 13 || event.which == 13) {
        ctrlAddItem();
      }
    });
  }

  var ctrlAddItem = function() {
    var input = uiCtrl.getinput();
    var newItem = budgetCtrl.addItem(
      input.type,
      input.description,
      input.value
    );
    uiCtrl.addListItem(newItem , input.type);
  };

  return {
    init: function() {
      console.log("Bakwaas giri start ho rahi hai abhi!!!");
      setupEventListeners();
    }
  };
})(budgetController, uiController);

controller.init();
