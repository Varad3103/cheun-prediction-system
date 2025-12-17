const chartColors = {
    electricBlue: '#00D9FF',
    hotPink: '#FF1493',
    neonGreen: '#39FF14',
    brightOrange: '#FF6B35',
    deepPurple: '#9D00FF',
    cyberYellow: '#FFD700',
    danger: '#FF0040',
    success: '#00FF87',
    gradient1: ['#00D9FF', '#FF1493'],
    gradient2: ['#39FF14', '#FFD700'],
    gradient3: ['#FF6B35', '#9D00FF'],
    rainbow: ['#00D9FF', '#FF1493', '#39FF14', '#FF6B35', '#9D00FF', '#FFD700']
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                padding: 20,
                font: {
                    size: 13,
                    family: "'Inter', sans-serif",
                    weight: '600'
                },
                color: '#0A0E27',
                usePointStyle: true,
                pointStyle: 'circle'
            }
        },
        tooltip: {
            backgroundColor: 'rgba(10, 14, 39, 0.95)',
            padding: 16,
            titleFont: {
                size: 15,
                weight: 'bold'
            },
            bodyFont: {
                size: 14
            },
            borderColor: chartColors.electricBlue,
            borderWidth: 2,
            cornerRadius: 10,
            displayColors: true,
            callbacks: {
                labelColor: function(context) {
                    return {
                        borderColor: 'transparent',
                        backgroundColor: context.dataset.backgroundColor,
                        borderWidth: 2,
                        borderRadius: 5
                    };
                }
            }
        }
    },
    animation: {
        duration: 1500,
        easing: 'easeInOutQuart'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    if (typeof chartData === 'undefined') return;

    createChurnDistributionChart();
    createAgeChurnChart();
    createUsageChurnChart();
    createSatisfactionChurnChart();
    createTicketsChurnChart();
    animateCharts();
});

function createChurnDistributionChart() {
    const ctx = document.getElementById('churnDistributionChart');
    if (!ctx) return;

    const data = chartData.churnDistribution;

    const gradient1 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, chartColors.neonGreen);
    gradient1.addColorStop(1, chartColors.success);

    const gradient2 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, chartColors.hotPink);
    gradient2.addColorStop(1, chartColors.danger);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Retained', 'Churned'],
            datasets: [{
                data: [data[0] || 0, data[1] || 0],
                backgroundColor: [gradient1, gradient2],
                borderWidth: 4,
                borderColor: '#ffffff',
                hoverOffset: 15,
                hoverBorderWidth: 6,
                hoverBorderColor: chartColors.electricBlue
            }]
        },
        options: {
            ...chartOptions,
            cutout: '70%',
            plugins: {
                ...chartOptions.plugins,
                legend: {
                    ...chartOptions.plugins.legend,
                    position: 'bottom',
                    labels: {
                        ...chartOptions.plugins.legend.labels,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return {
                                        text: `${label}: ${value} (${percentage}%)`,
                                        fillStyle: i === 0 ? chartColors.neonGreen : chartColors.hotPink,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                }
            }
        }
    });
}

function createAgeChurnChart() {
    const ctx = document.getElementById('ageChurnChart');
    if (!ctx) return;

    const data = chartData.ageChurn;
    const labels = Object.keys(data);
    const retained = labels.map(label => data[label].Retained || 0);
    const churned = labels.map(label => data[label].Churned || 0);

    const gradient1 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, chartColors.electricBlue);
    gradient1.addColorStop(1, chartColors.deepPurple);

    const gradient2 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, chartColors.hotPink);
    gradient2.addColorStop(1, chartColors.danger);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Retained',
                    data: retained,
                    backgroundColor: gradient1,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: chartColors.electricBlue,
                    hoverBackgroundColor: chartColors.neonGreen
                },
                {
                    label: 'Churned',
                    data: churned,
                    backgroundColor: gradient2,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: chartColors.hotPink,
                    hoverBackgroundColor: chartColors.danger
                }
            ]
        },
        options: {
            ...chartOptions,
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        color: chartColors.deepPurple
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 217, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        color: chartColors.deepPurple
                    }
                }
            }
        }
    });
}

