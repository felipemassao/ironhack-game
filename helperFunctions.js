const random = (num) => {
    return Math.floor(Math.random() * num);
}

const randomFloat = (num) => {
    return Math.random() * num;
}

const distanceBetweenPoints = (x1, y1, x2, y2) => {
    return Math.sqrt((y2 - y1)*(y2 - y1) + (x2 - x1) * (x2 - x1));
}