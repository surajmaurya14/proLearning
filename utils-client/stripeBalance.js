const stripeBalance = (price, currency_type) => {
    price = price / 100.0;
    return price.toLocaleString("en-US", {
        style: "currency",
        currency: currency_type,
    });
};

export default stripeBalance;
