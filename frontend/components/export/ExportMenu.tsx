'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/store/usePlannerStore';
import { generateStudyPlanPDF } from '@/lib/pdfExport';
import { generatePartitionCSV, generateScheduleCSV } from '@/lib/csvExport';
import { encodePlaylistState, generateShareableURL } from '@/lib/shareableLink';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Download, FileText, Share2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export function ExportMenu() {
  const store = usePlannerStore();
  const { playlistTitle, videos, partitions, schedule } = store;
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handlePDFExport = () => {
    try {
      const totalDurationSeconds = videos.reduce((sum, v) => sum + v.duration, 0);
      const hours = Math.floor(totalDurationSeconds / 3600);
      const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
      const formattedDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      
      generateStudyPlanPDF({
        playlistTitle: playlistTitle || 'Study Plan',
        totalDuration: formattedDuration,
        videoCount: videos.length,
        speed: store.currentSpeed,
        partitions,
        schedule: schedule || undefined,
        generatedDate: new Date(),
        includeVideos: true,
        videos,
      });
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error('Failed to export PDF');
      console.error(error);
    }
  };

  const handlePartitionCSV = () => {
    try {
      const csv = generatePartitionCSV(partitions);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${playlistTitle || 'study-plan'}-partitions.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Partition CSV exported!');
    } catch (error) {
      toast.error('Failed to export CSV');
      console.error(error);
    }
  };

  const handleScheduleCSV = () => {
    if (!schedule) {
      toast.error('No schedule available');
      return;
    }

    try {
      const csv = generateScheduleCSV(schedule);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${playlistTitle || 'study-plan'}-schedule.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Schedule CSV exported!');
    } catch (error) {
      toast.error('Failed to export CSV');
      console.error(error);
    }
  };

  const handleShare = () => {
    try {
      const encoded = encodePlaylistState({
        playlistTitle: playlistTitle || 'Untitled Playlist',
        videos,
        partitions,
        schedule: schedule || undefined,
        currentSpeed: store.currentSpeed,
      });
      
      const url = generateShareableURL(encoded);
      setShareUrl(url);
      setShareDialogOpen(true);
      toast.success('Shareable link generated!');
    } catch (error) {
      toast.error('Failed to generate share link');
      console.error(error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export & Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handlePDFExport}>
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handlePartitionCSV} disabled={partitions.length === 0}>
            <FileText className="h-4 w-4 mr-2" />
            Export Partitions (CSV)
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleScheduleCSV} disabled={!schedule}>
            <FileText className="h-4 w-4 mr-2" />
            Export Schedule (CSV)
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Study Plan</DialogTitle>
            <DialogDescription>
              Anyone with this link can view your study plan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={handleCopyLink} size="sm">
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              This link contains your playlist data encoded in the URL. No server storage required!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
