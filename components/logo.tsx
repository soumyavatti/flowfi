import Image from "next/image";

export default function Logo() {
  return (
    <div className="rounded-xl bg-white/10 backdrop-blur-md  border border-white/20 shadow-lg hover:scale-105 transition-transform">
      <Image
        src="/images/logo.png"
        alt="Lowkey Lofi"
        width={160}
        height={60}
        className="w-28 md:w-32 rounded-xl"
        style={{ background: "transparent" }}
      />
    </div>
  );
}
