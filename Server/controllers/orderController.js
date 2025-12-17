
//place order ocd:/api/order/cod

import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/user.js";

export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.userid;
    const { items, address } = req.body;

    if (!userId || !items || items.length === 0 || !address) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      amount += product.offerPrice * item.quantity;
    }

    // add 2% tax
    amount += amount * 0.02;

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
      isPaid: false
    });

    return res.json({ success: true, message: "Order placed successfully" });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//get orders oc: /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userid;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }]
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//get all orders oc: /api/order/seller

export const getAllOrders=async(req,res)=>{
    try {
       
        const orders=await Order.find({
         
            $or:[{paymentType:"COD"},{isPaid:true}]

        }).populate("items.product address").sort({createdAt:-1});
    res.json({success:true,orders});
    }catch(error){
        return res.json({success:false,message:error.message});
    }   }

// /api/order/stripe

    export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userid;
    const { items, address } = req.body;
    const { origin } = req.headers;

    if (!userId || !items || items.length === 0 || !address) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let productData = [];
    let subtotal = 0;

    for (const item of items) {
      if (item.quantity <= 0) {
        return res.json({ success: false, message: "Invalid quantity" });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }

      productData.push({
        name: product.name,
        quantity: item.quantity,
        price: product.offerPrice,
      });

      subtotal += product.offerPrice * item.quantity;
    }

    const tax = Math.round(subtotal * 0.02);
    const totalAmount = subtotal + tax;

    const order = await Order.create({
      userId,
      items,
      amount: totalAmount,
      address,
      paymentType: "Online",
      isPaid: false,
    });

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map(item => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add tax as separate line item
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Tax (2%)" },
        unit_amount: tax * 100,
      },
      quantity: 1,
    });

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({ success: true, url: session.url });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// stripe webhook to verify payments action :/stripe

export const stripeWebhook = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
//handle the event
switch (event.type) {
  case "payment_intent.succeeded":{
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    const session=await stripeInstance.checkout.sessions.list({
      payment_intent:paymentIntentId
    })
    const {orderId,userId}=session.data[0].metadata;

    // mark order as paid
    await Order.findByIdAndUpdate(orderId,{
      isPaid:true
    });

    await User.findByIdAndUpdate(userId,{
     cartItems:{}
    });
    break;
  }
    case "payment_intent.payment_failed":{
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    const session=await stripeInstance.checkout.sessions.list({
      payment_intent:paymentIntentId
    })
    const {orderId}=session.data[0].metadata;

    // delete the order
    await Order.findByIdAndDelete(orderId);
    break;

  }

  default:
    console.log(`Unhandled event type ${event.type}`);
    break;
}
  res.json({ received: true });
}