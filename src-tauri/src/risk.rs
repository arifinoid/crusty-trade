pub struct RiskManager {
    max_daily_loss_pct: f64,
    current_daily_loss: f64,
    is_locked: bool,
}

impl RiskManager {
    pub fn new(max_loss: f64) -> Self {
        Self {
            max_daily_loss_pct: max_loss,
            current_daily_loss: 0.0,
            is_locked: false,
        }
    }

    pub fn calculate_quantity(&self, balance: f64, risk_pct: f64, entry: f64, stop_loss: f64) -> f64 {
        // Position Sizing: Risk 1% of total balance per trade
        let amount_to_risk = balance * (risk_pct / 100.0);
        let price_diff = (entry - stop_loss).abs();
        if price_diff == 0.0 { return 0.0; }
        amount_to_risk / price_diff
    }

    pub fn check_kill_switch(&mut self, total_wallet: f64) -> bool {
        // Kill Switch: If daily loss exceeds 3%, lock for 12 hours.
        if self.current_daily_loss / total_wallet >= self.max_daily_loss_pct / 100.0 {
            self.is_locked = true;
        }
        self.is_locked
    }
}
