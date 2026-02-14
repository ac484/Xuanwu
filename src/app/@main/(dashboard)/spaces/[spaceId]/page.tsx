
import { SpaceLayout } from '@/features/spaces';
import { SpaceCapabilityRenderer } from '@/features/spaces/_components/shell/space-capability-renderer';

export default function Page({ params }: { params: { spaceId: string } }) {
  return (
    <SpaceLayout spaceId={params.spaceId}>
      <SpaceCapabilityRenderer />
    </SpaceLayout>
  );
}
