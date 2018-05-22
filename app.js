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

  var calculateTotal = function(type) {
    var sum  = 0;
    data.allItems[type].forEach(function(curr , i){
      sum  = sum + curr.value
    });
    data.totals[type] = sum;
  }
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
    },
    deleteItem: function(id,type) {
      data.allItems[type] = data.allItems[type].filter(function(obj , i) {
            return obj.id != id;
      });
    },
    calculateBudget: function() {
      calculateTotal('exp');
      calculateTotal('inc');

      data.budget = data.totals.inc - data.totals.exp;
      if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
      }
      else{
        data.percentage = -1;
      }
      
    },
    getBudget: function() {
        return {
          budget:data.budget,
          totalinc: data.totals.inc,
          totalexp: data.totals.exp,
          totalper: data.percentage
        }
    },
    getPercentage: function() {
      return data.percentage;
    },
    testing: function() {
      console.log(data);
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
    expenseList: '.expenses__list',
    totalbudget: '.budget__value',
    totalincome: '.budget__income--value',
    totalexpenses: '.budget__expenses--value',
    totalpercentage: '.budget__expenses--percentage',
    container: '.container'
  };
  return {
    getinput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },
    getDOMStrings: function() {
      return DOMStrings;
    },
    clearFields: function() {
      var fields;

      fields = document.querySelectorAll(DOMStrings.inputValue + ','+DOMStrings.inputDescription);
      fields.forEach(function(ele , i , list) {
        ele.value = '';
      });
      fields[0].focus();
    },
    addListItem: function(obj , type) {
      var html , element;
      if (type === 'inc') {
        element = (DOMStrings.incomeList);
        html =
          `<div class="item clearfix" id="inc-${obj.id}"> 
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
          `<div class="item clearfix" id="exp-${obj.id}"> 
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
         
    },
    deleteListItem: function(selectorID) {
      document.getElementById(selectorID).parentNode.removeChild( document.getElementById(selectorID));
    },
    showBudget: function(obj) {
      
      document.querySelector(DOMStrings.totalbudget).textContent = '+ '+obj.budget;
      
      document.querySelector(DOMStrings.totalincome).textContent = '+ '+obj.totalinc;
      
      document.querySelector(DOMStrings.totalexpenses).textContent = '- '+obj.totalexp;
      
      if(obj.totalper > 0){
        document.querySelector(DOMStrings.totalpercentage).textContent = obj.totalper + '%';
      }
      else {
        document.querySelector(DOMStrings.totalpercentage).textContent = '---';
      }
      
    }
  };
})();

var controller = (function(budgetCtrl, uiCtrl) {

  function updateBudget() {
    budgetCtrl.calculateBudget();
    var budget = budgetCtrl.getBudget();
    uiCtrl.showBudget(budget);
  }

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

    document.querySelector(DOM.container).addEventListener('click',ctrlDelItem);
  }

  var ctrlAddItem = function() {
    var input = uiCtrl.getinput();
    if(input.description.trim() !== '' && !isNaN(input.value) && input.value > 0){
      var newItem = budgetCtrl.addItem(
        input.type,
        input.description,
        input.value
      );
      uiCtrl.addListItem(newItem , input.type);
      uiCtrl.clearFields();
      updateBudget();
    }
  };

  var ctrlDelItem = function(e) {
    var itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemID){
      var splitItemsID = itemID.split('-');
      var id = splitItemsID[1];
      var type = splitItemsID[0];

      budgetCtrl.deleteItem(id,type);
      uiCtrl.deleteListItem(itemID);
      updateBudget();
    }
  }

  return {
    init: function() {
      console.log("Bakwaas giri start ho rahi hai abhi!!!");
      uiCtrl.showBudget( {budget:0,
        totalinc: 0,
        totalexp: 0,
        totalper: -1})
      setupEventListeners();
    }
  };
})(budgetController, uiController);

controller.init();
