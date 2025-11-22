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
  const bookingFee = data.bookingFee ?? 0;
  const roomPrice = data.roomPerMonth ?? 0;
  const insurance = data.insurance ?? 0;
  const water = data.waterFees ?? 0;
  const electricity = data.electricityFees ?? 0;
  const firstMonth = data.firstMonthTotal ?? 0;

  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 0 });

  return `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Invoice ${data.bookingId}</title>
      <style>
        /* Reset */
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%}
        body{
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
          font-size:12px;color:#111827;background:#f3f4f6;-webkit-print-color-adjust:exact;print-color-adjust:exact;
        }

        @page{size:A4;margin:18mm}

        .page{
          width:210mm;min-height:297mm;margin:0 auto;background:transparent;display:flex;align-items:flex-start;justify-content:center;padding:0;
        }

        .sheet{
          width:calc(210mm - 36mm);/* account for page margins */
          background:#fff;border:1px solid #e6e7eb;border-radius:6px;overflow:hidden;
          box-shadow:0 6px 18px rgba(15,23,42,0.06);
        }

        .header{display:flex;justify-content:space-between;align-items:center;padding:22px 28px;background:linear-gradient(90deg,#0f172a 0%, #111827 100%);color:#fff}
        .brand{display:flex;align-items:center;gap:14px}
        .logo{width:56px;height:56px;border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center;color:#0f172a;font-weight:700}
        .company{font-weight:700;font-size:15px}
        .company small{display:block;font-weight:500;opacity:.9;font-size:11px}
        .company-contact .address{font-size:12px;color:rgba(255,255,255,0.95);margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.12)}
        .company-contact .contact-line{font-size:11.5px;color:rgba(255,255,255,0.85);margin-top:4px}

        .invoice-meta{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
        .invoice-meta h2{font-size:20px;margin:0;letter-spacing:1px;color:#fff;font-weight:700}
        .invoice-meta .meta{font-size:12px;color:rgba(255,255,255,0.92);display:flex;gap:8px;align-items:center}
        .invoice-meta .meta .label{color:rgba(255,255,255,0.75);font-size:11px;text-transform:uppercase;font-weight:600;margin-right:6px}
        .status-pill{display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,0.06);color:#d1fae5;font-weight:700;font-size:12px;border:1px solid rgba(255,255,255,0.06)}
        .status-pill svg{width:14px;height:14px;display:block}

        .body{padding:20px 28px}
        .billing{display:flex;justify-content:space-between;gap:16px;margin-bottom:18px}
        .bill-to{width:60%}
        .bill-to h4{font-size:13px;margin-bottom:8px;color:#111827}
        .bill-to .name{font-size:15px;font-weight:700;margin-bottom:6px;color:#0f172a}
        .bill-to .contact{font-size:12px;color:#6b7280;margin-bottom:8px;line-height:1.4}
        .bill-to .properties{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
        .bill-to .property{background:#f1f5f9;padding:6px 10px;border-radius:6px;font-size:12px;color:#374151;border:1px solid #eef2f7}
        .right-summary{width:40%;text-align:right}
        .right-summary .box{background:#f8fafc;padding:10px;border:1px solid #eef2f7;border-radius:6px}

        table.items{width:100%;border-collapse:collapse;margin-top:12px}
        table.items thead th{background:#f8fafc;color:#6b7280;text-transform:uppercase;font-size:11px;padding:10px;border-bottom:1px solid #e6e7eb;text-align:left}
        table.items tbody td{padding:12px 10px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#0f172a}
        table.items tbody tr.total td{border-top:2px solid #e6e7eb;font-weight:700;background:#fff}
        .text-right{text-align:right}

        .totals{margin-top:12px;display:flex;justify-content:flex-end}
        .totals .totals-table{width:320px;border-collapse:collapse}
        .totals .totals-table td{padding:8px 10px;font-size:13px}
        .totals .totals-table tr.total td{font-size:15px;font-weight:700;color:#0f172a}

        .notes{margin-top:18px;font-size:12px;color:#6b7280}

        .footer{padding:14px 28px;background:#fbfdff;border-top:1px solid #eef2f7;text-align:center;font-size:11px;color:#6b7280}

        @media print{
          body{background:white}
          .sheet{box-shadow:none;border:0}
          .page{margin:0}
        }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="sheet" role="document">
          <div class="header">
            <div class="brand">
              <div>
                <div class="company">Lumiq</div>
                <small class="company-contact">
                  <div class="address">33 Nang Lae, Mae Fah Luang, Nang Lae, Meaung. <br/>Chiang Rai, 57100, Thailand</div>
                  <div class="contact-line">Contact: 0923377538</div>
                  <div class="contact-line">Email: sanmine@gmail.com</div>
                  <div class="contact-line">Line ID: @sanmineDorm</div>
                  <div class="contact-line">Facebook: sanmine.facebook.com</div>
                </small>
              </div>
            </div>
            <div class="invoice-meta" aria-label="Invoice meta">
              <h2>INVOICE</h2>
              <div class="meta"><span class="label">Invoice #</span><span>${data.bookingId}</span></div>
              <div class="meta"><span class="label">Date</span><span>${data.invoiceDate}</span></div>
              <div style="margin-top:4px">
                <span class="status-pill" role="status" aria-label="Paid">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" stroke="#a7f3d0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  PAID
                </span>
              </div>
            </div>
          </div>

          <div class="body">
            <div class="billing">
              <div class="bill-to">
                <h4>Bill To</h4>
                <div class="name">${data.customerName || 'N/A'}</div>
                <div class="contact">
                  ${data.customerEmail ? `<div>${data.customerEmail}</div>` : ''}
                  ${data.customerPhone ? `<div>${data.customerPhone}</div>` : ''}
                </div>
                <div class="properties">
                  <div class="property">Dorm: <strong>${data.dormName || 'N/A'}</strong></div>
                  <div class="property">Room: <strong>${data.roomNumber || 'N/A'}</strong> • ${data.roomType || ''}</div>
                </div>
              </div>

              <div class="right-summary">
                <div class="box">
                  <div style="font-size:12px;color:#6b7280">Move-in Date</div>
                  <div style="font-weight:700;margin-top:6px">${data.moveInDate || 'N/A'}</div>
                  <div style="font-size:12px;color:#6b7280;margin-top:10px">Duration</div>
                  <div style="font-weight:700;margin-top:6px">${data.stayDuration || 'Not specified'}</div>
                </div>
              </div>
            </div>

            <!-- Payment received summary (booking fee) -->
            <table class="items" style="margin-top:6px; border-bottom:0">
              <thead>
                <tr>
                  <th style="width:60%">Description</th>
                  <th style="width:20%">Type</th>
                  <th style="width:20%" class="text-right">Amount (฿)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Booking Fee (Reservation)</td>
                  <td>One-time</td>
                  <td class="text-right">${fmt(bookingFee)}</td>
                </tr>
                <tr class="total">
                  <td colspan="2" style="text-align:left"><strong>Total Paid</strong></td>
                  <td class="text-right"><strong>฿${fmt(bookingFee)}</strong></td>
                </tr>
              </tbody>
            </table>

            <!-- Upcoming payments / breakdown -->
            <table class="items" aria-describedby="items-desc" style="margin-top:14px">
              <thead>
                <tr>
                  <th style="width:60%">Description</th>
                  <th style="width:20%">Type</th>
                  <th style="width:20%" class="text-right">Amount (฿)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Room Price</td>
                  <td>Monthly</td>
                  <td class="text-right">${fmt(roomPrice)}</td>
                </tr>
                <tr>
                  <td>Booking Fee (Already Paid)</td>
                  <td>Deduction</td>
                  <td class="text-right" style="color:#10b981;">-${fmt(bookingFee)}</td>
                </tr>
                <tr>
                  <td>Dorm Insurance</td>
                  <td>One-time</td>
                  <td class="text-right">${fmt(insurance)}</td>
                </tr>
                <tr>
                  <td>Water Fees (Estimated)</td>
                  <td>Monthly</td>
                  <td class="text-right">~${fmt(water)}</td>
                </tr>
                <tr>
                  <td>Electricity Fees (Estimated)</td>
                  <td>Monthly</td>
                  <td class="text-right">~${fmt(electricity)}</td>
                </tr>
                <tr class="total">
                  <td colspan="2" style="text-align:left"><strong>Estimated First Month Total</strong></td>
                  <td class="text-right"><strong>฿${fmt(firstMonth)}</strong></td>
                </tr>
              </tbody>
            </table>

            <div class="notes">
              <strong>Notes:</strong>
              <p>Booking fee is non-refundable. Water and electricity fees are estimates and subject to actual usage.</p>
            </div>
          </div>

          <div class="footer">This invoice was generated electronically and is valid without a signature. Generated on ${data.invoiceDate}</div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const downloadInvoice = (data: InvoiceData): void => {
  const invoiceHTML = generateInvoiceHTML(data);

  // Create a hidden iframe, write the invoice HTML into it, then trigger print.
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.srcdoc = invoiceHTML;

  const removeIframe = () => {
    try {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    } catch (e) {
      // ignore
    }
  };

  iframe.onload = () => {
    try {
      // focus then print - user can choose Save as PDF in print dialog
      (iframe.contentWindow as Window)?.focus();
      setTimeout(() => {
        try {
          (iframe.contentWindow as Window).print();
        } catch (e) {
          console.warn('Printing invoice failed', e);
        }
        // remove after a short delay to allow print dialog to open
        setTimeout(removeIframe, 1000);
      }, 250);
    } catch (err) {
      console.warn('Invoice iframe print error', err);
      removeIframe();
    }
  };

  document.body.appendChild(iframe);
};