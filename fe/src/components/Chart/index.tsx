import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

type ChartProps = {
    labels: string[]
    data: number[]
}

export default function Chart({ labels, data }: { labels: string[], data: number[] }) {
    // Chart.js에 필요한 데이터와 스타일을 설정합니다.
    const chartData = {
      labels, // x축 라벨: 주식 데이터의 시간값
      datasets: [
        {
          label: 'Stock Price', // 데이터 레이블
          data, // y축 데이터: 주식 가격
          borderColor: 'rgba(75, 192, 192, 1)', // 라인 색상
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // 채우기 색상
          tension: 0.1, // 곡선의 부드러움 정도
        },
      ],
    }
  
    const options = {
      responsive: true, // 반응형 차트
      plugins: {
        legend: { display: true }, // 차트 레이블 표시
        tooltip: { enabled: true }, // 툴팁 활성화
      },
    }
  
    const style = {
      width: '100%',
      height: '400px',
    }
  
    return (
      <div style={style}>
        <Line data={chartData} options={options} />
      </div>
    )
  }
  