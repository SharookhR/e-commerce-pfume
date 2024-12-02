const Order = require('../Model/orderModel')

const monthgraph = async () => {
    const currentYear = new Date().getFullYear();
    const ordersByMonth = await Order.aggregate([
      {
        $match: {
          orderDate: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$orderDate" },
          count: { $sum: 1 },
        },
      },
    ]);
  
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    const data = {
      labels: months,
      count: Array(12).fill(0),
    };
  
    ordersByMonth.forEach((order) => {
      data.count[order._id - 1] = order.count;
    });
  
    return data;
  };
  
  const yeargraph = async () => {
    const startYear = 2022;
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: currentYear - startYear + 2 },
      (_, i) => startYear + i
    );
  
    const ordersByYear = await Order.aggregate([
      {
        $match: {
          orderDate: {
            $gte: new Date(`${startYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $year: "$orderDate" },
          count: { $sum: 1 },
        },
      },
    ]);
  
    const data = { labels: years, count: Array(years.length).fill(0) };
  
    ordersByYear.forEach((order) => {
      const index = data.labels.indexOf(order._id);
      if (index !== -1) data.count[index] = order.count;
    });
  
    return data;
  };


  const chart = async () => {
    const orderStatuses = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    
    const statusCounts = {
      pending: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned:0
    };
  
    orderStatuses.forEach((status) => {
      if (status._id === "Pending") statusCounts.pending = status.count;
      if (status._id === "Shipped") statusCounts.shipped = status.count;
      if (status._id === "Delivered") statusCounts.delivered = status.count;
      if (status._id === "Cancelled") statusCounts.cancelled = status.count;
      if (status._id === "Returned") statusCounts.returned = status.count;
    });

    
  
    return statusCounts;
  };
  

module.exports = {monthgraph, yeargraph, chart}