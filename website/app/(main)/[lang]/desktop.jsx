import Navbar from "./component/navbar";
import SideBar from "./component/sidebar";

export default function DesktopLayout({children}){
    return(
        <>
        <div className=" w-screen h-screen">
            <SideBar/>
            <div className="relative md:ml-64 bg-blueGray-100">
                <Navbar/>
                
                <div className="px-4 md:px-10 mx-auto w-full -m-24">
                {children}
                
                </div>
            </div>
        </div>
            
        </>
    )
}