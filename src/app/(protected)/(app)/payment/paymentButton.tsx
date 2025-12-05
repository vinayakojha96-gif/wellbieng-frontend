// "use client"

// import { useState } from "react"

// export default function PaymentButton({ amount }: { amount: number }) {
//   const [loading, setLoading] = useState(false)

//   const loadScript = (src: string) => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script")
//       script.src = src
//       script.onload = () => resolve(true)
//       script.onerror = () => resolve(false)
//       document.body.appendChild(script)
//     })
//   }

//   const handlePayment = async () => {
//     setLoading(true)

//     const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
//     if (!res) {
//       alert("Failed to load Razorpay SDK. Check your internet connection.")
//       return
//     }

//     // 1️⃣ Call backend to create Razorpay order
//     const orderRes = await fetch("http://127.0.0.1:3333/api/payments/order", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount })
//     })

//     const orderData = await orderRes.json()

//     if (!orderData?.orderId) {
//       alert("Failed to create payment order")
//       return
//     }

//     // 2️⃣ Open Razorpay Checkout
//     const options = {
//       key: "rzp_test_Rl89mqGQPjipXF",   // frontend key
//       amount: orderData.amount,
//       currency: orderData.currency,
//       name: "Wanderfly Pvt Ltd",
//       description: "Travel Payment",
//       order_id: orderData.orderId,
//       handler: async function (response: any) {
//         // 3️⃣ Verify payment (backend)
//         // await fetch("https://api.wanderfly.in/api/payments/verify", {
//         await fetch("http://127.0.0.1:3333/api/payments/verify", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             orderId: response.razorpay_order_id,
//             paymentId: response.razorpay_payment_id,
//             signature: response.razorpay_signature,
//           }),
//         })

//         alert("🎉 Payment Successful! Thank you for choosing Wanderfly.")
//       },
//       prefill: {
//         name: "Vinayak", // Replace with logged-in user later
//         email: "customer@example.com",
//         contact: "9876543210",
//       },
//       theme: { color: "#0d9488" },
//     }

//     const rzp = new (window as any).Razorpay(options)
//     rzp.open()
//     setLoading(false)
//   }

//   return (
//     <button
//       onClick={handlePayment}
//       disabled={loading}
//       className="w-full bg-teal-600 text-white font-medium py-3 rounded-lg shadow hover:bg-teal-700 transition disabled:opacity-50"
//     >
//       {loading ? "Processing..." : `Pay ₹${amount}`}
//     </button>
//   )
// }

"use client";

import { useState } from "react";

export default function PaymentButton({ amount }: { amount: number }) {
  const [loading, setLoading] = useState(false);

  const loadScript = (src: string) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePay = async () => {
    setLoading(true);

    await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    const orderRes = await fetch(`https://api.wanderfly.in/api/payments/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const order = await orderRes.json();

    const rzp = new (window as any).Razorpay({
      key: "rzp_test_Rl89mqGQPjipXF",
      amount: order.amount,
      currency: order.currency,
      name: "Wanderfly Wellbeing",
      description: "Payment for wellbeing services",
      order_id: order.orderId,
      theme: { color: "#0d9488" },

      handler: async function (response: any) {
        await fetch(`https://api.wanderfly.in/api/payments/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          }),
        });

        // redirect to success page 🚀
        window.location.href = "/payment/success";
      },
    });

    rzp.open();
    setLoading(false);
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="w-full rounded-lg bg-teal-600 py-2.5 font-medium text-white shadow transition hover:bg-teal-700 disabled:opacity-50"
    >
      {loading ? "Processing..." : `Pay ₹${amount}`}
    </button>
  );
}
