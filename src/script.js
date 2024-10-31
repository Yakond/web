const url = new URL(window.location.href)
const params = new URLSearchParams(url.search);
function updateUrl() {
	url.search = params.toString();
	window.history.pushState({}, '', url);
}
const filesets_datalist = document.getElementById("filesets")
const filesets_span = document.getElementById("fileset_choice")
const fileset_input = document.getElementById("fileset_input");
const fileset_button = document.querySelector("label:has(input#fileset_input) button");

const waiter = document.querySelector(".waiter");
exports = {};
(async ()=>{
	const image_elem = document.querySelector("#view > img")
	const control_btns = document.getElementById("control_btns")

	// get filesets
	let filesets = await fetch("./assets/filesets.json").then(res=>res.json());
	const getFileset = (fileset) => filesets[fileset]
	for (let key of Object.keys(filesets)) {
		const option = document.createElement("option")
		option.setAttribute("value", key)
		filesets_datalist.append(option)
	}
	fileset_button.addEventListener("click", () => {
		if (!fileset_input.value) return;

		const new_fileset = fileset_input.value;
		
		if (!new_fileset) {
			return alert(`Пакета файлів під назвою «${fileset_input.value}» немає`)
		} else {
			return showFileset(new_fileset)
		}
	})

	if (params.get("set")) showFileset(params.get("set"));
	if (params.get("name")) showImage(params.get("name"))

		function showImage(filename) {
			if (!filename) {
				resetImage();
				return alert("Filename not provided");
			}
			image_elem.classList.remove("hidden");
			image_elem.setAttribute("src", `./assets/viewer/${filename}`);
		
			waiter.classList.add("hidden")
		}
		
		function resetImage() {
			image_elem.setAttribute("src", "");
			image_elem.classList.add("hidden");
		
			waiter.classList.remove("hidden")
		}
    function swapFilesetButtons(fileset_buttons, control) {
		control.innerHTML = ""
		if (fileset_buttons.length > 0) {
		try {
			control.append(document.createElement("_"))
			let i = 0;
			for (let {type="invalid", props={}} of fileset_buttons) {
				i++;
				const el_type = type?.startsWith?.("#")
				? type.slice(1, type.length)
				: ["url", "file"].includes(type)
					? "button"
					: undefined
				const button = document.createElement(el_type)
				button.innerText = props?.label;
				switch (type) {
					case "file":
						button.setAttribute("id", "btn/file/"+i)
						button.addEventListener("click", () => {
							params.set("name", props?.filename);
							updateUrl();
							showImage(decodeURIComponent(params.get("name")));
						})
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
		}}
    }
	function showFileset(filesetName) {
		const filesetData = getFileset(filesetName)
		if (filesetData?.buttons) {
			swapFilesetButtons(filesetData.buttons, control_btns)
		}
		if (!params.get("set") && filesetData?.default_filename) {
			params.set("name", filesetData.default_filename);
			showImage(params.get("name"))
			updateUrl();
		}

		filesets_span.innerText = filesetName || "Ніякий"
		params.set("set", filesetName);
		updateUrl();
	}
	exports = {getFileset, showImage, swapFilesetButtons, showFileset, resetImage}
})()

