// app/actions/uploadFile.ts

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file uploaded');
  }

  const fileName = formData.get('fileName') as string;
  if (!fileName) {
    throw new Error('No file name provided');
  }
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
  if (!apiKey) {
    throw new Error("Missing OpenAI API Key");
  }

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('purpose', 'vision');
    formDataToSend.append('file', file, fileName);

    const response = await fetch('https://api.openai.com/v1/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formDataToSend
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Error uploading file:', errorDetails);
      throw new Error('File upload failed');
    }

    const uploadedFile = await response.json();
    console.log("uploadresponse", uploadedFile);

    // Start polling for file status
    const fileId = uploadedFile.id;
    const fileStatus = await pollFileStatus(fileId, apiKey);

    return { file_id: fileId, status: fileStatus };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed');
  }
}

async function pollFileStatus(fileId: string, apiKey: string, maxAttempts = 100, interval = 1000): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await checkFileStatus(fileId, apiKey);
    if (status === 'processed') {
      console.log("file in process")

      return status;
    } else if (status === 'error') {
      console.log("error", status)

      throw new Error('File processing failed');
    }
    console.log("fileuploaded")
    // Wait before next attempt
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  throw new Error('Polling timed out');
}

async function checkFileStatus(fileId: string, apiKey: string): Promise<string> {
  const response = await fetch(`https://api.openai.com/v1/files/${fileId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to check file status');
  }

  const fileInfo = await response.json();
  console.log("fileInfo",response)
  return fileInfo.status;
}

export async function deleteFile(fileId: string) {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
  if (!apiKey) {
    throw new Error("Missing OpenAI API Key");
  }

  try {
    const response = await fetch(`https://api.openai.com/v1/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Error deleting file:', errorDetails);
      throw new Error('File deletion failed');
    }

    const deleteResponse = await response.json();
    console.log("deleteResponse", deleteResponse);

    return deleteResponse;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('File deletion failed');
  }
}

export async function getAllFiles() {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
  if (!apiKey) {
    throw new Error("Missing OpenAI API Key");
  }

  try {
    const response = await fetch('https://api.openai.com/v1/files', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Error fetching files:', errorDetails);
      throw new Error('Failed to fetch files');
    }

    const filesList = await response.json();
    console.log("filesList", filesList);

    return filesList;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw new Error('Failed to fetch files');
  }
}

export async function deleteVisionFiles() {
  try {
    const filesList = await getAllFiles();

    if (filesList && filesList.data && filesList.data.length > 0) {
      for (const file of filesList.data) {
        if (file.purpose === 'vision') {
          await deleteFile(file.id);
          console.log(`Deleted file with ID: ${file.id}`);
        }
      }
    }
  } catch (error) {
    console.error('Error deleting vision files:', error);
    throw new Error('Failed to delete vision files');
  }
}
