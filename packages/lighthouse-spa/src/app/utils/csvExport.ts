export const csvExport = (data, branch) => {
  const replacer = (key, value) => (value === null ? '' : value);
  const header = Object.keys(data[0]);
  const csv = [
    header.join(','),
    ...data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    ),
  ].join('\r\n');
  const blobUrl = window.document.createElement('a');
  blobUrl.href = window.URL.createObjectURL(new Blob( [ csv ], { type: 'text/csv' } ));
  blobUrl.download = `${branch}_lh_report.csv`;
  document.body.appendChild(blobUrl);
  blobUrl.click();
  document.body.removeChild(blobUrl);
};
