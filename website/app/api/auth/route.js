import admin from "lib/database";
import { headers } from 'next/headers'

export async function GET() {
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
    const db = admin.firestore();
    const ref = db.collection('user').doc(data.username);
    const snapshot = await ref.get();
    if(!snapshot.exists){
      let lastcheck = Date.now() - 86400000
      console.log(lastcheck)
      ref.set({
        'lastcheck' : lastcheck,
        'watchlist' : [],
        'public_key' : '',
        'nodelist':[],
        'point':20,        
      })
    }
    return new Response(token, {
        status: 200
      })
  }