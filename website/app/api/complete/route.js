import admin from "lib/database";
import { headers } from 'next/headers'

export async function POST(req) {
  const body = await req.json()
  const headersList = headers()
  const auth = headersList.get('Authorization')
    let pid = body.pid,txid = body.txid
    const pi = await fetch('https://api.minepi.com/v2/payments/'+pid+'/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Key `+process.env.PI_API_KEY,
      },
      body:JSON.stringify({'txid':txid})
    })
    const piauth = await fetch('https://api.minepi.com/v2/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth}`
      },
    })
    const payment = await pi.json()
    const data = await piauth.json()
    const username = await data.username
    const from_address = payment.from_address

    const db = admin.firestore();
    const ref = db.collection('user').doc(username);
    ref.update({
      public_key:from_address
    })
    return new Response(null, {
        status: 200
      })
  }