export interface ProcessedImageData {
  db_id: string;
  url: string;
  file_id?: string;
  fileName: string;
  supabaseFileName: string;
  old_filename: string;
}

export interface ImageData extends ProcessedImageData {
  messageId: string;
}

