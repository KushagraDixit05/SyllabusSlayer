/**
 * PDF Export Utility
 * Generates professional study plan PDFs
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import type { PDFExportData } from '@/types/export';
import { formatDurationText } from './partitioning';

// Colors
const COLORS = {
  primary: [99, 102, 241] as [number, number, number],     // indigo-500
  primaryDark: [79, 70, 229] as [number, number, number],  // indigo-600
  gray100: [243, 244, 246] as [number, number, number],
  gray200: [229, 231, 235] as [number, number, number],
  gray500: [107, 114, 128] as [number, number, number],
  gray700: [55, 65, 81] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

/**
 * Generate professional study plan PDF
 */
export function generateStudyPlanPDF(data: PDFExportData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let y = 0;
  
  // ====== HEADER WITH ACCENT BAR ======
  // Indigo accent bar at top
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 8, 'F');
  
  y = 25;
  
  // Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.gray700);
  doc.text('Study Plan', 20, y);
  
  // Generated date (right aligned)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray500);
  doc.text(format(data.generatedDate, 'MMM d, yyyy'), pageWidth - 20, y, { align: 'right' });
  
  y += 10;
  
  // Playlist title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray700);
  const titleLines = doc.splitTextToSize(data.playlistTitle, 170);
  doc.text(titleLines, 20, y);
  y += titleLines.length * 6 + 12;
  
  // ====== SUMMARY BOX ======
  const boxHeight = 32;
  doc.setFillColor(...COLORS.gray100);
  doc.roundedRect(20, y, pageWidth - 40, boxHeight, 3, 3, 'F');
  
  // Summary stats in horizontal layout
  const stats = [
    { label: 'Videos', value: data.videoCount.toString() },
    { label: 'Duration', value: data.totalDuration },
    { label: 'Speed', value: `${data.speed}×` },
    { label: 'Sessions', value: data.partitions.length.toString() },
  ];
  
  const statWidth = (pageWidth - 40) / stats.length;
  stats.forEach((stat, i) => {
    const x = 20 + statWidth * i + statWidth / 2;
    
    // Value
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primaryDark);
    doc.text(stat.value, x, y + 14, { align: 'center' });
    
    // Label
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray500);
    doc.text(stat.label, x, y + 24, { align: 'center' });
  });
  
  y += boxHeight + 15;
  
  // ====== STUDY SESSIONS TABLE ======
  if (data.partitions.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.gray700);
    doc.text('Study Sessions', 20, y);
    y += 8;
    
    const partitionRows = data.partitions.map((p, idx) => [
      `Session ${idx + 1}`,
      `Videos ${p.startVideoIndex + 1}–${p.endVideoIndex + 1}`,
      p.videos.length.toString(),
      formatDurationText(p.totalDuration),
      '☐',
    ]);
    
    autoTable(doc, {
      startY: y,
      head: [['Session', 'Range', 'Videos', 'Duration', '✓']],
      body: partitionRows,
      theme: 'plain',
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontSize: 9,
        fontStyle: 'bold',
        cellPadding: 5,
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 4,
      },
      alternateRowStyles: {
        fillColor: COLORS.gray100,
      },
      columnStyles: {
        0: { cellWidth: 35, fontStyle: 'bold' },
        1: { cellWidth: 45 },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 35, halign: 'right' },
        4: { cellWidth: 20, halign: 'center' },
      },
      margin: { left: 20, right: 20 },
    });
    
    y = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // ====== SCHEDULE SECTION ======
  if (data.schedule) {
    // Check if we need a new page
    if (y > 220) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.gray700);
    doc.text('Schedule Overview', 20, y);
    y += 10;
    
    // Schedule summary in compact format
    const scheduleStart = format(data.schedule.startDate, 'MMM d, yyyy');
    const scheduleEnd = format(data.schedule.endDate, 'MMM d, yyyy');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray500);
    doc.text(`${scheduleStart} → ${scheduleEnd}  •  ${data.schedule.studyDays} study days  •  ${data.schedule.restDays} rest days`, 20, y);
    y += 12;
    
    // Daily schedule table (compact, first 20 days)
    const daysToShow = data.schedule.dailySchedule.slice(0, 20);
    const scheduleRows = daysToShow.map(day => [
      format(day.date, 'MMM d'),
      day.dayOfWeek.substring(0, 3),
      day.isRestDay ? 'Rest' : `${day.hoursAllocated.toFixed(1)}h`,
      day.isRestDay ? '—' : (day.sessionsScheduled.join(', ') || '—'),
    ]);
    
    autoTable(doc, {
      startY: y,
      head: [['Date', 'Day', 'Hours', 'Sessions']],
      body: scheduleRows,
      theme: 'plain',
      headStyles: {
        fillColor: COLORS.gray200,
        textColor: COLORS.gray700,
        fontSize: 8,
        fontStyle: 'bold',
        cellPadding: 4,
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 60 },
      },
      margin: { left: 20, right: 20 },
    });
    
    y = (doc as any).lastAutoTable.finalY + 5;
    
    if (data.schedule.dailySchedule.length > 20) {
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.gray500);
      doc.text(`+ ${data.schedule.dailySchedule.length - 20} more days`, 20, y);
      y += 10;
    }
  }
  
  // ====== VIDEO LIST (compact) ======
  if (data.includeVideos && data.videos && data.videos.length > 0) {
    // Add new page for video list
    doc.addPage();
    y = 20;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.gray700);
    doc.text(`Video List (${data.videos.length} videos)`, 20, y);
    y += 8;
    
    // Show all videos in compact table
    const videoRows = data.videos.map((v, idx) => [
      (idx + 1).toString(),
      v.title.length > 55 ? v.title.substring(0, 52) + '...' : v.title,
      formatDurationText(v.duration),
    ]);
    
    autoTable(doc, {
      startY: y,
      head: [['#', 'Video Title', 'Length']],
      body: videoRows,
      theme: 'plain',
      headStyles: {
        fillColor: COLORS.gray100,
        textColor: COLORS.gray700,
        fontSize: 8,
        fontStyle: 'bold',
        cellPadding: 4,
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [252, 252, 252],
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 140 },
        2: { cellWidth: 22, halign: 'right' },
      },
      margin: { left: 20, right: 20 },
    });
  }
  
  // ====== FOOTER ON ALL PAGES ======
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    
    // Footer line
    doc.setDrawColor(...COLORS.gray200);
    doc.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);
    
    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray500);
    doc.text('Syllabus Slayer', 20, pageHeight - 8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 8, { align: 'right' });
  }
  
  // ====== DOWNLOAD ======
  const filename = `study-plan-${data.playlistTitle.replace(/[^a-z0-9]/gi, '-').substring(0, 30).toLowerCase()}.pdf`;
  doc.save(filename);
}
