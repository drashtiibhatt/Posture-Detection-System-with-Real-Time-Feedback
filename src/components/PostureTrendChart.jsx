import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const PostureTrendChart = ({ sessions }) => {
  const labels = sessions.map(session => new Date(session.date).toLocaleString());

  const uprightCounts = [], slouchCounts = [], armsFoldedCounts = [], legsCrossedCounts = [];

  sessions.forEach(session => {
    let u = 0, s = 0, a = 0, l = 0;
    (session.feedback || []).forEach(fb => {
      const status = fb?.status || "";
      if (status.includes("Upright")) u++;
      if (status.includes("Slouch")) s++;
      if (status.includes("Arms Folded")) a++;
      if (status.includes("Legs Crossed")) l++;
    });
    
    uprightCounts.push(u);
    slouchCounts.push(s);
    armsFoldedCounts.push(a);
    legsCrossedCounts.push(l);
  });

  const lineBarData = {
    labels,
    datasets: [
      { label: 'Upright', data: uprightCounts, backgroundColor: 'rgba(75, 192, 192, 0.6)' },
      { label: 'Slouching', data: slouchCounts, backgroundColor: 'rgba(255, 99, 132, 0.6)' },
      { label: 'Arms Folded', data: armsFoldedCounts, backgroundColor: 'rgba(255, 206, 86, 0.6)' },
      { label: 'Legs Crossed', data: legsCrossedCounts, backgroundColor: 'rgba(153, 102, 255, 0.6)' }
    ]
  };

  const pieData = {
    labels: ['Upright', 'Slouching', 'Arms Folded', 'Legs Crossed'],
    datasets: [{
      data: [
        uprightCounts.reduce((a, b) => a + b, 0),
        slouchCounts.reduce((a, b) => a + b, 0),
        armsFoldedCounts.reduce((a, b) => a + b, 0),
        legsCrossedCounts.reduce((a, b) => a + b, 0)
      ],
      backgroundColor: ['#4bc0c0', '#ff6384', '#ffce56', '#9966ff']
    }]
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2>📊 Feedback Over Time</h2>
      <Line data={lineBarData} />
      <h2 style={{ marginTop: '50px' }}>📈 Bar Comparison</h2>
      <Bar data={lineBarData} />
      <h2 style={{ marginTop: '50px' }}>🍰 Overall Distribution</h2>
      <Pie data={pieData} />
    </div>
  );
};

export default PostureTrendChart;
