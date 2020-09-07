module.exports = {
    getId(path) {
        var name = `${path.slice(9).replace(".png","")}`;
        return name;
    }
}