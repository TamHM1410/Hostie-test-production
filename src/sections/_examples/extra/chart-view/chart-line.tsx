// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = {
  series: {
    name: string;
    data: number[];
  }[];
};

export default function ChartLine({ series }: Props) {
  const chartOptions = useChart({
    xaxis: {
      categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9'],
    },
    tooltip: {
      x: {
        show: false,
      },
      marker: { show: false },
    },
  });

  return <Chart dir="ltr" type="line" series={series} options={chartOptions} height={320} />;
}
