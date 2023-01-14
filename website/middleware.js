import { NextResponse,userAgent } from "next/server";

export function middleware(req){
    const {ua,device} = userAgent(req)
   if(ua.toLowerCase().includes("pibrowser") && device.type === 'mobile'){
        return NextResponse.rewrite(new URL('/pibrowser/explorer', req.url))
        
    }else{
        return NextResponse.next()
    }
}
export const config = {
    matcher: ['/'],
  }