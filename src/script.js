(async ()=>{
	const url = new URL(window.location.href)
	const params = new URLSearchParams(url.search);
	let filename = params.get("name");
	let fileset = params.get("set");
	let filesets = await fetch("./assets/filesets.json").then(res=>res.json());
	const filesets_datalist = document.getElementById("filesets")
	for (let key of Object.keys(filesets)) {
		const option = document.createElement("option")
		option.setAttribute("value", key)
		filesets_datalist.append(option)
	}
	const fileset_buttons = filesets[fileset?.buttons] ?? []
	const control = document.getElementById("control")
	function updateUrl(){
		url.params = params;
		window.location.updateUrl(url)
	}
	const view = document.getElementById("view")
	function showImage(filename, type) {
		view.style.backgroundImage = `url(./assets/viewer/${filename}.${type})`
	}
	if (filename) showImage(filename)
})()
function updateButtons() {
	
}