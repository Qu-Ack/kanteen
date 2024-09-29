import { createContext, ReactNode, useContext, useState } from "react";
import { Item } from "../app/(flow)/home";

interface PaymentContext {
  addUserId(user_id: string): void;
  addPaymentStatus(status: string): void;
  finalOrder: FinalOrderData;
  addOrderID(order_id: string): void;
  orderId: string;
}

const paymentContext = createContext<PaymentContext | undefined>(undefined);

type PaymentEnum = "complete" | "pending";

type FinalOrderData = {
  user_id: string;
  payment_status: PaymentEnum;
};

export default function PaymentContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [finalOrder, setFinalOrder] = useState<FinalOrderData>({
    user_id: "",
    payment_status: "pending",
  });
  const [orderId, setOrderID] = useState("");

  function addUserId(user_id: string) {
    setFinalOrder((prevFinalOrder) => ({
      ...prevFinalOrder,
      user_id,
    }));
  }

  function addOrderID(order_id: string) {
    setOrderID(order_id);
  }

  function addPaymentStatus(status: PaymentEnum) {
    setFinalOrder((prevFinalOrder) => ({
      ...prevFinalOrder,
      payment_status: status,
    }));
  }

  return (
    <paymentContext.Provider
      value={{
        addUserId,
        addPaymentStatus,
        finalOrder,
        addOrderID,
        orderId,
      }}
    >
      {children}
    </paymentContext.Provider>
  );
}

export function usePaymentContext() {
  const payment_context = useContext(paymentContext);

  if (!payment_context) {
    throw Error(
      "usePaymentContext() should be used inside the PaymentContextProvider",
    );
  }

  return payment_context;
}
