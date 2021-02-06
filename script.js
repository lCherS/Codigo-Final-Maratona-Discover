const Modal = {
  open() {
    document.querySelector('.modal-overlay')
      .classList.add('active');
  },
  close() {
    document.querySelector('.modal-overlay')
      .classList
      .remove('active')
  }
};

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dados')) || [];
  },
  set(transactions) {
    localStorage.setItem('dados',JSON.stringify(transactions))
  },
}

const Transaction = {
  all: Storage.get(),
  add(transaction) {
    Transaction.all.push(transaction)

    App.reload()
  },
  remove(i) {
    console.log('removendo');
    Transaction.all.splice(i, 1)

    App.reload()
  },
  incomes() {
    // Somar as Entradas
    let income = 0;

    Transaction.all.forEach((el) => {
      if (el.amount > 0) {
        income += el.amount;
      }
    })
    return income;

  },
  expenses() {
    // Somar as Saidas
    let expense = 0;

    Transaction.all.forEach((el) => {
      if (el.amount < 0) {
        expense += el.amount;
      }
    })
    return expense;
  },
  total() {
    // Entradas - Saidas
    return Transaction.incomes() + Transaction.expenses()

  }
}
const DOM = {
  TransactionsContainer: document.querySelector('#data-table tbody'),

  addTrasaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index;

    DOM.TransactionsContainer.appendChild(tr)
  },
  innerHTMLTransaction(transaction, index) {
    const Cssclass = transaction.amount > 0 ? 'income' : 'expense';
    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${Cssclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td><img src="./assets/minus.svg" alt="Remover Transação" onclick="Transaction.remove(${index})"></td>
    `;

    return html
  },

  updateBalance() {
    document.getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes());
    document.getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses());
    document.getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total());
  },
  clearTransactions() {
    DOM.TransactionsContainer.innerHTML = '';
  }
}

const Utils = {
  formatAmount(val) {
    val = Number(val) * 100;
     return val
  },
  formatDate(date) {
    const splittedDate = date.split('-')

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },
  formatCurrency(val) {
    val = Number(val) / 100;
    val = val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    return val;
  }
}

const Form = {
  description: document.querySelector('input#txdescription'),
  amount: document.querySelector('input#txamount'),
  date: document.querySelector('input#sldate'),
  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },
  validateFileds() {
    const {
      description,
      amount,
      date
    } = Form.getValues()
    if (description.trim() === '' || amount.trim() === '' || date.trim() === '') {
      throw new Error('Favor preencher todos os campos')
    }
  },
  formatValues() {
    let {
      description,
      amount,
      date
    } = Form.getValues()

    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },
  saveTransaction(transaction) {
    Transaction.add(transaction);
  },
  ClearFileds() {
    Form.description.values = '';
    Form.amount.values = '';
    Form.date.values = '';
  },
  submit(event) {
    event.preventDefault();
    try {
      Form.validateFileds();
      const transaction = Form.formatValues();
      Form.saveTransaction(transaction)
      Form.ClearFileds()

      Modal.close()
    } catch (e) {
      console.log(e)
    }
  }
}

const App = {
  init() {
    Transaction.all.forEach(DOM.addTrasaction);
    DOM.updateBalance();

    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransactions()
    App.init()
  },
}

App.init()
/**
 * Transaction.add({
  description: 'Bola',
  amount: -6000,
  date: '23/01/2021'
})
 */


// Transaction.remove() 