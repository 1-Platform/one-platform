const fs = require( "fs" );

let rawReport = fs.readFileSync( 'e2e/reports/report.json');
let report = JSON.parse( rawReport );
let passed=parseInt(report.testsuites._attributes.tests)-parseInt(report.testsuites._attributes.failures)
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
                        <td>${ report.testsuites._attributes.tests }</td>
                    </tr>
                    <tr>
                        <th>Passed</th>
                        <td>${ passed }</td>
                    </tr>
                    <tr>
                        <th>Failed</th>
                        <td>${ report.testsuites._attributes.failures }</td>
                    </tr>
                </table>
            </body>
        </html>`;
};
let fileName = 'e2e/reports/summary.html';
let stream = fs.createWriteStream( fileName );
stream.once( "open", function ( fs ) {
    let html = buildHtml();
    stream.end( html );
} );
