import { headers } from 'next/headers'

export async function POST(req) {
    const headersList = headers()
    const client_t = headersList.get('Authorization')
    const body = await req.json()

    console.log(body.pid)
    const pi = await fetch('https://api.minepi.com/v2/payments/'+body.pid+'/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key `+process.env.PI_API_KEY
      },
    })

    return new Response(null,{
        status: 200
      })
  }