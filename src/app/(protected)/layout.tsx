import ProtectedRoute from '@/components/protected-route';

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

export default async function ProtectedLayout({
    children,
}: ProtectedLayoutProps) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}
