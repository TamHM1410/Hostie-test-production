export function checkPriceCommission(totalPrice: number, commissionRate: number): boolean {
    if (commissionRate > 100 || commissionRate < 0) {
        return false;
    }

    const paidAmount = totalPrice / 2;
    const commission = (totalPrice * commissionRate) / 100;

    if (commission > paidAmount) {
        return false;
    }

    return true;
}
