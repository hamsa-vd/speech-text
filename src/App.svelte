<script>
    let isListening = false;
    let note = "";
    let stopMic = false;
    window.SpeechRecognition =
        window.SpeechRecognition || window["webkitSpeechRecognition"];
    const mic = new window.SpeechRecognition();
    mic.continuous = true;
    mic.interimResults = true;
    mic.lang = "en-US";

    function handleMic(..._args) {
        stopMic = false;
        if (isListening) {
            mic.start();
            mic.onend = (ev) => {
                console.log(ev);
                mic.start();
            };
        } else {
            mic.stop();
            mic.onend = (ev) => {
                console.log(ev);
            };
        }
        mic.onstart = () => {
            console.log("Mic is On!");
        };
        mic.onresult = (ev) => {
            const transcript = Array.from(ev.results)
                .map((sr) => sr[0].transcript)
                .join("");
            note = transcript;
            mic.onerror = (event) => console.log(event.error);
        };
    }

    $: stopMic && mic.stop();

    $: handleMic(isListening);
</script>

<svelte:head>
    <title>voice tester</title>
</svelte:head>

<main>
    <div>
        <h1>Tap to Speak</h1>
        <button on:click={() => (isListening = !isListening)}>
            {isListening ? "stop 🛑" : "start 🎙"}
        </button>
        <p>{note}</p>
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
