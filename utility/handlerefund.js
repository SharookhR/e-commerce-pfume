const Wallet = require('../Model/walletModel');

async function handleRefund(order, item, userId) {
  try {
    
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      throw new Error('Wallet not found for user');
    }

    console.log(item.price, item.quantity);
    
    const itemTotal = item.price * item.quantity;
    let refundAmount = itemTotal;
    
    
    if (order.discount > 0) {
      const totalOrderValue = order.items.reduce((sum, i) =>  sum + (i.price * i.quantity), 0);
      console.log(itemTotal, totalOrderValue);
      
      const discountRatio = itemTotal / totalOrderValue; 
      console.log(discountRatio);
      
      const discountForItem = discountRatio * order.discount; 
      refundAmount -= discountForItem; 
      console.log( discountRatio, discountForItem, refundAmount);
      
    }

    wallet.transactions.push({
      type: 'refund',
      amount: refundAmount,
      date: new Date(),
      description: `${item.productStatus === 'Cancelled' ? 'Cancellation' : 'Return'} refund for item`,
      orderId: order._id.toString()
    });

    wallet.balance += refundAmount;
    await wallet.save();

    return refundAmount;
  } catch (error) {
    console.error('Error handling refund:', error);
    throw new Error('Failed to process the refund');
  }
}

module.exports = { handleRefund };
