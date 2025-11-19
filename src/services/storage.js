import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabase = createClient('your_project_url', 'your_supabase_api_key')

// Upload file using standard upload
async function uploadFile(file) {
  const { data, error } = await supabase
    .storage
    .from('vinos')
    .upload('file_path', file)

  if (error) {
    console.log('[storage.js uploadFile] Error mostrando imagen', error)
  } else {
    // Handle success
  }
}
