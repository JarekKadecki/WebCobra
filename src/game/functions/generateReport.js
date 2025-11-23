export function generateReport(data) {
    if (!data || !Array.isArray(data)) return '';

    const answerKeys = new Set();
    const statKeys = new Set();

    // Collect columns
    data.forEach(item => {
        const answers = (item.answers && typeof item.answers === 'object') ? item.answers : {};
        Object.keys(answers).forEach(k => answerKeys.add(k));

        const stats = item.stats || {};
        Object.keys(stats).forEach(statKey => {
            const value = stats[statKey];
            if (Array.isArray(value)) {
                value.forEach((_, idx) => statKeys.add(`${statKey}${idx}`));
            } else {
                statKeys.add(statKey);
            }
        });
    });

    const answerColumns = Array.from(answerKeys);
    const statColumns = Array.from(statKeys);

    // Header
    const header = ['hash', ...answerColumns, ...statColumns];

    // Rows
    const rows = data.map(item => {
        const answers = (item.answers && typeof item.answers === 'object') ? item.answers : {};
        const stats = item.stats || {};
        const flatStats = {};

        statColumns.forEach(col => {
            const keyBase = col.replace(/\d+$/, '');
            const idx = parseInt(col.replace(keyBase, ''), 10);
            const value = stats[keyBase];

            flatStats[col] = Array.isArray(value)
                ? (value[idx] ?? '')
                : (value ?? '');
        });

        return [
            item.hash,
            ...answerColumns.map(k => answers[k] ?? ''),
            ...statColumns.map(k => flatStats[k] ?? '')
        ];
    });

    const csvLines = [
        header.join(','),
        ...rows.map(row => row.map(escapeCsv).join(','))
    ];

    return csvLines.join('\n');
}

function escapeCsv(value) {
    if (value === null || value === undefined) return '';
    let str = String(value);
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}
