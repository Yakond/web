const params = new URLSearchParams(new URL(window.location.href).search);
const filename = params.get("filename");
// const control = document.getElementById("control")
const view = document.getElementById("view")
function useImage(filename, type) {
    view.style.backgroundImage = `url(./assets/viewer/${filename}.${type})`
}
useImage(filename, "png")
const buttons = {
    png: document.getElementById("btn/png"),
    svg: document.getElementById("btn/svg")
}
buttons.png.addEventListener("click", () => useImage(filename, "png"))
buttons.svg.addEventListener("click", () => useImage(filename, "svg"))