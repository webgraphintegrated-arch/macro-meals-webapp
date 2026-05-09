export default function SiteFooter() {
  return (
    <footer className="relative z-40 border-t border-gray-200 bg-white/90 py-4 text-center backdrop-blur">
      <p className="text-xs font-semibold text-gray-600">
        Designed & Developed by{" "}
        <a
          href="https://webgraphintegrated.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-black text-[#060d57] hover:text-[#75a62f]"
        >
          Webgraph Integrated
        </a>
      </p>
    </footer>
  );
}