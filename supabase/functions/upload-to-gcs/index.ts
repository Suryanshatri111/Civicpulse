
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting Google Cloud Storage upload process')
    
    // Get the form data from the request
    const formData = await req.formData()
    const file = formData.get('file') as File
    const filename = formData.get('filename') as string

    if (!file) {
      throw new Error('No file provided')
    }

    console.log(`Processing file: ${file.name}, size: ${file.size} bytes`)

    // Get Google Cloud credentials from Supabase secrets
    const projectId = Deno.env.get('GOOGLE_CLOUD_PROJECT_ID')
    const keyFileContents = Deno.env.get('GOOGLE_CLOUD_KEY_FILE')
    const bucketName = Deno.env.get('GOOGLE_CLOUD_STORAGE_BUCKET')

    if (!projectId || !keyFileContents || !bucketName) {
      throw new Error('Missing Google Cloud configuration')
    }

    // Parse the service account key
    const keyFile = JSON.parse(keyFileContents)

    // Create JWT token for Google Cloud API authentication
    const now = Math.floor(Date.now() / 1000)
    const expiry = now + 3600 // 1 hour

    const header = {
      alg: 'RS256',
      typ: 'JWT'
    }

    const payload = {
      iss: keyFile.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: expiry
    }

    // Import the private key
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      new TextEncoder().encode(keyFile.private_key.replace(/\\n/g, '\n')),
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256'
      },
      false,
      ['sign']
    )

    // Create JWT
    const headerB64 = btoa(JSON.stringify(header))
    const payloadB64 = btoa(JSON.stringify(payload))
    const unsignedToken = `${headerB64}.${payloadB64}`
    
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      privateKey,
      new TextEncoder().encode(unsignedToken)
    )
    
    const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    const jwt = `${unsignedToken}.${signatureB64}`

    // Get access token from Google OAuth
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    console.log('Successfully obtained access token')

    // Upload file to Google Cloud Storage
    const fileBuffer = await file.arrayBuffer()
    const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${encodeURIComponent(filename)}`

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': file.type || 'application/octet-stream'
      },
      body: fileBuffer
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('Upload failed:', errorText)
      throw new Error(`Upload failed: ${uploadResponse.status}`)
    }

    const uploadResult = await uploadResponse.json()
    console.log('File uploaded successfully:', uploadResult.name)

    // Make the file publicly accessible
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`

    // Log the successful upload to Supabase for tracking
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabase.from('upload_logs').insert({
      filename: filename,
      file_size: file.size,
      file_type: file.type,
      upload_url: publicUrl,
      uploaded_at: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        filename: filename
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )

  } catch (error) {
    console.error('Error in upload-to-gcs function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})
