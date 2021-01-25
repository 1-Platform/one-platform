/**
 * MIT License
 * Copyright (c) 2021 Red Hat One Platform
 * 
 * @version 0.1.0
 * 
 * This is the testcase for api interface for the opc-feedback component. This supports passing the apiUrl, 
 * authToken and payload of feedback data that needs to be passed to backend.
 * @params - apiUrl: API endpoint for the feedback microservice
 *           authToken: Authorization code for the API Gateway if needed
 *           feedbackInput: Feedback data which needs to be passed to backend
 * 
 * @summary feedback.test.js enables the test environment for api interface. 
 * @author Rigin Oommen <riginoommen@gmail.com>
 *
 * Created at     : 2021-01-14 13:50:01
 * Last modified  : 2021-01-25 11:38:41
 */

const sendFeedback = require('../src/feedback');

describe('feedback-api-layer', () => {
    it('sendFeedback', async () => {
        expect(sendFeedback).toBeDefined();
    });
});