import { Menu } from "@headlessui/react";
import {
  ChartPieIcon,
  UserGroupIcon,
  TrophyIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 md:grid-cols-3 lg:grid-cols-4 p-4">
        {/* Team Performance Card */}
        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div className="inline-flex gap-2 self-end rounded bg-blue-100 p-1 text-blue-600">
            <ChartPieIcon className="h-5 w-5" />
            <span className="text-xs font-medium"> 85% Efficiency </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Team Performance
            </strong>
            <p>
              <span className="text-2xl font-medium text-gray-900">
                Excellent
              </span>
              <span className="text-xs text-gray-500">
                {" "}
                compared to last week
              </span>
            </p>
          </div>
        </article>

        {/* Top Players Card */}
        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
            <UserGroupIcon className="h-5 w-5" />
            <span className="text-xs font-medium"> 5 Star Players </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Top Players
            </strong>
            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                5 Players
              </span>
              <span className="text-xs text-gray-500"> boosted your rank</span>
            </p>
          </div>
        </article>

        {/* Total Matches Played Card */}
        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div className="inline-flex gap-2 self-end rounded bg-yellow-100 p-1 text-yellow-600">
            <TrophyIcon className="h-5 w-5" />
            <span className="text-xs font-medium"> 25 Matches </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Matches Played
            </strong>
            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                25 Matches
              </span>
              <span className="text-xs text-gray-500"> this season</span>
            </p>
          </div>
        </article>

        {/* League Points */}
        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <UserIcon className="h-5 w-5" />
            <span className="text-xs font-medium"> 320 Points </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              League Points
            </strong>
            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                320 Points
              </span>
              <span className="text-xs text-gray-500"> ranked #3</span>
            </p>
          </div>
        </article>

        {/* Chart Section */}
        <div className="flex flex-wrap justify-around bg-white rounded-lg py-8 col-span-full">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-gray-600 mb-2">
              Performance Chart
            </span>
            <div className="bg-blue-50 rounded-lg w-80 h-60 flex items-center justify-center">
              <p className="text-gray-500 text-sm">
                [Insert Chart Placeholder]
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-gray-600 mb-2">
              Top Scorers
            </span>
            <div className="bg-green-50 rounded-lg w-80 h-60 flex items-center justify-center">
              <p className="text-gray-500 text-sm">
                [Insert Doughnut Chart Placeholder]
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
