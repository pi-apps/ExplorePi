'use client'
import { Sidebar } from "flowbite-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCubes,faHandshake,faPencil,faNetworkWired,faServer,faUsers,faCircleQuestion } from "@fortawesome/free-solid-svg-icons"
export default function SideBar(){

    return(
        <>
            <div className="md:h-full md:block hidden">
            <Sidebar aria-label="Sidebar with content separator example">
                <Sidebar.Items>
                <form className="group relative">
                    <svg width="20" height="20" fill="currentColor" className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500" aria-hidden="true">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                    </svg>
                    <input className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm" type="text" aria-label="Filter projects" placeholder="Block/TX/Account"/>
                </form>

                <Sidebar.ItemGroup>
                    <p className=" font-semibold uppercase">Explorer</p>
                    <Sidebar.Item href="#">
                    <FontAwesomeIcon icon={faCubes} />
                    <span className="ml-2">Block</span>
                    </Sidebar.Item>
                    <Sidebar.Item href="#">
                    <FontAwesomeIcon icon={faHandshake} />
                    <span className="ml-2">Transaction</span>
                    </Sidebar.Item>
                    <Sidebar.Item href="#">
                    <FontAwesomeIcon icon={faPencil} />
                    <span className="ml-2">Operation</span>
                    </Sidebar.Item>                    
                </Sidebar.ItemGroup>

                <Sidebar.ItemGroup>
                    <p className=" font-semibold uppercase">Dashboard</p>
                    <Sidebar.Item
                    href="#"
                    >
                    <FontAwesomeIcon icon={faNetworkWired} />
                    <span className="ml-2">Network</span>
                    </Sidebar.Item>
                    <Sidebar.Item
                    href="#"
                    >
                    <FontAwesomeIcon icon={faServer} />
                    <span className="ml-2">Migration</span>
                    </Sidebar.Item>
                    <Sidebar.Item
                    href="#"
                    >
                    <FontAwesomeIcon icon={faUsers} />
                    <span className="ml-2">Activity</span>
                    </Sidebar.Item>

                </Sidebar.ItemGroup>

                <Sidebar.ItemGroup>
                    <Sidebar.Item
                    href="#"
                    >
                    <FontAwesomeIcon icon={faCircleQuestion} />
                    <span className="ml-2">Help</span>
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
            </div>
        </>
    )
}