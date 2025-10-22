import React, { useEffect, useRef } from 'react';

const TradingViewWidget = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Clear any existing children to prevent duplicates
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: 'FX:EURUSD',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: 'rgba(0, 0, 0, 1)',
      withdateranges: true,
      range: 'YTD',
      hide_side_toolbar: false,
      allow_symbol_change: true,
      watchlist: ['OANDA:USDJPY', 'CAPITALCOM:USDCAD'],
      compareSymbols: [
        {
          symbol: 'OANDA:GBPUSD',
          position: 'SameScale',
        },
      ],
      details: true,
      hotlist: true,
      studies: ['STD;24h%Volume', 'STD;Arnaud%1Legoux%1Moving%1Average'],
      show_popup_button: true,
      popup_width: '1000',
      popup_height: '650',
      support_host: 'https://www.tradingview.com',
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
      <div className="tradingview-widget-container__widget" ref={containerRef} style={{ height: '100%', width: '100%' }} />
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default React.memo(TradingViewWidget);
