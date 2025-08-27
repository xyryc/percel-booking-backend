import { ISslCommerz } from "./sslCommerz.interface";
import axios from "axios";
const sslPaymentInit = async (payload: ISslCommerz) => {
  

  try {
    const data = {
      store_id: process.env.SSL_COMMERZ_STORE_ID,
      store_passwd: process.env.SSL_COMMERZ_STORE_PASSWORD,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: `${process.env.SSL_COMMERZ_SUCCESS_URL}?transactionId=${payload.transactionId}`,
      fail_url: `${process.env.SSL_COMMERZ_FAIL_URL}?transactionId=${payload.transactionId}`,
      cancel_url: `${process.env.SSL_COMMERZ_CANCEL_URL}?transactionId=${payload.transactionId}`,
      ipn_url: `${process.env.SSL_COMMERZ_IPN_URL}?transactionId=${payload.transactionId}`,
      shipping_method: "Courier",
      product_name: "Tour Booking Payment",
      product_category: "Tour",
      product_profile: "general",
      cus_name: payload.name,
      cus_email: payload.email,
      cus_phone: payload.phone,
      cus_add1: payload.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_zip: "1212",
      cus_country: "Bangladesh",
      cus_fax: "N/A",
      ship_name: payload.name,
      ship_add1: payload.address,
      ship_add2: "N/A",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_zip: "1212",
      ship_country: "Bangladesh",
    };

    const response = await axios({
      method: "POST",
      url: process.env.SSL_COMMERZ_PAYMENT_API,
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error) {
    // console.error("SSL Commerz payment initialization failed:", error);
    throw new Error("Payment initialization failed: " + error);
  }
};

export const sslCommerzService = {
  sslPaymentInit,
};
