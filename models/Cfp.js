export const createCfp = (data = {}) => ({
  userId: data.userId,
  title: data.title || "",
  deadline: data.deadline ?? null,
  conferenceDate: data.conferenceDate ?? null,
  location: data.location || "",
  url: data.url || "",
  submissionForm: data.submissionForm || "",
  wordCharacterLimit: data.wordCharacterLimit ?? null,
  tags: data.tags || [],
  groupIds: data.groupIds || []
});