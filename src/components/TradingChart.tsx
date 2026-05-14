import { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi, CandlestickSeries } from 'lightweight-charts';

export const TradingChart = ({ data }: { data: any[] }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#d1d5db',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
        });

        candlestickSeriesRef.current = candlestickSeries;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    return <div ref={chartContainerRef} className="w-full h-full" />;
};
