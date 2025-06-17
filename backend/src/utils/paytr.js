const crypto = require("crypto");
const config = require("../config/config");

class PayTR {
  static generateToken(paymentData) {
    const {
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount,
      user_basket,
      debug_on,
      no_installment,
      max_installment,
      user_name,
      user_address,
      user_phone,
      merchant_ok_url,
      merchant_fail_url,
      timeout_limit,
      currency,
      test_mode,
    } = paymentData;

    // Debug için gelen verileri logla
    console.log("PayTR Input Data:", {
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount,
      user_basket,
      no_installment,
      max_installment,
      currency,
      test_mode,
    });

    const merchant_key = config.paytr.merchant_key;
    const merchant_salt = config.paytr.merchant_salt;

    // user_basket'i base64'e çevir
    const user_basket_base64 = Buffer.from(
      JSON.stringify(user_basket)
    ).toString("base64");

    // Hash string oluştur - PayTR'nin beklediği sırayla
    const hash_str = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket_base64}${no_installment}${max_installment}${currency}${test_mode}`;
    const paytr_token = hash_str + merchant_salt;

    // Debug için hash string'i logla
    console.log("PayTR Hash String:", hash_str);
    console.log("PayTR Merchant Key:", merchant_key);
    console.log("PayTR Merchant Salt:", merchant_salt);
    console.log("PayTR User Basket Base64:", user_basket_base64);

    // Token oluştur
    const token = crypto
      .createHmac("sha256", merchant_key)
      .update(paytr_token)
      .digest("base64");

    // Debug için oluşturulan token'ı logla
    console.log("PayTR Generated Token:", token);

    return {
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount,
      paytr_token: token,
      user_basket: user_basket_base64,
      debug_on,
      no_installment,
      max_installment,
      user_name,
      user_address,
      user_phone,
      merchant_ok_url,
      merchant_fail_url,
      timeout_limit,
      currency,
      test_mode,
    };
  }

  static verifyCallback(post) {
    const merchant_key = config.paytr.merchant_key;
    const merchant_salt = config.paytr.merchant_salt;

    const hash = post.hash;
    const merchant_oid = post.merchant_oid;
    const status = post.status;
    const total_amount = post.total_amount;

    // Debug için callback verilerini logla
    console.log("PayTR Callback Data:", {
      hash,
      merchant_oid,
      status,
      total_amount,
    });

    const hash_str = `${merchant_oid}${merchant_salt}${status}${total_amount}`;
    const calculated_hash = crypto
      .createHmac("sha256", merchant_key)
      .update(hash_str)
      .digest("base64");

    // Debug için hesaplanan hash'i logla
    console.log("PayTR Calculated Hash:", calculated_hash);

    return hash === calculated_hash;
  }

  static formatBasket(items) {
    // Debug için sepet verilerini logla
    console.log("PayTR Basket Items:", items);

    const formattedBasket = items.map((item) => {
      // Fiyatı string olarak formatla
      const price = parseFloat(item.price).toFixed(2);
      return [item.name, price, item.quantity];
    });

    // Debug için formatlanmış sepeti logla
    console.log("PayTR Formatted Basket:", formattedBasket);

    return formattedBasket;
  }
}

module.exports = PayTR;
