export const deliveryDate = (days) => {
    if (!days || isNaN(days)) return '3-5 business days';

    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + parseInt(days));

    // Format the date as "Day, Month Date" (e.g., "Mon, Aug 25")
    return deliveryDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
};