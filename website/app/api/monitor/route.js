import admin from "lib/database";

export async function POST(request) {
    const res = await request.json()
    const db = admin.firestore();
    const ref = db.collection('user').doc(res.username);
    const doc = await ref.get();
    console.log(`${res.username}+${doc.token}+${res.token}+${res.ip}`)
    if(doc.token == res.token){
        await ref.update(
            {
                nodelist:FieldValue.arrayUnion(res.ip)
            }
        )
        const check = await db.collection('monitor').doc(res.ip).get();
            if(!check.exists){
                await db.collection('monitor').doc(res.ip).set({
                    status:true,
                    type:1
                });
            }else if(!check.status){
                await db.collection('monitor').doc(res.ip).update({
                    status:true
                });
            }
        return new Response('Complete!', {
            status: 200,
          })
    }else{
        return new Response(null, {
            status: 403,
          })
    }    
  }