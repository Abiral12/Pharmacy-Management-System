"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
  Clock,
  Receipt,
  Banknote,
  Smartphone,
} from "lucide-react";
import { Invoice } from "@/types/billing";
import {
  formatCurrency,
  formatDate,
  formatStatusBadge,
} from "@/utils/formatters";
import { validatePaymentAmount } from "@/utils/validation";

interface PaymentProcessorProps {
  invoices: Invoice[];
  onProcessPayment: (invoiceId: string, updates: Partial<Invoice>) => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  invoices,
  onProcessPayment,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [paymentReference, setPaymentReference] = useState<string>("");
  const [paymentNotes, setPaymentNotes] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const paymentMethods = [
    { id: "cash", label: "Cash", icon: Banknote, color: "green" },
    { id: "card", label: "Credit/Debit Card", icon: CreditCard, color: "blue" },
    {
      id: "bank_transfer",
      label: "Bank Transfer",
      icon: Receipt,
      color: "purple",
    },
    {
      id: "digital_wallet",
      label: "Digital Wallet",
      icon: Smartphone,
      color: "orange",
    },
    { id: "insurance", label: "Insurance", icon: CheckCircle, color: "teal" },
  ];

  const handleInvoiceSelect = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.total);
    setPaymentReference("");
    setPaymentNotes("");
    setErrors([]);
  };

  const handleProcessPayment = async () => {
    if (!selectedInvoice) return;

    setProcessing(true);
    setErrors([]);

    try {
      // Validate payment amount
      const validation = validatePaymentAmount(
        paymentAmount,
        selectedInvoice.total
      );
      if (!validation.isValid) {
        setErrors(validation.errors);
        setProcessing(false);
        return;
      }

      // Process payment
      const updates: Partial<Invoice> = {
        status: "paid" as const,
        paymentMethod: paymentMethod as any,
        paymentReference,
        datePaid: new Date().toISOString().split("T")[0],
        notes: paymentNotes
          ? `${
              selectedInvoice.notes || ""
            }\n\nPayment Notes: ${paymentNotes}`.trim()
          : selectedInvoice.notes,
      };

      await onProcessPayment(selectedInvoice.id, updates);

      // Reset form
      setSelectedInvoice(null);
      setPaymentAmount(0);
      setPaymentReference("");
      setPaymentNotes("");
    } catch (error) {
      setErrors(["Failed to process payment. Please try again."]);
    } finally {
      setProcessing(false);
    }
  };

  const getPaymentMethodIcon = (methodId: string) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    return method ? method.icon : CreditCard;
  };

  const getPaymentMethodColor = (methodId: string) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    const colorMap = {
      green: "text-green-600 bg-green-50 border-green-200",
      blue: "text-blue-600 bg-blue-50 border-blue-200",
      purple: "text-purple-600 bg-purple-50 border-purple-200",
      orange: "text-orange-600 bg-orange-50 border-orange-200",
      teal: "text-teal-600 bg-teal-50 border-teal-200",
    };
    return method
      ? colorMap[method.color as keyof typeof colorMap]
      : colorMap.blue;
  };

  const pendingTotal = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const overdueInvoices = invoices.filter((inv) => {
    const dueDate = new Date(inv.dueDate);
    const today = new Date();
    return dueDate < today;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">
                Pending Payments
              </p>
              <p className="text-2xl font-bold text-yellow-700">
                {formatCurrency(pendingTotal)}
              </p>
              <p className="text-sm text-yellow-600">
                {invoices.length} invoices
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-red-700">
                {overdueInvoices.length}
              </p>
              <p className="text-sm text-red-600">invoices overdue</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">
                Ready to Process
              </p>
              <p className="text-2xl font-bold text-green-700">
                {invoices.length}
              </p>
              <p className="text-sm text-green-600">payments available</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Pending Invoices
            </h3>
            <p className="text-sm text-gray-600">
              Select an invoice to process payment
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {invoices.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">
                  All Caught Up!
                </h4>
                <p className="text-gray-500">
                  No pending payments at the moment.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {invoices.map((invoice) => {
                  const statusBadge = formatStatusBadge(invoice.status);
                  const isOverdue = new Date(invoice.dueDate) < new Date();

                  return (
                    <motion.div
                      key={invoice.id}
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedInvoice?.id === invoice.id
                          ? "bg-teal-50 border-l-4 border-teal-500"
                          : ""
                      }`}
                      onClick={() => handleInvoiceSelect(invoice)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {invoice.id}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge.className}`}
                            >
                              {statusBadge.text}
                            </span>
                            {isOverdue && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                Overdue
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              {invoice.customerName}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Due: {formatDate(invoice.dueDate)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {formatCurrency(invoice.total)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(invoice.dateCreated)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Process Payment
            </h3>
            <p className="text-sm text-gray-600">
              {selectedInvoice
                ? `Processing payment for ${selectedInvoice.id}`
                : "Select an invoice to process payment"}
            </p>
          </div>

          {selectedInvoice ? (
            <div className="p-4 space-y-6">
              {/* Error Display */}
              {errors.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-800">
                      Payment Error
                    </span>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Invoice Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Invoice Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">
                      {selectedInvoice.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Total:</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(selectedInvoice.total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span
                      className={
                        new Date(selectedInvoice.dueDate) < new Date()
                          ? "text-red-600 font-medium"
                          : ""
                      }
                    >
                      {formatDate(selectedInvoice.dueDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount *
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) =>
                      setPaymentAmount(parseFloat(e.target.value) || 0)
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                {paymentAmount !== selectedInvoice.total && (
                  <p className="mt-1 text-sm text-amber-600">
                    {paymentAmount > selectedInvoice.total
                      ? "Overpayment"
                      : "Partial payment"}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method *
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;

                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center p-3 border rounded-lg transition-colors ${
                          isSelected
                            ? getPaymentMethodColor(method.id) +
                              " border-current"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 mr-3 ${
                            isSelected ? "text-current" : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            isSelected ? "text-current" : "text-gray-700"
                          }`}
                        >
                          {method.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Reference */}
              {(paymentMethod === "card" ||
                paymentMethod === "bank_transfer" ||
                paymentMethod === "digital_wallet") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Reference
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Transaction ID, Check number, etc."
                  />
                </div>
              )}

              {/* Payment Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Notes
                </label>
                <textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Additional notes about this payment..."
                />
              </div>

              {/* Process Button */}
              <button
                onClick={handleProcessPayment}
                disabled={processing || paymentAmount <= 0}
                className="w-full flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Process Payment
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-8 text-center">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">
                Select Invoice
              </h4>
              <p className="text-gray-500">
                Choose an invoice from the list to process payment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessor;
