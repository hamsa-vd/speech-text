<script>
    import axios from "axios";
    let isListening = false;
    let mediaStream, recorder, blob, note;
    let chunks = [];

    const reset = () => {
        mediaStream = undefined;
        recorder = undefined;
        chunks = [];
    };

    const handleMicChange = async () => {
        if (!isListening) {
            isListening = true;
            mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            });
            //@ts-ignore
            recorder = new MediaRecorder(mediaStream);
            recorder.start();
            recorder.ondataavailable = ({ data }) => chunks.push(data);
            recorder.onstop = async () => {
                blob = new Blob(chunks, { type: "audio/ogg" });
                const formData = new FormData();
                const file = new File([blob], "ivr.ogg", {
                    lastModified: new Date().getTime(),
                });
                formData.append("audio", file);
                // const reader = new FileReader();
                // reader.readAsDataURL(blob);
                // reader.onloadend = async () => {
                //     const result = reader.result;
                //     console.log(result);
                //     note = (
                //         await axios.post(
                //             "http://localhost:5000/",
                //             { content: result },
                //             {}
                //         )
                //     ).data.msg;
                // };
                note = (
                    await axios.post("http://localhost:5000/", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                ).data.msg;
            };
        } else {
            isListening = false;
            if (mediaStream)
                mediaStream.getAudioTracks().forEach((track) => track.stop());
            if (recorder) recorder.stop();
            reset();
        }
    };
</script>

<svelte:head>
    <title>voice tester</title>
</svelte:head>

<main>
    <div>
        <h1>Tap to Speak</h1>
        <button on:click={handleMicChange}>
            {isListening ? "stop 🛑" : "start 🎙"}
        </button>
        {#if note}
            <p>{note}</p>
        {/if}
        {#if blob}
            <audio controls src={URL.createObjectURL(blob)} />
            <button
                ><a href={URL.createObjectURL(blob)} download="test1.mp3">
                    Download
                </a></button
            >
        {/if}
    </div>
</main>

<style lang="scss" global>
    @import url(https://fonts.googleapis.com/css?family=Nunito+Sans:200,200italic,300,300italic,regular,italic,600,600italic,700,700italic,800,800italic,900,900italic);

    *,
    *::before,
    *::after {
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
    }

    main {
        display: grid;
        place-items: center;
        min-height: 100vh;
        max-width: 100vw;
        overflow-x: hidden;
        overflow-y: auto;
        font-family: "Nunito Sans", Arial, Helvetica, sans-serif;
        div {
            min-height: 50vh;
            width: 50vw;
            overflow-x: hidden;
            overflow-y: auto;
            box-shadow: 0px 0px 2rem -1rem rgba(20, 65, 190, 0.39);
            border-radius: 1vw;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding: 1rem;
            h1 {
                color: royalblue;
                margin-top: 2rem;
            }
            button {
                all: unset;
                font-size: 2rem;
                margin-top: 2rem;
                box-shadow: 0px 0px 1em -0.5em rgba(0, 0, 0, 0.404);
                border-radius: 5px;
                padding: 0.25em 1em;
                background-color: white;
                &:hover {
                    cursor: pointer;
                    border: 0.5px solid rgba(0, 0, 0, 0.219);
                }
            }
            p {
                margin-top: 2rem;
                font-size: 2rem;
                color: rgb(62, 83, 87);
            }
        }
    }
</style>
