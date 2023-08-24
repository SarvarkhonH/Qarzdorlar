const calculateDebtsAndRemaining = (products, payments) => {
    const totalDebts = products.reduce((total, product) => total + product.totalPrice, 0);
    const totalPayments = payments.reduce((total, payment) => total + payment.payment, 0);
    const remain = totalDebts - totalPayments;
  
    return { debts: totalDebts, remain };
  };
  
  module.exports = calculateDebtsAndRemaining;
  