const localPort = '8000'
const baseUrl =
  process.env.NODE_ENV !== "production"
    ? `localhost:${localPort}`
    : `localhost:${localPort}`;

export const getMessageResponse = async (messages: any[]) => {
  const conversationUrl = `http://${baseUrl}/open-ai/converse/`;
  const settings = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",

    },
    body: JSON.stringify(messages),
  };

  try {
    return await fetch(conversationUrl, settings).then(res => res.json());
  } catch (error) {
    console.log({ error })
    return error
  }
};
