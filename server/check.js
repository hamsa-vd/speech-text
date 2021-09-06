const { readFileSync } = require("fs");
const { SpeechClient } = require("@google-cloud/speech");

process.env.GOOGLE_APPLICATION_CREDENTIALS = "google-credentials.json";

const client = new SpeechClient();

(async () => {
    const audio = {
        content: readFileSync("commands/test.mp3").toString("base64"),
    };
    console.log(audio.content.slice(0, 30));
    try {
        const [response] = await client.recognize({
            config: {
                sampleRateHertz: 48000,
                languageCode: "en-US",
                speechContexts: [
                    {
                        phrases: ["pow - r -"],
                        boost: 20.0,
                    },
                ],
            },
            audio,
        });
        const transcription = response?.results
            ?.map((result) => result.alternatives[0].transcript)
            .join("\n");
        console.log("Transcription: \n", transcription);
    } catch (error) {
        console.log(error);
    }
})();
