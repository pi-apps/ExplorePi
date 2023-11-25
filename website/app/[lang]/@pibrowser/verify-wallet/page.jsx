'use client'
import { BrowserContext } from "app/getuser"
import { useContext } from "react"

export default function Page({params:{lang}}){

    const pimode = useContext(BrowserContext)
    function onIncompletePaymentFound(payment) {
          fetch(
            '/api/incomplete',{
              method: 'POST',
              headers:{
                'Authorization': pimode.pimode.accessToken
              },
              body: JSON.stringify({pid: payment.identifier,txid:payment.transaction.txid})
            }
          ).then(()=>{
          })
          
      };

      const authcheck = () =>{
        const scopes = ['payments','username'];
        pimode.pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
            
            window.Pi.createPayment({
                // Amount of π to be paid:
                amount: 0.0000001,
                // An explanation of the payment - will be shown to the user:
                memo: "Verify Wallet", // e.g: "Digital kitten #1234",
                // An arbitrary developer-provided metadata object - for your own usage:
                metadata: {usage:'verify'}, // e.g: { kittenId: 1234 }
              }, {
                // Callbacks you need to implement - read more about those in the detailed docs linked below:
                onReadyForServerApproval: function(paymentId) { 
                  fetch(
                    '/api/approval',{
                      method: 'POST',
                      headers:{
                        'Authorization': auth.accessToken
                      },
                      body: JSON.stringify({pid: paymentId})
                    }
                  )
                 },
                onReadyForServerCompletion: async function(paymentId, txid) {
                  await fetch(
                    '/api/complete',{
                      method: 'POST',
                      headers:{
                        'Authorization': auth.accessToken
                      },
                      body: JSON.stringify({pid: paymentId,txid:txid})
                    }
                  )
                  window.Pi.openUrlInSystemBrowser('explorepi://explorepi.info')
                },
                onCancel: function(paymentId) { /* ... */ },
                onError: function(error, payment) { /* ... */ },
              })
          }).catch(function(error) {
            console.error('error');
          });
      }
      return(<>
        <div className=" h-screen w-screen overflow-y-hidden overflow-x-hidden pb-14 flex justify-center items-center">
            <div className=" h-10 w-1/2 bg-purple-600 text-slate-300 font-semibold text-lg rounded-lg items-center flex justify-center" onClick={authcheck}>Verify Wallet</div>
        </div>
    </>)
}