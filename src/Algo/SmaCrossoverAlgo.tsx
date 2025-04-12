import StockService from '../ApiCalls/StockService';
import TradingService from '../ApiCalls/TradingService';
import { StockData, OrderRequest } from '../types/trading';

export class SmaCrossoverStrategy {
    private static movingAverage(data: StockData[], windowSize: number): number[] {
        return data.map((_, i) => {
            if (i < windowSize - 1) return null;
            const slice = data.slice(i - windowSize + 1, i + 1);
            const avg = slice.reduce((sum, d) => sum + d.price, 0) / windowSize;
            return avg;
        }).filter((avg): avg is number => avg !== null);
    }

    private static calculateOptimalLimitPrice(
        currentPrice: number,
        shortMA: number,
        longMA: number,
        isBuy: boolean
    ): number {
        // Calculate the percentage difference between MAs
        const maDiff = Math.abs(shortMA - longMA) / longMA;
        
        // Use this difference to determine how aggressive our limit order should be
        // For buys: place order slightly above MA support
        // For sells: place order slightly below MA resistance
        if (isBuy) {
            // Buy limit slightly above the short MA when crossing up
            return shortMA * (1 + maDiff * 0.1); // 10% of the MA difference
        } else {
            // Sell limit slightly below the short MA when crossing down
            return shortMA * (1 - maDiff * 0.1); // 10% of the MA difference
        }
    }

    static async execute(symbol: string, shortWindow = 5, longWindow = 20) {
        try {
            // Get historical data
            const stockData = await StockService.getStockHistory(symbol);
            if (!stockData.length) {
                throw new Error('No stock data available');
            }
            
            const shortMA = this.movingAverage(stockData, shortWindow);
            const longMA = this.movingAverage(stockData, longWindow);
            
            // Get latest prices for comparison
            const latestIndex = stockData.length - 1;
            const prevIndex = latestIndex - 1;
            
            const prevShort = shortMA[prevIndex];
            const prevLong = longMA[prevIndex];
            const currShort = shortMA[latestIndex];
            const currLong = longMA[latestIndex];
            const currentPrice = stockData[latestIndex].price;
            
            // Check for trading signals
            if (prevShort < prevLong && currShort >= currLong) {
                // Buy Signal
                const limitPrice = this.calculateOptimalLimitPrice(
                    currentPrice,
                    currShort,
                    currLong,
                    true
                );
                
                const order: OrderRequest = {
                    user_id: Number(process.env.user_id),
                    symbol,
                    side: 'buy',
                    quantity: 100,
                    order_type: 'limit',
                    limit_price: limitPrice
                };
                return await TradingService.placeOrder(order);
            } else if (prevShort > prevLong && currShort <= currLong) {
                // Sell Signal
                const limitPrice = this.calculateOptimalLimitPrice(
                    currentPrice,
                    currShort,
                    currLong,
                    false
                );
                
                const order: OrderRequest = {
                    user_id: Number(process.env.user_id),
                    symbol,
                    side: 'sell',
                    quantity: 100,
                    order_type: 'limit',
                    limit_price: limitPrice
                };
                return await TradingService.placeOrder(order);
            }
            
            return null; // No trading signal
        } catch (error) {
            console.error('Strategy execution error:', error);
            throw error;
        }
    }
}