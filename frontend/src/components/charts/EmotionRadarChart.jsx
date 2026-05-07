import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const EmotionRadarChart = ({ emotionDistribution }) => {
  const labels = emotionDistribution?.map(e => 
    e._id.charAt(0).toUpperCase() + e._id.slice(1)
  ) || []
  
  const scores = emotionDistribution?.map(e => e.avgScore) || []

  const data = {
    labels,
    datasets: [
      {
        label: 'Average Emotion Scores',
        data: scores,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 0.2
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Emotion Analysis
      </h3>
      <div style={{ height: '300px' }}>
        {emotionDistribution && emotionDistribution.length > 0 ? (
          <Radar data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No emotion data available
          </div>
        )}
      </div>
    </div>
  )
}

export default EmotionRadarChart
