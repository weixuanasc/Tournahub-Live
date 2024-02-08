import React, { useState, useEffect } from "react";
import NavbarS from "./NavbarS";

function PaymentSuccess() {

    const Message = () => (
        <section>
          <div>
            <div>
              <h3> Payment Successful. We will be reaching out to you soon.</h3>
            </div>
          </div>
        </section>
      );

  return (
    <>
      <NavbarS />
      <Message />
    </>
  );
}

export default PaymentSuccess;