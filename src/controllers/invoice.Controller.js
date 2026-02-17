import { pdfQueue } from '../queues/pdfQueue.js';
import { createInvoice, findInvoice } from '../services/invoice.service.js';

export const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.body;
    const { userId } = req.user;
    //1. create job using bullMQ for generate invoice
    await pdfQueue.add(
      'generateInvoice',
      { orderId, userId },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      }
    );
    //2. store invoice in DB
    await createInvoice({
      orderId,
      userId,
      pdf: `invoice-${orderId}.pdf`,
    });
    return res.success(200, 'Invoice generate successfully.');
  } catch (error) {
    console.log('GeneratePdf API Error:', error);
    return res.fail(500, 'Internal server error');
  }
};
export const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const invoice = await findInvoice(orderId);
    //1. checking is existing invoice
    if (!invoice) {
      return res.fail(404, 'Invoice not found.');
    }
    return res.success(200, 'Invoice download successfully.', invoice);
  } catch (error) {
    console.log('DownloadPdf API Error:', error);
    return res.fail(500, 'Internal server error');
  }
};
