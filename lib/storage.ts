// Storage wrapper for FamiPrint
// This provides a unified interface for file uploads

export interface PrintData {
  id: string;
  url: string;
  filename: string;
  uploadedAt: Date;
  category?: string;
  metadata?: {
    width: number;
    height: number;
    size: number;
    type: string;
  };
}

// Mock storage implementation
// In production, this would integrate with cloud storage (AWS S3, Vercel Blob, etc.)
class MockStorage {
  private prints: PrintData[] = [];

  async uploadPrint(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      // Simulate upload delay
      setTimeout(() => {
        try {
          // Create mock URL
          const url = URL.createObjectURL(file);
          
          // Create print data
          const printData: PrintData = {
            id: `print_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            url,
            filename: file.name,
            uploadedAt: new Date(),
            metadata: {
              width: 0, // Would be populated from image analysis
              height: 0,
              size: file.size,
              type: file.type,
            },
          };
          
          // Store in mock database
          this.prints.push(printData);
          
          resolve(url);
        } catch (error) {
          reject(error);
        }
      }, 1000 + Math.random() * 2000); // 1-3 second delay
    });
  }

  async getAllPrints(): Promise<PrintData[]> {
    return [...this.prints];
  }

  async getPrintById(id: string): Promise<PrintData | null> {
    return this.prints.find(print => print.id === id) || null;
  }

  async deletePrint(id: string): Promise<boolean> {
    const index = this.prints.findIndex(print => print.id === id);
    if (index !== -1) {
      this.prints.splice(index, 1);
      return true;
    }
    return false;
  }

  async updatePrintCategory(id: string, category: string): Promise<boolean> {
    const print = this.prints.find(p => p.id === id);
    if (print) {
      print.category = category;
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const storage = new MockStorage();

// Main upload function
export async function uploadPrint(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are supported');
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    throw new Error('File size must be less than 10MB');
  }

  return await storage.uploadPrint(file);
}

// Helper functions
export async function uploadMultiplePrints(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadPrint(file));
  return await Promise.all(uploadPromises);
}

export async function getAllPrints(): Promise<PrintData[]> {
  return await storage.getAllPrints();
}

export async function getPrintById(id: string): Promise<PrintData | null> {
  return await storage.getPrintById(id);
}

export async function deletePrint(id: string): Promise<boolean> {
  return await storage.deletePrint(id);
}

export async function updatePrintCategory(id: string, category: string): Promise<boolean> {
  return await storage.updatePrintCategory(id, category);
}