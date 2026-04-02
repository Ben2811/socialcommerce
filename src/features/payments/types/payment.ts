export interface CreateVnpayPaymentInput {
  orderId: string;
  bankCode?: string;
  language?: "vn" | "en";
}

export interface CreateVnpayPaymentResponse {
  paymentUrl: string;
  orderId: string;
  amount: number;
}

export interface VnpayCallbackResponse {
  orderId: string;
  isSuccess: boolean;
  message: string;
  responseCode?: string;
  transactionStatus?: string;
  transactionNo?: string;
  payDate?: string;
  amount?: number;
}

/** Query params appended by VNPay to the return URL */
export interface VnpayReturnParams {
  vnp_ResponseCode?: string;
  vnp_TransactionStatus?: string;
  vnp_TxnRef?: string;
  vnp_Amount?: string;
  vnp_TransactionNo?: string;
  vnp_PayDate?: string;
  vnp_OrderInfo?: string;
  vnp_BankCode?: string;
  vnp_SecureHash?: string;
}
