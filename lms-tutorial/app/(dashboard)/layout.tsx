import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import Footer from "@/components/footer";

const DashboardLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Navbar cố định phía trên */}
       <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
    
      {/* Sidebar cố định bên trái */}     
         {/* Sidebar cố định bên trái */}
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      

      {/* Nội dung chính */}
      <div className="flex flex-col flex-grow pt-[80px] md:ml-56 bg-gray-50">
        <main className="flex-grow p-4">
          {children}
        </main>

        {/* Footer full width, có thể nằm đè lên sidebar */}
      </div>
      <div className="w-full h-10 relative z-50">
          <Footer />
        </div>
    </div>
  );
};

export default DashboardLayout;
