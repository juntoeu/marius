'use client';

import { useEffect, useState } from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

interface DimensionData {
  dimension: string;
  score: number;
  fullMark: number;
}

interface RadarChartProps {
  data: DimensionData[];
}

export default function RadarChart({ data }: RadarChartProps) {
  const [animatedData, setAnimatedData] = useState<DimensionData[]>(
    data.map((d) => ({ ...d, score: 0 }))
  );

  useEffect(() => {
    // Animate data from 0 to actual values
    const timer = setTimeout(() => {
      setAnimatedData(data);
    }, 100);
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={animatedData}>
          <PolarGrid stroke="var(--card-border)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: 'var(--foreground-light)', fontSize: 12 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fill: 'var(--foreground-light)', fontSize: 10 }}
            tickCount={6}
            axisLine={false}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="var(--teal)"
            fill="var(--teal)"
            fillOpacity={0.4}
            strokeWidth={2}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
