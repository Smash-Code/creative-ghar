export const deliveryDate = (days) => {
    if (!days) return '3-5 business days';

    // Extract all numbers from the string
    const matches = days.match(/\d+/g);

    if (!matches || matches.length === 0) return '3-5 business days';

    // Convert to numbers
    const numbers = matches.map(n => parseInt(n, 10));

    const today = new Date();

    // Helper to format date
    const formatDate = (date) =>
        date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

    if (numbers.length === 1) {
        // Single number case → return one delivery date
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + numbers[0]);
        return formatDate(deliveryDate);
    } else {
        // Range case → return earliest and latest dates
        const [min, max] = [Math.min(...numbers), Math.max(...numbers)];
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + min);
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + max);

        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
};
