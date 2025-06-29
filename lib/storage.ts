import { supabase } from './supabase';

export interface PrintData {
  id: string;
  url: string;
  filename: string;
  uploaded_at: string; // ISO string for Supabase timestamp
  category?: string;
  metadata?: {
    width: number;
    height: number;
    size: number;
    type: string;
  };
}

const PRINTS_BUCKET = 'prints';
const PRINTS_TABLE = 'prints';

export async function uploadPrint(file: File): Promise<string> {
  console.log(`[uploadPrint] Starting upload for file: ${file.name}, type: ${file.type}, size: ${file.size}`);

  if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
    console.error(`[uploadPrint] Invalid file type: ${file.type}`);
    throw new Error('Only image files and PDFs are supported');
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    console.error(`[uploadPrint] File size exceeds limit: ${file.size} bytes`);
    throw new Error('File size must be less than 10MB');
  }

  const filePath = `${Date.now()}-${file.name}`;
  console.log(`[uploadPrint] Generated filePath: ${filePath}`);

  // Upload file to Supabase Storage
  console.log(`[uploadPrint] Attempting to upload to Supabase Storage bucket: ${PRINTS_BUCKET}`);
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(PRINTS_BUCKET)
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    console.error(`[uploadPrint] Failed to upload file to storage: ${uploadError.message}`, uploadError);
    throw new Error(`Failed to upload file: ${uploadError.message}`);
  }
  console.log(`[uploadPrint] File uploaded to storage successfully:`, uploadData);

  // Get public URL
  console.log(`[uploadPrint] Attempting to get public URL for filePath: ${filePath}`);
  const { data: publicUrlData } = supabase.storage
    .from(PRINTS_BUCKET)
    .getPublicUrl(filePath);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    console.error(`[uploadPrint] Failed to get public URL after upload. publicUrlData:`, publicUrlData);
    throw new Error('Failed to get public URL after upload.');
  }
  const publicUrl = publicUrlData.publicUrl;
  console.log(`[uploadPrint] Public URL obtained: ${publicUrl}`);

  // Insert print metadata into PostgreSQL
  console.log(`[uploadPrint] Attempting to insert print metadata into table: ${PRINTS_TABLE}`);
  const { data: insertData, error: insertError } = await supabase
    .from(PRINTS_TABLE)
    .insert({
      url: publicUrl,
      filename: file.name,
      uploaded_at: new Date().toISOString(),
      metadata: {
        size: file.size,
        type: file.type,
        // width and height would be extracted here for images if needed
      },
    })
    .select();

  if (insertError) {
    console.error(`[uploadPrint] Failed to save print metadata to DB: ${insertError.message}`, insertError);
    // If DB insert fails, try to delete the uploaded file from storage
    console.log(`[uploadPrint] Attempting to remove file from storage due to DB insert failure: ${filePath}`);
    const { error: removeError } = await supabase.storage.from(PRINTS_BUCKET).remove([filePath]);
    if (removeError) {
      console.error(`[uploadPrint] Failed to remove file from storage after DB insert failure: ${removeError.message}`, removeError);
    } else {
      console.log(`[uploadPrint] File successfully removed from storage: ${filePath}`);
    }
    throw new Error(`Failed to save print metadata: ${insertError.message}`);
  }
  console.log(`[uploadPrint] Print metadata inserted successfully:`, insertData);

  return publicUrl;
}

export async function getAllPrints(): Promise<PrintData[]> {
  const { data, error } = await supabase
    .from(PRINTS_TABLE)
    .select('id, url, filename, uploaded_at, category, metadata')
    .order('uploaded_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch prints: ${error.message}`);
  }

  return data as PrintData[];
}

export async function getPrintById(id: string): Promise<PrintData | null> {
  const { data, error } = await supabase
    .from(PRINTS_TABLE)
    .select('id, url, filename, uploaded_at, category, metadata')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows found
      return null;
    }
    throw new Error(`Failed to fetch print by ID: ${error.message}`);
  }

  return data as PrintData;
}

export async function deletePrint(id: string): Promise<boolean> {
  // First, get the print data to find the file path in storage
  const { data: printData, error: fetchError } = await supabase
    .from(PRINTS_TABLE)
    .select('filename, url')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch print for deletion: ${fetchError.message}`);
  }

  if (!printData) {
    return false; // Print not found
  }

  // Extract file path from URL (assuming a simple path structure)
  const urlParts = printData.url.split('/');
  const filePath = urlParts[urlParts.length - 1];

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(PRINTS_BUCKET)
    .remove([filePath]);

  if (storageError) {
    console.warn(`Failed to delete file from storage: ${storageError.message}`);
    // Continue to delete from DB even if storage deletion fails
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from(PRINTS_TABLE)
    .delete()
    .eq('id', id);

  if (dbError) {
    throw new Error(`Failed to delete print from database: ${dbError.message}`);
  }

  return true;
}

export async function updatePrintCategory(id: string, category: string): Promise<boolean> {
  const { data, error } = await supabase
    .from(PRINTS_TABLE)
    .update({ category: category })
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(`Failed to update print category: ${error.message}`);
  }

  return data !== null && data.length > 0;
}

export async function uploadMultiplePrints(files: File[]): Promise<string[]> {
  console.log(`[uploadMultiplePrints] Starting batch upload for ${files.length} files.`);
  const uploadPromises = files.map(file => uploadPrint(file));
  const results = await Promise.allSettled(uploadPromises);

  const successfulUrls: string[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`[uploadMultiplePrints] File ${files[index].name} uploaded successfully. URL: ${result.value}`);
      successfulUrls.push(result.value);
    } else {
      console.error(`[uploadMultiplePrints] File ${files[index].name} failed to upload. Reason:`, result.reason);
    }
  });

  console.log(`[uploadMultiplePrints] Batch upload finished. Successfully uploaded ${successfulUrls.length} of ${files.length} files.`);
  return successfulUrls;
}
