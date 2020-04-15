import { Feedback } from './schema';
import { getTransporter } from './helpers';
  
const transporter = getTransporter;

export const FeedbackResolver = {
  Query: {
    //queries
    listFeedback(root: any, args: any, ctx: any) {
      return Feedback.find()
        .sort({ "timestamp": -1 })
        .then(response => response)
        .catch(err => err);
    },
    getFeedback(root: any, args: any, ctx: any) {
      return Feedback.findById(args._id)
        .then(response => response)
        .catch(err => err);
    }
  },
  Mutation: {
    // mutations
    addFeedback(root: any, args: any, ctx: any) {
      const data = new Feedback(args.input);
      return data.save().then(response => {
        Feedback.findById(response._id)
          .then(fb => {
            if (fb) {
              const feedbackfor = fb.portalFeedback ? "One Platfrom" : Object(fb.module).name + " module";
              const feedbackType = fb.feedbackType === "Bug" ? "submitting a bug report" : "your feedback";
              let body, imsg, summary;
              if (fb.iid) {
                imsg = "You can track updates for your feedback via Jira at: https://projects.engineering.redhat.com/browse/ONEPLAT-" + fb.iid;
              } else {
                imsg = "";
              }
              if (fb.description) {
                summary = "\nSummary: " + fb.description + "\n";
              } else {
                summary = "";
              }
              if (fb.feedbackType === "Feedback") {
                // tslint:disable-next-line:max-line-length
                body = `Hi ${fb.timestamp.createdBy.name},\n\nThanks for sharing your feedback on ${feedbackfor} with us.\n\nPlease find the details of the feedback we recieved as below:\nExperience: ${fb.experience} ${summary}\nThe feedback is currently active and we will be looking into it shortly.\n\nIn the meanwhile, you can also read the feedback shared by others here: https://one.redhat.com/feedback \n\n${imsg}\n\nRegards,\nOne Portal Team \n\nP.S.: This is an automated email. Please do not reply.`;
              } else if (fb.feedbackType === "Bug") {
                // tslint:disable-next-line:max-line-length
                body = `Hi ${fb.timestamp.createdBy.name},\n\nThanks for submitting your bug report on ${feedbackfor} with us.\n\nPlease find the details of the feedback we recieved as below:\nTitle: ${fb.title} ${summary}\nThe bug is currently under review and we will be looking into it shortly.\n\nIn the meanwhile, you can also read the feedback shared by others here: https://one.redhat.com/feedback \n\n${imsg}\n\nRegards,\nOne Portal Team \n\nP.S.: This is an automated email. Please do not reply.`;
              }

              const environment: any = process.env.NODE_ENV;
              if (environment === "production") {
                transporter.sendMail({
                  from: "noreply@redhat.com",
                  to: fb.timestamp.createdBy.name + " <" + fb.timestamp.createdBy.email + ">",
                  cc: "one-portal-devel@redhat.com",
                  subject: `[One Platfrom]: Thanks for ${feedbackType} on ${feedbackfor}`,
                  text: body,
                }, function (err: Error, reply: any) {
                  if (err) {
                    console.log(err);
                  }
                });
              }
            }
          })
          .catch(err => err);
      }).catch(err => err);
    },
    updateFeedback(root: any, args: any, ctx: any) {
      return Feedback.findById(args.input._id).then(response => {
        return Object.assign(response, args.input).save().then((feedback: any) => {
          return feedback;
        });
      }).catch((err: any) => err);
    },
    deleteFeedback(root: any, args: any, ctx: any) {
      return Feedback.findByIdAndRemove(args._id)
              .then(response => response)
              .catch(err => err);
    },

  }
}
