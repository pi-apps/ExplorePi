import admin from "lib/database";

export async function POST() {
    const res = await request.json()
    const db = admin.firestore();
    const ref = db.collection('report').doc(res.account);
    const username = await res.username;
    let obj = {}
    obj[username] = {
        'reason':res.reason,
        'time': Date.now()
    }
    await ref.set(obj,{ merge: true })
    return new Response('Report!', {
        status: 200,
      })
  }