interface SuspenseLoadingProps {
    children: React.ReactNode;
    isLoading: boolean;
    fallback: React.ReactNode;
}

export function SuspenseLoading({children, isLoading, fallback}: SuspenseLoadingProps) {
    return isLoading ? fallback : children
}