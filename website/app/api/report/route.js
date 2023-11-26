import admin from "lib/database";

export async function POST(request) {
    const res = await request.json()
    const db = admin.firestore();
    const ref = db.collection('report').doc(res.account);
    const username = await res.username;
    let obj = {}
    const ref2 = db.collection('user').doc(res.username);
    const doc = await ref2.get();
    if(doc.token == res.token){
        obj[username] = {
            'reason':res.reason,
            'time': Date.now()
        }
        await ref.set(obj,{ merge: true })
        return new Response('Report!', {
            status: 200,
          })
    }else{
        return new Response(null, {
            status: 403,
          })
    }
    
  }