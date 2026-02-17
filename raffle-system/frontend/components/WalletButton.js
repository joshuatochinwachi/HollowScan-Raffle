import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
    { ssr: false } // This disables server-side rendering for this component
);

export default function WalletButton() {
    return (
        <div className="wallet-button-wrapper">
            <WalletMultiButton className="!bg-pokemon-blue hover:!bg-blue-700 !transition-colors !rounded-xl !font-bold" />
        </div>
    );
}
