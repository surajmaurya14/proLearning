const formatCurrency = (price, currency_type) => {
    return price.toLocaleString("en-US", {
        style: "currency",
        currency: currency_type,
    });
};
export default formatCurrency;