function createUsageChurnChart() {
    const ctx = document.getElementById('usageChurnChart');
    if (!ctx) return;

    const data = chartData.usageChurn;
    const labels = data.map(item => {
        const freq = item.usage_frequency;
        return freq === 1 ? 'Low' : freq === 2 ? 'Medium' : 'High';
    });
    const churnRates = data.map(item => (item.churn * 100).toFixed(1));

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, ctx.width, 0);
    gradient.addColorStop(0, chartColors.neonGreen);
    gradient.addColorStop(0.5, chartColors.cyberYellow);
    gradient.addColorStop(1, chartColors.hotPink);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Churn Rate (%)',
                data: churnRates,
                borderColor: chartColors.electricBlue,
                backgroundColor: 'rgba(0, 217, 255, 0.2)',
                borderWidth: 4,
                fill: true,
                tension: 0.4,
                pointRadius: 8,
                pointHoverRadius: 12,
                pointBackgroundColor: chartColors.rainbow,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 3,
                pointHoverBackgroundColor: chartColors.neonGreen,
                pointHoverBorderColor: chartColors.electricBlue,
                pointHoverBorderWidth: 4,
                segment: {
                    borderColor: ctx => {
                        const value = ctx.p1.parsed.y;
                        return value > 50 ? chartColors.danger :
                               value > 25 ? chartColors.cyberYellow :
                               chartColors.neonGreen;
                    }
                }
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 217, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        color: chartColors.deepPurple,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        color: chartColors.deepPurple
                    }
                }
            },
            plugins: {
                ...chartOptions.plugins,
                filler: {
                    propagate: true
                }
            }
        }
    });
}

function createSatisfactionChurnChart() {
    const ctx = document.getElementById('satisfactionChurnChart');
    if (!ctx) return;

    const data = chartData.satisfactionChurn;
    const labels = Object.keys(data).sort();
    const retained = labels.map(label => data[label].Retained || 0);
    const churned = labels.map(label => data[label].Churned || 0);

    const retainedGradients = labels.map((_, i) => {
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, chartColors.neonGreen);
        gradient.addColorStop(1, chartColors.success);
        return gradient;
    });

    const churnedGradients = labels.map((_, i) => {
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, chartColors.hotPink);
        gradient.addColorStop(1, chartColors.danger);
        return gradient;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(l => `${l} ⭐`),
            datasets: [
                {
                    label: 'Retained',
                    data: retained,
                    backgroundColor: retainedGradients,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: chartColors.neonGreen,
                    hoverBackgroundColor: chartColors.electricBlue
                },
                {
                    label: 'Churned',
                    data: churned,
                    backgroundColor: churnedGradients,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: chartColors.hotPink,
                    hoverBackgroundColor: chartColors.danger
                }
            ]
        },
        options: {
            ...chartOptions,
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        color: chartColors.deepPurple
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 217, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        color: chartColors.deepPurple
                    }
                }
            }
        }
    });
}

function createTicketsChurnChart() {
    const ctx = document.getElementById('ticketsChurnChart');
    if (!ctx) return;

    const data = chartData.ticketsChurn;
    const labels = Object.keys(data).sort((a, b) => {
        if (a === '4+') return 1;
        if (b === '4+') return -1;
        return parseFloat(a) - parseFloat(b);
    });
    const retained = labels.map(label => data[label].Retained || 0);
    const churned = labels.map(label => data[label].Churned || 0);

    const retainedGradients = labels.map((_, i) => {
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 600, 0);
        gradient.addColorStop(0, chartColors.electricBlue);
        gradient.addColorStop(1, chartColors.deepPurple);
        return gradient;
    });

    const churnedGradients = labels.map((_, i) => {
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 600, 0);
        gradient.addColorStop(0, chartColors.brightOrange);
        gradient.addColorStop(1, chartColors.hotPink);
        return gradient;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(l => `${l} tickets`),
            datasets: [
                {
                    label: 'Retained',
                    data: retained,
                    backgroundColor: retainedGradients,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: chartColors.electricBlue,
                    hoverBackgroundColor: chartColors.neonGreen
                },
                {
                    label: 'Churned',
                    data: churned,
                    backgroundColor: churnedGradients,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: chartColors.hotPink,
                    hoverBackgroundColor: chartColors.danger
                }
            ]
        },
        options: {
            ...chartOptions,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 217, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        color: chartColors.deepPurple
                    }
                },
                y: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        color: chartColors.deepPurple
                    }
                }
            }
        }
    });
}

function animateCharts() {
    const chartCards = document.querySelectorAll('.chart-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    chartCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#0A0E27';
Chart.defaults.borderColor = 'rgba(0, 217, 255, 0.2)';

Chart.register({
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
        const {ctx} = chart;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = options.color || '#ffffff';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    }
});
