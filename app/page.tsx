export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#060d57]">
      
      <section className="flex flex-col items-center justify-center px-6 py-16 text-center">
        
        <img
          src="/logo.png"
          alt="Macro Meals On Wheels"
          className="w-64 mb-8"
        />

        <h1 className="text-5xl md:text-7xl font-black leading-tight">
          FUEL YOUR
          <br />
          BODY
        </h1>

        <p className="mt-6 text-xl text-[#6ea52f] font-semibold">
          Healthy Meals Made Simple
        </p>

        <div className="mt-10 flex flex-col md:flex-row gap-4">
          
          <button className="bg-[#060d57] text-white px-8 py-4 rounded-2xl font-bold text-lg">
            ORDER NOW
          </button>

          <button className="border-2 border-[#060d57] px-8 py-4 rounded-2xl font-bold text-lg">
            VIEW MENU
          </button>

        </div>

      </section>

    </main>
  );
}