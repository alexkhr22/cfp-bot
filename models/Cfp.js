export const createCfp = (data = {}) => ({
  title: data.title || "",
  submissionDeadline: data.submissionDeadline || "",
  location: data.location || "",
  dateOfConference: data.dateOfConference || "",
  url: data.url || "",
  dateReturnMessage: data.dateReturnMessage || "",
  submissionForm: data.submissionForm || "",
  wordLimit: data.wordLimit || ""
});
