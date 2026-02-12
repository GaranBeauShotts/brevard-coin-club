import BackToHome from "@/components/BackToHome";

export default function PrivacyPage() {
    return (
        <main className="mx-auto max-w-3xl p-6 text-white">


            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <h1 className="text-3xl font-bold">
                    Privacy Policy
                </h1>

                <BackToHome />
            </div>


            <p className="mb-4">
                Brevard Coin Club respects your privacy. This website does not sell or share
                personal information with third parties.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">
                Information We Collect
            </h2>
            <p className="mb-4">
                We may collect basic information submitted through forms such as name,
                email address, or coin details for valuation purposes.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">
                How We Use Information
            </h2>
            <p className="mb-4">
                Information is used solely to provide requested services, improve the
                website experience, and respond to inquiries.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">
                Third-Party Services
            </h2>
            <p className="mb-4">
                This site may query third-party marketplaces (such as eBay) for public
                market data. We do not control third-party content or policies.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
            <p>
                If you have questions about this Privacy Policy, please contact us via
                the Contact page.
            </p>
        </main>
    );
}
