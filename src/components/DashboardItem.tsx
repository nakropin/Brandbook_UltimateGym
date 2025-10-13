import Link from "next/link";

interface DashboardItemProps {
  children: React.ReactNode;
  icon: string;
  url: string;
}

export default function DashboardItem({
  children,
  icon,
  url,
}: DashboardItemProps) {
  return (
    <Link href={`${url}`}>
      <div className="bg-frontera_blue aspect-square w-full flex flex-col p-4">
        <div className="flex-1 flex justify-start text-7xl">{icon}</div>
        <div className="flex-1 flex items-center justify-center text-2xl text-white font-bold">
          {children}
        </div>
        <div className="flex-1 flex"></div>
      </div>
    </Link>
  );
}
