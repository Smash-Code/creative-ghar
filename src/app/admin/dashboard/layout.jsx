import Sidebar from "@/components/Sidebar";

export default function layout({children}){
    return(
        <div className="flex h-screen bg-gray-50" >
            <Sidebar/>
            {children}
        </div>
    )
}