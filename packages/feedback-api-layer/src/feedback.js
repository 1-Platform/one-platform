/**
 * MIT License
 * Copyright (c) 2021 Red Hat One Platform
 * 
 * @version 0.1.0
 * 
 * This is the api interface for the opc-feedback component. This supports passing the apiUrl, 
 * authToken and payload of feedback data that needs to be passed to backend.
 * @params - apiUrl: API endpoint for the feedback microservice
 *           authToken: Authorization code for the API Gateway if needed
 *           feedbackInput: Feedback data which needs to be passed to backend
 * 
 * @summary feedback.js enables to to interact with feedback microservice. 
 * @author Rigin Oommen <riginoommen@gmail.com>
 *
 * Created at     : 2021-01-14 13:50:01
 * Last modified  : 2021-01-25 11:38:50
 */

sendFeedback = (apiUrl, authToken, feedbackInput) => {
    let feedbackQuery = JSON.stringify({
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
    let xhr = new XMLHttpRequest();
    xhr.open('POST', apiUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader("Authorization", authToken || `${(window.OpAuthHelper.jwtToken) ? `Bearer ${window.OpAuthHelper.jwtToken}` : null}`);
    xhr.send(feedbackQuery);

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            let response = JSON.parse(this.responseText);
            if (response.data.createFeedback) {
                (window.OpNotification) ? window.OpNotification.success({ subject: `Submitted Feedback` }) : alert('Submitted Feedback')
            } else {
                (window.OpNotification) ? window.OpNotification.danger({ subject: `Error in Feedback Submission` }) : alert('Error in Feedback Submission')
            }
        }
    });
}

module.exports.sendFeedback = this.sendFeedback;