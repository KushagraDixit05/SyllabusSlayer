/**
 * PDF Export Utility
 * Generates professional study plan PDFs
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import type { PDFExportData } from '@/types/export';
import { formatDurationText } from './partitioning';

/**
 * Generate professional study plan PDF
 */
export function generateStudyPlanPDF(data: PDFExportData): void {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // ====== HEADER ======
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Study Plan', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  const titleLines = doc.splitTextToSize(data.playlistTitle, 170);
  doc.text(titleLines, 20, yPosition);
  yPosition += titleLines.length * 7 + 10;
  
  // ====== SUMMARY SECTION ======
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 20, yPosition);
  yPosition += 8;
  
  doc.setFont('helvetica', 'normal');
  const summaryData = [
    ['Total Duration', data.totalDuration],
    ['Video Count', data.videoCount.toString()],
    ['Playback Speed', `${data.speed}x`],
    ['Sessions', data.partitions.length.toString()],
  ];
  
  summaryData.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 25, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 75, yPosition);
    yPosition += 7;
  });
  
  yPosition += 5;
  
  // ====== PARTITIONS TABLE ======
  if (data.partitions.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Study Sessions', 20, yPosition);
    yPosition += 8;
    
    const partitionRows = data.partitions.map(p => [
      `Session ${p.sessionNumber}`,
      `${p.startVideoIndex + 1}-${p.endVideoIndex + 1}`,
      `${p.videos.length}`,
      formatDurationText(p.totalDuration),
      '☐',
    ]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Session', 'Videos', 'Count', 'Duration', 'Complete']],
      body: partitionRows,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246], // blue-600
        fontSize: 10,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      columnStyles: {
        4: { halign: 'center' },
      },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // ====== SCHEDULE SECTION ======
  if (data.schedule) {
    // Check if we need a new page
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Schedule', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const scheduleInfo = [
      `Start Date: ${format(data.schedule.startDate, 'MMM d, yyyy')}`,
      `End Date: ${format(data.schedule.endDate, 'MMM d, yyyy')}`,
      `Total Days: ${data.schedule.totalDays}`,
      `Study Days: ${data.schedule.studyDays}`,
      `Rest Days: ${data.schedule.restDays}`,
    ];
    
    scheduleInfo.forEach(info => {
      doc.text(info, 25, yPosition);
      yPosition += 6;
    });
    
    yPosition += 5;
    
    // Daily schedule table (first 30 days or all if less)
    const daysToShow = data.schedule.dailySchedule.slice(0, 30);
    const scheduleRows = daysToShow.map(day => [
      format(day.date, 'MMM d'),
      day.dayOfWeek.substring(0, 3),
      day.isRestDay ? 'Rest' : `${day.hoursAllocated.toFixed(1)}h`,
      day.sessionsScheduled.join(', ') || '-',
    ]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Date', 'Day', 'Hours', 'Sessions']],
      body: scheduleRows,
      theme: 'striped',
      headStyles: {
        fillColor: [139, 92, 246], // purple-600
        fontSize: 9,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 5;
    
    if (data.schedule.dailySchedule.length > 30) {
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`... and ${data.schedule.dailySchedule.length - 30} more days`, 25, yPosition);
      yPosition += 10;
    }
  }
  
  // ====== VIDEO LIST (if requested) ======
  if (data.includeVideos && data.videos && data.videos.length > 0) {
    doc.addPage();
    yPosition = 20;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Video List', 20, yPosition);
    yPosition += 8;
    
    const videoRows = data.videos.map((v, idx) => [
      (idx + 1).toString(),
      v.title.length > 60 ? v.title.substring(0, 57) + '...' : v.title,
      formatDurationText(v.duration),
    ]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'Title', 'Duration']],
      body: videoRows,
      theme: 'plain',
      headStyles: {
        fillColor: [243, 244, 246], // gray-100
        textColor: [0, 0, 0],
        fontSize: 9,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 140 },
        2: { cellWidth: 25, halign: 'right' },
      },
    });
  }
  
  // ====== FOOTER ======
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(128);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Generated by Syllabus Slayer on ${format(data.generatedDate, 'PPP')}`,
      20,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 40,
      doc.internal.pageSize.height - 10
    );
  }
  
  // ====== DOWNLOAD ======
  const filename = `study-plan-${data.playlistTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
  doc.save(filename);
}
