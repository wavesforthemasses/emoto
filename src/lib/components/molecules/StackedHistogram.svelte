<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    
    type DataPoint = {
        timestamp: Date;
        values: {
            [key: string]: number;
        };
    };

    export let data: DataPoint[] = [];
    export let categories: string[] = [];
    
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let width: number;
    let height: number;
    
    // Color generation for categories
    const generateColors = (count: number) => {
        return Array.from({ length: count }, (_, i) => {
            const hue = (i * 360) / count;
            return `hsl(${hue}, 70%, 50%)`;
        });
    };

    const colors = generateColors(categories.length);

    // Drawing functions
    function drawHistogram() {
        if (!ctx || !canvas) return;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // Calculate scales
        const maxTotal = Math.max(...data.map(d => 
            Object.values(d.values).reduce((a, b) => a + b, 0)
        ));

        const barWidth = chartWidth / data.length;

        // Draw axes
        ctx.beginPath();
        ctx.strokeStyle = '#666';
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw bars
        data.forEach((point, i) => {
            let y = height - padding;
            categories.forEach((category, categoryIndex) => {
                const value = point.values[category] || 0;
                const barHeight = (value / maxTotal) * chartHeight;
                
                ctx.fillStyle = colors[categoryIndex];
                ctx.fillRect(
                    padding + i * barWidth,
                    y - barHeight,
                    barWidth - 1,
                    barHeight
                );
                
                y -= barHeight;
            });
        });

        // Draw labels
        drawLabels(maxTotal, padding, chartHeight);
    }

    function drawLabels(maxValue: number, padding: number, chartHeight: number) {
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';

        // Y-axis labels
        for (let i = 0; i <= 5; i++) {
            const value = (maxValue * i) / 5;
            const y = height - padding - (i * chartHeight) / 5;
            ctx.fillText(value.toFixed(0), 5, y);
        }

        // X-axis labels (dates)
        data.forEach((point, i) => {
            const x = padding + i * ((width - padding * 2) / data.length);
            const date = new Date(point.timestamp);
            ctx.save();
            ctx.translate(x, height - padding + 20);
            ctx.rotate(Math.PI / 4);
            ctx.fillText(date.toLocaleDateString(), 0, 0);
            ctx.restore();
        });
    }

    // Legend component
    function Legend() {
        return categories.map((category, i) => ({
            label: category,
            color: colors[i]
        }));
    }

    // Resize handling
    function handleResize() {
        if (!canvas) return;
        width = canvas.parentElement?.clientWidth ?? 600;
        height = 400;
        canvas.width = width;
        canvas.height = height;
        drawHistogram();
    }

    onMount(() => {
        ctx = canvas.getContext('2d')!;
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    afterUpdate(drawHistogram);
</script>

<div class="histogram-container">
    <canvas
        bind:this={canvas}
        role="img"
        aria-label="Stacked histogram of company statistics"
    ></canvas>
    
    <div class="legend" role="list">
        {#each Legend() as {label, color}}
            <div class="legend-item" role="listitem">
                <span class="color-box" style="background-color: {color}"></span>
                <span>{label}</span>
            </div>
        {/each}
    </div>
</div>

<style>
    .histogram-container {
        width: 100%;
        height: 100%;
        min-height: 400px;
    }

    canvas {
        max-width: 100%;
    }

    .legend {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-sm);
        padding: var(--space-md);
        justify-content: center;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
    }

    .color-box {
        width: 16px;
        height: 16px;
        border-radius: var(--radius-sm);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .legend {
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style> 