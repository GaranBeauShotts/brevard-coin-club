import BackToHome from "@/components/BackToHome";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 text-white">
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold">
          Terms of Service
        </h1>

        <BackToHome />
      </div>

      <p className="mb-4">
        The Coin Value Helper provides market estimates for informational purposes only.
        Values are not guarantees of sale price.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        No Financial Advice
      </h2>
      <p className="mb-4">
        All valuation data is provided as general information and should not be
        considered financial, legal, or investment advice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Limitation of Liability
      </h2>
      <p>
        Brevard Coin Club is not responsible for losses, grading outcomes,
        marketplace disputes, or third-party pricing data.
      </p>
    </main>
  );
}
