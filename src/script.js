(async ()=>{
	const params = new URLSearchParams(new URL(window.location.href).search);
	const filename = params.get("filename");
	let additional_nav = await fetch("./assets/additionals.json").then(res=>res.json());

	const control = document.getElementById("control")
	const splitter = document.createElement("_")
	if (additional_nav.length > 0) {
		try {
			control.append(splitter)
			let i = 0;
			for (let {type="invalid", props={}} of additional_nav) {
				i++;
				const el_type = type?.starsWith?.("#")
				? type.slice(1, type.length)
				: ["url", "file"].includes(type)
					? "button"
					: undefined
				const button = document.createElement(el_type)
				button.innerText = props?.label;
				switch (type) {
					case "file":
						button.setAttribute("id", "btn/file/"+i)
						button.addEventListener("click", () => (filename = props?.url, showImage(props?.filename, "png")));
						break;
					case "url":
						button.setAttribute("id", "btn/url/"+i)
						button.addEventListener("click", () => location.replace(props?.url));
						break
					default:
						if (type !== undefined) break;
						const div = document.createElement("invalid")
						div.innerText = JSON.stringify({type,props}, 0, "\t")
						div.innerHTML = div.innerHTML.replaceAll("\t", "&emsp;")
						control.append(div)
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