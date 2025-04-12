export interface StockData {
    symbol: string;
    price: number;
    volume: number;
    volatility: number;
    liquidity: number;
    timestamp: number;
}

export interface TradeData {
    order_id: string;
    user_id: number;
    symbol: string;
    side: string;
    quantity: number;
    price: number;
    timestamp: number;
}
  
// Order Types
export interface OrderRequest {
    user_id: number;
    symbol: string;
    side: 'buy' | 'sell';
    quantity: number;
    order_type: 'market' | 'limit';
    limit_price: number;
}
  
export interface OrderResponse {
    status: string;
    order_id: number;
    executed: boolean;
    executed_price: number;
    quantity: number;
    message: string;
}

export interface PendingOrderResponse {
    order_id: string;
    user_id: number;
    symbol: string; 
    side: string; 
    quantity: number;
    order_type: string;
    limit_price: number;
    timestamp: number; 
}
  
// Authentication Types
export interface TradingCredentials {
    user_id: number;
    password: string;
}