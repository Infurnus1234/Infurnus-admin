import { ProviderRequests } from "@/components/ProviderRequests";
import { FleetApplications } from "@/components/FleetApplications";
export default function Page() {
  return (
    <div className="workspace-section">
      <ProviderRequests />
      <FleetApplications />
    </div>
  );
}
