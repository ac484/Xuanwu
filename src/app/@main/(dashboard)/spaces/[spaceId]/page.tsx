
import { SpaceCapabilityRenderer } from '@/features/spaces/_components/shell/space-capability-renderer';

export default function Page() {
  // The layout file now handles the SpaceLayout wrapper and provides context.
  // This page component's only job is to render the correct capability.
  return (
    <SpaceCapabilityRenderer />
  );
}
