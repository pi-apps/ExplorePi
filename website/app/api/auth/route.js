import admin from "lib/database";
import { headers } from 'next/headers'

export async function GET(requset) {
    const headersList = headers()
    const client_t = headersList.get('Authorization')
    
    const pi = await fetch('https://api.minepi.com/v2/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${client_t}`
      },
    })   
    const data = await pi.json()
    const username = await data.username
    const token = await admin.auth().createCustomToken(username)
    console.log(token)
    return new Response(token, {
        status: 200
      })
  }