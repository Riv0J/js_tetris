function newElement(element_name, attributes_dictionary, text_content) {
    const element = document.createElement(element_name);

    for (const attributeName in attributes_dictionary) {
        const attributeValue = attributes_dictionary[attributeName];
        element.setAttribute(attributeName, attributeValue);
    }

    if (text_content) {
        element.textContent = text_content;
    }

    element.setAttribute("generated", true);
    return element;
}