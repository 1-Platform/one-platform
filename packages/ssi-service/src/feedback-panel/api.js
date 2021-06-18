/**
 * MIT License
 * Copyright (c) 2021 Red Hat One Platform
 *
 * @version 0.1.0
 *
 * This is the api interface for the opc-feedback component. This supports passing the payload of
 * feedback data that needs to be passed to backend.
 * @params - feedbackInput: Feedback data which needs to be passed to backend
 *
 * @summary feedback.js enables to to interact with feedback microservice.
 * @author Rigin Oommen <riginoommen@gmail.com>
 *
 * Created at     : 2021-01-14 13:50:01
 * Last modified  : 2021-03-03 17:17:40
 */

sendFeedback = (feedbackInput) => {
    let body = JSON.stringify({
        query: `mutation CreateFeedback($input: FeedbackInput!) {
        createFeedback(input: $input) {
            _id
            ticketUrl
            }
        }`,
        variables: {
            "input": feedbackInput
        }
    });
    return fetch( process.env.OP_API_GATEWAY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${(window.OpAuthHelper?.jwtToken) ? `Bearer ${window.OpAuthHelper?.jwtToken}` : null}`
        },
        body: body
    })
        .then(res => {
            if (!res) {
                (window.OpNotification) ? window.OpNotification.danger({ subject: `Error in Feedback Submission`, body: `The Server returned an empty response.` }) : alert('Error in Feedback Submission');
                throw new Error('The Server returned an empty response.');
            }
            return res.json();
        })
        .then( res => {
            if(res.data.createFeedback) {
                (window.OpNotification) ? window.OpNotification.success({ subject: `Submitted Feedback`, link: response?.data?.createFeedback?.ticketUrl || null }) : alert('Submitted Feedback');
            } else {
                ( window.OpNotification ) ? window.OpNotification.danger( { subject: `Error in Feedback Submission` } ) : alert( 'Error in Feedback Submission' );
                throw new Error( 'There were some errors in the query' + JSON.stringify( res.errors ) );
            }
            return res.data;
        });
}

module.exports.sendFeedback = sendFeedback;
