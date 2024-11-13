const verifyPaymentAndCreateOrder = async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        addressID,
        paymentMethod,
        discount,
        totalPrice,
        paymentStatus,
      } = req.body;
  
      const userId = req.session.user._id;
  
      if (paymentStatus === "Failed") {
        const cart = await Cart.findOne({ userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
          return res.status(400).json({ message: "Your cart is empty." });
        }
  
        const address = await Address.findOne({
          "addressDetails._id": addressID,
        });
        if (!address) {
          return res.status(400).json({ message: "Invalid address." });
        }
  
        const selectedAddress = address.addressDetails.find(
          (addr) => addr._id.toString() === addressID
        );
        const user = await User.findById(userId);
  
        const failedOrder = new Order({
          userId: userId,
          items: cart.items.map((item) => ({
            product: item.product._id,
            price: item.price,
            quantity: item.quantity,
          })),
          totalPrice: cart.totalPrice,
          billingDetails: {
            name: user.name,
            email: user.email,
            phno: user.phno,
            address: selectedAddress.address,
            pincode: selectedAddress.pincode,
            country: selectedAddress.country,
            state: selectedAddress.state,
            city: selectedAddress.city,
          },
          discount,
          orderDate: Date.now(),
          paymentMethod: "Razorpay",
          paymentStatus: "Failed",
          orderNumber: uuidv4(),
        });
  
        await failedOrder.save();
        return res.status(200).json({
          message: "Order created with failed payment status.",
          orderId: failedOrder._id,
        });
      }
  
      const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
      shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = shasum.digest("hex");
  
      if (digest !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid payment signature." });
      }
  
      const cart = await Cart.findOne({ userId }).populate("items.product");
  
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Your cart is empty." });
      }
  
      const address = await Address.findOne({ "addressDetails._id": addressID });
      if (!address) {
        return res.status(400).json({ message: "Invalid address." });
      }
  
      const selectedAddress = address.addressDetails.find(
        (addr) => addr._id.toString() === addressID
      );
  
      if (!selectedAddress) {
        return res.status(400).json({ message: "Address not found." });
      }
  
      const user = await User.findById(userId);
  
      const newOrder = new Order({
        userId: userId,
        items: cart.items.map((item) => ({
          product: item.product._id,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice: cart.totalPrice,
        billingDetails: {
          name: user.name,
          email: user.email,
          phno: user.phno,
          address: selectedAddress.address,
          pincode: selectedAddress.pincode,
          country: selectedAddress.country,
          state: selectedAddress.state,
          city: selectedAddress.city,
        },
        discount,
        paymentMethod,
        paymentStatus: "Paid",
        orderNumber: uuidv4(),
      });
  
      await newOrder.save();
  
      for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity },
        });
      }
  
      await Cart.findOneAndDelete({ userId });
  
      return res.status(200).json({
        message: "Payment verified and order created successfully!",
        orderId: newOrder._id,
      });
    } catch (error) {
      console.error("Error verifying payment and creating order:", error);
      return res.status(500).json({
        message: "Error verifying payment and creating order.",
      });
    }
  };