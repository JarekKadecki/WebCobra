export function generateReport(data) {
    if (!data || !Array.isArray(data)) return '';

    // Collect all unique answer keys (questions)
    const answerKeys = new Set();
    const statKeys = new Set();

    data.forEach(item => {
        const answers = item.answers || {};
        Object.keys(answers).forEach(key => answerKeys.add(key));

        const stats = item.stats || {};
        Object.keys(stats).forEach(statKey => {
            // if value is array -> expand keys like key0, key1
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

    // Build header row
    const header = ['hash', ...answerColumns, ...statColumns];

    // Build data rows
    const rows = data.map(item => {
        const answers = item.answers || {};
        const stats = item.stats || {};
        const flatStats = {};

        statColumns.forEach(col => {
            const keyBase = col.replace(/\d+$/, '');
            const idx = parseInt(col.replace(keyBase, ''), 10);
            const value = stats[keyBase];
            flatStats[col] = Array.isArray(value) ? value[idx] ?? '' : value ?? '';
        });

        return [
            item.hash,
            ...answerColumns.map(key => answers[key] ?? ''),
            ...statColumns.map(key => flatStats[key] ?? '')
        ];
    });

    const csvLines = [header.join(','), ...rows.map(row => row.map(escapeCsv).join(','))];
    return csvLines.join('\n');
}

// Escape CSV values (commas, quotes, linebreaks)
function escapeCsv(value) {
    if (value === null || value === undefined) return '';
    let str = String(value);
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}
