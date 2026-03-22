import { useEffect } from 'react';
import styles from './Charts.module.css';
import API_BASE_URL from '../../config';

export default function Charts() {

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.onload = () => {
      window.google.charts.load('current', { packages: ['corechart'] });
      window.google.charts.setOnLoadCallback(drawCharts);
    };
    document.head.appendChild(script);
  }, []);

  const drawCharts = async () => {
    await drawBookingsPerClass();
    await drawBookingsByStatus();
  };

  const drawBookingsPerClass = async () => {
    const res = await fetch(`${API_BASE_URL}/api/charts/bookingsPerClass`);
    const data = await res.json();

    const dataTable = new window.google.visualization.DataTable();
    dataTable.addColumn('string', 'Заняття');
    dataTable.addColumn('number', 'Записів');

    data.forEach(item => {
      dataTable.addRow([item.className, item.count]);
    });

    const options = {
      title: 'Кількість записів на заняття',
      width: '100%',
      height: 400,
      legend: { position: 'none' },
      colors: ['#593837'],
      bar: { groupWidth: '60%' },
    };

    const chart = new window.google.visualization.ColumnChart(
      document.getElementById('bookingsPerClassChart')
    );
    chart.draw(dataTable, options);
  };

  const drawBookingsByStatus = async () => {
    const res = await fetch(`${API_BASE_URL}/api/charts/bookingsByStatus`);
    const data = await res.json();

    const dataTable = new window.google.visualization.DataTable();
    dataTable.addColumn('string', 'Статус');
    dataTable.addColumn('number', 'Кількість');

    data.forEach(item => {
      dataTable.addRow([item.status, item.count]);
    });

    const options = {
      title: 'Записи за статусом',
      width: '100%',
      height: 400,
      colors: ['#f39c12', '#2ecc71', '#e74c3c', '#3498db'],
    };

    const chart = new window.google.visualization.PieChart(
      document.getElementById('bookingsByStatusChart')
    );
    chart.draw(dataTable, options);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Статистика</h1>
        <div className={styles.grid}>
          <div className={styles.chartCard}>
            <div id="bookingsPerClassChart" />
          </div>
          <div className={styles.chartCard}>
            <div id="bookingsByStatusChart" />
          </div>
        </div>
      </div>
    </div>
  );
}