import { Worker } from 'bullmq';
import { connectRedis } from '../../config/redisConfig.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const invoiceFolder = path.join(__dirname, '../public/invoice');
if (!fs.existsSync(invoiceFolder)) {
  fs.mkdirSync(invoiceFolder, { recursive: true });
}
//also use "Puppeteer" package for generate pdf to bind html,css

const worker = new Worker(
  'pdfQueue',
  async (job) => {
    if (job.name == 'generateInvoice') {
      const { orderId, userId } = job.data;
      const doc = new PDFDocument();
      const filePath = `${invoiceFolder}/invoice-${orderId}.pdf`;
      doc.pipe(fs.createWriteStream(filePath));
      doc.fontSize(20).text('Invoice', { align: 'center' });
      doc.moveDown();
      doc.text(`Order ID: ${orderId}`);
      doc.text(`User ID: ${userId}`);
      doc.text(`Generated At: ${new Date().toISOString()}`);

      doc.end();

      console.log('PDF generated:', filePath);
    }
  },
  { connection: connectRedis }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.log('Job failed:', err);
});
