import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  async exportTableAsPDF(tableData: any[], filename = 'table.pdf') {
    const doc = new jsPDF('l', 'mm', 'a4');

    const data = tableData.map(item => [
      item.description,
      item.serialNumber,
      new Date(item.dateReceived).toISOString().split('T')[0],
      item.remarks
    ]);

    const title = 'Stock In'
    const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
    const pageWidth = doc.internal.pageSize.getWidth();
    const xPos = (pageWidth - titleWidth) / 2;

    doc.setFontSize(14);
    doc.text(title, xPos, 20);

    autoTable(doc, {
      head: [['Item', 'Serial Number', 'Date', 'Remarks']],
      body: data,
      theme: 'grid',
      margin: { top: 25 }
    })

    doc.save(filename);
  }
}
