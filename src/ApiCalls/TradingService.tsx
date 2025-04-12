import ApiService from './ApiService';
import { OrderRequest, OrderResponse, PendingOrderResponse, TradeData } from '../types/trading';

class TradingService extends ApiService {
    static async getAccountInfo(userId: number) {
        return this.fetchWithAuth(`/accounts/${userId}`);
    }
    
    static async getOrderBook() {
        return this.fetchWithAuth('/orderbook');
    }
    
    static async placeOrder(order: OrderRequest): Promise<OrderResponse> {
        return this.fetchWithAuth('/orders', {
            method: 'POST',
            body: JSON.stringify(order)
        });
    }
    
    static async getPendingOrders(userId: number): Promise<PendingOrderResponse[]> {
        return this.fetchWithAuth(`/orders/pending?user_id=${userId}`);
    }
    
    static async cancelOrder(orderId: string, userId: number): Promise<void> {
        return this.fetchWithAuth(`/orders/cancel`, {
            method: 'DELETE',
            body: JSON.stringify({ order_id: orderId, user_id: userId })
        });
    }
    
    static async getMyTrades(symbol: string): Promise<TradeData[]> {
        return this.fetchWithAuth(`/trades/my?symbol=${symbol}`);
    }
}

export default TradingService;