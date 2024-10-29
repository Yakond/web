(async ()=>{
    const params = new URLSearchParams(new URL(window.location.href).search);
    const filename = params.get("filename");
    let more_buttons = await fetch("./assets/additionals.json").then(res=>res.json());

    const control = document.getElementById("control")
    const splitter = document.createElement("splitter")
    if (more_buttons.length > 0) {
        try {
            splitter.setAttribute("id", "btn/splitter")
            control.append(splitter)
            let i = 0;
            for (const {type, filename, label} of more_buttons) {
                i++;
                const button = document.createElement()
                button.innerText = label;
                switch (type) {
                    case "file":
                        button.setAttribute("id", "btn/file/"+i)
                        button.addEventListener("click", () => showImage(filename, "png"));
                        break;
                    case "url":
                        button.setAttribute("id", "btn/url/"+i)
                        button.addEventListener("click", () => location.replace(button.url));
                        break
                    case _:
                        continue;
                }
                control.append(button)
            }
        } catch (e) {
            console.error(e)
        }
    }
    const view = document.getElementById("view")
    function showImage(filename, type) {
        view.style.backgroundImage = `url(./assets/viewer/${filename}.${type})`
    }
    showImage(filename, "png")
    const buttons = {
        png: document.getElementById("btn/picker/png"),
        svg: document.getElementById("btn/picker/svg")
    }
    buttons.png.addEventListener("click", () => showImage(filename, "png"))
    buttons.svg.addEventListener("click", () => showImage(filename, "svg"))
})()