const params = new URLSearchParams(new URL(window.location.href).search);
const filename = params.get("filename");
useImage(filename, "png")
// const control = document.getElementById("control")
const view = document.getElementById("view")

const buttons = {
    png: document.getElementById("btn/png"),
    svg: document.getElementById("btn/svg")
}
function useImage(filename, type) {
    view.style.backgroundImage = `url(./assets/${filename}.${type})`

}
buttons.png.addEventListener("click", () => useImage(filename, "png"))
buttons.svg.addEventListener("click", () => useImage(filename, "svg"))