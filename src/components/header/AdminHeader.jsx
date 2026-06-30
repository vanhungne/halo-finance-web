import { PanelLeftDashed, Bell, Calendar, Search } from 'lucide-react';
import { useSidebar } from "../ui/sidebar";

function AdminHeader() {
  const { toggle, activeLabel, activeIcon } = useSidebar();

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-black/10">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-2 h-16 flex items-center justify-between">

        <nav className="hidden md:block">
          <ul className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <li><div className="p-2 border-r border-black/30 border-dashed">
              <button
                onClick={toggle}
                className="w-full flex p-2 rounded-md hover:bg-black/10"
              >
                <PanelLeftDashed size={20} />
              </button>
            </div></li>
            <li><span>{activeIcon}</span></li>
            <li><span className='text-lg'>{activeLabel}</span></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default AdminHeader;