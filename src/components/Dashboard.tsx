import DashboardItem from "./DashboardItem";
import brandbook from "@/brandbook.json";

export default function Dashboard() {
  return (
    <main className="grid grid-cols-5 gap-4 w-full flex-8">
      {brandbook.sections.slice(1).map((section) => (
        <DashboardItem key={section.id} icon={section.icon} url={section.url}>
          {section.title}
        </DashboardItem>
      ))}
    </main>
  );
}
