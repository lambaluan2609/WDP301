import { Logo } from "./logo"
import { SidebarRoutes } from "./sidebar-routes"

export const Sidebar = () => {
    return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
        <div className="flex flex-col w-full">
              <div className="p-6">
                                    <Logo></Logo>
                                </div>
            <SidebarRoutes/>
        </div>
    </div>
    
    )
}