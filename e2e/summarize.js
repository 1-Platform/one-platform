const fs = require( "fs" );

let rawReport = fs.readFileSync( `e2e/reports/output.json` );
let report = JSON.parse( rawReport );

function buildHtml ( req ) {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>
                    Test run report
                </title>
                <style>
                    table, td, th {
                        border: 1px solid black;
                    }
                    th {
                        text-align: left !important;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                </style>
            </head>
            <body>
                <table>
                    <tr>
                        <th>Total no. of tests</th>
                        <td>${ report.stats.tests }</td>
                    </tr>
                    <tr>
                        <th>Passed</th>
                        <td>${ report.stats.passes }</td>
                    </tr>
                    <tr>
                        <th>Failed</th>
                        <td>${ report.stats.failures }</td>
                    </tr>
                    <tr>
                        <th>Skipped</th>
                        <td>${ report.stats.skipped }</td>
                    </tr>
                </table>
            </body>
        </html>`;
};
let fileName = "e2e/reports/summary.html";
let stream = fs.createWriteStream( fileName );

stream.once( "open", function ( fd ) {
    let html = buildHtml();
    stream.end( html );
} );
