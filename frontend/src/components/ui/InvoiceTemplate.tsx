// InvoiceTemplate.tsx
interface InvoiceData {
  bookingId: string;
  invoiceDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  dormName: string;
  roomNumber: string;
  roomType: string;
  floor: string;
  moveInDate: string;
  stayDuration: string;
  bookingFee: number;
  roomPerMonth: number;
  insurance: number;
  waterFees: number;
  electricityFees: number;
  firstMonthTotal: number;
}

export const generateInvoiceHTML = (data: InvoiceData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${data.bookingId}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
        .invoice-container { max-width: 800px; margin: 0 auto; border: 2px solid #e5e7eb; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; }
        .header h1 { font-size: 32px; margin-bottom: 10px; }
        .header p { opacity: 0.9; font-size: 14px; }
        .invoice-info { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 30px; background: #f9fafb; border-bottom: 2px solid #e5e7eb; }
        .info-section h3 { font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
        .info-section p { font-size: 14px; margin-bottom: 5px; color: #1f2937; }
        .info-section strong { color: #111827; }
        .content { padding: 30px; }
        .section-title { font-size: 18px; font-weight: 600; margin: 25px 0 15px 0; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .detail-item { padding: 12px; background: #f9fafb; border-radius: 6px; }
        .detail-item label { display: block; font-size: 11px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px; }
        .detail-item span { font-size: 14px; color: #111827; font-weight: 500; }
        .price-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .price-table th { background: #f3f4f6; padding: 12px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase; border-bottom: 2px solid #e5e7eb; }
        .price-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
        .price-table tr:last-child td { border-bottom: none; }
        .total-row { background: #f9fafb; font-weight: 600; font-size: 16px; }
        .total-row td { padding: 15px 12px; border-top: 2px solid #e5e7eb; }
        .amount { text-align: right; font-weight: 600; color: #667eea; }
        .footer { padding: 30px; background: #f9fafb; border-top: 2px solid #e5e7eb; text-align: center; }
        .footer p { font-size: 12px; color: #6b7280; margin-bottom: 5px; }
        .status-badge { display: inline-block; padding: 6px 12px; background: #10b981; color: white; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 10px; }
        @media print {
          body { padding: 0; }
          .invoice-container { border: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <h1>PAYMENT INVOICE</h1>
          <p>Booking Confirmation & Payment Receipt</p>
        </div>
        
        <div class="invoice-info">
          <div class="info-section">
            <h3>Invoice Details</h3>
            <p><strong>Invoice Number:</strong> ${data.bookingId}</p>
            <p><strong>Invoice Date:</strong> ${data.invoiceDate}</p>
            <p><strong>Payment Status:</strong> <span class="status-badge">PAID</span></p>
          </div>
          <div class="info-section">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${data.customerName || 'N/A'}</p>
            <p><strong>Email:</strong> ${data.customerEmail || 'N/A'}</p>
            <p><strong>Phone:</strong> ${data.customerPhone || 'N/A'}</p>
          </div>
        </div>

        <div class="content">
          <h2 class="section-title">Dormitory & Room Information</h2>
          <div class="details-grid">
            <div class="detail-item">
              <label>Dormitory Name</label>
              <span>${data.dormName || 'N/A'}</span>
            </div>
            <div class="detail-item">
              <label>Room Number</label>
              <span>${data.roomNumber || 'N/A'}</span>
            </div>
            <div class="detail-item">
              <label>Room Type</label>
              <span>${data.roomType || 'N/A'}</span>
            </div>
            <div class="detail-item">
              <label>Floor</label>
              <span>Floor ${data.floor || 'N/A'}</span>
            </div>
            <div class="detail-item">
              <label>Move-in Date</label>
              <span>${data.moveInDate || 'N/A'}</span>
            </div>
            <div class="detail-item">
              <label>Stay Duration</label>
              <span>${data.stayDuration || 'Not specified'}</span>
            </div>
          </div>

          <h2 class="section-title">Payment Breakdown</h2>
          <table class="price-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Type</th>
                <th class="amount">Amount (฿)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Booking Fee (Reservation)</td>
                <td>One-time</td>
                <td class="amount">${data.bookingFee.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2"><strong>Total Paid</strong></td>
                <td class="amount"><strong>฿${data.bookingFee.toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>

          <h2 class="section-title">Upcoming Payments (First Month)</h2>
          <table class="price-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Type</th>
                <th class="amount">Amount (฿)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Room Price</td>
                <td>Monthly</td>
                <td class="amount">${data.roomPerMonth.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Booking Fee (Already Paid)</td>
                <td>Deduction</td>
                <td class="amount" style="color: #10b981;">-${data.bookingFee.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Dorm Insurance</td>
                <td>One-time</td>
                <td class="amount">${data.insurance.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Water Fees (Estimated)</td>
                <td>Monthly</td>
                <td class="amount">~${data.waterFees.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Electricity Fees (Estimated)</td>
                <td>Monthly</td>
                <td class="amount">~${data.electricityFees.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2"><strong>Estimated First Month Total</strong></td>
                <td class="amount"><strong>฿${data.firstMonthTotal.toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p><strong>Thank you for your booking!</strong></p>
          <p>This is an official invoice for booking ID: ${data.bookingId}</p>
          <p>For questions or support, contact us at support@dormbooking.com</p>
          <p style="margin-top: 15px; font-size: 11px;">Generated on ${data.invoiceDate}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const downloadInvoice = (data: InvoiceData): void => {
  const invoiceHTML = generateInvoiceHTML(data);
  
  // Create a Blob from the HTML
  const blob = new Blob([invoiceHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Open in new window for printing/saving as PDF
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        URL.revokeObjectURL(url);
      }, 250);
    };
  }
};