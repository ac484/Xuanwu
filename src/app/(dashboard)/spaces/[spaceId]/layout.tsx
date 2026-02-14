import { ReactNode } from "react";

// This layout is required for the segment to have its own layout.
// It will render the content from the @main parallel route slot.
export default function SpaceDetailLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
