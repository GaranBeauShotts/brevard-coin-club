import BackToHome from "@/components/BackToHome";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 text-white min-h-screen">
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold">
          About South Brevard Coin Club
        </h1>
        <BackToHome />
      </div>

      <p className="text-white/80 mb-8">
        Joining Brevard Coin Club connects you with collectors who bring decades
        of experience, knowledge, and fresh ideas to the table. Whether you're
        just getting started or have been collecting for years, you'll find a
        welcoming group eager to share insights and stories.
        <br /><br />
        Every dollar of membership dues stays within the club, directly
        supporting our activities and events. We host annual holiday gatherings,
        regular in-person meetings, educational lectures, and live member
        auctions where you can even have your own coins auctioned within the club.
        <br /><br />
        Members enjoy door prizes, engaging presentations, and a strong sense of
        community. Best of all, you can be involved as much or as little as you
        like — whether you simply attend meetings or take an active role in club
        activities.
      </p>

      {/* Membership Card */}
      <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6 mb-8">
        <div className="text-sm uppercase tracking-wide text-yellow-300">
          Membership
        </div>

        <div className="mt-2 text-3xl font-bold text-white">
          $30 <span className="text-lg font-medium text-white/70">/ year</span>
        </div>

        <p className="mt-3 text-sm text-white/80">
          Membership includes access to club meetings, special events,
          community classifieds, and updates throughout the year.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Benefits of Membership
        </h2>

        <ul className="space-y-3 text-white/80">
          <li>• Meet once a month with fellow numismatists</li>
          <li>
            • Education
            <ul className="ml-6 mt-2 space-y-1 text-white/70 text-sm">
              <li>◦ Guest speakers</li>
              <li>◦ Monthly book review</li>
              <li>◦ Library of books available for checkout</li>
            </ul>
          </li>
          <li>
            • Paid members can tabletop their coins for sale before each
            meeting (show & tell)
          </li>
          <li>• Participate in club coin auctions (buying & selling)</li>
          <li>• Win coins and coin-related items in raffles</li>
          <li>• Annual summer picnic</li>
          <li>• Pizza and movie night in July</li>
          <li>• Annual Christmas party with big coin raffle</li>
        </ul>
      </div>

      {/* Meeting Info */}
      <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6">
        <h2 className="text-xl font-semibold mb-3">
          Meeting Information
        </h2>

        <p className="text-white/80">
          Meets the <strong>1st Wednesday of each month</strong>
          <br />
          David R. Schechter Community Center
          <br />
          1089 South Patrick Drive
          <br />
          Satellite Beach, FL 32937
          <br /><br />
          Doors open at 6:30 PM — Meeting starts at 7:00 PM
        </p>
      </div>
    </main>
  );
}