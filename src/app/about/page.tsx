import BackToHome from "@/components/BackToHome";

export default function AboutPage() {
    return (
        <main className="mx-auto max-w-3xl p-6 text-white">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <h1 className="text-3xl font-bold">About South Brevard Coin Club</h1>
                <BackToHome />
            </div>

            <p className="text-white/80 mb-6">
                Joining Brevard Coin Club connects you with collectors who bring decades of experience, knowledge, and fresh ideas to the table. Whether you're just getting started or have been collecting for years, you'll find a welcoming group eager to share insights and stories.

                Every dollar of membership dues stays within the club, directly supporting our activities and events. We host annual holiday gatherings, regular in-person meetings, educational lectures, and live member auctions where you can even have your own coins auctioned within the club.

                Members enjoy door prizes, engaging presentations, and a strong sense of community. Best of all, you can be involved as much or as little as you like — whether you simply attend meetings or take an active role in club activities.
            </p>

            <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">
                <div className="text-sm uppercase tracking-wide text-yellow-300">
                    Membership
                </div>

                <div className="mt-2 text-3xl font-bold text-white">
                    $30 <span className="text-lg font-medium text-white/70">/ year</span>
                </div>

                <p className="mt-3 text-sm text-white/80">
                    Membership includes access to club meetings, special events, community classifieds,
                    and updates throughout the year.
                </p>
            </div>
        </main>
    );
}
