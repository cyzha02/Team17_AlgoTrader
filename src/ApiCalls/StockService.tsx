import ApiService from './ApiService';
import { StockData } from '../types/trading';

class StockService extends ApiService {
    static async getStockQuote(symbol: string): Promise<StockData> {
        return this.fetchWithAuth(`/stocks/${symbol}/quote`);
    }
    
    static async getStockHistory(symbol: string): Promise<StockData[]> {
        return this.fetchWithAuth(`/stocks/${symbol}/history`);
    }
}

export default StockService;