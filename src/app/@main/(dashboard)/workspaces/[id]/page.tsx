
import { WorkspaceLayout } from '@/features/workspaces';
import { WorkspaceCapabilityRenderer } from '@/features/workspaces/_components/shell/workspace-capability-renderer';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <WorkspaceLayout workspaceId={params.id}>
      <WorkspaceCapabilityRenderer />
    </WorkspaceLayout>
  );
}
