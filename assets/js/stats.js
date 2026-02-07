document.addEventListener('DOMContentLoaded', function () {
  var stats = window.siteStats;
  if (!stats) return;

  var chartDefaults = {
    color: '#a4b1cd',
    borderColor: '#2a3a4e'
  };
  Chart.defaults.color = chartDefaults.color;
  Chart.defaults.borderColor = chartDefaults.borderColor;

  // Difficulty doughnut
  new Chart(document.getElementById('difficultyChart'), {
    type: 'doughnut',
    data: {
      labels: ['Easy', 'Medium', 'Hard', 'Insane'],
      datasets: [{
        data: [stats.difficulty.easy, stats.difficulty.medium, stats.difficulty.hard, stats.difficulty.insane],
        backgroundColor: ['#9fef00', '#ffab40', '#ff4444', '#b388ff'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16 } }
      }
    }
  });

  // OS doughnut
  new Chart(document.getElementById('osChart'), {
    type: 'doughnut',
    data: {
      labels: ['Linux', 'Windows'],
      datasets: [{
        data: [stats.os.linux, stats.os.windows],
        backgroundColor: ['#4fc3f7', '#ffab40'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16 } }
      }
    }
  });

  // Platform bar
  new Chart(document.getElementById('platformChart'), {
    type: 'bar',
    data: {
      labels: ['HackTheBox', 'TryHackMe'],
      datasets: [{
        data: [stats.platform.htb, stats.platform.thm],
        backgroundColor: ['#9fef00', '#ff4444'],
        borderRadius: 6,
        barPercentage: 0.5
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
          grid: { color: '#2a3a4e' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });

  // Progress timeline
  var sorted = stats.timeline.slice().sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });
  var cumulative = [];
  sorted.forEach(function (entry, i) {
    cumulative.push({ x: entry.date, y: i + 1 });
  });

  if (cumulative.length > 0) {
    new Chart(document.getElementById('timelineChart'), {
      type: 'line',
      data: {
        datasets: [{
          label: 'Boxes Completed',
          data: cumulative,
          borderColor: '#9fef00',
          backgroundColor: 'rgba(159,239,0,0.1)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#9fef00',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            type: 'time',
            time: { unit: 'week', displayFormats: { week: 'MMM dd' } },
            grid: { color: '#2a3a4e' }
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            grid: { color: '#2a3a4e' }
          }
        }
      }
    });
  }
});
