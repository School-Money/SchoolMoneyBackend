import { Injectable } from "@nestjs/common";
import { Payment } from "src/schemas/Payment.schema";
import { Stream } from "stream";
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ReportService {
  generatePaymentsPDF(payments: Payment[]): Stream {
    const doc = new PDFDocument({ margin: 30, layout: 'landscape' });
    const fontSize = 10;
    const rowSize = 40;
    const startYPosition = 60;
    const startXPosition = 15;
    const pageYLimit = 550;

    doc
      .fontSize(fontSize * 2)
      .text('Payments Report', { align: 'center' })
      .moveDown();

    const headers = ['Collection ID', 'Parent ID', 'Child ID', 'Amount', 'Description', 'Created At'];
    const columnWidths = [120, 120, 120, 80, 200, 120];
    const startX = startXPosition;
    let yPosition = startYPosition;

    const drawRow = (row: string[], y: number) => {
      let x = startX;
      row.forEach((text, i) => {
        doc
          .fontSize(fontSize)
          .text(text, x + fontSize / 2, y + fontSize / 2, { width: columnWidths[i] - fontSize, align: 'left' }); // Text padding
        x += columnWidths[i];
      });

      doc
        .moveTo(startX, y)
        .lineTo(startX + columnWidths.reduce((a, b) => a + b), y)
        .stroke();
      doc
        .moveTo(startX, y + rowSize)
        .lineTo(startX + columnWidths.reduce((a, b) => a + b), y + rowSize)
        .stroke();
    };

    const drawVerticalLines = (y: number) => {
      let x = startX;
      columnWidths.forEach((width) => {
        doc
          .moveTo(x, y)
          .lineTo(x, y + rowSize)
          .stroke();
        x += width;
      });
      doc
        .moveTo(x, y)
        .lineTo(x, y + rowSize)
        .stroke();
    };

    doc.font('Helvetica-Bold');
    drawRow(headers, yPosition);
    drawVerticalLines(yPosition);
    yPosition += rowSize;

    doc.font('Helvetica');
    payments.forEach((payment) => {
      const row = [
        payment.collection.toString(),
        payment.parent.toString(),
        payment.child ? payment.child.toString() : 'N/A',
        payment.amount.toFixed(2),
        payment.description,
        payment.createdAt.toLocaleString(),
      ];
      drawRow(row, yPosition);
      drawVerticalLines(yPosition);
      yPosition += rowSize;

      if (yPosition > pageYLimit) {
        doc.addPage();
        yPosition = startYPosition / 2;
        drawRow(headers, yPosition);
        drawVerticalLines(yPosition);
        yPosition += rowSize;
      }
    });

    doc
      .moveTo(startX, yPosition)
      .lineTo(startX + columnWidths.reduce((a, b) => a + b), yPosition)
      .stroke();

    doc.end();
    return doc;
  }
}
