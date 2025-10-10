"use client";

import { tripAnalytics } from "@/app/actions/trip-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TripAnalyticsResponse } from "@/interfaces/openapi";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import { useEffect, useState } from "react";
import DialogLoader from "@/app/_components/layout/dialog-loader";

export default function RightSectionCards() {
  const router = useRouter();
  const [userTripAnalytics, setUserTripAnalytics] = useState<TripAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await tripAnalytics();
        setUserTripAnalytics(data);
        // if(data.success){
        //   console.log("insiode success")
        //   console.log(data.trip_details)
        //   setUserTripAnalytics(data.trip_details);
        // }
      } catch (err) {
        console.error(err);
        setUserTripAnalytics({ success: false } as TripAnalyticsResponse);
      } finally {
        console.log(userTripAnalytics)
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <DialogLoader />;

  if (!userTripAnalytics?.success) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500 font-medium">
        Something went wrong
      </div>
    );
  }


  // Use data or fallback if empty
  const hasStatusData = userTripAnalytics?.trip_details?.total_trips > 0;
  const hasChartData = userTripAnalytics?.trip_details?.trip_spends?.length > 0;

  const data = hasStatusData
    ? userTripAnalytics?.trip_details?.status_count
    : [{ name: "No Data", value: 1, color: "#D1D5DB" }]; // gray Pie

  const chartData = hasChartData
    ? userTripAnalytics?.trip_details?.trip_spends
    : Array.from({ length: 6 }, (_, i) => ({ month: `M${i + 1}`, spend: 0 })); // black Bar

  const total_trips = userTripAnalytics?.trip_details?.total_trips || 0;

  return (
    <>
      <div className="flex flex-wrap">
        <Card className="p-4 bg-white shadow-md rounded-2xl text-black w-[40%] m-8">
          <CardHeader className="mb-4">
            <CardTitle>Trip Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6 text-black">
            {/* Circular Chart */}
            <div className="w-60 h-60 text-black">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={2}
                    startAngle={90}
                    endAngle={-280}
                    label={({ cx, cy }) => (
                      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                        {total_trips ? <> Total Trips
                          <tspan x={cx} dy="1.2em">{total_trips}</tspan></> : <> No Trip</>}
                       
                      </text>
                    )}
                  >
                    {data.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2">
              {total_trips ? data.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">
                    {item.name} ({item.value})
                  </span>
                </div>
              )) : <Button
              className="flex items-center gap-2 rounded-xl bg-[#5A2D82] hover:bg-purple-800 text-white"
              onClick={() => router.push("/destinations")}
            >
              Explore New Adventures!
            </Button>}
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-white shadow-md rounded-2xl text-black w-[51%] m-8">
          <CardHeader className="mb-4">
            <CardTitle>Active Trips</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <div className="text-center text-gray-500">No Active Trips</div>
            <Button
              className="flex items-center gap-2 rounded-xl bg-[#5A2D82] hover:bg-purple-800 text-white"
              onClick={() => router.push("/create-trip")}
            >
              Plan Your Next Trip
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-md text-black m-8">
        <CardHeader>
          <CardTitle>Travel Spends</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="spend"
                fill={hasChartData ? "#520669" : "#000000"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
