// Get the full URL
const params = new URLSearchParams(new URL(window.location.href).search);

// Example: Access specific parameter values
const filename = params.get("filename");

alert(filename)