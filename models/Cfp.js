export const createCfp = (data = {}) => ({
  userId: data.userId,
  title: data.title || "",
  deadline: data.deadline ?? null,
  conferenceDate: data.conferenceDate ?? null,
  callback: data.callback ?? null,
  location: data.location || "",
  url: data.url || "",
  submissionForm: data.submissionForm || "",
  wordCharacterLimit: data.wordCharacterLimit ?? null,
  tag: data.tag || "",
  groupIds: data.groupIds || []
});