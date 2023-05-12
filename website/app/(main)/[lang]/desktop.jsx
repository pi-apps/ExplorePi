import Searchbar from "./component/searchbar";
import SideBar from "./component/sidebar";
import './style.css'
export default function DesktopLayout({children,lang}){
    return(
        <>
        <div className="w-screen h-screen overflow-hidden desktop-bg">
            <SideBar lang={lang}/>
            <div className="relative md:ml-64 h-screen">
                <Searchbar lang={lang}/>
                
                <div className="w-full h-full pb-[58px] overflow-scroll">
                {children}
                
                </div>
            </div>
        </div>
            
        </>
    )
}