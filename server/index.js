const { readFileSync, writeFileSync, existsSync, statSync } = require("fs");
const { SpeechClient } = require("@google-cloud/speech");
const app = require("express")();
const cors = require("cors");
const upload = require("multer")();
const { json } = require("body-parser");
require("dotenv").config();

app.use(json());
app.use(cors());

try {
    if (
        !existsSync("google-credentials.json") ||
        statSync("google-credentials.json").size < 200
    ) {
        const googleCred = {
            type: process.env.GOOGLE_TYPE,
            project_id: process.env.GOOGLE_PROJECT_ID,
            private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            client_id: process.env.GOOGLE_CLIENT_ID,
            auth_uri: process.env.GOOGLE_AUTH_URI,
            token_uri: process.env.GOOGLE_TOKEN_URI,
            auth_provider_x509_cert_url:
                process.env.AUTH_PROVIDER_X509_CERT_URL,
            client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
        };
        writeFileSync("google-credentials.json", JSON.stringify(googleCred));
    }
} catch (error) {
    console.log(error);
}

console.log(Buffer.from(readFileSync("google-credentials.json")).toString());

process.env.GOOGLE_APPLICATION_CREDENTIALS = "google-credentials.json";

const client = new SpeechClient();

app.get("/", (req, res) => res.send("make a 'POST' request, not 'GET'"));

app.post("/", upload.single("audio"), async (req, res) => {
    const file = req.file;
    if (file) console.log("received file " + file.filename);
    const content = Buffer.from(file.buffer).toString("base64");
    const products = [
        "id",
        "1MM",
        "1MP",
        "MB8",
        "MBE20",
        "3MM",
        "3MP",
        "35MM",
        "37MM",
        "1MCB",
        "3MCB",
        "1MTB",
        "3MTB",
        "1MFS",
        "3MFS",
    ];
    if (content)
        try {
            const [response] = await client.recognize({
                config: {
                    encoding: "OGG_OPUS",
                    sampleRateHertz: 48000,
                    languageCode: "en-US",
                    speechContexts: [
                        ...products.map((product) => ({
                            phrases: [product],
                            boost: 20.0,
                        })),
                    ],
                },
                audio: { content },
            });
            const transcription = response?.results
                ?.map((result) => result.alternatives[0].transcript)
                .join("\n");
            res.status(200).json({ msg: transcription });
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    else res.status(400).json(req.body);
});

const port = process.env.PORT || 5000;
app.listen(port, () =>
    console.log("server started at http://localhost:" + port)
);
