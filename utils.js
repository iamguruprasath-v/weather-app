function createNewElement(element, classes = [], text = "") {
    let elem = document.createElement(element);
    classes.forEach(cls => {
        elem.classList.add(cls);
    });
    if(element === "input") {
        elem.value = text;
    } else if (element === "img") {
        elem.src = text;
    } else {
        elem.innerText = text;
    }
    return elem;
}

function getAllParams(params, paramNames) {
    let values = paramNames.map(paramName => params.get(paramName));
    return values;
}

function getDayFormat(date) {
    let day = new Date(date);
    let options = { weekday: 'long' };
    return day.toLocaleDateString('en-US', options) + " " + date;
}




export default {
    createNewElement,
    getAllParams,
    getDayFormat
}
